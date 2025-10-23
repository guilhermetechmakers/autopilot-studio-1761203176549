/**
 * Database Types
 * Generated from Supabase schema
 */

export interface Database {
  public: {
    Tables: {
      metrics: {
        Row: {
          id: string;
          tenant_id: string;
          metric_name: string;
          metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
          metric_value: number;
          labels: Record<string, any>;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          metric_name: string;
          metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
          metric_value: number;
          labels?: Record<string, any>;
          timestamp?: string;
        };
        Update: {
          metric_value?: number;
          labels?: Record<string, any>;
        };
      };
      alert_rules: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          metric_name: string;
          condition: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
          threshold_value: number;
          severity: 'low' | 'medium' | 'high' | 'critical';
          enabled: boolean;
          notification_channels: string[];
          cooldown_minutes: number;
          label_filters: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          metric_name: string;
          condition: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
          threshold_value: number;
          severity: 'low' | 'medium' | 'high' | 'critical';
          enabled?: boolean;
          notification_channels?: string[];
          cooldown_minutes?: number;
          label_filters?: Record<string, any>;
        };
        Update: {
          name?: string;
          description?: string | null;
          metric_name?: string;
          condition?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
          threshold_value?: number;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          enabled?: boolean;
          notification_channels?: string[];
          cooldown_minutes?: number;
          label_filters?: Record<string, any>;
        };
      };
      alerts: {
        Row: {
          id: string;
          tenant_id: string;
          rule_id: string;
          title: string;
          description: string | null;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status: 'firing' | 'resolved' | 'acknowledged' | 'silenced';
          metric_value: number;
          threshold_value: number;
          labels: Record<string, any>;
          resolved_at: string | null;
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          resolution_notes: string | null;
          fired_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          rule_id: string;
          title: string;
          description?: string | null;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status?: 'firing' | 'resolved' | 'acknowledged' | 'silenced';
          metric_value: number;
          threshold_value: number;
          labels?: Record<string, any>;
          resolved_at?: string | null;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          resolution_notes?: string | null;
          fired_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          status?: 'firing' | 'resolved' | 'acknowledged' | 'silenced';
          resolved_at?: string | null;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          resolution_notes?: string | null;
        };
      };
      health_checks: {
        Row: {
          id: string;
          tenant_id: string;
          service_name: string;
          check_type: 'http' | 'database' | 'redis' | 'external_api' | 'custom';
          endpoint_url: string | null;
          status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
          response_time_ms: number | null;
          status_code: number | null;
          error_message: string | null;
          metadata: Record<string, any>;
          checked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          service_name: string;
          check_type: 'http' | 'database' | 'redis' | 'external_api' | 'custom';
          endpoint_url?: string | null;
          status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
          response_time_ms?: number | null;
          status_code?: number | null;
          error_message?: string | null;
          metadata?: Record<string, any>;
          checked_at?: string;
        };
        Update: {
          service_name?: string;
          check_type?: 'http' | 'database' | 'redis' | 'external_api' | 'custom';
          endpoint_url?: string | null;
          status?: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
          response_time_ms?: number | null;
          status_code?: number | null;
          error_message?: string | null;
          metadata?: Record<string, any>;
        };
      };
      notification_channels: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          type: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
          enabled: boolean;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          type: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
          enabled?: boolean;
          settings?: Record<string, any>;
        };
        Update: {
          name?: string;
          type?: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
          enabled?: boolean;
          settings?: Record<string, any>;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          company: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
          preferences: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          company?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
          preferences?: Record<string, any>;
        };
        Update: {
          name?: string | null;
          company?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
          preferences?: Record<string, any>;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}