"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  type Task,
  blankTask,
  isTaskOverdue,
  getTasks,
  saveTask,
  setTaskStatus,
  deleteTask,
} from "@/lib/tasks";

function TasksInner() {
  const params = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [t, setT] = useState<Task>(blankTask());
  const [filter, setFilter] = useState<"open" | "overdue" | "done" | "all">("open");

  async function refresh() {
    setTasks(await getTasks());
    setLoading(false);
  }
  useEffect(() => {
    refresh();
  }, []);

  // Prefill from a conversation: /admin/tasks?name=Jane&contact=409...&title=...
  useEffect(() => {
    const name = params.get("name") ?? "";
    const contact = params.get("contact") ?? "";
    const title = params.get("title") ?? "";
    const due = params.get("due") ?? "";
    if (name || contact || title || due) {
      setT((s) => ({
        ...s,
        relatedName: name || s.relatedName,
        relatedContact: contact || s.relatedContact,
        title: title || s.title,
        dueDate: due || s.dueDate,
      }));
    }
  }, [params]);

  const set = (p: Partial<Task>) => setT((s) => ({ ...s, ...p }));

  async function add() {
    if (!t.title.trim()) {
      alert("Give the follow-up a title.");
      return;
    }
    await saveTask(t);
    setT(blankTask());
    refresh();
  }
  async function toggle(task: Task) {
    await setTaskStatus(task.id, task.status === "done" ? "open" : "done");
    refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this follow-up?")) return;
    await deleteTask(id);
    refresh();
  }

  const openCount = tasks.filter((x) => x.status === "open").length;
  const overdueCount = tasks.filter(isTaskOverdue).length;

  const shown = useMemo(() => {
    if (filter === "open") return tasks.filter((x) => x.status === "open");
    if (filter === "overdue") return tasks.filter(isTaskOverdue);
    if (filter === "done") return tasks.filter((x) => x.status === "done");
    return tasks;
  }, [tasks, filter]);

  const input =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60";
  const lbl = "block label-mono text-[10px] uppercase tracking-wider text-white/50 mb-1";

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="aurora bg-sky-500 w-[40rem] h-[40rem] -top-72 right-0 opacity-[0.10]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/admin" className="label-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-white">← Admin</Link>
          <div className="label-mono text-[11px] uppercase tracking-wider text-sky-400/80 mb-1 mt-2">
            {"// Follow-ups"}
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-[-0.01em]">Tasks</h1>
          <p className="text-white/55 text-sm max-w-2xl mt-1">
            Capture the next step from a call so nothing slips through. Create a follow-up,
            give it a due date, and check it off when it&rsquo;s done.
          </p>
          <div className="flex gap-4 mt-5">
            <div className="bg-[#0b1020] border border-white/10 rounded-2xl px-5 py-3">
              <div className="text-2xl font-extrabold text-holo">{openCount}</div>
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider">Open</div>
            </div>
            <div className={`rounded-2xl px-5 py-3 border ${overdueCount ? "bg-red-500/15 border-red-400/30" : "bg-[#0b1020] border-white/10"}`}>
              <div className="text-2xl font-extrabold text-holo">{overdueCount}</div>
              <div className="text-white/45 label-mono text-[10px] uppercase tracking-wider">Overdue</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* New follow-up */}
        <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-6">
          <h2 className="font-extrabold text-lg mb-4">New follow-up</h2>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-6"><label className={lbl}>What needs to happen *</label><input className={input} value={t.title} onChange={(e) => set({ title: e.target.value })} placeholder="Call back re: balcony upgrade · Send confirmation · Collect deposit" /></div>
            <div className="sm:col-span-2"><label className={lbl}>Guest / contact</label><input className={input} value={t.relatedName} onChange={(e) => set({ relatedName: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Phone / email</label><input className={input} value={t.relatedContact} onChange={(e) => set({ relatedContact: e.target.value })} /></div>
            <div className="sm:col-span-1"><label className={lbl}>Due</label><input type="date" className={input} value={t.dueDate} onChange={(e) => set({ dueDate: e.target.value })} /></div>
            <div className="sm:col-span-1"><label className={lbl}>Assignee</label><input className={input} value={t.assignee} onChange={(e) => set({ assignee: e.target.value })} placeholder="Initials" /></div>
            <div className="sm:col-span-6"><label className={lbl}>Notes</label><input className={input} value={t.details} onChange={(e) => set({ details: e.target.value })} /></div>
          </div>
          <button onClick={add} className="mt-4 bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all">
            Add follow-up
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(["open", "overdue", "done", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                filter === f ? "bg-white text-black" : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <p className="text-white/45">Loading…</p>
        ) : shown.length === 0 ? (
          <div className="bg-[#0b1020] rounded-2xl border border-white/10 p-8 text-center text-white/45">
            {filter === "open" ? "No open follow-ups — you're all caught up. 🎉" : "Nothing here."}
          </div>
        ) : (
          <div className="space-y-2">
            {shown.map((task) => {
              const overdue = isTaskOverdue(task);
              return (
                <div key={task.id} className="bg-[#0b1020] rounded-xl border border-white/10 p-4 flex items-start gap-3">
                  <button
                    onClick={() => toggle(task)}
                    aria-label="Toggle complete"
                    className={`mt-0.5 h-5 w-5 rounded-md border flex-shrink-0 flex items-center justify-center text-xs ${
                      task.status === "done" ? "bg-green-500/30 border-green-400/40 text-green-200" : "border-white/30 hover:border-sky-400"
                    }`}
                  >
                    {task.status === "done" ? "✓" : ""}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold ${task.status === "done" ? "text-white/40 line-through" : "text-white"}`}>
                      {task.title}
                    </div>
                    <div className="text-white/45 text-xs mt-0.5">
                      {task.relatedName || task.relatedContact ? (
                        <span>{task.relatedName}{task.relatedContact ? ` · ${task.relatedContact}` : ""} · </span>
                      ) : null}
                      {task.dueDate ? (
                        <span className={overdue ? "text-red-300 font-bold" : ""}>
                          due {task.dueDate}{overdue ? " (overdue)" : ""}
                        </span>
                      ) : "no due date"}
                      {task.assignee ? ` · ${task.assignee}` : ""}
                    </div>
                    {task.details && <div className="text-white/55 text-sm mt-1">{task.details}</div>}
                  </div>
                  <button onClick={() => remove(task.id)} className="text-red-300 hover:text-red-200 text-xs font-bold flex-shrink-0">
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTasksPage() {
  return (
    <Suspense fallback={null}>
      <TasksInner />
    </Suspense>
  );
}
