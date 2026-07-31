# AutoGrow OS — Mission Control Center

Personal autonomous-agency dashboard. Next.js (App Router) + Supabase + Tailwind v4.
Dark glassmorphism UI, live realtime updates, 14 pages, drag-and-drop task board,
Groq-powered AI assistant, content studio with SEO scoring.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 → redirected to `/login`.

### 1. Create your auth user
First visit: use **Create account** on `/login` (email + password ≥ 6 chars).
RLS then grants full access to the single authenticated owner.

### 2. Apply the database schema
Open your Supabase project → **SQL Editor** → paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql) → **Run**.

Idempotent (`IF NOT EXISTS` + `ON CONFLICT`), safe to re-run. Creates all 11 tables,
enables RLS, adds Realtime publication, seeds 6 agents + sample data.

### 3. Environment
`.env.local` is pre-filled (gitignored). See `.env.example` for the key list.

## Architecture

| Layer | Tech |
|---|---|
| Frontend | Next.js App Router, React 19, Tailwind v4 |
| DB + Auth + Realtime | Supabase Postgres, `@supabase/ssr` |
| Kanban | `@hello-pangea/dnd` |
| AI | Groq (Llama 3.3 70B) via `/api/chat` server route |
| Icons | lucide-react |

Three Supabase clients (split by trust boundary):
- `lib/supabase/client.ts` — browser (RLS-scoped, realtime)
- `lib/supabase/server.ts` — server components/actions (RLS-scoped)
- `lib/supabase/service.ts` — service-role, route handlers only

## What's live vs. stubbed

**Live (this build):** all 14 pages, Supabase CRUD + realtime, auth gate, Kanban
drag-and-drop, AI Assistant (Groq), Content Studio (editor + preview + SEO score +
seed from sample posts), Reports export, Memory/Research/SEO/Website reads.

**Stubbed (need the AWS VPS engine — not part of this build):**
- Agent **Run Now** + **cron execution** → `/api/trigger-agent` logs the intent and
  relays to `VPS_WEBHOOK_URL` once set. Today it logs "engine_not_connected".
- **GitHub PR creation** → marks draft `pr_created`; real PR needs octokit + repo.
- **Server Monitor CPU/RAM/Disk** → requires the VPS worker to push metrics.
- **Telegram bot** runtime → lives on the VPS.

To wire the engine later: set `VPS_WEBHOOK_URL` + `VPS_WEBHOOK_SECRET` in `.env.local`.

## Schema note
The blueprint header said "14 tables" but its SQL defines 11. We implement the 11.
Add more when the engine requires them.
