// Outstanding amounts still to collect per group member, shown as an "Amounts
// Due" callout on the group portal (so guests know what's left to pay).

export type BalanceDue = {
  who: string;
  item: string;
  amount: number;
  payTo?: string; // if set, pay this person directly (not the agency)
  note?: string;
};

export const GROUP_BALANCES: Record<string, BalanceDue[]> = {
  "gabby-group": [
    {
      who: "Group",
      item: "DoubleTree Seattle Airport hotel — 3 rooms (Jul 29 night)",
      amount: 677.64,
    },
    {
      who: "Peter",
      item: "Carnival Vacation Protection",
      amount: 49.0,
      payTo: "Gabby",
      note: "Gabby already paid this — please reimburse Gabby directly.",
    },
  ],
};

export function balancesForGroup(code: string): BalanceDue[] {
  return GROUP_BALANCES[code] ?? [];
}
