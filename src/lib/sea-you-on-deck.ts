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

export function getMembers(): CommunityMember[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cfg-syod-members") ?? "[]");
  } catch {
    return [];
  }
}

export function saveMember(member: CommunityMember): void {
  const all = getMembers();
  const idx = all.findIndex((m) => m.id === member.id);
  if (idx >= 0) all[idx] = member;
  else all.unshift(member);
  localStorage.setItem("cfg-syod-members", JSON.stringify(all));
}

export function getMembersForSailing(ship: string, sailingDate: string): CommunityMember[] {
  return getMembers().filter(
    (m) =>
      m.privacy === "public" &&
      m.ship.toLowerCase() === ship.toLowerCase() &&
      m.sailingDate === sailingDate
  );
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
