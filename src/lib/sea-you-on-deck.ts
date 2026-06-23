export type MemberPrivacy = "public" | "private";

export type CommunityMember = {
  id: string;
  displayName: string;
  hometown?: string;
  bio?: string;
  ship: string;
  sailingDate: string;
  crews: string[];
  privacy: MemberPrivacy;
  joinedAt: string;
  emoji?: string; // optional avatar emoji
};

export function generateMemberId(): string {
  return "syod-" + Math.random().toString(36).substring(2, 10);
}

import { supabase } from "./supabase";

function toMember(row: Record<string, unknown>): CommunityMember {
  return {
    id: row.id as string,
    displayName: row.display_name as string,
    hometown: row.hometown as string | undefined,
    bio: row.bio as string | undefined,
    ship: row.ship as string,
    sailingDate: row.sailing_date as string,
    crews: (row.crews as string[]) ?? [],
    privacy: (row.privacy as MemberPrivacy) ?? "public",
    joinedAt: row.created_at as string,
    emoji: (row.emoji as string) ?? "⚓",
  };
}

export async function saveMember(member: CommunityMember): Promise<void> {
  await supabase.from("community_members").upsert({
    id: member.id,
    display_name: member.displayName,
    hometown: member.hometown,
    bio: member.bio,
    ship: member.ship,
    sailing_date: member.sailingDate,
    crews: member.crews,
    privacy: member.privacy,
    emoji: member.emoji,
  });
}

export async function getMembersForSailing(ship: string, sailingDate: string): Promise<CommunityMember[]> {
  const { data, error } = await supabase
    .from("community_members")
    .select("*")
    .ilike("ship", ship)
    .eq("sailing_date", sailingDate)
    .eq("privacy", "public")
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(toMember);
}

export function groupMembersByCrews(members: CommunityMember[]): Record<string, CommunityMember[]> {
  const map: Record<string, CommunityMember[]> = {};
  for (const m of members) {
    for (const crew of m.crews) {
      (map[crew] = map[crew] ?? []).push(m);
    }
  }
  return map;
}

export const AVATAR_EMOJIS = [
  "🐚", "⚓", "🌊", "🐬", "🦈", "🦀", "🐠", "🌴", "🏖️", "⛵",
  "🦆", "🎉", "🎰", "🌟", "💪", "🍸", "🧘", "📸", "🎵", "🌅",
];
