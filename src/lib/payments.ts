import { supabase } from "@/lib/supabase";

// Payment history (ledger) behind a guest's folio. The group member's
// deposit_paid stays the running total (source of truth); this records HOW it
// got there — each payment's amount, method, date — for the statement.

export type Payment = {
  id: string;
  memberId: string;
  amount: number;
  method: string;
  note: string;
  createdAt?: string;
};

export const newPaymentId = () => "pay-" + Math.random().toString(36).slice(2, 9);

export async function getPayments(memberId: string): Promise<Payment[]> {
  const { data, error } = await supabase.from("payments").select("*").eq("member_id", memberId).order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    memberId: (r.member_id as string) ?? "",
    amount: Number(r.amount) || 0,
    method: (r.method as string) ?? "",
    note: (r.note as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  }));
}

export async function addPayment(p: Payment): Promise<boolean> {
  const { error } = await supabase.from("payments").insert({
    id: p.id, member_id: p.memberId, amount: p.amount, method: p.method, note: p.note || null,
  });
  return !error;
}

export async function deletePayment(id: string): Promise<void> {
  await supabase.from("payments").delete().eq("id", id);
}
