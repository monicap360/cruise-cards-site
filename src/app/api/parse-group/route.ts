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

// Reads a cruise GROUP contract / booking confirmation / deposit reminder and
// extracts the reservation into structured group fields (matches GroupDeposit).
const TOOL: Anthropic.Tool = {
  name: "record_group",
  description: "Record the group cruise reservation found in the document.",
  input_schema: {
    type: "object",
    properties: {
      groupName: { type: "string", description: "Group name (e.g. YEN ALSTON FAMILY)." },
      cruiseGroupId: { type: "string", description: "Cruise-line group ID / booking number." },
      cruiseLine: { type: "string", description: "e.g. Royal Caribbean, Carnival Cruise Line." },
      ship: { type: "string" },
      sailingDate: { type: "string", description: "YYYY-MM-DD" },
      returnDate: { type: "string", description: "YYYY-MM-DD if shown" },
      itinerary: { type: "string", description: "e.g. 5 Night Western Caribbean" },
      issueDate: { type: "string", description: "YYYY-MM-DD if shown" },
      partnerAdvocate: { type: "string", description: "Cruise-line group contact / advocate name" },
      advocateExt: { type: "string", description: "Their phone extension if shown" },
      rep: { type: "string", description: "Sales rep name if shown" },
      groupEmail: { type: "string", description: "Cruise-line group email if shown" },
      notes: { type: "string", description: "Any helpful notes (terms, requirements)." },
      schedule: {
        type: "array",
        description: "Deposit due-date schedule.",
        items: {
          type: "object",
          properties: {
            dueDate: { type: "string", description: "YYYY-MM-DD" },
            depositRequired: { type: "number" },
            cumulativeDue: { type: "number" },
            paidToDate: { type: "number" },
          },
          required: ["dueDate"],
        },
      },
      cabins: {
        type: "array",
        description: "Each cabin / stateroom held in the group.",
        items: {
          type: "object",
          properties: {
            cabinNumber: { type: "string", description: "Cabin # or GTY for guarantee." },
            bookingId: { type: "string" },
            category: { type: "string", description: "Category code/name (2D, 4V, Interior, Balcony…)." },
            occupancy: { type: "string", description: "D (double), T, Q, etc." },
            deposit: { type: "number" },
            paid: { type: "number" },
          },
        },
      },
    },
    required: ["groupName"],
  },
};

const PROMPT =
  `Read this cruise GROUP contract / booking confirmation / deposit reminder and extract the group reservation into the record_group tool.\n` +
  `- Pull the group name, cruise-line group ID, cruise line, ship, sail date (YYYY-MM-DD), return date, itinerary, issue date, and the cruise-line group contact (advocate, extension, rep, email).\n` +
  `- Extract the full deposit schedule (each due date with the deposit required, cumulative due, and paid-to-date).\n` +
  `- Extract every cabin/stateroom: cabin number (or GTY), booking ID, category, occupancy.\n` +
  `- Only record what's actually in the document. Don't invent cabins, dates, or amounts.`;

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
      max_tokens: 4096,
      tools: [TOOL],
      tool_choice: { type: "tool", name: "record_group" },
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
