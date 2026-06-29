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

// Claude reads an uploaded PDF (invoice, receipt, statement, commission report)
// and extracts its transactions as structured ledger entries.
const EXTRACT_TOOL: Anthropic.Tool = {
  name: "record_transactions",
  description:
    "Record the financial transactions found in the document as ledger entries.",
  input_schema: {
    type: "object",
    properties: {
      entries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            date: { type: "string", description: "Transaction date, YYYY-MM-DD (infer the year if only month/day shown)." },
            type: { type: "string", enum: ["income", "expense"], description: "income = money the agency receives (client payment, commission); expense = money paid out." },
            category: { type: "string", description: "Short category, e.g. Commission, Cruise payment, Marketing, Software, Bank & processing fees." },
            client: { type: "string", description: "Client or vendor name, if shown." },
            description: { type: "string", description: "What the line item is for." },
            amount: { type: "number", description: "Positive dollar amount." },
            method: { type: "string", description: "Payment method if shown (Check, Card, Bank transfer, Cruise line, etc.)." },
            invoiceNumber: { type: "string", description: "Invoice/confirmation number if shown." },
          },
          required: ["date", "type", "amount", "description"],
        },
      },
    },
    required: ["entries"],
  },
};

const PROMPT = `Read this document and extract EVERY financial transaction / line item into the record_transactions tool.
- This is for a Galveston cruise travel agency's bookkeeping.
- income = money the agency receives (client payments, deposits, commissions, refunds received).
- expense = money the agency pays out (marketing, software, supplies, fees, refunds issued).
- Use positive amounts. Infer the year from context if a line shows only month/day.
- If a single total is the only figure, record one entry. Don't invent transactions that aren't in the document.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError("AI document reading isn't configured yet (missing ANTHROPIC_API_KEY).", 503);
  }

  let body: { pdfBase64?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  const pdfBase64 = body.pdfBase64;
  if (!pdfBase64) return jsonError("No file provided.", 400);

  const mediaType = body.mediaType === "image/png" || body.mediaType === "image/jpeg"
    ? body.mediaType
    : "application/pdf";

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      tools: [EXTRACT_TOOL],
      tool_choice: { type: "tool", name: "record_transactions" },
      messages: [
        {
          role: "user",
          content: [
            mediaType === "application/pdf"
              ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } }
              : { type: "image", source: { type: "base64", media_type: mediaType, data: pdfBase64 } },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    });

    const tu = msg.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );
    const input = (tu?.input ?? {}) as { entries?: unknown[] };
    const entries = Array.isArray(input.entries) ? input.entries : [];
    return new Response(JSON.stringify({ entries }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    const m = e instanceof Error ? e.message : "Extraction failed.";
    return jsonError(m, 500);
  }
}
