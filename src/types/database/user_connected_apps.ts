/**
 * Database types for user_connected_apps table
 * Generated: 2024-10-13T12:00:00Z
 */

export interface UserConnectedApp {
  id: string;
  user_id: string;
  app_name: string;
  app_type: 'oauth' | 'api_key' | 'webhook';
  provider: string;
  connection_id: string;
  access_token_encrypted: string | null;
  refresh_token_encrypted: string | null;
  token_expires_at: string | null;
  scopes: string[];
  permissions: string[];
  is_active: boolean;
  last_sync_at: string | null;
  sync_status: 'pending' | 'success' | 'error';
  sync_error: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserConnectedAppInsert {
  id?: string;
  user_id: string;
  app_name: string;
  app_type: 'oauth' | 'api_key' | 'webhook';
  provider: string;
  connection_id: string;
  access_token_encrypted?: string | null;
  refresh_token_encrypted?: string | null;
  token_expires_at?: string | null;
  scopes?: string[];
  permissions?: string[];
  is_active?: boolean;
  last_sync_at?: string | null;
  sync_status?: 'pending' | 'success' | 'error';
  sync_error?: string | null;
  metadata?: Record<string, any>;
}

export interface UserConnectedAppUpdate {
  app_name?: string;
  app_type?: 'oauth' | 'api_key' | 'webhook';
  provider?: string;
  connection_id?: string;
  access_token_encrypted?: string | null;
  refresh_token_encrypted?: string | null;
  token_expires_at?: string | null;
  scopes?: string[];
  permissions?: string[];
  is_active?: boolean;
  last_sync_at?: string | null;
  sync_status?: 'pending' | 'success' | 'error';
  sync_error?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type UserConnectedAppRow = UserConnectedApp;
