import { getAssistantContext } from "@/lib/queries";
import { AssistantChat } from "./chat";

export default async function AssistantPage() {
  const { agents, activeMission, topMemories } = await getAssistantContext();
  return (
    <AssistantChat
      agents={agents.map((a) => ({ name: a.agent_name, status: a.status, current_task: a.current_task }))}
      mission={activeMission ? { title: activeMission.title, progress: activeMission.progress, status: activeMission.status } : null}
      memories={topMemories.map((m) => ({ title: m.title, category: m.category }))}
    />
  );
}
