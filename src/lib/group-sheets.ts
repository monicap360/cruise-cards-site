// Per-group reference docs (Google Sheets) embedded ADMIN-ONLY in /admin/groups.
// These hold private cross-family data + pricing notes, so they are never shown
// on the guest portal. Add an entry keyed by the group code.
// NOTE: the sheet must be shared "Anyone with the link can view" to embed.

export const GROUP_SHEETS: Record<string, string> = {
  "thanksgiving-alston-group":
    "https://docs.google.com/spreadsheets/d/1AaZzA5eNn6tGLsr88rp83xN71zDjDTNEZsnF7kiqcxE/preview",
};
