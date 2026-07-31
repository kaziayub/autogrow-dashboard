import { getAgents } from "@/lib/queries";
import { AgentSwarmClient } from "./agent-swarm-client";

export default async function ControlCenterPage() {
  const agents = await getAgents();
  return <AgentSwarmClient agents={agents} />;
}
