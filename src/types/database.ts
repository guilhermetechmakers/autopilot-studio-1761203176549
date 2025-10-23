/**
 * Main database types file
 * Exports all database table types for Supabase integration
 */

// Re-export all table types
export * from './database/user_profiles';
export * from './database/user_billing_contacts';
export * from './database/user_api_keys';
export * from './database/user_security_settings';
export * from './database/user_connected_apps';
export * from './database/user_sessions';

// Main Database interface for Supabase
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: import('./database/user_profiles').UserProfileRow;
        Insert: import('./database/user_profiles').UserProfileInsert;
        Update: import('./database/user_profiles').UserProfileUpdate;
      };
      user_billing_contacts: {
        Row: import('./database/user_billing_contacts').UserBillingContactRow;
        Insert: import('./database/user_billing_contacts').UserBillingContactInsert;
        Update: import('./database/user_billing_contacts').UserBillingContactUpdate;
      };
      user_api_keys: {
        Row: import('./database/user_api_keys').UserApiKeyRow;
        Insert: import('./database/user_api_keys').UserApiKeyInsert;
        Update: import('./database/user_api_keys').UserApiKeyUpdate;
      };
      user_security_settings: {
        Row: import('./database/user_security_settings').UserSecuritySettingsRow;
        Insert: import('./database/user_security_settings').UserSecuritySettingsInsert;
        Update: import('./database/user_security_settings').UserSecuritySettingsUpdate;
      };
      user_connected_apps: {
        Row: import('./database/user_connected_apps').UserConnectedAppRow;
        Insert: import('./database/user_connected_apps').UserConnectedAppInsert;
        Update: import('./database/user_connected_apps').UserConnectedAppUpdate;
      };
      user_sessions: {
        Row: import('./database/user_sessions').UserSessionRow;
        Insert: import('./database/user_sessions').UserSessionInsert;
        Update: import('./database/user_sessions').UserSessionUpdate;
      };
    };
  };
}
