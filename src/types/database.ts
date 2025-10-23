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

// Dashboard table types
export * from './database/projects';
export * from './database/meetings';
export * from './database/notifications';
export * from './database/kpi_metrics';

// Proposal system table types
export * from './database/proposal_templates';
export * from './database/proposals';

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
      // Dashboard tables
      projects: {
        Row: import('./database/projects').ProjectRow;
        Insert: import('./database/projects').ProjectInsert;
        Update: import('./database/projects').ProjectUpdate;
      };
      meetings: {
        Row: import('./database/meetings').MeetingRow;
        Insert: import('./database/meetings').MeetingInsert;
        Update: import('./database/meetings').MeetingUpdate;
      };
      notifications: {
        Row: import('./database/notifications').NotificationRow;
        Insert: import('./database/notifications').NotificationInsert;
        Update: import('./database/notifications').NotificationUpdate;
      };
      kpi_metrics: {
        Row: import('./database/kpi_metrics').KpiMetricRow;
        Insert: import('./database/kpi_metrics').KpiMetricInsert;
        Update: import('./database/kpi_metrics').KpiMetricUpdate;
      };
      // Proposal system tables
      proposal_templates: {
        Row: import('./database/proposal_templates').ProposalTemplateRow;
        Insert: import('./database/proposal_templates').ProposalTemplateInsert;
        Update: import('./database/proposal_templates').ProposalTemplateUpdate;
      };
      proposals: {
        Row: import('./database/proposals').ProposalRow;
        Insert: import('./database/proposals').ProposalInsert;
        Update: import('./database/proposals').ProposalUpdate;
      };
    };
  };
}
