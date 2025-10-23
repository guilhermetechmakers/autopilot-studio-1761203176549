-- =====================================================
-- Migration: Create Intake Forms Table
-- Created: 2024-12-13T12:00:01Z
-- Tables: intake_forms, intake_scores, intake_attachments
-- Purpose: Store AI-assisted intake form data and lead scoring
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
-- TABLE: intake_forms
-- Purpose: Store intake form submissions with AI processing
-- =====================================================
CREATE TABLE IF NOT EXISTS intake_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Contact Information
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  company_name TEXT,
  
  -- Project Details
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN (
    'web-app', 'mobile-app', 'e-commerce', 'ai-integration', 
    'data-analytics', 'api-development', 'custom-software', 'other'
  )),
  project_description TEXT NOT NULL,
  
  -- Requirements & Goals
  key_requirements TEXT NOT NULL,
  business_goals TEXT,
  success_metrics TEXT,
  
  -- Timeline & Budget
  timeline TEXT NOT NULL CHECK (timeline IN (
    '1-2-weeks', '1-month', '2-3-months', '3-6-months', '6+months'
  )),
  budget_range TEXT NOT NULL CHECK (budget_range IN (
    'under-10k', '10k-25k', '25k-50k', '50k-100k', '100k+'
  )),
  budget_flexibility TEXT CHECK (budget_flexibility IN (
    'fixed', 'somewhat-flexible', 'very-flexible'
  )),
  
  -- Technical Stack
  preferred_tech_stack JSONB DEFAULT '[]'::jsonb,
  existing_systems TEXT,
  integration_requirements TEXT,
  
  -- AI Processing
  ai_qualification_score INTEGER DEFAULT 0 CHECK (ai_qualification_score >= 0 AND ai_qualification_score <= 100),
  ai_confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (ai_confidence_score >= 0.0 AND ai_confidence_score <= 1.0),
  ai_insights JSONB DEFAULT '{}'::jsonb,
  ai_recommendations TEXT,
  
  -- Status & Workflow
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'under-review', 'qualified', 'disqualified', 
    'scheduled', 'completed', 'archived'
  )),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Calendar Integration
  preferred_meeting_times JSONB DEFAULT '[]'::jsonb,
  timezone TEXT DEFAULT 'UTC',
  meeting_scheduled_at TIMESTAMPTZ,
  meeting_completed_at TIMESTAMPTZ,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT intake_forms_contact_email_valid CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT intake_forms_project_name_not_empty CHECK (length(trim(project_name)) > 0),
  CONSTRAINT intake_forms_description_min_length CHECK (length(trim(project_description)) >= 50)
);

-- =====================================================
-- TABLE: intake_scores
-- Purpose: Store detailed AI scoring breakdown
-- =====================================================
CREATE TABLE IF NOT EXISTS intake_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  intake_form_id UUID REFERENCES intake_forms(id) ON DELETE CASCADE NOT NULL,
  
  -- Scoring Categories
  budget_score INTEGER DEFAULT 0 CHECK (budget_score >= 0 AND budget_score <= 100),
  timeline_score INTEGER DEFAULT 0 CHECK (timeline_score >= 0 AND timeline_score <= 100),
  technical_complexity_score INTEGER DEFAULT 0 CHECK (technical_complexity_score >= 0 AND technical_complexity_score <= 100),
  business_impact_score INTEGER DEFAULT 0 CHECK (business_impact_score >= 0 AND business_impact_score <= 100),
  market_potential_score INTEGER DEFAULT 0 CHECK (market_potential_score >= 0 AND market_potential_score <= 100),
  
  -- Overall Scores
  overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  confidence_level DECIMAL(3,2) DEFAULT 0.0 CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0),
  
  -- AI Analysis
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  risk_factors JSONB DEFAULT '[]'::jsonb,
  opportunity_factors JSONB DEFAULT '[]'::jsonb,
  
  -- Recommendations
  recommended_approach TEXT,
  estimated_project_duration TEXT,
  suggested_team_size INTEGER,
  next_steps JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: intake_attachments
-- Purpose: Store file attachments for intake forms
-- =====================================================
CREATE TABLE IF NOT EXISTS intake_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  intake_form_id UUID REFERENCES intake_forms(id) ON DELETE CASCADE NOT NULL,
  
  -- File Information
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0),
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  
  -- AI Processing
  ai_processed BOOLEAN DEFAULT FALSE,
  ai_extracted_text TEXT,
  ai_insights JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- TABLE: intake_meetings
