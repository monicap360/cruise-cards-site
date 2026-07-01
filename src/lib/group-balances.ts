// Outstanding amounts still to collect per group member, shown as an "Amounts
// Due" callout on the group portal (so guests know what's left to pay).

export type BalanceDue = { who: string; item: string; amount: number };

export const GROUP_BALANCES: Record<string, BalanceDue[]> = {
  "gabby-group": [
    { who: "Peter", item: "Carnival Vacation Protection", amount: 49.0 },
  ],
};

export function balancesForGroup(code: string): BalanceDue[] {
  return GROUP_BALANCES[code] ?? [];
}
