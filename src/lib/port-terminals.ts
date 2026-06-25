// ── Port of Galveston — embarkation terminal by ship ─────────────────────────
// Which entrance/street a guest uses to reach THEIR ship on sail day. Getting
// this right matters — terminals are blocks apart and guests get sent to the
// wrong building. Only fill entries you can confirm; unknown ships simply show
// nothing rather than a guess.

export type TerminalInfo = {
  entryStreet: string; // the street you turn in / enter at
  terminal?: string; // terminal name/number if known
  address?: string; // full address for maps
};

export const PORT_ADDRESS = "Port of Galveston, Galveston, TX 77550";

export const SHIP_TERMINAL: Record<string, TerminalInfo> = {
  "Carnival Breeze": {
    entryStreet: "35th Street",
    terminal: "Carnival Terminal",
    address: PORT_ADDRESS,
  },
  "Carnival Jubilee": {
    entryStreet: "22nd Street",
    terminal: "Carnival Terminal",
    address: PORT_ADDRESS,
  },
  // Add the rest as confirmed, e.g.:
  // "Carnival Dream": { entryStreet: "…", address: PORT_ADDRESS },
  // "Mariner of the Seas": { entryStreet: "…", address: PORT_ADDRESS },
  // "Symphony of the Seas": { entryStreet: "…", address: PORT_ADDRESS },
  // "MSC Seascape": { entryStreet: "…", address: PORT_ADDRESS },
};

export function getTerminal(ship: string): TerminalInfo | undefined {
  return SHIP_TERMINAL[ship];
}
