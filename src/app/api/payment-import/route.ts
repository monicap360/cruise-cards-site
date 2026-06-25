import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Reads an uploaded payment-history document (PDF or image — e.g. a cruise-line
// statement) with Claude and extracts a structured list of payments the agent
// can review and add to a booking's ledger. No card data beyond last-4 is kept.

export const runtime = "nodejs";
export const maxDuration = 60;

const IMAGE_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI import is not configured (missing ANTHROPIC_API_KEY)." },
      { status: 503 }
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 25MB)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());
  const b64 = buf.toString("base64");

  const isPdf = ext === "pdf" || file.type === "application/pdf";
  const imageMedia = IMAGE_TYPES[ext] ?? (file.type.startsWith("image/") ? file.type : "");

  if (!isPdf && !imageMedia) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PDF or image." },
      { status: 400 }
    );
  }

  const docBlock = isPdf
    ? {
        type: "document" as const,
        source: { type: "base64" as const, media_type: "application/pdf" as const, data: b64 },
      }
    : {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: imageMedia as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
          data: b64,
        },
      };

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system:
        "You extract payment records from cruise/travel payment-history documents. Return ONLY payments that actually appear in the document. Use the date the payment was made (YYYY-MM-DD). Map the method to one of: check, in-person, cruise-line-direct, other (a card charged by the cruise line is 'cruise-line-direct'). Set status to 'cleared' for posted/completed payments, 'pending' for payments shown as pending, 'bounced' for returned items. Capture only the LAST 4 digits of any card (never more). Do not invent data; omit fields you cannot read.",
      messages: [
        {
          role: "user",
          content: [
            docBlock,
            {
              type: "text",
              text: "Extract every payment in this payment history as structured JSON.",
            },
          ],
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              payments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    receivedDate: { type: "string" },
                    amount: { type: "number" },
                    method: {
                      type: "string",
                      enum: ["check", "in-person", "cruise-line-direct", "other"],
                    },
                    status: {
                      type: "string",
                      enum: ["pending", "cleared", "bounced"],
                    },
                    payerName: { type: "string" },
                    cardLast4: { type: "string" },
                    reference: { type: "string" },
                    note: { type: "string" },
                  },
                  required: ["receivedDate", "amount", "method", "status"],
                  additionalProperties: false,
                },
              },
            },
            required: ["payments"],
            additionalProperties: false,
          },
        },
      },
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ payments: [] });
    }
    const parsed = JSON.parse(textBlock.text) as { payments?: unknown[] };
    return NextResponse.json({ payments: parsed.payments ?? [] });
  } catch {
    return NextResponse.json(
      { error: "Could not read the document. Try a clearer file." },
      { status: 502 }
    );
  }
}
