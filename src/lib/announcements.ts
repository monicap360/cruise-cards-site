// Guest-facing notices shown at the top of every group portal. Edit this list
// to post or retire a notice. Keep them short and professional.

export type Announcement = {
  id: string;
  tone: "info" | "warn" | "success";
  title: string;
  body: string;
};

export const GROUP_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "updating",
    tone: "info",
    title: "🛠️ We’re still updating your group",
    body:
      "Thanks for your patience! We’re actively finishing your group details — cabins, guest names, and pricing may still be changing as we get everyone loaded. " +
      "If you spot anything that looks off, or you have a request, please share it using the “Questions & Concerns” box below or call (409) 632-2106. Your feedback helps us get it perfect.",
  },
  {
    id: "name-check",
    tone: "warn",
    title: "📋 Please check your name is correct",
    body:
      "Every guest's name must match their passport or government photo ID exactly. " +
      "If your name is missing or spelled incorrectly on your reservation, please request a correction right away — " +
      "use the “Questions & Concerns” box on this page or call (409) 632-2106. " +
      "Name changes get harder, and can cost more, the closer we get to your sail date.",
  },
  {
    id: "system-upgrade",
    tone: "success",
    title: "📞 We’ve upgraded our phone & booking systems",
    body:
      "Our phone lines have successfully moved over to Ooma for more reliable service " +
      "(after repeated outages with our previous provider) — same numbers, fewer dropped calls. " +
      "Our team is also in training this week on the new phone system plus our new cruise booking engine and group panels, " +
      "so thank you for your patience if something takes an extra moment this week.",
  },
];
