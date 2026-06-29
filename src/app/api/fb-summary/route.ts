import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MODEL = process.env.CHAT_MODEL || "claude-opus-4-8";

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// Generate a UNIQUE ~50-word Facebook summary for an article — deliberately not
// a copy-paste, so it indexes as distinct content (your site + your FB post).
export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError("AI isn't configured yet (missing ANTHROPIC_API_KEY).", 503);
  }
  let body: { title?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  const title = (body.title ?? "").slice(0, 300);
  const text = (body.text ?? "").slice(0, 6000);
  if (!title && !text) return jsonError("No article provided.", 400);

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content:
            `You write Facebook posts for a Galveston cruise agency ("Cruises from Galveston").\n` +
            `Write a UNIQUE ~50-word Facebook post summarizing the article below. Rules:\n` +
            `- Do NOT copy sentences or phrasing from the article — use a fresh angle and a scroll-stopping hook so Google indexes it as DISTINCT content from the article.\n` +
            `- Conversational, a little excitement, 1-2 relevant emojis max.\n` +
            `- End with a soft nudge to read the full story (don't include a URL — they'll paste the link after).\n` +
            `- Plain text only, ~50 words.\n\n` +
            `TITLE: ${title}\n\nARTICLE:\n${text}`,
        },
      ],
    });
    const summary = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return new Response(JSON.stringify({ summary }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Generation failed.", 500);
  }
}
