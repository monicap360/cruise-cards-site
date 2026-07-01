"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ReputationPlan from "@/components/ReputationPlan";

// Elaria — Monica's PERSONAL command center (not cruise operations — that lives
// in the cruise admin). Tracks her bills & due dates, a prioritized to-do list,
// private notes, and her setup checklist. Everything is device-local (localStorage)
// so personal finances never touch the shared database. The Elaria AI assistant
// reads these to remind her what's due and what to do first.

type Bill = { id: string; name: string; amount: number; due: string; recurring: boolean };
type Todo = { id: string; text: string; priority: "high" | "med" | "low"; done: boolean };

const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => new Date().toISOString().slice(0, 10);
const daysUntil = (d: string) => Math.round((new Date(d + "T00:00:00").getTime() - new Date(todayStr() + "T00:00:00").getTime()) / 86400000);
const addMonth = (d: string) => { const x = new Date(d + "T00:00:00"); x.setMonth(x.getMonth() + 1); return x.toISOString().slice(0, 10); };
const PRI_RANK = { high: 0, med: 1, low: 2 } as const;

// Owner setup checklist (Render keys + accounts to store in the vault).
const RENDER_KEYS: { id: string; k: string; p: string; s: "live" | "todo" }[] = [
  { id: "sb-url", k: "NEXT_PUBLIC_SUPABASE_URL", p: "Database", s: "live" },
  { id: "sb-anon", k: "NEXT_PUBLIC_SUPABASE_ANON_KEY", p: "Database (public)", s: "live" },
  { id: "admin-pin", k: "ADMIN_PIN", p: "Admin login", s: "live" },
  { id: "anthropic", k: "ANTHROPIC_API_KEY", p: "AI assistants + chatbot", s: "todo" },
  { id: "resend", k: "RESEND_API_KEY", p: "Booking emails", s: "todo" },
  { id: "owner-email", k: "OWNER_EMAIL", p: "Alert recipient", s: "todo" },
  { id: "booking-from", k: "BOOKING_FROM", p: "Email “from” address", s: "todo" },
  { id: "tw-sid", k: "TWILIO_ACCOUNT_SID", p: "Text + phone ring", s: "todo" },
  { id: "tw-token", k: "TWILIO_AUTH_TOKEN", p: "Text + phone ring", s: "todo" },
  { id: "tw-from", k: "TWILIO_FROM", p: "Your Twilio number", s: "todo" },
  { id: "tw-sms", k: "ALERT_SMS_TO", p: "Your # for the text", s: "todo" },
  { id: "tw-voice", k: "TWILIO_VOICE_TO", p: "Your # for the ring", s: "todo" },
];
const VAULT_GROUPS: { group: string; items: string[] }[] = [
  { group: "Cruise line portals", items: ["Royal Caribbean — Cruising Power", "Carnival — GoCCL", "Norwegian (NCL)", "MSC"] },
  { group: "Infrastructure", items: ["Render login", "Supabase login", "GitHub login", "Domain registrar", "Gmail + app password"] },
  { group: "Service accounts", items: ["Ooma", "Twilio account", "Resend account", "Anthropic account"] },
  { group: "Always store here", items: ["Backup copies of ALL Render keys", "2FA / MFA backup codes"] },
];
const slug = (s: string) => "v-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ElariaPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const [bName, setBName] = useState(""); const [bAmt, setBAmt] = useState(""); const [bDue, setBDue] = useState(""); const [bRec, setBRec] = useState(true);
  const [tText, setTText] = useState(""); const [tPri, setTPri] = useState<"high" | "med" | "low">("med");

  useEffect(() => {
    setNotes(localStorage.getItem("elaria-notes") || "");
    try { setBills(JSON.parse(localStorage.getItem("elaria-bills") || "[]")); } catch { /* ignore */ }
    try { setTodos(JSON.parse(localStorage.getItem("elaria-todos") || "[]")); } catch { /* ignore */ }
    try { setDone(JSON.parse(localStorage.getItem("elaria-checklist") || "{}")); } catch { /* ignore */ }
  }, []);

  const saveBills = (b: Bill[]) => { setBills(b); localStorage.setItem("elaria-bills", JSON.stringify(b)); };
  const saveTodos = (t: Todo[]) => { setTodos(t); localStorage.setItem("elaria-todos", JSON.stringify(t)); };

  function addBill() {
    if (!bName.trim() || !bDue) return;
    saveBills([...bills, { id: nid(), name: bName.trim(), amount: Number(bAmt) || 0, due: bDue, recurring: bRec }]);
    setBName(""); setBAmt(""); setBDue("");
  }
  function payBill(b: Bill) {
    if (b.recurring) saveBills(bills.map((x) => (x.id === b.id ? { ...x, due: addMonth(x.due) } : x)));
    else saveBills(bills.filter((x) => x.id !== b.id));
  }
  const delBill = (id: string) => saveBills(bills.filter((x) => x.id !== id));

  function addTodo() {
    if (!tText.trim()) return;
    saveTodos([...todos, { id: nid(), text: tText.trim(), priority: tPri, done: false }]);
    setTText("");
  }
  const toggleTodo = (id: string) => saveTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const delTodo = (id: string) => saveTodos(todos.filter((t) => t.id !== id));

  function saveNotes(v: string) { setNotes(v); localStorage.setItem("elaria-notes", v); setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })); }
  function toggleDone(id: string) { setDone((d) => { const n = { ...d, [id]: !d[id] }; localStorage.setItem("elaria-checklist", JSON.stringify(n)); return n; }); }

  // Derived
  const billsSorted = [...bills].sort((a, b) => a.due.localeCompare(b.due));
  const overdue = bills.filter((b) => daysUntil(b.due) < 0);
  const due7 = bills.filter((b) => { const d = daysUntil(b.due); return d >= 0 && d <= 7; });
  const unpaidTotal = bills.reduce((s, b) => s + b.amount, 0);
  const openTodos = todos.filter((t) => !t.done);
  const highPri = openTodos.filter((t) => t.priority === "high");
  const todosSorted = [...todos].sort((a, b) => (Number(a.done) - Number(b.done)) || (PRI_RANK[a.priority] - PRI_RANK[b.priority]));

  const allIds = [...RENDER_KEYS.map((r) => r.id), ...VAULT_GROUPS.flatMap((g) => g.items.map((i) => slug(g.group + i)))];
  const doneCount = allIds.filter((id) => done[id]).length;
  const pct = Math.round((doneCount / allIds.length) * 100);

  const KPIS = [
    { label: "Overdue", value: String(overdue.length), accent: overdue.length ? "text-red-300" : "text-white/70" },
    { label: "Due ≤ 7 days", value: String(due7.length), accent: due7.length ? "text-amber-300" : "text-white/70" },
    { label: "Unpaid total", value: money(unpaidTotal), accent: "text-sky-300" },
    { label: "Open to-dos", value: String(openTodos.length), accent: "text-white" },
    { label: "High priority", value: String(highPri.length), accent: highPri.length ? "text-red-300" : "text-white/70" },
  ];

  const input = "w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const dueClass = (d: string) => { const n = daysUntil(d); return n < 0 ? "text-red-300" : n <= 7 ? "text-amber-300" : "text-white/50"; };
  const dueLabel = (d: string) => { const n = daysUntil(d); return n < 0 ? `${Math.abs(n)}d overdue` : n === 0 ? "due today" : `in ${n}d`; };

  return (
    <div className="relative min-h-screen bg-[#02040a] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 starfield opacity-70" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="aurora bg-sky-500 -top-40 -left-32 w-[36rem] h-[36rem] animate-drift-slow opacity-[0.16]" />
      <div className="aurora bg-indigo-600 top-1/3 -right-40 w-[34rem] h-[34rem] animate-drift opacity-[0.14]" />
      <div className="scanline" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="relative neon-edge neon-pulse rounded-3xl bg-[#060b18]/70 backdrop-blur-md p-6 sm:p-8 mb-8 overflow-hidden">
          <div className="tech-rule absolute top-0 left-8 right-8" />
          <div className="hidden sm:block absolute -right-6 -top-6 w-44 h-44 opacity-40">
            <div className="absolute inset-0 rounded-full border border-sky-400/30 orbit-spin" />
            <div className="absolute inset-4 rounded-full border border-sky-400/20 orbit-spin-rev" />
            <div className="absolute inset-0 orbit-spin" style={{ background: "conic-gradient(from 0deg, rgba(56,189,248,.35), transparent 28%)", borderRadius: "9999px", WebkitMask: "radial-gradient(circle, transparent 30%, #000 31%)", mask: "radial-gradient(circle, transparent 30%, #000 31%)" }} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="label-mono text-[10px] uppercase tracking-[0.3em] text-sky-300/80">// personal command center</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase tracking-[-0.03em] text-holo text-glow leading-none">Elaria</h1>
          <p className="text-white/50 text-sm mt-2 max-w-md">Your private hub — bills, to-dos, ideas, and your secure keys. Ask Elaria (bottom-left) what to pay and do first.</p>
          <div className="mt-4 flex items-center gap-4 flex-wrap label-mono text-[10px] uppercase tracking-widest text-white/40">
            <span>◇ personal — not cruise ops</span>
            <span className="text-sky-400/60">●</span>
            <Link href="/admin" className="hover:text-white">◇ cruise business →</Link>
            <span className="text-sky-400/60">●</span>
            <Link href="/admin/vault" className="hover:text-white">◇ vault →</Link>
          </div>
        </div>

        {/* Reputation action plan */}
        <div className="mb-8"><ReputationPlan /></div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-9">
          {KPIS.map((k, i) => (
            <div key={k.label} className="relative bg-[#060b18]/70 backdrop-blur-sm rounded-2xl p-4 neon-edge overflow-hidden">
              <span className="absolute top-1.5 left-1.5 w-2 h-2 border-l border-t border-sky-400/40" />
              <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-r border-b border-sky-400/40" />
              <div className={`text-2xl font-extrabold ${k.accent}`}>{k.value}</div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider mt-1 label-mono">{k.label}</div>
              <div className="text-white/20 text-[9px] label-mono mt-0.5">{String(i + 1).padStart(2, "0")}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-6">
          {/* Left: bills + todos */}
          <div className="space-y-6">
            {/* Bills */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">Bills &amp; Due Dates</div>
                <div className="tech-rule flex-1 opacity-60" />
              </div>
              <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-[1fr_110px_140px_auto] gap-2 mb-3">
                  <input className={input} placeholder="Bill (e.g. Light bill)" value={bName} onChange={(e) => setBName(e.target.value)} />
                  <input className={input} placeholder="$ amount" inputMode="decimal" value={bAmt} onChange={(e) => setBAmt(e.target.value)} />
                  <input className={input} type="date" value={bDue} onChange={(e) => setBDue(e.target.value)} />
                  <button onClick={addBill} className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wider text-[11px] px-4 rounded-xl">Add</button>
                </div>
                <label className="flex items-center gap-2 text-white/50 text-xs mb-3 cursor-pointer">
                  <input type="checkbox" checked={bRec} onChange={(e) => setBRec(e.target.checked)} className="accent-sky-500" /> Recurring monthly (rolls to next month when paid)
                </label>
                {billsSorted.length === 0 ? (
                  <div className="text-white/40 text-sm py-2">No bills yet. Add your light bill, credit card, etc.</div>
                ) : (
                  <div className="space-y-1.5">
                    {billsSorted.map((b) => (
                      <div key={b.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm flex items-center gap-2">{b.name}{b.recurring && <span className="text-[9px] uppercase text-sky-300/60 label-mono">monthly</span>}</div>
                          <div className={`text-xs ${dueClass(b.due)}`}>{b.due} · {dueLabel(b.due)}</div>
                        </div>
                        <div className="text-white/80 font-mono text-sm shrink-0">{money(b.amount)}</div>
                        <button onClick={() => payBill(b)} className="text-green-300 hover:text-green-200 text-xs font-bold shrink-0">Paid ✓</button>
                        <button onClick={() => delBill(b.id)} className="text-red-300/70 hover:text-red-200 text-xs shrink-0">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* To-dos */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">Prioritized To-Do</div>
                <div className="tech-rule flex-1 opacity-60" />
              </div>
              <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-4">
                <div className="flex gap-2 mb-3">
                  <input className={input} placeholder="Add a task…" value={tText} onChange={(e) => setTText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} />
                  <select value={tPri} onChange={(e) => setTPri(e.target.value as "high" | "med" | "low")} className="bg-white/5 border border-white/15 rounded-xl px-2 text-white text-sm focus:outline-none">
                    <option value="high" className="bg-[#0b1020]">High</option>
                    <option value="med" className="bg-[#0b1020]">Med</option>
                    <option value="low" className="bg-[#0b1020]">Low</option>
                  </select>
                  <button onClick={addTodo} className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wider text-[11px] px-4 rounded-xl">Add</button>
                </div>
                {todosSorted.length === 0 ? (
                  <div className="text-white/40 text-sm py-2">No tasks yet.</div>
                ) : (
                  <div className="space-y-1">
                    {todosSorted.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                        <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} className="accent-sky-500 w-4 h-4 shrink-0" />
                        <span className={`flex-1 text-sm ${t.done ? "line-through text-white/35" : "text-white/85"}`}>{t.text}</span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${t.priority === "high" ? "bg-red-500/15 text-red-300" : t.priority === "med" ? "bg-amber-400/15 text-amber-300" : "bg-white/10 text-white/45"}`}>{t.priority}</span>
                        <button onClick={() => delTodo(t.id)} className="text-red-300/70 hover:text-red-200 text-xs shrink-0">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: notes + links */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">Captain&rsquo;s log</div>
                {savedAt && <span className="text-sky-300/40 text-[10px] label-mono">saved {savedAt}</span>}
              </div>
              <textarea value={notes} onChange={(e) => saveNotes(e.target.value)} rows={9}
                placeholder="Private notes, ideas, reminders…"
                className="w-full bg-[#060b18]/70 backdrop-blur-sm border border-sky-400/15 rounded-2xl p-4 text-sky-100/90 text-sm font-mono placeholder-sky-300/25 resize-none focus:outline-none focus:border-sky-400/50" />
              <p className="text-sky-300/25 text-[10px] mt-1 label-mono">▮ everything here stays on this device</p>
            </div>
            <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-4">
              <div className="label-mono text-[10px] uppercase tracking-wider text-sky-300/60 mb-2">Jump to</div>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/admin/vault" className="bg-white/[0.04] border border-sky-400/15 rounded-xl px-3 py-2.5 text-sm font-semibold hover:border-sky-400/50">🔐 Password Vault</Link>
                <Link href="/admin" className="bg-white/[0.04] border border-sky-400/15 rounded-xl px-3 py-2.5 text-sm font-semibold hover:border-sky-400/50">🚢 Cruise Business Admin</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Keys & Setup checklist */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="label-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/70">// Keys &amp; Setup</div>
            <div className="tech-rule flex-1 min-w-[40px] opacity-60" />
            <span className="label-mono text-[10px] uppercase tracking-widest text-sky-300/60">{doneCount}/{allIds.length} secured · {pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-5">
            <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-5">
              <div className="font-bold text-sm mb-1">⚙️ Render — engine keys</div>
              <p className="text-white/40 text-xs mb-3">The live site uses these. Add at Render → Environment.</p>
              <div className="space-y-1.5">
                {RENDER_KEYS.map((r) => (
                  <label key={r.id} className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/[0.04]">
                    <input type="checkbox" checked={!!done[r.id]} onChange={() => toggleDone(r.id)} className="accent-sky-500 w-4 h-4 shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className={`font-mono text-xs ${done[r.id] ? "line-through text-white/35" : "text-sky-200/90"}`}>{r.k}</span>
                      <span className="block text-white/35 text-[10px]">{r.p}</span>
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${r.s === "live" ? "bg-green-500/15 text-green-300" : "bg-amber-400/15 text-amber-300"}`}>{r.s === "live" ? "live" : "add"}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-[#060b18]/70 backdrop-blur-sm neon-edge rounded-2xl p-5">
              <div className="font-bold text-sm mb-1">🔐 Vault — your records</div>
              <p className="text-white/40 text-xs mb-3">Store in the <Link href="/admin/vault" className="text-sky-400 hover:text-sky-300">Password Vault</Link>. Logins + backup copies of every key.</p>
              <div className="space-y-3">
                {VAULT_GROUPS.map((g) => (
                  <div key={g.group}>
                    <div className="label-mono text-[10px] uppercase tracking-wider text-sky-300/50 mb-1">{g.group}</div>
                    <div className="space-y-1">
                      {g.items.map((it) => {
                        const id = slug(g.group + it);
                        return (
                          <label key={id} className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1 hover:bg-white/[0.04]">
                            <input type="checkbox" checked={!!done[id]} onChange={() => toggleDone(id)} className="accent-sky-500 w-4 h-4 shrink-0" />
                            <span className={`text-xs ${done[id] ? "line-through text-white/35" : "text-white/80"}`}>{it}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
