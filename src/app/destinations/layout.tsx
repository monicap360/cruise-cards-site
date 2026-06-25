import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cruise Destinations from Galveston",
  description:
    "Where you can sail from Galveston — Cozumel, Roatán, Belize, Grand Cayman, Nassau, Key West, Costa Maya, Progreso & private islands. Photos, things to do, and which cruise lines go there.",
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
