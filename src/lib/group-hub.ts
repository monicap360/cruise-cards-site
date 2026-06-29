import { supabase } from "@/lib/supabase";

// Per-cruise group announcements (update feed) + structured change requests.
// Keyed by the group sailing `key` (e.g. "thanksgiving-2026").

export type GroupAnnouncement = {
  id: string;
  groupKey: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt?: string;
};

export type RequestStatus =
  | "Submitted"
  | "Being Reviewed"
  | "Waiting on Guest"
  | "Waiting on Cruise Line"
  | "Approved"
  | "Completed"
  | "Unable to Complete";

export type GroupRequest = {
  id: string;
  groupKey: string;
  type: string;
  details: string;
  requester: string;
  status: RequestStatus;
  response: string;
  createdAt?: string;
};

export const REQUEST_TYPES = [
  "Add a traveler",
  "Remove a traveler",
  "Change a traveler name",
  "Adjoining rooms",
  "Room upgrade",
  "Payment question",
  "Wheelchair / scooter rental",
  "Travel documents",
  "Hotel before/after cruise",
  "Transportation",
  "Dining change",
  "Celebration / birthday",
  "General question",
];

export const REQUEST_STATUSES: RequestStatus[] = [
  "Submitted",
  "Being Reviewed",
  "Waiting on Guest",
  "Waiting on Cruise Line",
  "Approved",
  "Completed",
  "Unable to Complete",
];

export const newAnnId = () => "ann-" + Math.random().toString(36).slice(2, 9);
export const newReqId = () => "req-" + Math.random().toString(36).slice(2, 9);

// ── Announcements ──
function toAnn(r: Record<string, unknown>): GroupAnnouncement {
  return {
    id: r.id as string,
    groupKey: (r.group_key as string) ?? "",
    title: (r.title as string) ?? "",
    body: (r.body as string) ?? "",
    pinned: Boolean(r.pinned),
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getAnnouncements(groupKey: string): Promise<GroupAnnouncement[]> {
  const { data, error } = await supabase
    .from("group_announcements")
    .select("*")
    .eq("group_key", groupKey)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toAnn);
}

export async function saveAnnouncement(a: GroupAnnouncement): Promise<boolean> {
  const { error } = await supabase.from("group_announcements").upsert({
    id: a.id,
    group_key: a.groupKey,
    title: a.title,
    body: a.body || null,
    pinned: a.pinned,
  });
  return !error;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await supabase.from("group_announcements").delete().eq("id", id);
}

// ── Requests ──
function toReq(r: Record<string, unknown>): GroupRequest {
  return {
    id: r.id as string,
    groupKey: (r.group_key as string) ?? "",
    type: (r.type as string) ?? "",
    details: (r.details as string) ?? "",
    requester: (r.requester as string) ?? "",
    status: ((r.status as string) as RequestStatus) ?? "Submitted",
    response: (r.response as string) ?? "",
    createdAt: (r.created_at as string) ?? "",
  };
}

export async function getRequests(groupKey: string): Promise<GroupRequest[]> {
  const { data, error } = await supabase
    .from("group_requests")
    .select("*")
    .eq("group_key", groupKey)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toReq);
}

export async function getAllRequests(): Promise<GroupRequest[]> {
  const { data, error } = await supabase
    .from("group_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toReq);
}

export async function saveRequest(r: GroupRequest): Promise<boolean> {
  const { error } = await supabase.from("group_requests").upsert({
    id: r.id,
    group_key: r.groupKey,
    type: r.type,
    details: r.details || null,
    requester: r.requester || null,
    status: r.status,
    response: r.response || null,
  });
  return !error;
}

export async function deleteRequest(id: string): Promise<void> {
  await supabase.from("group_requests").delete().eq("id", id);
}
