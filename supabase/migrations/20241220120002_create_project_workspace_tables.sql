-- =====================================================
-- Migration: Create Project Workspace Tables
-- Created: 2024-12-20T12:00:02Z
-- Tables: milestones, tasks, tickets, repositories
-- Purpose: Create tables for project workspace functionality
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: milestones
-- Purpose: Store project milestones and deliverables
-- =====================================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Timeline
  start_date DATE,
  due_date DATE,
  completed_date DATE,
  
  -- Progress tracking
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Dependencies
  depends_on UUID REFERENCES milestones(id),
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT milestones_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT milestones_dates_valid CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date),
  CONSTRAINT milestones_no_self_dependency CHECK (depends_on IS NULL OR depends_on != id)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS milestones_project_id_idx ON milestones(project_id);
CREATE INDEX IF NOT EXISTS milestones_user_id_idx ON milestones(user_id);
CREATE INDEX IF NOT EXISTS milestones_status_idx ON milestones(status);
CREATE INDEX IF NOT EXISTS milestones_due_date_idx ON milestones(due_date);
CREATE INDEX IF NOT EXISTS milestones_created_at_idx ON milestones(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "milestones_select_own"
  ON milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "milestones_insert_own"
  ON milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "milestones_update_own"
  ON milestones FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "milestones_delete_own"
  ON milestones FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE milestones IS 'Project milestones and deliverables';
COMMENT ON COLUMN milestones.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN milestones.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN milestones.user_id IS 'Owner of this milestone (references auth.users)';
COMMENT ON COLUMN milestones.depends_on IS 'Dependency milestone (self-reference)';

-- =====================================================
-- TABLE: tasks
-- Purpose: Store project tasks and subtasks
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Task details
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  assignee_id UUID REFERENCES auth.users(id),
  
  -- Timeline
  due_date DATE,
  completed_date DATE,
  
  -- Dependencies
  depends_on UUID REFERENCES tasks(id),
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT tasks_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT tasks_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours >= 0),
  CONSTRAINT tasks_actual_hours_positive CHECK (actual_hours IS NULL OR actual_hours >= 0),
  CONSTRAINT tasks_no_self_dependency CHECK (depends_on IS NULL OR depends_on != id)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);
CREATE INDEX IF NOT EXISTS tasks_milestone_id_idx ON tasks(milestone_id);
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_assignee_id_idx ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "tasks_select_own"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_own"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_own"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_delete_own"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE tasks IS 'Project tasks and subtasks';
COMMENT ON COLUMN tasks.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN tasks.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN tasks.milestone_id IS 'Parent milestone (references milestones)';
COMMENT ON COLUMN tasks.assignee_id IS 'Task assignee (references auth.users)';

-- =====================================================
-- TABLE: tickets
-- Purpose: Store project tickets and issues
-- =====================================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'bug' CHECK (type IN ('bug', 'feature', 'task', 'improvement', 'question')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical')),
  
  -- Ticket details
  assignee_id UUID REFERENCES auth.users(id),
  reporter_id UUID REFERENCES auth.users(id),
  
  -- External references
  external_id TEXT, -- For Jira/GitHub integration
  external_url TEXT,
  
  -- Resolution
  resolution TEXT,
  resolved_date DATE,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT tickets_title_not_empty CHECK (length(trim(title)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS tickets_project_id_idx ON tickets(project_id);
CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON tickets(user_id);
CREATE INDEX IF NOT EXISTS tickets_assignee_id_idx ON tickets(assignee_id);
CREATE INDEX IF NOT EXISTS tickets_reporter_id_idx ON tickets(reporter_id);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON tickets(status);
CREATE INDEX IF NOT EXISTS tickets_type_idx ON tickets(type);
CREATE INDEX IF NOT EXISTS tickets_priority_idx ON tickets(priority);
CREATE INDEX IF NOT EXISTS tickets_external_id_idx ON tickets(external_id);
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON tickets(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "tickets_select_own"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "tickets_insert_own"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tickets_update_own"
  ON tickets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tickets_delete_own"
  ON tickets FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE tickets IS 'Project tickets and issues';
COMMENT ON COLUMN tickets.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN tickets.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN tickets.assignee_id IS 'Ticket assignee (references auth.users)';
COMMENT ON COLUMN tickets.reporter_id IS 'Ticket reporter (references auth.users)';
COMMENT ON COLUMN tickets.external_id IS 'External system ID (Jira/GitHub)';

-- =====================================================
-- TABLE: repositories
-- Purpose: Store project repository integrations
-- =====================================================
CREATE TABLE IF NOT EXISTS repositories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'gitlab', 'bitbucket', 'azure')),
  
  -- Repository details
  full_name TEXT NOT NULL, -- e.g., "owner/repo"
  private BOOLEAN DEFAULT false,
  default_branch TEXT DEFAULT 'main',
  
  -- Integration status
  is_connected BOOLEAN DEFAULT false,
  last_sync TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'success', 'failed')),
  
  -- External references
  external_id TEXT, -- Provider's repository ID
  webhook_id TEXT, -- Webhook ID for updates
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT repositories_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT repositories_url_valid CHECK (url ~ '^https?://'),
  CONSTRAINT repositories_full_name_not_empty CHECK (length(trim(full_name)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS repositories_project_id_idx ON repositories(project_id);
CREATE INDEX IF NOT EXISTS repositories_user_id_idx ON repositories(user_id);
CREATE INDEX IF NOT EXISTS repositories_provider_idx ON repositories(provider);
CREATE INDEX IF NOT EXISTS repositories_is_connected_idx ON repositories(is_connected);
CREATE INDEX IF NOT EXISTS repositories_external_id_idx ON repositories(external_id);
CREATE INDEX IF NOT EXISTS repositories_created_at_idx ON repositories(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_repositories_updated_at ON repositories;
CREATE TRIGGER update_repositories_updated_at
  BEFORE UPDATE ON repositories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "repositories_select_own"
  ON repositories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "repositories_insert_own"
  ON repositories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "repositories_update_own"
  ON repositories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "repositories_delete_own"
  ON repositories FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE repositories IS 'Project repository integrations';
COMMENT ON COLUMN repositories.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN repositories.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN repositories.provider IS 'Git provider (github, gitlab, etc.)';
COMMENT ON COLUMN repositories.full_name IS 'Full repository name (owner/repo)';
COMMENT ON COLUMN repositories.external_id IS 'Provider repository ID';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS repositories CASCADE;
-- DROP TABLE IF EXISTS tickets CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS milestones CASCADE;
