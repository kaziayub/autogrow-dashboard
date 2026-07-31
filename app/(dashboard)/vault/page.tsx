import { getMemories } from "@/lib/queries";
import { PageHeader, Card, Badge, EmptyState } from "@/components/ui";
import { BrainCircuit, Search } from "lucide-react";
import { VaultSearch } from "./vault-search";

const CATEGORY_TONE: Record<string, "blue" | "green" | "amber" | "violet" | "neutral"> = {
  Business: "green",
  SEO: "blue",
  Technical: "violet",
  Personal: "amber",
  Ideas: "blue",
  General: "neutral",
};

export default async function VaultPage() {
  const memories = await getMemories();
  const categories = [...new Set(memories.map((m) => m.category))];

  return (
    <div>
      <PageHeader
        title="Memory Vault"
        subtitle={`${memories.length} entries · searchable knowledge base`}
        icon={<BrainCircuit className="h-5 w-5" />}
      />
      <VaultSearch memories={memories} categories={categories} categoryTone={CATEGORY_TONE} />
    </div>
  );
}
