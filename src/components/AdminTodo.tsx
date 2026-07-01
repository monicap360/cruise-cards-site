"use client";

import { useEffect, useState } from "react";

// Simple personal to-do list on the admin dashboard. Saved on this device.
type T = { id: string; text: string; done: boolean };

export default function AdminTodo() {
  const [todos, setTodos] = useState<T[]>([]);
  const [text, setText] = useState("");

  useEffect(() => { try { setTodos(JSON.parse(localStorage.getItem("admin-todo") || "[]")); } catch { /* ignore */ } }, []);
  const save = (t: T[]) => { setTodos(t); localStorage.setItem("admin-todo", JSON.stringify(t)); };

  function add() {
    if (!text.trim()) return;
    save([...todos, { id: Math.random().toString(36).slice(2, 9), text: text.trim(), done: false }]);
    setText("");
  }
  const toggle = (id: string) => save(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const del = (id: string) => save(todos.filter((t) => t.id !== id));

  const open = todos.filter((t) => !t.done).length;
  const sorted = [...todos].sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-4">
      <div className="font-bold text-sm mb-3">✅ My To-Do <span className="text-white/40 font-normal">— {open} open</span></div>
      <div className="flex gap-2 mb-3">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task…" className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/35 focus:outline-none focus:border-sky-400/60" />
        <button onClick={add} className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wider text-[11px] px-4 rounded-xl">Add</button>
      </div>
      {sorted.length === 0 ? (
        <div className="text-white/40 text-sm">No tasks yet.</div>
      ) : (
        <div className="space-y-1">
          {sorted.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} className="accent-sky-500 w-4 h-4 shrink-0" />
              <span className={`flex-1 text-sm ${t.done ? "line-through text-white/35" : "text-white/85"}`}>{t.text}</span>
              <button onClick={() => del(t.id)} className="text-red-300/60 hover:text-red-200 text-xs">×</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-white/30 text-[10px] mt-2 label-mono">▮ saved on this device</p>
    </div>
  );
}
