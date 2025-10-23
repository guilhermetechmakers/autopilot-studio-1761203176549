/**
 * Monitoring System Types
 * Generated: 2024-12-20T12:00:00Z
 */

// =====================================================
// METRICS TYPES
// =====================================================

export interface Metric {
  id: string;
  tenant_id: string;
  metric_name: string;
  metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
  metric_value: number;
  labels: Record<string, any>;
  timestamp: string;
  created_at: string;
}

export interface MetricInsert {
  id?: string;
  tenant_id: string;
  metric_name: string;
  metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
  metric_value: number;
  labels?: Record<string, any>;
  timestamp?: string;
}

export interface MetricUpdate {
  metric_value?: number;
  labels?: Record<string, any>;
}

export type MetricRow = Metric;

// =====================================================
// ALERT RULES TYPES
// =====================================================

export interface AlertRule {
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
}

export interface AlertRuleInsert {
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
}

export interface AlertRuleUpdate {
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
}

export type AlertRuleRow = AlertRule;

// =====================================================
// ALERTS TYPES
// =====================================================

export interface Alert {
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
}

export interface AlertInsert {
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
}

export interface AlertUpdate {
  title?: string;
  description?: string | null;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'firing' | 'resolved' | 'acknowledged' | 'silenced';
  resolved_at?: string | null;
  acknowledged_at?: string | null;
  acknowledged_by?: string | null;
  resolution_notes?: string | null;
}

export type AlertRow = Alert;

// =====================================================
// HEALTH CHECKS TYPES
// =====================================================

export interface HealthCheck {
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
}

export interface HealthCheckInsert {
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
}

export interface HealthCheckUpdate {
  service_name?: string;
  check_type?: 'http' | 'database' | 'redis' | 'external_api' | 'custom';
  endpoint_url?: string | null;
  status?: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  response_time_ms?: number | null;
  status_code?: number | null;
  error_message?: string | null;
  metadata?: Record<string, any>;
}

export type HealthCheckRow = HealthCheck;

// =====================================================
// NOTIFICATION CHANNELS TYPES
// =====================================================

export interface NotificationChannel {
  id: string;
  tenant_id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
  enabled: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NotificationChannelInsert {
  id?: string;
  tenant_id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
  enabled?: boolean;
  settings?: Record<string, any>;
}

export interface NotificationChannelUpdate {
  name?: string;
  type?: 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
  enabled?: boolean;
  settings?: Record<string, any>;
}

export type NotificationChannelRow = NotificationChannel;

// =====================================================
// DASHBOARD TYPES
// =====================================================

export interface MonitoringDashboard {
  metrics: {
    total_metrics: number;
    active_alerts: number;
    healthy_services: number;
    avg_response_time: number;
  };
  recent_alerts: Alert[];
  health_status: HealthCheck[];
  metric_trends: {
    metric_name: string;
    data_points: Array<{
      timestamp: string;
      value: number;
    }>;
  }[];
}

export interface MetricQuery {
  metric_name?: string;
  metric_type?: 'counter' | 'gauge' | 'histogram' | 'summary';
  start_time?: string;
  end_time?: string;
  labels?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface AlertQuery {
  status?: 'firing' | 'resolved' | 'acknowledged' | 'silenced';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  rule_id?: string;
  start_time?: string;
  end_time?: string;
  limit?: number;
  offset?: number;
}

export interface HealthCheckQuery {
  service_name?: string;
  check_type?: 'http' | 'database' | 'redis' | 'external_api' | 'custom';
  status?: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
  start_time?: string;
  end_time?: string;
  limit?: number;
  offset?: number;
}

// =====================================================
// CHART DATA TYPES
// =====================================================

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  metric_name: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface AlertSummary {
  total: number;
  firing: number;
  resolved: number;
  acknowledged: number;
  by_severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface HealthSummary {
  total_services: number;
  healthy: number;
  unhealthy: number;
  degraded: number;
  unknown: number;
  avg_response_time: number;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface MonitoringApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface MetricsCollectionRequest {
  metrics: Array<{
    metric_name: string;
    metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
    metric_value: number;
    labels?: Record<string, any>;
    timestamp?: string;
  }>;
}

export interface HealthCheckRequest {
  service_name: string;
  check_type: 'http' | 'database' | 'redis' | 'external_api' | 'custom';
  endpoint_url?: string;
  metadata?: Record<string, any>;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'firing' | 'resolved' | 'acknowledged' | 'silenced';
export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
export type CheckType = 'http' | 'database' | 'redis' | 'external_api' | 'custom';
export type NotificationType = 'email' | 'slack' | 'webhook' | 'sms' | 'pagerduty';
export type ConditionType = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';