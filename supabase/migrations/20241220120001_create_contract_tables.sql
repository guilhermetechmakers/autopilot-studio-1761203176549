-- =====================================================
-- Migration: Create Contract and Template Tables
-- Created: 2024-12-20T12:00:01Z
-- Tables: contract_templates, contracts, contract_versions, contract_signatures
-- Purpose: Enable E-Contract execution with digital signatures and version control
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
-- TABLE: contract_templates
-- Purpose: Store reusable contract templates
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'nda', 'sow', 'msa', 'custom')),
  
  -- Template content
  template_content TEXT NOT NULL,
  variables JSONB DEFAULT '{}'::jsonb,
  
  -- Status and visibility
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  is_public BOOLEAN DEFAULT false,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT contract_templates_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT contract_templates_content_not_empty CHECK (length(trim(template_content)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS contract_templates_user_id_idx ON contract_templates(user_id);
CREATE INDEX IF NOT EXISTS contract_templates_category_idx ON contract_templates(category);
CREATE INDEX IF NOT EXISTS contract_templates_status_idx ON contract_templates(status) WHERE status != 'deleted';
CREATE INDEX IF NOT EXISTS contract_templates_public_idx ON contract_templates(is_public) WHERE is_public = true;

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_contract_templates_updated_at ON contract_templates;
CREATE TRIGGER update_contract_templates_updated_at
  BEFORE UPDATE ON contract_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can access their own templates and public templates
CREATE POLICY "contract_templates_select_own_and_public"
  ON contract_templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "contract_templates_insert_own"
  ON contract_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contract_templates_update_own"
  ON contract_templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contract_templates_delete_own"
  ON contract_templates FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: contracts
-- Purpose: Store individual contract instances
-- =====================================================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES contract_templates(id) ON DELETE SET NULL,
  
  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  
  -- Contract content and status
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'pending_signature', 'signed', 'executed', 'cancelled', 'expired')),
  
  -- Parties involved
  client_email TEXT,
  client_name TEXT,
  client_company TEXT,
  
  -- Contract details
  contract_type TEXT DEFAULT 'general' CHECK (contract_type IN ('general', 'nda', 'sow', 'msa', 'custom')),
  effective_date DATE,
  expiration_date DATE,
  
  -- Negotiation and versioning
  current_version INTEGER DEFAULT 1,
  is_negotiable BOOLEAN DEFAULT true,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT contracts_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT contracts_content_not_empty CHECK (length(trim(content)) > 0),
  CONSTRAINT contracts_effective_before_expiration CHECK (effective_date IS NULL OR expiration_date IS NULL OR effective_date <= expiration_date)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS contracts_user_id_idx ON contracts(user_id);
