"use client";

import { useState } from "react";
import { Card, Badge, Input, EmptyState } from "@/components/ui";
import type { Memory } from "@/lib/types";
import { Search, Star } from "lucide-react";

type ToneMap = Record<string, "blue" | "green" | "amber" | "violet" | "neutral">;

export function VaultSearch({
  memories,
  categories,
  categoryTone,
}: {
  memories: Memory[];
  categories: string[];
  categoryTone: ToneMap;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = memories.filter((m) => {
    const matchCat = cat === "All" || m.category === cat;
    const matchQ =
      !q ||
      m.title.toLowerCase().includes(q.toLowerCase()) ||
      m.content.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search memories…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition ${
                cat === c
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "border-border-soft text-text-muted hover:text-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<Search className="h-8 w-8" />} title="No memories match" /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <Card key={m.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">{m.title}</h3>
                <div className="flex items-center gap-0.5 text-warn shrink-0">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs">{m.importance}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted line-clamp-3 flex-1">{m.content}</p>
              <div className="flex items-center justify-between pt-1">
                <Badge tone={categoryTone[m.category] ?? "neutral"}>{m.category}</Badge>
                <span className="text-[10px] text-text-muted">used {m.usage_count}×</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
