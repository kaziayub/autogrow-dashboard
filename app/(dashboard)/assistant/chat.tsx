"use client";

import { useRef, useState, useEffect } from "react";
import { PageHeader, Card, Button, Textarea, Badge } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { Bot, Send, Loader2, BrainCircuit, Target, Cpu, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantChat({
  agents,
  mission,
  memories,
}: {
  agents: { name: string; status: string; current_task: string | null }[];
  mission: { title: string; progress: number; status: string } | null;
  memories: { title: string; category: string }[];
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Mission Control online. Ask me to plan, audit, or draft — I'll reason step by step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }] as Msg[];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...next.slice(-8).map((m) => ({ role: m.role, content: m.content })),
            {
              role: "user",
              content: `[Context] Active mission: ${mission?.title ?? "none"}. Agents: ${agents
                .map((a) => `${a.name}(${a.status})`)
                .join(", ")}.`,
            },
          ],
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? data.error ?? "No response." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        subtitle="Groq Llama 3.3 70B · reasoning co-pilot"
        icon={<Bot className="h-5 w-5" />}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col p-0 overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    m.role === "assistant"
                      ? "bg-gradient-to-br from-accent to-accent-2 text-bg"
                      : "bg-white/8 text-text-muted"
                  }`}
                >
                  {m.role === "assistant" ? <Bot className="h-4 w-4" /> : "You"}
                </div>
                <div
                  className={`rounded-xl px-3.5 py-2.5 max-w-[80%] text-sm whitespace-pre-wrap ${
                    m.role === "assistant"
                      ? "bg-black/30 border border-border-soft"
                      : "bg-accent/15 border border-accent/25"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-bg" />
                </div>
                <div className="rounded-xl px-3.5 py-3 bg-black/30 border border-border-soft">
                  <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-border-soft p-3 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message your assistant…  (Enter to send, Shift+Enter for newline)"
              className="min-h-[44px] max-h-32 font-sans"
              rows={1}
            />
            <Button variant="primary" onClick={send} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Reasoning inspector */}
        <div className="space-y-4 overflow-y-auto">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-3 text-text-muted">
              <Target className="h-4 w-4 text-accent" /> Active Mission
            </h3>
            {mission ? (
              <div>
                <p className="text-sm font-medium">{mission.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={mission.status} />
                  <span className="text-xs text-text-muted">{mission.progress}%</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted">No active mission.</p>
            )}
          </Card>

          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-3 text-text-muted">
              <Cpu className="h-4 w-4 text-accent-2" /> Agent States
            </h3>
            <div className="space-y-2">
              {agents.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-xs">
                  <span>{a.name}</span>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-3 text-text-muted">
              <BrainCircuit className="h-4 w-4 text-violet-400" /> Retrieved Memory
            </h3>
            <div className="space-y-2">
              {memories.map((m) => (
                <div key={m.title} className="text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-text-muted" />
                    <span className="font-medium">{m.title}</span>
                  </div>
                  <Badge tone="neutral" className="mt-1">{m.category}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
