"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  agent: "concierge" | "guestcare";
  title: string; // header title
  subtitle: string; // small line under the title
  greeting: string; // first assistant bubble
  // Guest Care passes the logged-in email so the agent can look up the booking.
  email?: string;
  // Where the bubble sits. Concierge floats bottom-right; Guest Care is inline.
  variant?: "floating" | "inline";
  placeholder?: string;
};

export default function ChatWidget({
  agent,
  title,
  subtitle,
  greeting,
  email,
  variant = "floating",
  placeholder = "Type your question…",
}: Props) {
  const [open, setOpen] = useState(variant === "inline");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");

    // Build the history we send (exclude the canned greeting), then optimistic UI.
    const history = messages.filter(
      (m, i) => !(i === 0 && m.role === "assistant")
    );
    const outgoing: Msg[] = [...history, { role: "user", content: text }];
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agent, email, messages: outgoing }),
      });

      if (!res.ok || !res.body) {
        let msg = "Sorry — I couldn't reach the assistant. Please call (409) 632-2106.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: msg };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Sorry — something went wrong. Please try again or call (409) 632-2106.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  const Panel = (
    <div
      className={
        variant === "floating"
          ? "fixed bottom-24 right-6 z-50 w-[min(92vw,380px)] h-[min(70vh,560px)] flex flex-col bg-[#0b1020] border border-sky-400/30 rounded-2xl shadow-2xl overflow-hidden"
          : "flex flex-col bg-[#0b1020] border border-sky-400/25 rounded-2xl overflow-hidden h-[480px]"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 bg-[#070b16]">
        <div>
          <div className="font-extrabold text-white text-sm leading-tight">{title}</div>
          <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70">
            {subtitle}
          </div>
        </div>
        {variant === "floating" && (
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="text-white/50 hover:text-white text-lg leading-none px-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] bg-white text-black rounded-2xl rounded-br-sm px-3.5 py-2 text-sm whitespace-pre-wrap"
                  : "max-w-[88%] bg-white/8 text-white/90 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm whitespace-pre-wrap"
              }
            >
              {m.content || (busy ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-2.5 bg-[#070b16]">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder={placeholder}
            className="flex-1 resize-none bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-sky-400/60 max-h-28"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="bg-white text-black hover:bg-white/90 disabled:opacity-40 font-semibold text-sm rounded-xl px-4 py-2 transition-all"
          >
            {busy ? "…" : "Send"}
          </button>
        </div>
        <div className="text-white/30 text-[10px] mt-1.5 px-1">
          AI assistant · for anything complex, a specialist is at (409) 632-2106
        </div>
      </div>
    </div>
  );

  if (variant === "inline") return Panel;

  // Floating: a launcher bubble + the panel when open.
  return (
    <>
      {open && Panel}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-full shadow-2xl h-14 w-14 flex items-center justify-center text-2xl transition-all border border-white/10 print:hidden"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
