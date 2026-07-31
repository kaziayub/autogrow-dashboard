import { NextResponse } from "next/server";

const SYSTEM = `You are AutoGrow OS's executive AI assistant — a calm, direct operations co-pilot for a solo founder running an autonomous content/SEO agency (Zynovari).
- Answer concisely. No filler.
- When asked to act, propose concrete next steps and reference missions/agents/tasks.
- You can see the owner's current context provided in the user message.`;

// Groq proxy. Server-side so the key never reaches the browser.
export async function POST(request: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 503 });
  }
  const { messages } = (await request.json()) as {
    messages: { role: string; content: string }[];
  };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      messages: [{ role: "system", content: SYSTEM }, ...messages],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: "groq_error", detail: txt }, { status: 502 });
  }
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ reply });
}
