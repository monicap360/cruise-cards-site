import { supabase } from "@/lib/supabase";

// Staff follow-up tasks — "create the next step from a conversation so nothing
// slips through between calls." Optionally tied to a guest/contact.
export type Task = {
  id: string;
  title: string;
  details: string;
  relatedName: string; // guest / contact this follow-up is about
  relatedContact: string; // their phone or email
  dueDate: string; // YYYY-MM-DD ("" = no due date)
  status: "open" | "done";
  assignee: string;
  createdBy: string;
  createdAt?: string;
  completedAt?: string;
};

export function newTaskId() {
  return "tsk-" + Math.random().toString(36).slice(2, 9);
}

export function blankTask(): Task {
  return {
    id: newTaskId(),
    title: "",
    details: "",
    relatedName: "",
    relatedContact: "",
    dueDate: "",
    status: "open",
    assignee: "",
    createdBy: "admin",
  };
}

// A task is overdue if it's open and its due date is before today.
export function isTaskOverdue(t: Task): boolean {
  if (t.status !== "open" || !t.dueDate) return false;
  return t.dueDate < new Date().toISOString().slice(0, 10);
}

function toTask(r: Record<string, unknown>): Task {
  return {
    id: r.id as string,
    title: (r.title as string) ?? "",
    details: (r.details as string) ?? "",
    relatedName: (r.related_name as string) ?? "",
    relatedContact: (r.related_contact as string) ?? "",
    dueDate: (r.due_date as string) ?? "",
    status: ((r.status as string) as Task["status"]) ?? "open",
    assignee: (r.assignee as string) ?? "",
    createdBy: (r.created_by as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
    completedAt: (r.completed_at as string) ?? "",
  };
}

function taskRow(t: Task): Record<string, unknown> {
  return {
    id: t.id,
    title: t.title,
    details: t.details || null,
    related_name: t.relatedName || null,
    related_contact: t.relatedContact || null,
    due_date: t.dueDate || null,
    status: t.status,
    assignee: t.assignee || null,
    created_by: t.createdBy || null,
    completed_at: t.completedAt || null,
  };
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("status", { ascending: true }) // open before done
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toTask);
}

export async function getOpenTaskCount(): Promise<number> {
  const { count } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");
  return count ?? 0;
}

export async function saveTask(t: Task): Promise<boolean> {
  const { error } = await supabase.from("tasks").upsert(taskRow(t));
  return !error;
}

export async function setTaskStatus(
  id: string,
  status: Task["status"]
): Promise<void> {
  await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", id);
}

export async function deleteTask(id: string): Promise<void> {
  await supabase.from("tasks").delete().eq("id", id);
}
