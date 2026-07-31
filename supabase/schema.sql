-- AutoGrow OS — Mission Control Center
-- Master schema. Idempotent (safe to re-run). Paste into Supabase SQL editor.
-- NOTE: the blueprint header said "14 tables" but only 11 are defined in its SQL.
--       We implement the 11 defined ones. ponytail: add more when the engine needs them.

-- ============================================================================
-- 1. Tables (verbatim from blueprint + a few helpful indexes/constraints)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agent_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',        -- 'running' | 'idle' | 'error'
    current_task TEXT,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    metrics JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning',    -- 'planning' | 'in_progress' | 'completed' | 'paused'
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    agent_name TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',     -- 'pending' | 'running' | 'waiting_approval' | 'completed' | 'failed'
    priority TEXT DEFAULT 'medium',             -- 'low' | 'medium' | 'high'
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    importance INTEGER DEFAULT 5,
    content TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    impact TEXT DEFAULT 'medium',               -- 'high' | 'medium' | 'low'
    status TEXT DEFAULT 'new',                  -- 'new' | 'accepted' | 'rejected'
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    action_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',              -- 'pending' | 'approved' | 'rejected'
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scheduler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name TEXT UNIQUE NOT NULL,
    job_type TEXT NOT NULL,                     -- 'system' | 'business' | 'user'
    cron_expression TEXT NOT NULL,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seo_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    title TEXT,
    meta_description TEXT,
    h1_count INTEGER,
    images_without_alt INTEGER,
    broken_links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft',                -- 'draft' | 'pr_created' | 'published'
    github_pr_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    summary TEXT NOT NULL,
    key_findings JSONB DEFAULT '[]'::jsonb,
    sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent TEXT NOT NULL,
    action TEXT NOT NULL,
    level TEXT DEFAULT 'info',                  -- 'info' | 'warn' | 'error'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_tasks_status        ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_mission       ON public.tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_tasks_agent         ON public.tasks(agent_name);
CREATE INDEX IF NOT EXISTS idx_logs_created        ON public.logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_audits_created  ON public.seo_audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scheduler_type      ON public.scheduler(job_type);

-- ============================================================================
-- 2. Realtime — publish the tables the UI watches live
-- ============================================================================
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_control, public.tasks, public.approvals, public.opportunities, public.logs;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 3. Row Level Security
--    Single-user system: any authenticated user has full access. ponytail: add a
--    `profiles.role` column + scoped policies before adding more operators.
-- ============================================================================
ALTER TABLE public.agent_control   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduler       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audits      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_drafts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs            ENABLE ROW LEVEL SECURITY;

-- Drop & recreate so the script is re-runnable.
DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t SLICE 1 IN ARRAY ARRAY[
    'agent_control','missions','tasks','memory','opportunities','approvals',
    'scheduler','seo_audits','content_drafts','research_reports','logs'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "authenticated_all" ON public.%I;', t);
    EXECUTE format('CREATE POLICY "authenticated_all" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

-- ============================================================================
-- 4. Seed data (idempotent via ON CONFLICT)
-- ============================================================================
INSERT INTO public.agent_control (agent_name, status, current_task, metrics) VALUES
  ('Executive', 'idle', NULL, '{"role":"Strategic planning & goal decomposition"}'),
  ('SEO',       'idle', NULL, '{"role":"Keyword tracking & technical audits"}'),
  ('Content',   'idle', NULL, '{"role":"Blog drafting & PR creation"}'),
  ('Website',   'idle', NULL, '{"role":"Crawler audits & broken-link scans"}'),
  ('Research',  'idle', NULL, '{"role":"Competitor & trend research"}'),
  ('Scheduler', 'idle', NULL, '{"role":"Cron orchestration & watchdog"}')
ON CONFLICT (agent_name) DO NOTHING;

INSERT INTO public.missions (title, description, status, progress) VALUES
  ('Launch Zynovari Content Engine', 'Automate weekly SEO-driven blog publishing pipeline.', 'in_progress', 35),
  ('Reach 10k Monthly Organic Visits', 'Compound content + technical SEO to hit organic milestone.', 'planning', 5)
ON CONFLICT DO NOTHING;

INSERT INTO public.memory (title, category, importance, content) VALUES
  ('Brand voice', 'Business', 9, 'Direct, practical, no hype. Bengali + English mix for local audience.'),
  ('Primary domain', 'Business', 8, 'zynovari.com — hosted on Vercel, repo kaziayub/zynovari-web.'),
  ('AI provider preference', 'Technical', 7, 'Groq Llama 3.3 70B for speed; NVIDIA as fallback.')
ON CONFLICT (title) DO NOTHING;

INSERT INTO public.scheduler (job_name, job_type, cron_expression, next_run) VALUES
  ('Daily SEO Audit',         'system',  '0 6 * * *',   now() + interval '1 day'),
  ('Weekly Content Generator','business','0 9 * * 1',   now() + interval '7 days'),
  ('Heartbeat Watchdog',      'system',  '*/5 * * * *', now() + interval '5 minutes'),
  ('Opportunity Scanner',     'business','0 12 * * *',  now() + interval '1 day')
ON CONFLICT (job_name) DO NOTHING;

INSERT INTO public.research_reports (topic, summary, key_findings, sources) VALUES
  ('AI SEO tools 2026', 'Competitor landscape of AI-assisted SEO suites is consolidating around agentic workflows.',
    '["Agentic SEO tools rising fast","Speed-to-index is the new ranking edge","Programmatic SEO maturing"]',
    '["https://example.com/source1","https://example.com/source2"]')
ON CONFLICT DO NOTHING;

INSERT INTO public.logs (agent, action, level, details) VALUES
  ('Scheduler', 'cron.tick',        'info', '{"job":"Heartbeat Watchdog"}'),
  ('SEO',       'audit.completed',  'info', '{"url":"https://zynovari.com","score":82}'),
  ('Executive', 'mission.updated',  'info', '{"mission":"Launch Zynovari Content Engine","progress":35}')
ON CONFLICT DO NOTHING;
