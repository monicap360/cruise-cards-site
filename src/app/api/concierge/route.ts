import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// AI concierge for the Cruise Experience Center reservation flow.
// Takes the guest's own description of what they need and returns:
//   • customerMessage — a warm, reassuring note shown to the guest on confirmation
//   • agentBrief      — a concise prep brief so the front desk specialist is ready
//
// Degrades gracefully: if no ANTHROPIC_API_KEY is configured, returns friendly
// static copy so the booking flow always works.

export const runtime = "nodejs";

type Body = {
  serviceType?: string;
  guestName?: string;
  partySize?: number;
  ship?: string;
  sailDate?: string;
  byPhone?: boolean;
  requestSummary?: string;
};

function fallback(byPhone: boolean) {
  return {
    customerMessage: byPhone
      ? "Thanks! A cruise specialist will call you at your chosen time. We've shared your notes with them so they're ready to help the moment you pick up."
      : "Thanks! We've shared your notes with your specialist so they're ready when you arrive. See you at the Cruise Experience Center.",
    agentBrief: "",
  };
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const {
    serviceType = "",
    guestName = "",
    partySize = 1,
    ship = "",
    sailDate = "",
    byPhone = false,
    requestSummary = "",
  } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  // No key, or nothing meaningful to summarize → friendly static copy.
  if (!apiKey || requestSummary.trim().length < 3) {
    return NextResponse.json(fallback(byPhone));
  }

  try {
    const client = new Anthropic({ apiKey });

    const context = [
      `Service: ${serviceType || "general visit"}`,
      `Format: ${byPhone ? "phone call (we call the guest)" : "in-person visit to the Galveston center"}`,
      guestName ? `Guest: ${guestName}` : "",
      partySize > 1 ? `Party size: ${partySize}` : "",
      ship ? `Ship: ${ship}` : "",
      sailDate ? `Sail date: ${sailDate}` : "",
      `What the guest wrote: "${requestSummary.trim()}"`,
    ]
      .filter(Boolean)
      .join("\n");

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system:
        "You are the AI concierge for the Cruise Experience Center in Galveston, Texas — a premium, welcoming cruise concierge where, as the brand says, \"cruises start.\" You help both first-time cruisers (who may be nervous and need reassurance) and seasoned cruisers (who want efficiency). All cruises depart from Galveston. You never quote prices, make guarantees, or invent specific availability — a human specialist confirms everything. Keep a warm, confident, high-end tone.",
      messages: [
        {
          role: "user",
          content: `A guest just requested a reservation. Here are the details:\n\n${context}\n\nProduce two things as JSON:\n1. "customerMessage": 2-3 warm sentences shown to THIS guest confirming we understand what they need and how we'll make it easy. Address their specific request. If they seem new to cruising, reassure them; if experienced, be efficient. Do not quote prices or promise specifics. Max ~60 words.\n2. "agentBrief": a concise internal prep brief for the front desk specialist who will handle this — bullet-style plain text: what the guest wants, anything to prepare, likely follow-up questions, and tone to take. Max ~90 words.`,
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              customerMessage: { type: "string" },
              agentBrief: { type: "string" },
            },
            required: ["customerMessage", "agentBrief"],
            additionalProperties: false,
          },
        },
      },
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(fallback(byPhone));
    }

    const parsed = JSON.parse(textBlock.text) as {
      customerMessage?: string;
      agentBrief?: string;
    };

    return NextResponse.json({
      customerMessage: parsed.customerMessage?.trim() || fallback(byPhone).customerMessage,
      agentBrief: parsed.agentBrief?.trim() || "",
    });
  } catch {
    // Any AI/parse failure → never block the booking.
    return NextResponse.json(fallback(byPhone));
  }
}
