import { supabase } from "@/lib/supabase";

// Two-way message thread per reservation (cabin) — guest ↔ agent. Shown on the
// group/individual portal (guest side) and in /admin/groups (agent side).

export type CabinMessage = {
  id: string;
  memberId: string;
  groupCode: string;
  sender: "guest" | "agent";
  body: string;
  createdAt?: string;
};

export const newCabinMsgId = () => "cmsg-" + Math.random().toString(36).slice(2, 10);

export async function getCabinThread(memberId: string): Promise<CabinMessage[]> {
  const { data, error } = await supabase
    .from("group_messages")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    memberId: (r.member_id as string) ?? "",
    groupCode: (r.group_code as string) ?? "",
    sender: (r.sender as string) === "agent" ? "agent" : "guest",
    body: (r.body as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  }));
}

export async function sendCabinMessage(
  memberId: string,
  groupCode: string,
  sender: "guest" | "agent",
  body: string
): Promise<boolean> {
  const { error } = await supabase.from("group_messages").insert({
    id: newCabinMsgId(),
    member_id: memberId,
    group_code: groupCode,
    sender,
    body,
  });
  return !error;
}
