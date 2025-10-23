/**
 * Database types for user_api_keys table
 * Generated: 2024-10-13T12:00:00Z
 */

export interface UserApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_prefix: string;
  permissions: string[];
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserApiKeyInsert {
  id?: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_prefix: string;
  permissions?: string[];
  is_active?: boolean;
  last_used_at?: string | null;
  expires_at?: string | null;
}

export interface UserApiKeyUpdate {
  name?: string;
  permissions?: string[];
  is_active?: boolean;
  last_used_at?: string | null;
  expires_at?: string | null;
}

// Supabase query result type
export type UserApiKeyRow = UserApiKey;
