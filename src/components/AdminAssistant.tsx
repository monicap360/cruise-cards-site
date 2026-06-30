"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

export default function AdminAssistant() {
  const pathname = usePathname();
  const onElaria = pathname?.startsWith("/admin/elaria");
  const onLogin = pathname?.startsWith("/admin/login");
  const mode: "elaria" | "ops" = onElaria ? "elaria" : "ops";

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);

  const persona = mode === "elaria"
    ? { name: "Elaria", tag: "Strategy · legal · ideas", accent: "from-sky-400 to-indigo-400",
        hi: "I'm Elaria — your strategy & business advisor. Ask me about growth, pricing, partnerships, legal/risk, or any idea you're chewing on.",
        prompts: ["Ways to grow bookings this quarter", "Is my cancellation policy wording solid?", "How should I price group cabins?"] }
    : { name: "Cruise Ops", tag: "Groups · bookings · fixes", accent: "from-sky-400 to-cyan-300",
        hi: "I'm your Ops assistant — I can see your live groups. Ask me things like “what's going on with the Yen Alston group” or “who still owes a deposit.”",
        prompts: ["What's going on with the Yen Alston group?", "Who still owes a deposit and when's it due?", "Which cabins still need guest names?"] };

  // Reset the thread when switching persona (elaria <-> ops).
  useEffect(() => { setMsgs([]); }, [mode]);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight }); }, [msgs, open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setBusy(true);
    // For Elaria, pull her device-local bills/to-dos so it can remind & prioritize.
    let context = "";
    if (mode === "elaria") {
      try {
        const bills = JSON.parse(localStorage.getItem("elaria-bills") || "[]") as { name: string; amount: number; due: string; recurring: boolean }[];
        const todos = JSON.parse(localStorage.getItem("elaria-todos") || "[]") as { text: string; priority: string; done: boolean }[];
        const notes = localStorage.getItem("elaria-notes") || "";
        const billLines = bills.map((b) => `- ${b.name}: $${b.amount} due ${b.due}${b.recurring ? " (monthly)" : ""}`).join("\n") || "(none)";
        const todoLines = todos.filter((t) => !t.done).map((t) => `- [${t.priority}] ${t.text}`).join("\n") || "(none)";
        context = `BILLS:\n${billLines}\n\nOPEN TO-DOS:\n${todoLines}${notes ? `\n\nNOTES:\n${notes.slice(0, 1000)}` : ""}`;
      } catch { /* ignore */ }
    }
    try {
      const res = await fetch("/api/assistant", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: next, context }),
      });
      if (!res.ok || !res.body) {
        const e = await res.json().catch(() => ({}));
        setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: e.error || "Couldn't reach the assistant." }; return c; });
        setBusy(false); return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: acc }; return c; });
      }
    } catch {
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: "Network hiccup — try again." }; return c; });
    }
    setBusy(false);
  }

  if (onLogin) return null;

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className={`fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-gradient-to-r ${persona.accent} text-black font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-full shadow-lg hover:brightness-110`}>
        ✦ Ask {persona.name}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[min(94vw,400px)] h-[min(72vh,560px)] flex flex-col bg-[#070d1a] border border-sky-400/25 rounded-2xl shadow-2xl overflow-hidden neon-edge">
      <div className={`bg-gradient-to-r ${persona.accent} px-4 py-3 flex items-center justify-between`}>
        <div>
          <div className="text-black font-extrabold uppercase tracking-wide text-sm leading-none">✦ {persona.name}</div>
          <div className="text-black/70 text-[10px] uppercase tracking-wider">{persona.tag}</div>
        </div>
        <button onClick={() => setOpen(false)} className="text-black/70 hover:text-black font-bold text-lg leading-none">×</button>
      </div>

      <div ref={scroller} className="flex-1 overflow-y-auto p-3 space-y-3">
        {msgs.length === 0 ? (
          <div className="space-y-3">
            <div className="text-white/70 text-sm bg-white/5 border border-white/10 rounded-xl p-3">{persona.hi}</div>
            <div className="space-y-1.5">
              {persona.prompts.map((p) => (
                <button key={p} onClick={() => send(p)} className="block w-full text-left text-sky-200/90 text-xs bg-sky-400/[0.07] border border-sky-400/20 rounded-lg px-3 py-2 hover:bg-sky-400/15">{p}</button>
              ))}
            </div>
          </div>
        ) : msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-sky-500/20 text-sky-50 border border-sky-400/25" : "bg-white/5 text-white/85 border border-white/10"}`}>
              {m.content || (busy && i === msgs.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-2.5 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Ask ${persona.name}…`} disabled={busy}
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm placeholder-white/35 focus:outline-none focus:border-sky-400/60 disabled:opacity-60" />
        <button onClick={() => send()} disabled={busy} className="bg-white text-black hover:bg-white/90 disabled:opacity-50 font-bold uppercase tracking-wider text-[11px] px-4 rounded-xl">{busy ? "…" : "Send"}</button>
      </div>
    </div>
  );
}
