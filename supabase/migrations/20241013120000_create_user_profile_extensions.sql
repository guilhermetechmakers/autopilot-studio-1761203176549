-- =====================================================
-- Migration: User Profile Extensions
-- Created: 2024-10-13T12:00:00Z
-- Tables: user_billing_contacts, user_api_keys, user_security_settings, user_connected_apps
-- Purpose: Extend user profiles with billing, security, API keys, and connected apps
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
-- TABLE: user_billing_contacts
-- Purpose: Store user billing contact information
-- =====================================================
CREATE TABLE IF NOT EXISTS user_billing_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Contact details
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  
  -- Billing preferences
  is_primary BOOLEAN DEFAULT false,
  tax_id TEXT,
  payment_method_id TEXT, -- External payment system reference
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_billing_contacts_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT user_billing_contacts_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_billing_contacts_user_id_idx ON user_billing_contacts(user_id);
CREATE INDEX IF NOT EXISTS user_billing_contacts_primary_idx ON user_billing_contacts(user_id, is_primary) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS user_billing_contacts_created_at_idx ON user_billing_contacts(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_user_billing_contacts_updated_at ON user_billing_contacts;
CREATE TRIGGER update_user_billing_contacts_updated_at
  BEFORE UPDATE ON user_billing_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_billing_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own billing contacts
CREATE POLICY "user_billing_contacts_select_own"
  ON user_billing_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_billing_contacts_insert_own"
  ON user_billing_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_billing_contacts_update_own"
  ON user_billing_contacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_billing_contacts_delete_own"
  ON user_billing_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: user_api_keys
-- Purpose: Store user API keys for external integrations
-- =====================================================
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Key details
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL, -- Hashed version of the actual key
  key_prefix TEXT NOT NULL, -- First 8 characters for display
  permissions JSONB DEFAULT '[]'::jsonb, -- Array of permission strings
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_api_keys_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT user_api_keys_key_hash_not_empty CHECK (length(trim(key_hash)) > 0),
  CONSTRAINT user_api_keys_key_prefix_not_empty CHECK (length(trim(key_prefix)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_api_keys_user_id_idx ON user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS user_api_keys_active_idx ON user_api_keys(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS user_api_keys_key_hash_idx ON user_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS user_api_keys_created_at_idx ON user_api_keys(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_user_api_keys_updated_at ON user_api_keys;
CREATE TRIGGER update_user_api_keys_updated_at
  BEFORE UPDATE ON user_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own API keys
CREATE POLICY "user_api_keys_select_own"
  ON user_api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_api_keys_insert_own"
  ON user_api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_api_keys_update_own"
  ON user_api_keys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_api_keys_delete_own"
  ON user_api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: user_security_settings
-- Purpose: Store user security preferences and 2FA settings
-- =====================================================
CREATE TABLE IF NOT EXISTS user_security_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- 2FA settings
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT, -- Encrypted TOTP secret
  backup_codes JSONB DEFAULT '[]'::jsonb, -- Array of backup codes
  
  -- Security preferences
  require_2fa_for_api BOOLEAN DEFAULT true,
  session_timeout_minutes INTEGER DEFAULT 480, -- 8 hours
  max_concurrent_sessions INTEGER DEFAULT 5,
  
  -- Login security
  last_password_change TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  
  -- Privacy settings
  data_retention_days INTEGER DEFAULT 2555, -- 7 years
  allow_analytics BOOLEAN DEFAULT true,
  allow_marketing_emails BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_security_settings_session_timeout_positive CHECK (session_timeout_minutes > 0),
  CONSTRAINT user_security_settings_max_sessions_positive CHECK (max_concurrent_sessions > 0),
  CONSTRAINT user_security_settings_retention_positive CHECK (data_retention_days > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_security_settings_user_id_idx ON user_security_settings(user_id);
CREATE INDEX IF NOT EXISTS user_security_settings_2fa_idx ON user_security_settings(two_factor_enabled) WHERE two_factor_enabled = true;

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_user_security_settings_updated_at ON user_security_settings;
CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_security_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own security settings
CREATE POLICY "user_security_settings_select_own"
  ON user_security_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_security_settings_insert_own"
  ON user_security_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_security_settings_update_own"
  ON user_security_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_security_settings_delete_own"
  ON user_security_settings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: user_connected_apps
-- Purpose: Store user's connected third-party applications
-- =====================================================
CREATE TABLE IF NOT EXISTS user_connected_apps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- App details
  app_name TEXT NOT NULL,
  app_type TEXT NOT NULL, -- 'oauth', 'api_key', 'webhook'
  provider TEXT NOT NULL, -- 'github', 'slack', 'jira', etc.
  
  -- Connection details
  connection_id TEXT NOT NULL, -- External system connection ID
  access_token_encrypted TEXT, -- Encrypted access token
  refresh_token_encrypted TEXT, -- Encrypted refresh token
  token_expires_at TIMESTAMPTZ,
  
  -- Permissions and scope
  scopes JSONB DEFAULT '[]'::jsonb, -- Array of granted scopes
  permissions JSONB DEFAULT '[]'::jsonb, -- Array of granted permissions
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'success', 'error'
  sync_error TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_connected_apps_name_not_empty CHECK (length(trim(app_name)) > 0),
  CONSTRAINT user_connected_apps_type_valid CHECK (app_type IN ('oauth', 'api_key', 'webhook')),
  CONSTRAINT user_connected_apps_provider_not_empty CHECK (length(trim(provider)) > 0),
  CONSTRAINT user_connected_apps_connection_id_not_empty CHECK (length(trim(connection_id)) > 0),
  CONSTRAINT user_connected_apps_sync_status_valid CHECK (sync_status IN ('pending', 'success', 'error'))
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_connected_apps_user_id_idx ON user_connected_apps(user_id);
CREATE INDEX IF NOT EXISTS user_connected_apps_provider_idx ON user_connected_apps(provider);
CREATE INDEX IF NOT EXISTS user_connected_apps_active_idx ON user_connected_apps(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS user_connected_apps_created_at_idx ON user_connected_apps(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_user_connected_apps_updated_at ON user_connected_apps;
CREATE TRIGGER update_user_connected_apps_updated_at
  BEFORE UPDATE ON user_connected_apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_connected_apps ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own connected apps
CREATE POLICY "user_connected_apps_select_own"
  ON user_connected_apps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_connected_apps_insert_own"
  ON user_connected_apps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_connected_apps_update_own"
  ON user_connected_apps FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_connected_apps_delete_own"
  ON user_connected_apps FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: user_sessions
-- Purpose: Track active user sessions for security management
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Session details
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_sessions_token_not_empty CHECK (length(trim(session_token)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_token_idx ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS user_sessions_active_idx ON user_sessions(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS user_sessions_expires_idx ON user_sessions(expires_at);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own sessions
CREATE POLICY "user_sessions_select_own"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_sessions_insert_own"
  ON user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_sessions_update_own"
  ON user_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_sessions_delete_own"
  ON user_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Documentation
-- =====================================================
COMMENT ON TABLE user_billing_contacts IS 'User billing contact information for invoicing and payments';
COMMENT ON TABLE user_api_keys IS 'User API keys for external integrations and automation';
COMMENT ON TABLE user_security_settings IS 'User security preferences including 2FA and session management';
COMMENT ON TABLE user_connected_apps IS 'Third-party applications connected to user accounts';
COMMENT ON TABLE user_sessions IS 'Active user sessions for security monitoring and management';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS user_sessions CASCADE;
-- DROP TABLE IF EXISTS user_connected_apps CASCADE;
-- DROP TABLE IF EXISTS user_security_settings CASCADE;
-- DROP TABLE IF EXISTS user_api_keys CASCADE;
-- DROP TABLE IF EXISTS user_billing_contacts CASCADE;
