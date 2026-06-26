import { supabase } from "@/lib/supabase";

export type Message = {
  id: string;
  email: string;
  sender: "customer" | "staff";
  body: string;
  docUrl: string;
  docName: string;
  createdAt: string;
};

export function newMessageId() {
  return "msg-" + Math.random().toString(36).slice(2, 10);
}

function toMessage(r: Record<string, unknown>): Message {
  return {
    id: r.id as string,
    email: (r.email as string) ?? "",
    sender: (r.sender as Message["sender"]) ?? "customer",
    body: (r.body as string) ?? "",
    docUrl: (r.doc_url as string) ?? "",
    docName: (r.doc_name as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getThread(email: string): Promise<Message[]> {
  const clean = email.trim().toLowerCase();
  if (!clean) return [];
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("email", clean)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(toMessage);
}

export async function sendMessage(m: {
  email: string;
  sender: "customer" | "staff";
  body: string;
  docUrl?: string;
  docName?: string;
}): Promise<boolean> {
  const { error } = await supabase.from("messages").insert({
    id: newMessageId(),
    email: m.email.trim().toLowerCase(),
    sender: m.sender,
    body: m.body,
    doc_url: m.docUrl || null,
    doc_name: m.docName || null,
  });
  return !error;
}

// For the admin inbox: every message, newest first (group by email in the UI).
export async function getAllMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toMessage);
}
