-- =====================================================
-- Migration: Create proposal templates table
-- Created: 2024-12-13T12:00:02Z
-- Tables: proposal_templates
-- Purpose: Store reusable proposal and SoW templates
-- =====================================================

-- =====================================================
-- TABLE: proposal_templates
-- Purpose: Store reusable proposal and SoW templates
-- =====================================================
CREATE TABLE IF NOT EXISTS proposal_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'proposal' CHECK (type IN ('proposal', 'sow', 'contract')),
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'web_development', 'mobile_app', 'ai_ml', 'consulting', 'maintenance')),
  
  -- Template content
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Rich text content with variables
  variables JSONB DEFAULT '[]'::jsonb, -- Available template variables
  pricing_structure JSONB DEFAULT '{}'::jsonb, -- Milestone pricing configuration
  
  -- Metadata
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  is_public BOOLEAN DEFAULT false, -- Whether template can be used by others
  version INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT proposal_templates_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT proposal_templates_content_not_empty CHECK (jsonb_typeof(content) = 'object')
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS proposal_templates_user_id_idx ON proposal_templates(user_id);
CREATE INDEX IF NOT EXISTS proposal_templates_type_idx ON proposal_templates(type);
CREATE INDEX IF NOT EXISTS proposal_templates_category_idx ON proposal_templates(category);
CREATE INDEX IF NOT EXISTS proposal_templates_status_idx ON proposal_templates(status) WHERE status != 'archived';
CREATE INDEX IF NOT EXISTS proposal_templates_created_at_idx ON proposal_templates(created_at DESC);
CREATE INDEX IF NOT EXISTS proposal_templates_is_public_idx ON proposal_templates(is_public) WHERE is_public = true;

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_proposal_templates_updated_at ON proposal_templates;
CREATE TRIGGER update_proposal_templates_updated_at
  BEFORE UPDATE ON proposal_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own templates or public ones
CREATE POLICY "proposal_templates_select_own_and_public"
  ON proposal_templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "proposal_templates_insert_own"
  ON proposal_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposal_templates_update_own"
  ON proposal_templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposal_templates_delete_own"
  ON proposal_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE proposal_templates IS 'Reusable proposal and SoW templates with variable substitution';
COMMENT ON COLUMN proposal_templates.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN proposal_templates.user_id IS 'Owner of this template (references auth.users)';
COMMENT ON COLUMN proposal_templates.content IS 'Rich text content with variable placeholders';
COMMENT ON COLUMN proposal_templates.variables IS 'Array of available template variables';
COMMENT ON COLUMN proposal_templates.pricing_structure IS 'Milestone pricing configuration';
