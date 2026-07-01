// Guest manifest per group — name, DOB, VIFP (loyalty) #, and stateroom. VIFP is
// left blank as "space to fill" until each guest provides it. Keyed by group code.

export type GroupPassenger = {
  name: string;
  dob: string;        // display, e.g. "May 14, 1990"
  vifp: string;       // Carnival VIFP # — blank = still needed
  stateroom: string;
};

export const GROUP_PASSENGERS: Record<string, GroupPassenger[]> = {
  "gabby-group": [
    { name: "Gabriela Lopez", dob: "Jun 1, 2004", vifp: "", stateroom: "4132" },
    { name: "Ty Munsch", dob: "Jan 14, 2003", vifp: "", stateroom: "4132" },
    { name: "Peter Von Marensdorff", dob: "May 14, 1990", vifp: "", stateroom: "4220" },
    { name: "Kristin Munsch", dob: "Jan 1, 1996", vifp: "", stateroom: "4220" },
    { name: "Stacy Munsch", dob: "Jun 21, 1970", vifp: "", stateroom: "4220" },
    { name: "Robert Munsch", dob: "", vifp: "", stateroom: "TBD" },
    { name: "Robert Stewart", dob: "", vifp: "", stateroom: "TBD" },
  ],
};

export function passengersForGroup(code: string): GroupPassenger[] {
  return GROUP_PASSENGERS[code] ?? [];
}
