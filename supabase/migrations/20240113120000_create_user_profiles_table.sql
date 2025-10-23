-- =====================================================
-- Migration: Create User Profiles Table
-- Created: 2024-01-13T12:00:00Z
-- Tables: user_profiles
-- Purpose: Store additional user profile information
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
-- TABLE: user_profiles
-- Purpose: Store additional user profile information
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Profile information
  name TEXT,
  company TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'dev' CHECK (role IN ('admin', 'owner', 'pm', 'dev', 'client', 'billing')),
  
  -- Preferences
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT user_profiles_name_not_empty CHECK (name IS NULL OR length(trim(name)) > 0),
  CONSTRAINT user_profiles_company_not_empty CHECK (company IS NULL OR length(trim(company)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_created_at_idx ON user_profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own profile
CREATE POLICY "user_profiles_select_own"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_profiles_insert_own"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_profiles_update_own"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_profiles_delete_own"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE user_profiles IS 'Additional user profile information beyond auth.users';
COMMENT ON COLUMN user_profiles.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN user_profiles.user_id IS 'Reference to auth.users (one-to-one)';
COMMENT ON COLUMN user_profiles.name IS 'User display name';
COMMENT ON COLUMN user_profiles.company IS 'User company name';
COMMENT ON COLUMN user_profiles.role IS 'User role in the system';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS user_profiles CASCADE;