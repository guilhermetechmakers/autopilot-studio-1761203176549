-- =====================================================
-- Migration: Create Dashboard Tables
-- Created: 2024-12-13T12:00:00Z
-- Tables: projects, meetings, notifications, kpi_metrics
-- Purpose: Create tables for dashboard data management
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
-- TABLE: projects
-- Purpose: Store project information for dashboard
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'completed', 'on_hold', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Project details
  client_name TEXT,
  budget DECIMAL(12,2),
  start_date DATE,
  end_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT projects_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT projects_budget_positive CHECK (budget IS NULL OR budget >= 0),
  CONSTRAINT projects_dates_valid CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_priority_idx ON projects(priority);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS projects_start_date_idx ON projects(start_date);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "projects_select_own"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_delete_own"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE projects IS 'Project information for dashboard display';
COMMENT ON COLUMN projects.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN projects.user_id IS 'Owner of this project (references auth.users)';
COMMENT ON COLUMN projects.status IS 'Current project status';
COMMENT ON COLUMN projects.priority IS 'Project priority level';
COMMENT ON COLUMN projects.progress_percentage IS 'Project completion percentage (0-100)';

-- =====================================================
-- TABLE: meetings
-- Purpose: Store meeting information for dashboard
-- =====================================================
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  
  -- Meeting details
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_url TEXT,
  
  -- Participants
  participants JSONB DEFAULT '[]'::jsonb,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT meetings_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT meetings_times_valid CHECK (end_time > start_time)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS meetings_user_id_idx ON meetings(user_id);
CREATE INDEX IF NOT EXISTS meetings_start_time_idx ON meetings(start_time);
CREATE INDEX IF NOT EXISTS meetings_status_idx ON meetings(status);
CREATE INDEX IF NOT EXISTS meetings_created_at_idx ON meetings(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "meetings_select_own"
  ON meetings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "meetings_insert_own"
  ON meetings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meetings_update_own"
  ON meetings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meetings_delete_own"
  ON meetings FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE meetings IS 'Meeting information for dashboard display';
COMMENT ON COLUMN meetings.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN meetings.user_id IS 'Owner of this meeting (references auth.users)';
COMMENT ON COLUMN meetings.participants IS 'Array of participant information';

-- =====================================================
-- TABLE: notifications
-- Purpose: Store notification information for dashboard
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  
  -- Notification details
  action_url TEXT,
  action_text TEXT,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  read_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT notifications_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT notifications_message_not_empty CHECK (length(trim(message)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_status_idx ON notifications(status);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON notifications(type);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON notifications(user_id, status) WHERE status = 'unread';

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_own"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE notifications IS 'Notification information for dashboard display';
COMMENT ON COLUMN notifications.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN notifications.user_id IS 'Owner of this notification (references auth.users)';
COMMENT ON COLUMN notifications.type IS 'Notification type for styling';
COMMENT ON COLUMN notifications.status IS 'Read status of notification';

-- =====================================================
-- TABLE: kpi_metrics
-- Purpose: Store KPI metrics for dashboard visualization
-- =====================================================
CREATE TABLE IF NOT EXISTS kpi_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  metric_unit TEXT,
  metric_category TEXT DEFAULT 'general' CHECK (metric_category IN ('revenue', 'projects', 'team', 'performance', 'general')),
  
  -- Metric details
  previous_value DECIMAL(15,4),
  change_percentage DECIMAL(5,2),
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable')),
  
  -- Time period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT kpi_metrics_name_not_empty CHECK (length(trim(metric_name)) > 0),
  CONSTRAINT kpi_metrics_periods_valid CHECK (period_end > period_start)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS kpi_metrics_user_id_idx ON kpi_metrics(user_id);
CREATE INDEX IF NOT EXISTS kpi_metrics_category_idx ON kpi_metrics(metric_category);
CREATE INDEX IF NOT EXISTS kpi_metrics_period_start_idx ON kpi_metrics(period_start);
CREATE INDEX IF NOT EXISTS kpi_metrics_created_at_idx ON kpi_metrics(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_kpi_metrics_updated_at ON kpi_metrics;
CREATE TRIGGER update_kpi_metrics_updated_at
  BEFORE UPDATE ON kpi_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "kpi_metrics_select_own"
  ON kpi_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "kpi_metrics_insert_own"
  ON kpi_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kpi_metrics_update_own"
  ON kpi_metrics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kpi_metrics_delete_own"
  ON kpi_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE kpi_metrics IS 'KPI metrics for dashboard visualization';
COMMENT ON COLUMN kpi_metrics.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN kpi_metrics.user_id IS 'Owner of this metric (references auth.users)';
COMMENT ON COLUMN kpi_metrics.metric_category IS 'Category for grouping metrics';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS kpi_metrics CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS meetings CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
