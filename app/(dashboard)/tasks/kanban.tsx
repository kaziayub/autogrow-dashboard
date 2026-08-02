"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { moveTask, deleteTask } from "./actions";
import type { Task } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { Trash2 } from "lucide-react";

const COLUMNS: { id: Task["status"]; label: string; tone: string }[] = [
  { id: "pending", label: "Pending", tone: "border-text-muted/30" },
  { id: "running", label: "Running", tone: "border-ok/40" },
  { id: "waiting_approval", label: "Waiting", tone: "border-warn/40" },
  { id: "completed", label: "Completed", tone: "border-accent-2/40" },
  { id: "failed", label: "Failed", tone: "border-danger/40" },
];

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-danger",
  medium: "bg-warn",
  low: "bg-text-muted",
};

export function Kanban({ tasks }: { tasks: Task[] }) {
  const [items, setItems] = useState(tasks);

  async function onDragEnd(res: DropResult) {
    if (!res.destination || res.destination.droppableId === res.source.droppableId) return;
    const taskId = res.draggableId;
    const newStatus = res.destination.droppableId as Task["status"];

    // optimistic
    setItems((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    await moveTask(taskId, newStatus);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3 overflow-x-auto">
        {COLUMNS.map((col) => {
          const colTasks = items.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className={`rounded-xl glass border-t-2 ${col.tone} flex flex-col min-h-[200px]`}>
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-soft">
                <span className="text-xs font-semibold uppercase tracking-wide">{col.label}</span>
                <span className="text-xs text-text-muted tabular-nums">{colTasks.length}</span>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 space-y-2 min-h-[120px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-accent/5" : ""
                    }`}
                  >
                    {colTasks.map((t, i) => (
                      <Draggable key={t.id} draggableId={t.id} index={i}>
                        {(p, s) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            className={`rounded-lg bg-black/30 border border-border-soft p-2.5 cursor-grab active:cursor-grabbing ${
                              s.isDragging ? "shadow-lg border-accent/40" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                                  t.status === "completed"
                                    ? "bg-ok"
                                    : t.status === "failed"
                                    ? "bg-danger"
                                    : PRIORITY_DOT[t.priority] || "bg-warn"
                                }`}
                                title={t.status === "completed" ? "Completed" : `Priority: ${t.priority}`}
                              />
                              <p className="text-xs flex-1 leading-snug">{t.title}</p>
                              <button
                                onClick={() => {
                                  setItems((prev) => prev.filter((x) => x.id !== t.id));
                                  deleteTask(t.id);
                                }}
                                className="text-text-muted/50 hover:text-danger shrink-0"
                                aria-label="Delete task"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <StatusBadge status={t.status} />
                              <span className="text-[10px] text-text-muted">{t.agent_name}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {colTasks.length === 0 && (
                      <div className="text-center text-[11px] text-text-muted/50 py-6">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