-- Purpose: Store scheduled intake meetings
-- =====================================================
CREATE TABLE IF NOT EXISTS intake_meetings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  intake_form_id UUID REFERENCES intake_forms(id) ON DELETE CASCADE NOT NULL,
  
  -- Meeting Details
  meeting_title TEXT NOT NULL,
  meeting_description TEXT,
  meeting_type TEXT DEFAULT 'intake' CHECK (meeting_type IN ('intake', 'follow-up', 'technical-review')),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60 CHECK (duration_minutes > 0),
  timezone TEXT DEFAULT 'UTC',
  
  -- Participants
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  attendee_email TEXT NOT NULL,
  attendee_name TEXT,
  
  -- Meeting Platform
  platform TEXT DEFAULT 'zoom' CHECK (platform IN ('zoom', 'teams', 'google-meet', 'calendly', 'other')),
  meeting_url TEXT,
  meeting_id TEXT,
  meeting_password TEXT,
  
  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'
  )),
  
  -- Notes & Outcomes
  meeting_notes TEXT,
  outcomes JSONB DEFAULT '{}'::jsonb,
  follow_up_required BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS intake_forms_user_id_idx ON intake_forms(user_id);
CREATE INDEX IF NOT EXISTS intake_forms_status_idx ON intake_forms(status);
CREATE INDEX IF NOT EXISTS intake_forms_created_at_idx ON intake_forms(created_at DESC);
CREATE INDEX IF NOT EXISTS intake_forms_ai_score_idx ON intake_forms(ai_qualification_score DESC);
CREATE INDEX IF NOT EXISTS intake_forms_priority_idx ON intake_forms(priority);

CREATE INDEX IF NOT EXISTS intake_scores_form_id_idx ON intake_scores(intake_form_id);
CREATE INDEX IF NOT EXISTS intake_scores_overall_score_idx ON intake_scores(overall_score DESC);

CREATE INDEX IF NOT EXISTS intake_attachments_form_id_idx ON intake_attachments(intake_form_id);
CREATE INDEX IF NOT EXISTS intake_attachments_processed_idx ON intake_attachments(ai_processed);

CREATE INDEX IF NOT EXISTS intake_meetings_form_id_idx ON intake_meetings(intake_form_id);
CREATE INDEX IF NOT EXISTS intake_meetings_scheduled_at_idx ON intake_meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS intake_meetings_status_idx ON intake_meetings(status);

-- Auto-update triggers
DROP TRIGGER IF EXISTS update_intake_forms_updated_at ON intake_forms;
CREATE TRIGGER update_intake_forms_updated_at
  BEFORE UPDATE ON intake_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_intake_scores_updated_at ON intake_scores;
CREATE TRIGGER update_intake_scores_updated_at
  BEFORE UPDATE ON intake_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_intake_attachments_updated_at ON intake_attachments;
CREATE TRIGGER update_intake_attachments_updated_at
  BEFORE UPDATE ON intake_attachments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_intake_meetings_updated_at ON intake_meetings;
CREATE TRIGGER update_intake_meetings_updated_at
  BEFORE UPDATE ON intake_meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "intake_forms_select_own"
  ON intake_forms FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "intake_forms_insert_own"
  ON intake_forms FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "intake_forms_update_own"
  ON intake_forms FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "intake_forms_delete_own"
  ON intake_forms FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Intake scores policies (linked to intake forms)
CREATE POLICY "intake_scores_select_own"
  ON intake_scores FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_scores.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ));

CREATE POLICY "intake_scores_insert_own"
  ON intake_scores FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_scores.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ));

CREATE POLICY "intake_scores_update_own"
  ON intake_scores FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_scores.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ));

-- Intake attachments policies
CREATE POLICY "intake_attachments_select_own"
  ON intake_attachments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_attachments.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ));

CREATE POLICY "intake_attachments_insert_own"
  ON intake_attachments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_attachments.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ));

-- Intake meetings policies
CREATE POLICY "intake_meetings_select_own"
  ON intake_meetings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_meetings.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ) OR auth.uid() = organizer_id);

CREATE POLICY "intake_meetings_insert_own"
  ON intake_meetings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_meetings.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ) OR auth.uid() = organizer_id);

CREATE POLICY "intake_meetings_update_own"
  ON intake_meetings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM intake_forms 
    WHERE intake_forms.id = intake_meetings.intake_form_id 
    AND (auth.uid() = intake_forms.user_id OR intake_forms.user_id IS NULL)
  ) OR auth.uid() = organizer_id);

-- Documentation
COMMENT ON TABLE intake_forms IS 'AI-assisted intake form submissions with lead qualification';
COMMENT ON TABLE intake_scores IS 'Detailed AI scoring breakdown for intake forms';
COMMENT ON TABLE intake_attachments IS 'File attachments for intake forms with AI processing';
COMMENT ON TABLE intake_meetings IS 'Scheduled intake meetings and follow-ups';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS intake_meetings CASCADE;
-- DROP TABLE IF EXISTS intake_attachments CASCADE;
-- DROP TABLE IF EXISTS intake_scores CASCADE;
-- DROP TABLE IF EXISTS intake_forms CASCADE;
