"use client";

// Small client button to trigger the browser print / save-as-PDF dialog.
export default function PrintButton({
  className = "",
  label = "🖨  Print / Save as PDF",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {label}
    </button>
  );
}
