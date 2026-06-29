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

const TOOL: Anthropic.Tool = {
  name: "publish_article",
  description: "Return the finished deep-dive article and a Facebook caption.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "SEO-friendly article title." },
      body: { type: "string", description: "~1,000-word article. Paragraphs separated by a blank line (\\n\\n)." },
      caption: { type: "string", description: "Facebook share caption starting 'You asked, we answered. Here's the full breakdown.'" },
    },
    required: ["title", "body", "caption"],
  },
};

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError("AI isn't configured yet (missing ANTHROPIC_API_KEY).", 503);
  }
  let b: { topic?: string; postText?: string; commenters?: { name?: string; comment?: string }[] };
  try {
    b = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  const topic = (b.topic ?? "").slice(0, 500);
  if (!topic.trim()) return jsonError("Add the topic of your most-engaged post.", 400);
  const postText = (b.postText ?? "").slice(0, 2000);
  const commenters = (b.commenters ?? [])
    .filter((c) => (c.name ?? "").trim())
    .map((c) => `${c.name}: "${(c.comment ?? "").trim()}"`)
    .join("\n");

  const prompt =
    `You write for "Cruises from Galveston," a Galveston, TX cruise agency and a trusted LOCAL community voice.\n` +
    `Expand the topic below into a ~1,000-word, original, genuinely useful deep-dive article (not fluff).\n` +
    `IMPORTANT: naturally quote the commenters by name within the article (e.g., As Jane R. asked, "...", and here's the real answer...). Make them feel featured.\n` +
    `Brand facts to stay accurate: Galveston-only departures; lines they book are Carnival, Royal Caribbean, MSC, Norwegian, Disney; guests drive in & park OR fly into Houston (IAH/Hobby) and we arrange transfers; no cards charged online — mail a check to 3501 Winnie St, Galveston TX 77550 or pay the cruise line, deposit holds the cabin, balance ~120 days before sailing; phone (409) 632-2106. Do NOT invent specific prices or statistics.\n` +
    `End with a soft call to action (search sailings or call). Then write a Facebook caption that begins exactly: "You asked, we answered. Here's the full breakdown."\n\n` +
    `TOPIC / MOST-ENGAGED POST: ${topic}\n\n` +
    (postText ? `ORIGINAL POST TEXT:\n${postText}\n\n` : "") +
    (commenters ? `TOP COMMENTERS TO QUOTE:\n${commenters}\n` : "");

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      tools: [TOOL],
      tool_choice: { type: "tool", name: "publish_article" },
      messages: [{ role: "user", content: prompt }],
    });
    const tu = msg.content.find((x): x is Anthropic.ToolUseBlock => x.type === "tool_use");
    const out = (tu?.input ?? {}) as { title?: string; body?: string; caption?: string };
    return new Response(
      JSON.stringify({ title: out.title ?? "", body: out.body ?? "", caption: out.caption ?? "" }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Generation failed.", 500);
  }
}
