import { supabase } from "@/lib/supabase";

// Support tickets — a guest question/concern. The agent works it on the admin
// dashboard; the guest opens their PIN-gated link to see updates and reply.
// Agent notes and guest replies share one thread, so updating one updates both.

export type TicketStatus = "Open" | "Closed";

export type Ticket = {
  id: string;
  token: string;
  pin: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  groupCode: string; // optional link to a group/reservation
  subject: string;
  status: TicketStatus;
  createdAt?: string;
};

export type TicketMessage = {
  id: string;
  ticketId: string;
  sender: "agent" | "guest";
  body: string;
  createdAt?: string;
};

export const newTicketId = () => "tkt-" + Math.random().toString(36).slice(2, 9);
export const newTicketToken = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
export const newTicketPin = () => String(Math.floor(1000 + Math.random() * 9000));
export const newTicketMsgId = () => "tmsg-" + Math.random().toString(36).slice(2, 10);

function toTicket(r: Record<string, unknown>): Ticket {
  return {
    id: r.id as string,
    token: (r.token as string) ?? "",
    pin: (r.pin as string) ?? "",
    customerName: (r.customer_name as string) ?? "",
    customerEmail: (r.customer_email as string) ?? "",
    customerPhone: (r.customer_phone as string) ?? "",
    groupCode: (r.group_code as string) ?? "",
    subject: (r.subject as string) ?? "",
    status: ((r.status as string) as TicketStatus) ?? "Open",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toTicket);
}

export async function getTicketByToken(token: string): Promise<Ticket | null> {
  const { data } = await supabase.from("tickets").select("*").eq("token", token).limit(1);
  if (!data || !data[0]) return null;
  return toTicket(data[0]);
}

export async function saveTicket(t: Ticket): Promise<boolean> {
  const { error } = await supabase.from("tickets").upsert({
    id: t.id, token: t.token, pin: t.pin, customer_name: t.customerName,
    customer_email: t.customerEmail || null, customer_phone: t.customerPhone || null,
    group_code: t.groupCode || null, subject: t.subject, status: t.status,
  });
  return !error;
}

export async function setTicketStatus(id: string, status: TicketStatus): Promise<void> {
  await supabase.from("tickets").update({ status }).eq("id", id);
}

export async function deleteTicket(id: string): Promise<void> {
  await supabase.from("ticket_messages").delete().eq("ticket_id", id);
  await supabase.from("tickets").delete().eq("id", id);
}

// ── Messages ──
export async function getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  const { data, error } = await supabase.from("ticket_messages").select("*").eq("ticket_id", ticketId).order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    ticketId: (r.ticket_id as string) ?? "",
    sender: (r.sender as string) === "agent" ? "agent" : "guest",
    body: (r.body as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  }));
}

export async function addTicketMessage(ticketId: string, sender: "agent" | "guest", body: string): Promise<boolean> {
  const { error } = await supabase.from("ticket_messages").insert({
    id: newTicketMsgId(), ticket_id: ticketId, sender, body,
  });
  return !error;
}
