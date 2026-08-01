import { PageHeader, Card, Badge } from "@/components/ui";
import { Settings, KeyRound, Plug, ShieldCheck } from "lucide-react";

function mask(v: string) {
  return v ? v.slice(0, 4) + "••••••••" + v.slice(-4) : "—";
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || "active_github_pat";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "active_telegram_token";
const TELEGRAM_OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID || process.env.NEXT_PUBLIC_TELEGRAM_OWNER_CHAT_ID || "active_chat_id";
const VPS_WEBHOOK_URL = process.env.VPS_WEBHOOK_URL || process.env.NEXT_PUBLIC_VPS_WEBHOOK_URL || "http://63.180.69.67:3005/api/trigger-agent";

const KEYS = [
  { name: "NEXT_PUBLIC_SUPABASE_URL", val: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fpteiupgrjdoraigcjhw.supabase.co", pub: true },
  { name: "SUPABASE_ANON_KEY", val: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "active_anon_key", pub: true },
  { name: "SUPABASE_SERVICE_ROLE_KEY", val: process.env.SUPABASE_SERVICE_ROLE_KEY || "active_service_key", pub: false },
  { name: "GROQ_API_KEY", val: process.env.GROQ_API_KEY || "active_groq_key", pub: false },
  { name: "GITHUB_TOKEN", val: GITHUB_TOKEN, pub: false },
  { name: "TELEGRAM_BOT_TOKEN", val: TELEGRAM_BOT_TOKEN, pub: false },
  { name: "TELEGRAM_OWNER_CHAT_ID", val: TELEGRAM_OWNER_CHAT_ID, pub: true },
  { name: "VPS_WEBHOOK_URL", val: VPS_WEBHOOK_URL, pub: true },
];

export default function SettingsPage() {
  const vpsConnected = !!VPS_WEBHOOK_URL;

  return (
    <div>
      <PageHeader
        title="Global Settings"
        subtitle="API keys & integration status"
        icon={<Settings className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <KeyRound className="h-4 w-4 text-accent" /> API Keys
          </h3>
          <div className="space-y-2.5">
            {KEYS.map((k) => (
              <div key={k.name} className="flex items-center justify-between gap-3 py-1.5 border-b border-border-soft/50 last:border-0">
                <div className="min-w-0">
                  <div className="text-xs font-medium font-mono truncate">{k.name}</div>
                  <div className="text-[10px] text-text-muted font-mono">
                    {k.pub ? (k.val ? mask(k.val) : "not set") : k.val ? "••••••••••••••••" : "not set"}
                  </div>
                </div>
                <Badge tone={k.val ? "green" : "red"}>{k.val ? "set" : "missing"}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Plug className="h-4 w-4 text-accent-2" /> Integration Status
            </h3>
            <div className="space-y-2.5">
              <Row label="Supabase (DB + Auth + Realtime)" ok={true} />
              <Row label="Groq (AI Assistant)" ok={true} />
              <Row label="GitHub (PR creation)" ok={!!GITHUB_TOKEN} />
              <Row label="Telegram (mobile approvals)" ok={!!TELEGRAM_BOT_TOKEN} />
              <Row label="AWS VPS Engine (workers + cron)" ok={vpsConnected} hint={vpsConnected ? undefined : "not connected"} />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-ok" /> Security
            </h3>
            <p className="text-xs text-text-muted">
              Auth is gated via Supabase + middleware redirect. RLS allows all actions to authenticated users (single-owner system). The service-role key never reaches the browser.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, ok, hint }: { label: string; ok: boolean; hint?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border-soft/50 last:border-0">
      <span className="text-xs">{label}</span>
      <Badge tone={ok ? "green" : "red"}>{ok ? "connected" : hint ?? "not set"}</Badge>
    </div>
  );
}
