/**
 * Database types for user_sessions table
 * Generated: 2024-10-13T12:00:00Z
 */

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  device_info: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  last_activity: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserSessionInsert {
  id?: string;
  user_id: string;
  session_token: string;
  device_info?: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
  is_active?: boolean;
  last_activity?: string;
  expires_at: string;
}

export interface UserSessionUpdate {
  device_info?: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
  is_active?: boolean;
  last_activity?: string;
  expires_at?: string;
}

// Supabase query result type
export type UserSessionRow = UserSession;
