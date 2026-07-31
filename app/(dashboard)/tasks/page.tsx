import { getTasks, getAgents } from "@/lib/queries";
import { PageHeader, Card, Input, Button } from "@/components/ui";
import { Kanban } from "./kanban";
import { createTask } from "./actions";
import { KanbanSquare, Plus } from "lucide-react";

export default async function TasksPage() {
  const [tasks, agents] = await Promise.all([getTasks(), getAgents()]);
  const agentNames = agents.map((a) => a.agent_name);

  return (
    <div>
      <PageHeader
        title="Task Board"
        subtitle="Drag tasks across the pipeline · live sync"
        icon={<KanbanSquare className="h-5 w-5" />}
      />

      <Card className="mb-4">
        <form action={createTask} className="flex flex-wrap gap-2">
          <Input
            name="title"
            placeholder="New task title…"
            required
            className="flex-1 min-w-[200px]"
          />
          <select
            name="agent_name"
            className="rounded-lg bg-black/30 border border-border-soft px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/60"
            defaultValue={agentNames[0] ?? "Executive"}
          >
            {agentNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select
            name="priority"
            defaultValue="medium"
            className="rounded-lg bg-black/30 border border-border-soft px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/60"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Button type="submit" variant="primary">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </Card>

      <Kanban tasks={tasks} />
    </div>
  );
}
