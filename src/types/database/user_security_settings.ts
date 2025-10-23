/**
 * Database types for user_security_settings table
 * Generated: 2024-10-13T12:00:00Z
 */

export interface UserSecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  backup_codes: string[];
  require_2fa_for_api: boolean;
  session_timeout_minutes: number;
  max_concurrent_sessions: number;
  last_password_change: string | null;
  failed_login_attempts: number;
  locked_until: string | null;
  data_retention_days: number;
  allow_analytics: boolean;
  allow_marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSecuritySettingsInsert {
  id?: string;
  user_id: string;
  two_factor_enabled?: boolean;
  two_factor_secret?: string | null;
  backup_codes?: string[];
  require_2fa_for_api?: boolean;
  session_timeout_minutes?: number;
  max_concurrent_sessions?: number;
  last_password_change?: string | null;
  failed_login_attempts?: number;
  locked_until?: string | null;
  data_retention_days?: number;
  allow_analytics?: boolean;
  allow_marketing_emails?: boolean;
}

export interface UserSecuritySettingsUpdate {
  two_factor_enabled?: boolean;
  two_factor_secret?: string | null;
  backup_codes?: string[];
  require_2fa_for_api?: boolean;
  session_timeout_minutes?: number;
  max_concurrent_sessions?: number;
  last_password_change?: string | null;
  failed_login_attempts?: number;
  locked_until?: string | null;
  data_retention_days?: number;
  allow_analytics?: boolean;
  allow_marketing_emails?: boolean;
}

// Supabase query result type
export type UserSecuritySettingsRow = UserSecuritySettings;