CREATE INDEX IF NOT EXISTS contracts_template_id_idx ON contracts(template_id);
CREATE INDEX IF NOT EXISTS contracts_status_idx ON contracts(status);
CREATE INDEX IF NOT EXISTS contracts_client_email_idx ON contracts(client_email);
CREATE INDEX IF NOT EXISTS contracts_created_at_idx ON contracts(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own contracts
CREATE POLICY "contracts_select_own"
  ON contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "contracts_insert_own"
  ON contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contracts_update_own"
  ON contracts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contracts_delete_own"
  ON contracts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: contract_versions
-- Purpose: Track contract version history for negotiations
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Version details
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT,
  
  -- Version metadata
  is_current BOOLEAN DEFAULT false,
  created_by_name TEXT,
  created_by_email TEXT,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT contract_versions_version_positive CHECK (version_number > 0),
  CONSTRAINT contract_versions_content_not_empty CHECK (length(trim(content)) > 0),
  UNIQUE(contract_id, version_number)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS contract_versions_contract_id_idx ON contract_versions(contract_id);
CREATE INDEX IF NOT EXISTS contract_versions_user_id_idx ON contract_versions(user_id);
CREATE INDEX IF NOT EXISTS contract_versions_version_idx ON contract_versions(contract_id, version_number);
CREATE INDEX IF NOT EXISTS contract_versions_current_idx ON contract_versions(contract_id, is_current) WHERE is_current = true;

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_contract_versions_updated_at ON contract_versions;
CREATE TRIGGER update_contract_versions_updated_at
  BEFORE UPDATE ON contract_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contract_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can access versions of their own contracts
CREATE POLICY "contract_versions_select_own"
  ON contract_versions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "contract_versions_insert_own"
  ON contract_versions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contract_versions_update_own"
  ON contract_versions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contract_versions_delete_own"
  ON contract_versions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: contract_signatures
-- Purpose: Store digital signatures and audit trail
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_signatures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Signature details
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signer_role TEXT DEFAULT 'client' CHECK (signer_role IN ('client', 'provider', 'witness', 'notary')),
  
  -- Digital signature data
  signature_data TEXT, -- Base64 encoded signature image or data
  signature_method TEXT DEFAULT 'digital' CHECK (signature_method IN ('digital', 'electronic', 'wet_signature')),
  
  -- Audit trail
  ip_address INET,
  user_agent TEXT,
  signed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Legal compliance
  is_legally_binding BOOLEAN DEFAULT true,
  compliance_metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Flexible metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT contract_signatures_signer_name_not_empty CHECK (length(trim(signer_name)) > 0),
  CONSTRAINT contract_signatures_signer_email_not_empty CHECK (length(trim(signer_email)) > 0),
  UNIQUE(contract_id, signer_email)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS contract_signatures_contract_id_idx ON contract_signatures(contract_id);
CREATE INDEX IF NOT EXISTS contract_signatures_user_id_idx ON contract_signatures(user_id);
CREATE INDEX IF NOT EXISTS contract_signatures_signer_email_idx ON contract_signatures(signer_email);
CREATE INDEX IF NOT EXISTS contract_signatures_signed_at_idx ON contract_signatures(signed_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_contract_signatures_updated_at ON contract_signatures;
CREATE TRIGGER update_contract_signatures_updated_at
  BEFORE UPDATE ON contract_signatures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contract_signatures ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can access signatures of their own contracts
CREATE POLICY "contract_signatures_select_own"
  ON contract_signatures FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "contract_signatures_insert_own"
  ON contract_signatures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contract_signatures_update_own"
  ON contract_signatures FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contract_signatures_delete_own"
  ON contract_signatures FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update contract current version when new version is created
CREATE OR REPLACE FUNCTION update_contract_current_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the contract's current_version and content
  UPDATE contracts 
  SET 
    current_version = NEW.version_number,
    content = NEW.content,
    updated_at = NOW()
  WHERE id = NEW.contract_id;
  
  -- Mark all other versions as not current
  UPDATE contract_versions 
  SET is_current = false 
  WHERE contract_id = NEW.contract_id AND id != NEW.id;
  
  -- Mark this version as current
  NEW.is_current = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update current version
DROP TRIGGER IF EXISTS update_contract_current_version_trigger ON contract_versions;
CREATE TRIGGER update_contract_current_version_trigger
  AFTER INSERT ON contract_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_contract_current_version();

-- Function to update contract status when all required signatures are collected
CREATE OR REPLACE FUNCTION update_contract_status_on_signature()
RETURNS TRIGGER AS $$
DECLARE
  required_signatures INTEGER;
  current_signatures INTEGER;
BEGIN
  -- Get required signatures count from contract metadata
  SELECT COALESCE((metadata->>'required_signatures')::INTEGER, 1) INTO required_signatures
  FROM contracts WHERE id = NEW.contract_id;
  
  -- Count current signatures
  SELECT COUNT(*) INTO current_signatures
  FROM contract_signatures 
  WHERE contract_id = NEW.contract_id;
  
  -- Update contract status if all signatures collected
  IF current_signatures >= required_signatures THEN
    UPDATE contracts 
    SET 
      status = 'signed',
      updated_at = NOW()
    WHERE id = NEW.contract_id AND status = 'pending_signature';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update contract status on signature
DROP TRIGGER IF EXISTS update_contract_status_on_signature_trigger ON contract_signatures;
CREATE TRIGGER update_contract_status_on_signature_trigger
  AFTER INSERT ON contract_signatures
  FOR EACH ROW
  EXECUTE FUNCTION update_contract_status_on_signature();

-- =====================================================
-- DOCUMENTATION
-- =====================================================
COMMENT ON TABLE contract_templates IS 'Reusable contract templates for creating new contracts';
COMMENT ON TABLE contracts IS 'Individual contract instances with negotiation and signature capabilities';
COMMENT ON TABLE contract_versions IS 'Version history for contract negotiations and changes';
COMMENT ON TABLE contract_signatures IS 'Digital signatures and audit trail for contract execution';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS contract_signatures CASCADE;
-- DROP TABLE IF EXISTS contract_versions CASCADE;
-- DROP TABLE IF EXISTS contracts CASCADE;
-- DROP TABLE IF EXISTS contract_templates CASCADE;
