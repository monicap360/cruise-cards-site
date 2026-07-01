import { supabase } from "@/lib/supabase";

// Live agent presence — "Available", "On a call", "At lunch", etc. The agent sets
// it in admin; it shows on their profile card so guests see what they're doing now.

export type AgentStatus = { slug: string; status: string; message: string; updatedAt?: string };

export const PRESENCE: { key: string; label: string; icon: string; badge: string; dot: string }[] = [
  { key: "available", label: "Available now", icon: "🟢", badge: "bg-green-500/15 text-green-300 border-green-400/30", dot: "bg-green-400" },
  { key: "call", label: "On a call", icon: "📞", badge: "bg-amber-400/15 text-amber-300 border-amber-400/30", dot: "bg-amber-400" },
  { key: "guest", label: "Assisting a guest", icon: "🎧", badge: "bg-amber-400/15 text-amber-300 border-amber-400/30", dot: "bg-amber-400" },
  { key: "meeting", label: "In a meeting", icon: "📅", badge: "bg-amber-400/15 text-amber-300 border-amber-400/30", dot: "bg-amber-400" },
  { key: "lunch", label: "At lunch", icon: "🍽️", badge: "bg-amber-400/15 text-amber-300 border-amber-400/30", dot: "bg-amber-400" },
  { key: "cruise", label: "On a cruise", icon: "🚢", badge: "bg-sky-500/15 text-sky-300 border-sky-400/30", dot: "bg-sky-400" },
  { key: "out", label: "Out of office", icon: "🌙", badge: "bg-white/10 text-white/50 border-white/15", dot: "bg-white/40" },
];

export function presenceMeta(status: string) {
  return PRESENCE.find((p) => p.key === status) || PRESENCE[0];
}

export async function getAgentStatus(slug: string): Promise<AgentStatus | null> {
  try {
    const { data } = await supabase.from("agent_status").select("*").eq("slug", slug).limit(1);
    if (!data || !data[0]) return null;
    const r = data[0] as Record<string, unknown>;
    return { slug: r.slug as string, status: (r.status as string) || "available", message: (r.message as string) || "", updatedAt: (r.updated_at as string) || "" };
  } catch { return null; }
}

export async function setAgentStatus(slug: string, status: string, message: string): Promise<void> {
  await supabase.from("agent_status").upsert({ slug, status, message: message || null, updated_at: new Date().toISOString() });
}
