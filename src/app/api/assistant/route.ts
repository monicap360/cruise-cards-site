import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.CHAT_MODEL || "claude-opus-4-8";

type ChatMsg = { role: "user" | "assistant"; content: string };

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { "content-type": "application/json" } });
}

const ELARIA_SYSTEM = `You are **Elaria** — Monica Pena's PRIVATE PERSONAL assistant and strategic advisor. Elaria is personal (her life + her ambitions), NOT cruise operations — the cruise business has its own ops assistant. Monica owns Cruises from Galveston, a Galveston, TX cruise agency, but here you focus on HER.

What you do:
- **Personal bills & to-dos:** When her bills and to-dos are provided in PERSONAL CONTEXT below, proactively tell her what's due or overdue (e.g., "heads up — your light bill is due in 2 days") and recommend a prioritized order to tackle things. Be a gentle, organized accountability partner.
- **Personal finance thinking:** budgeting, what to pay first, cash management.
- **Entrepreneur + legal-aware sounding board:** business ideas, growth, pricing, partnerships, risk and legal awareness (seller-of-travel rules, contracts, disclaimers, entity/tax structure). Think like a seasoned owner.

How you operate:
- Be direct, warm, and practical. Lead with the answer, then concrete next steps.
- When she asks "what should I do today / what's most important," look at her bills (by due date) and to-dos (by priority) and give a ranked plan.
- LEGAL/FINANCIAL DISCLAIMER: You are NOT a lawyer or CPA. For anything binding (contracts, entity setup, taxes, compliance), say so and tell her to confirm with a licensed Texas attorney/CPA.

Her bills and to-dos live only on her device; they appear below ONLY when she's chatting from her dashboard.`;

const OPS_SYSTEM = `You are the **Cruise Operations Assistant** for Cruises from Galveston — Monica's right hand for running groups, bookings, guests, deposits, and commissions. You have access to LIVE DATA from the system (below). Use it to answer specific operational questions like "what's going on with the Yen Alston group" or "who still owes a deposit" and to recommend fixes.

How you operate:
- Be specific and use real numbers from the live data.
- When asked "how do we fix X," give a concrete action plan (who to contact, what to change, deadlines).
- Watch for problems: unpaid deposits near a due date, held/unnamed cabins (GTY) that need names, balances near final-payment dates, missing DOBs.
- Cancellation/penalty awareness: after final payment date the cruise line auto-cancels and penalties apply.
- Keep answers tight and scannable. Lead with the answer.

You are internal/admin-only — it's fine to discuss commissions, costs, and guest specifics here.`;

// Compact live snapshot of every group + member so the ops assistant can answer specifics.
async function opsContext(): Promise<string> {
  try {
    const g = await supabase.from("groups").select("id,code,name,ship,sailing_date,return_date,nights,deposit_due_date,final_payment_date,notes");
    const m = await supabase.from("group_members").select("group_id,name,confirmation_number,cabin_type,cabin_number,guests,fare,deposit_paid,paid_in_full,notes");
    const groups = g.data || [];
    const members = m.data || [];
    if (!groups.length) return "LIVE DATA: no groups found.";
    const lines: string[] = ["LIVE DATA — current groups & cabins (today is the reference point):"];
    for (const grp of groups) {
      const mem = members.filter((x: Record<string, unknown>) => x.group_id === grp.id);
      let owed = 0;
      mem.forEach((x: Record<string, unknown>) => { owed += x.paid_in_full ? 0 : Math.max(0, (Number(x.fare) || 0) - (Number(x.deposit_paid) || 0)); });
      lines.push(`\n### ${grp.name} — ${grp.ship} ${grp.sailing_date}→${grp.return_date} (${grp.nights}n) · deposit due ${grp.deposit_due_date || "?"} · final pay ${grp.final_payment_date || "?"} · ${mem.length} cabins · balance owed $${owed.toFixed(2)}`);
      for (const x of mem as Record<string, unknown>[]) {
        const bal = x.paid_in_full ? 0 : Math.max(0, (Number(x.fare) || 0) - (Number(x.deposit_paid) || 0));
        lines.push(`- ${x.name || "—"} | ${x.cabin_type || "?"} ${x.cabin_number || ""} | ${x.guests}g | fare $${x.fare || 0} paid $${x.deposit_paid || 0} bal $${bal.toFixed(2)} | ${String(x.notes || "").slice(0, 110)}`);
      }
      if (grp.notes) lines.push(`  group notes: ${String(grp.notes).slice(0, 500)}`);
    }
    return lines.join("\n").slice(0, 12000);
  } catch {
    return "LIVE DATA: unavailable (could not read the database).";
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError("The AI assistant isn't configured yet — add ANTHROPIC_API_KEY in Render to turn it on.", 503);
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return jsonError("invalid json", 400); }

  const mode = body.mode === "elaria" ? "elaria" : "ops";

  const raw = Array.isArray(body.messages) ? (body.messages as unknown[]) : [];
  const messages: ChatMsg[] = raw
    .filter((m): m is ChatMsg => !!m && typeof m === "object" && ((m as ChatMsg).role === "user" || (m as ChatMsg).role === "assistant") && typeof (m as ChatMsg).content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return jsonError("no user message", 400);
  }

  let system = mode === "elaria" ? ELARIA_SYSTEM : OPS_SYSTEM;
  if (mode === "ops") system += "\n\n" + (await opsContext());
  if (mode === "elaria" && typeof body.context === "string" && body.context.trim()) {
    system += `\n\nPERSONAL CONTEXT (today is ${new Date().toISOString().slice(0, 10)}):\n` + body.context.slice(0, 4000);
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          thinking: { type: "adaptive" },
          system,
          messages,
        });
        stream.on("text", (t) => controller.enqueue(encoder.encode(t)));
        await stream.finalMessage();
      } catch {
        controller.enqueue(encoder.encode("\n\nSorry — I hit a snag. Try again in a moment."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
