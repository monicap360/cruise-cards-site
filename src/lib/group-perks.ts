// Per-group included perks / inclusions shown as a callout on the group portal.
// Keyed by group code. Add items and the "Included for Your Group" band appears.

export type GroupPerk = { icon: string; title: string; detail: string };

export const GROUP_PERKS: Record<string, GroupPerk[]> = {
  "gabby-group": [
    {
      icon: "💵",
      title: "Prepaid gratuities — entire group",
      detail: "Crew appreciation (tips) is prepaid for every guest in the group — nothing to settle onboard.",
    },
  ],
};

export function perksForGroup(code: string): GroupPerk[] {
  return GROUP_PERKS[code] ?? [];
}
