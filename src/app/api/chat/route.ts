import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CONCIERGE_SYSTEM, GUESTCARE_SYSTEM } from "@/lib/chat-knowledge";
import { lookupCredits } from "@/lib/credits";
import { getStatus } from "@/lib/account";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Default to Opus 4.8. To run the chatbot on a faster/cheaper model, set
// CHAT_MODEL in the environment (e.g. CHAT_MODEL=claude-haiku-4-5).
const MODEL = process.env.CHAT_MODEL || "claude-opus-4-8";

type ChatMsg = { role: "user" | "assistant"; content: string };

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// Pull the guest's real reservation context (status, credits, requests) so the
// Guest Care agent can answer specifics. Every lookup is defensive — if a table
// doesn't exist yet or the query fails, we degrade to "no record" rather than 500.
async function guestContextBlock(email: string): Promise<string> {
  const clean = email.trim().toLowerCase();
  if (!clean) {
    return "VERIFIED GUEST RECORD: none — the guest has not provided the email on their booking yet. Ask for it before answering reservation-specific questions.";
  }

  const fetchInquiries = async () => {
    try {
      const { data } = await supabase
        .from("inquiries")
        .select("confirm_number, ship, sail_date, cabin_type, mode, message, created_at")
        .ilike("email", clean)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    } catch {
      return [];
    }
  };

  const [credits, status, requests] = await Promise.all([
    lookupCredits(clean).catch(() => []),
    getStatus(clean).catch(() => null),
    fetchInquiries(),
  ]);

  const lines: string[] = [`VERIFIED GUEST RECORD (email on file: ${clean})`];

  if (status) {
    lines.push(
      `- Booking status: ${status.status}${status.workingOn ? ` (currently: ${status.workingOn})` : ""}${status.updatedAt ? ` — updated ${status.updatedAt.slice(0, 10)}` : ""}`
    );
  } else {
    lines.push("- Booking status: none on file yet.");
  }

  if (credits.length) {
    lines.push("- Active credits:");
    for (const c of credits) {
      lines.push(
        `   * $${c.amount}${c.reason ? ` — ${c.reason}` : ""}${c.expiresOn ? ` (rebook by ${c.expiresOn})` : ""}`
      );
    }
  } else {
    lines.push("- Active credits: none.");
  }

  if (requests.length) {
    lines.push("- Requests & services on file:");
    for (const r of requests) {
      const mode = (r.mode as string) || "inquiry";
      const ship = (r.ship as string) || "";
      const sail = (r.sail_date as string) || "";
      const cabin = (r.cabin_type as string) || "";
      const confirm = (r.confirm_number as string) || "";
      lines.push(
        `   * ${mode}${ship ? ` · ${ship}` : ""}${cabin ? ` · ${cabin}` : ""}${sail ? ` · sails ${sail}` : ""}${confirm ? ` (#${confirm})` : ""}`
      );
    }
  } else {
    lines.push("- Requests & services on file: none found for this email.");
  }

  lines.push(
    "Use ONLY this record for specifics. If nothing matches, tell the guest you don't see a booking under that email and offer to connect them with a specialist."
  );
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError(
      "The AI assistant isn't configured yet. Please call us at (409) 632-2106.",
      503
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("invalid json", 400);
  }

  const agent = body.agent === "guestcare" ? "guestcare" : "concierge";

  // Sanitize the conversation: only user/assistant string turns, last 20, capped.
  const raw = Array.isArray(body.messages) ? (body.messages as unknown[]) : [];
  const messages: ChatMsg[] = raw
    .filter(
      (m): m is ChatMsg =>
        !!m &&
        typeof m === "object" &&
        ((m as ChatMsg).role === "user" || (m as ChatMsg).role === "assistant") &&
        typeof (m as ChatMsg).content === "string"
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return jsonError("no user message", 400);
  }

  let system = agent === "guestcare" ? GUESTCARE_SYSTEM : CONCIERGE_SYSTEM;
  if (agent === "guestcare") {
    const email = typeof body.email === "string" ? body.email : "";
    system += "\n\n" + (await guestContextBlock(email));
  }

  const client = new Anthropic();

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system,
          messages,
        });
        stream.on("text", (t) => controller.enqueue(encoder.encode(t)));
        await stream.finalMessage();
      } catch {
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — I hit a snag on my end. Please try again, or call us at (409) 632-2106 and a specialist will help right away."
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
