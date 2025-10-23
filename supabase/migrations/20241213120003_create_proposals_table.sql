-- =====================================================
-- Migration: Create proposals table
-- Created: 2024-12-13T12:00:03Z
-- Tables: proposals
-- Purpose: Store generated proposals and SoWs
-- =====================================================

-- =====================================================
-- TABLE: proposals
-- Purpose: Store generated proposals and SoWs
-- =====================================================
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES proposal_templates(id) ON DELETE SET NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'proposal' CHECK (type IN ('proposal', 'sow', 'contract')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'under_review', 'negotiating', 'approved', 'rejected', 'signed')),
  
  -- Client information
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  
  -- Proposal content
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Generated content with variables filled
  variables JSONB DEFAULT '{}'::jsonb, -- Variable values used in generation
  pricing JSONB DEFAULT '{}'::jsonb, -- Milestone pricing details
  
  -- Negotiation and redlines
  redlines JSONB DEFAULT '[]'::jsonb, -- Array of redline changes
  comments JSONB DEFAULT '[]'::jsonb, -- Array of comments and discussions
  version INTEGER DEFAULT 1,
  
  -- E-signature
  signature_status TEXT DEFAULT 'pending' CHECK (signature_status IN ('pending', 'sent', 'signed', 'declined')),
  signature_data JSONB DEFAULT '{}'::jsonb, -- E-signature provider data
  signed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  sent_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT proposals_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT proposals_client_name_not_empty CHECK (length(trim(client_name)) > 0),
  CONSTRAINT proposals_content_not_empty CHECK (jsonb_typeof(content) = 'object')
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS proposals_user_id_idx ON proposals(user_id);
CREATE INDEX IF NOT EXISTS proposals_template_id_idx ON proposals(template_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON proposals(status);
CREATE INDEX IF NOT EXISTS proposals_type_idx ON proposals(type);
CREATE INDEX IF NOT EXISTS proposals_client_email_idx ON proposals(client_email);
CREATE INDEX IF NOT EXISTS proposals_created_at_idx ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS proposals_signature_status_idx ON proposals(signature_status);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own proposals
CREATE POLICY "proposals_select_own"
  ON proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "proposals_insert_own"
  ON proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposals_update_own"
  ON proposals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposals_delete_own"
  ON proposals FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE proposals IS 'Generated proposals and SoWs with negotiation tracking';
COMMENT ON COLUMN proposals.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN proposals.user_id IS 'Owner of this proposal (references auth.users)';
COMMENT ON COLUMN proposals.template_id IS 'Template used to generate this proposal (references proposal_templates)';
COMMENT ON COLUMN proposals.content IS 'Generated content with variables filled';
COMMENT ON COLUMN proposals.redlines IS 'Array of redline changes during negotiation';
COMMENT ON COLUMN proposals.comments IS 'Array of comments and discussions';
COMMENT ON COLUMN proposals.signature_data IS 'E-signature provider data and metadata';
