import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.CHAT_MODEL || "claude-opus-4-8";

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// Reads a single cruise-line RESERVATION / booking confirmation / invoice and
// extracts the cabin into structured fields for a group member.
const TOOL: Anthropic.Tool = {
  name: "record_booking",
  description: "Record the single cruise reservation found in the document.",
  input_schema: {
    type: "object",
    properties: {
      reservationNumber: { type: "string", description: "Reservation / booking number." },
      brand: { type: "string", description: "Cruise line (Royal Caribbean, Carnival…)." },
      ship: { type: "string" },
      sailDate: { type: "string", description: "YYYY-MM-DD" },
      nights: { type: "number" },
      itinerary: { type: "string" },
      stateroom: { type: "string", description: "Cabin/stateroom number (or GTY)." },
      category: { type: "string", description: "Friendly category: Interior, Ocean View, Balcony, or Suite." },
      guests: {
        type: "array",
        description: "Each guest in the cabin.",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Full name." },
            dob: { type: "string", description: "Date of birth as shown (e.g. 14JAN2014)." },
          },
          required: ["name"],
        },
      },
      totalPrice: { type: "number", description: "Total price for the cabin (USD)." },
      taxesPerPerson: { type: "number", description: "Taxes/fees/port expenses per person (USD)." },
      deposit: { type: "number", description: "Deposit amount (USD)." },
      paymentsReceived: { type: "number", description: "Payments received to date (USD)." },
      finalPayment: { type: "number", description: "Final payment amount due (USD)." },
      finalPaymentDue: { type: "string", description: "Final payment due date (YYYY-MM-DD)." },
      email: { type: "string" },
      phone: { type: "string" },
      promos: { type: "array", items: { type: "string" }, description: "Promo/rate names (e.g. BOGO60 NRD)." },
    },
    required: ["reservationNumber"],
  },
};

const PROMPT =
  `Read this cruise-line reservation / booking confirmation / invoice and extract the single cabin into the record_booking tool.\n` +
  `- Map the cabin category to a friendly name: Interior, Ocean View, Balcony, or Suite (4N/interior codes → Interior; ocean view → Ocean View; balcony → Balcony; suite → Suite). If the doc says "Type: Ocean View", use Ocean View.\n` +
  `- Extract every guest with name and date of birth exactly as shown.\n` +
  `- Extract totals: total price, taxes/fees/port per person, deposit, payments received, final payment + due date, and any promo/rate names.\n` +
  `- Only record what's actually in the document. Don't invent values.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError("AI isn't configured yet (missing ANTHROPIC_API_KEY).", 503);
  }
  let body: { pdfBase64?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  if (!body.pdfBase64) return jsonError("No file provided.", 400);
  const mediaType =
    body.mediaType === "image/png" || body.mediaType === "image/jpeg" ? body.mediaType : "application/pdf";

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      tools: [TOOL],
      tool_choice: { type: "tool", name: "record_booking" },
      messages: [
        {
          role: "user",
          content: [
            mediaType === "application/pdf"
              ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: body.pdfBase64 } }
              : { type: "image", source: { type: "base64", media_type: mediaType, data: body.pdfBase64 } },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    });
    const tu = msg.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    return new Response(JSON.stringify(tu?.input ?? {}), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Extraction failed.", 500);
  }
}
