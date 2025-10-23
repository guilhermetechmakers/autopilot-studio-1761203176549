/**
 * Monitoring API Layer
 * Handles all monitoring-related API calls
 */

import { api } from '@/lib/api';
import type {
  Metric,
  MetricInsert,
  MetricQuery,
  AlertRule,
  AlertRuleInsert,
  AlertRuleUpdate,
  Alert,
  AlertInsert,
  AlertUpdate,
  AlertQuery,
  HealthCheck,
  HealthCheckInsert,
  HealthCheckUpdate,
  HealthCheckQuery,
  NotificationChannel,
  NotificationChannelInsert,
  NotificationChannelUpdate,
  MonitoringDashboard,
  MetricsCollectionRequest,
  HealthCheckRequest,
  MonitoringApiResponse,
  AlertSummary,
  HealthSummary,
  TimeSeriesData,
} from '@/types/monitoring';

// =====================================================
// METRICS API
// =====================================================

export const metricsApi = {
  // Get metrics with optional filtering
  async getMetrics(query: MetricQuery = {}): Promise<MonitoringApiResponse<Metric[]>> {
    const params = new URLSearchParams();
    
    if (query.metric_name) params.append('metric_name', query.metric_name);
    if (query.metric_type) params.append('metric_type', query.metric_type);
    if (query.start_time) params.append('start_time', query.start_time);
    if (query.end_time) params.append('end_time', query.end_time);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());
    if (query.labels) params.append('labels', JSON.stringify(query.labels));

    const response = await api.get<MonitoringApiResponse<Metric[]>>(`/monitoring/metrics?${params.toString()}`);
    return response;
  },

  // Get metric by ID
  async getMetric(id: string): Promise<MonitoringApiResponse<Metric>> {
    const response = await api.get<MonitoringApiResponse<Metric>>(`/monitoring/metrics/${id}`);
    return response;
  },

  // Create a new metric
  async createMetric(metric: MetricInsert): Promise<MonitoringApiResponse<Metric>> {
    const response = await api.post<MonitoringApiResponse<Metric>>('/monitoring/metrics', metric);
    return response;
  },

  // Bulk create metrics
  async createMetrics(metrics: MetricsCollectionRequest): Promise<MonitoringApiResponse<{ created: number }>> {
    const response = await api.post<MonitoringApiResponse<{ created: number }>>('/monitoring/metrics/bulk', metrics);
    return response;
  },

  // Get time series data for charts
  async getTimeSeriesData(
    metricName: string,
    startTime: string,
    endTime: string,
    labels?: Record<string, any>
  ): Promise<MonitoringApiResponse<TimeSeriesData>> {
    const params = new URLSearchParams({
      metric_name: metricName,
      start_time: startTime,
      end_time: endTime,
    });
    
    if (labels) params.append('labels', JSON.stringify(labels));

    const response = await api.get<MonitoringApiResponse<TimeSeriesData>>(`/monitoring/metrics/timeseries?${params.toString()}`);
    return response;
  },

  // Get dashboard metrics summary
  async getDashboardMetrics(): Promise<MonitoringApiResponse<{
    total_metrics: number;
    active_alerts: number;
    healthy_services: number;
    avg_response_time: number;
  }>> {
    const response = await api.get<MonitoringApiResponse<{
    total_metrics: number;
    active_alerts: number;
    healthy_services: number;
    avg_response_time: number;
  }>>('/monitoring/metrics/dashboard');
    return response;
  },
};

// =====================================================
// ALERT RULES API
// =====================================================

export const alertRulesApi = {
  // Get all alert rules
  async getAlertRules(): Promise<MonitoringApiResponse<AlertRule[]>> {
    const response = await api.get<MonitoringApiResponse<AlertRule[]>>('/monitoring/alert-rules');
    return response;
  },

  // Get alert rule by ID
  async getAlertRule(id: string): Promise<MonitoringApiResponse<AlertRule>> {
    const response = await api.get<MonitoringApiResponse<AlertRule>>(`/monitoring/alert-rules/${id}`);
    return response;
  },

  // Create new alert rule
  async createAlertRule(rule: AlertRuleInsert): Promise<MonitoringApiResponse<AlertRule>> {
    const response = await api.post<MonitoringApiResponse<AlertRule>>('/monitoring/alert-rules', rule);
    return response;
  },

  // Update alert rule
  async updateAlertRule(id: string, rule: AlertRuleUpdate): Promise<MonitoringApiResponse<AlertRule>> {
    const response = await api.put<MonitoringApiResponse<AlertRule>>(`/monitoring/alert-rules/${id}`, rule);
    return response;
  },

  // Delete alert rule
  async deleteAlertRule(id: string): Promise<MonitoringApiResponse<void>> {
    const response = await api.delete<MonitoringApiResponse<void>>(`/monitoring/alert-rules/${id}`);
    return response;
  },

  // Toggle alert rule enabled status
  async toggleAlertRule(id: string, enabled: boolean): Promise<MonitoringApiResponse<AlertRule>> {
    const response = await api.patch<MonitoringApiResponse<AlertRule>>(`/monitoring/alert-rules/${id}/toggle`, { enabled });
    return response;
  },
};

// =====================================================
// ALERTS API
// =====================================================

export const alertsApi = {
  // Get alerts with optional filtering
  async getAlerts(query: AlertQuery = {}): Promise<MonitoringApiResponse<Alert[]>> {
    const params = new URLSearchParams();
    
    if (query.status) params.append('status', query.status);
    if (query.severity) params.append('severity', query.severity);
    if (query.rule_id) params.append('rule_id', query.rule_id);
    if (query.start_time) params.append('start_time', query.start_time);
    if (query.end_time) params.append('end_time', query.end_time);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());

    const response = await api.get<MonitoringApiResponse<Alert[]>>(`/monitoring/alerts?${params.toString()}`);
    return response;
  },

  // Get alert by ID
  async getAlert(id: string): Promise<MonitoringApiResponse<Alert>> {
    const response = await api.get<MonitoringApiResponse<Alert>>(`/monitoring/alerts/${id}`);
    return response;
  },

  // Create new alert
  async createAlert(alert: AlertInsert): Promise<MonitoringApiResponse<Alert>> {
    const response = await api.post<MonitoringApiResponse<Alert>>('/monitoring/alerts', alert);
    return response;
  },

  // Update alert
  async updateAlert(id: string, alert: AlertUpdate): Promise<MonitoringApiResponse<Alert>> {
    const response = await api.put<MonitoringApiResponse<Alert>>(`/monitoring/alerts/${id}`, alert);
    return response;
  },

  // Acknowledge alert
  async acknowledgeAlert(id: string, notes?: string): Promise<MonitoringApiResponse<Alert>> {
    const response = await api.patch<MonitoringApiResponse<Alert>>(`/monitoring/alerts/${id}/acknowledge`, { notes });
    return response;
  },

  // Resolve alert
  async resolveAlert(id: string, notes?: string): Promise<MonitoringApiResponse<Alert>> {
    const response = await api.patch<MonitoringApiResponse<Alert>>(`/monitoring/alerts/${id}/resolve`, { notes });
    return response;
  },

  // Silence alert
  async silenceAlert(id: string, notes?: string): Promise<MonitoringApiResponse<Alert>> {
    const response = await api.patch<MonitoringApiResponse<Alert>>(`/monitoring/alerts/${id}/silence`, { notes });
    return response;
  },

  // Get alert summary
  async getAlertSummary(): Promise<MonitoringApiResponse<AlertSummary>> {
    const response = await api.get<MonitoringApiResponse<AlertSummary>>('/monitoring/alerts/summary');
    return response;
  },
};

// =====================================================
// HEALTH CHECKS API
// =====================================================

export const healthChecksApi = {
  // Get health checks with optional filtering
  async getHealthChecks(query: HealthCheckQuery = {}): Promise<MonitoringApiResponse<HealthCheck[]>> {
    const params = new URLSearchParams();
    
    if (query.service_name) params.append('service_name', query.service_name);
    if (query.check_type) params.append('check_type', query.check_type);
    if (query.status) params.append('status', query.status);
    if (query.start_time) params.append('start_time', query.start_time);
    if (query.end_time) params.append('end_time', query.end_time);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());

    const response = await api.get<MonitoringApiResponse<HealthCheck[]>>(`/monitoring/health-checks?${params.toString()}`);
    return response;
  },

  // Get health check by ID
  async getHealthCheck(id: string): Promise<MonitoringApiResponse<HealthCheck>> {
    const response = await api.get<MonitoringApiResponse<HealthCheck>>(`/monitoring/health-checks/${id}`);
    return response;
  },

  // Create new health check
  async createHealthCheck(check: HealthCheckInsert): Promise<MonitoringApiResponse<HealthCheck>> {
    const response = await api.post<MonitoringApiResponse<HealthCheck>>('/monitoring/health-checks', check);
    return response;
  },

  // Update health check
  async updateHealthCheck(id: string, check: HealthCheckUpdate): Promise<MonitoringApiResponse<HealthCheck>> {
    const response = await api.put<MonitoringApiResponse<HealthCheck>>(`/monitoring/health-checks/${id}`, check);
    return response;
  },

  // Delete health check
  async deleteHealthCheck(id: string): Promise<MonitoringApiResponse<void>> {
    const response = await api.delete<MonitoringApiResponse<void>>(`/monitoring/health-checks/${id}`);
    return response;
  },

  // Perform health check
  async performHealthCheck(request: HealthCheckRequest): Promise<MonitoringApiResponse<HealthCheck>> {
    const response = await api.post<MonitoringApiResponse<HealthCheck>>('/monitoring/health-checks/perform', request);
    return response;
  },

  // Get health summary
  async getHealthSummary(): Promise<MonitoringApiResponse<HealthSummary>> {
    const response = await api.get<MonitoringApiResponse<HealthSummary>>('/monitoring/health-checks/summary');
    return response;
  },
};

// =====================================================
// NOTIFICATION CHANNELS API
// =====================================================

export const notificationChannelsApi = {
  // Get all notification channels
  async getNotificationChannels(): Promise<MonitoringApiResponse<NotificationChannel[]>> {
    const response = await api.get<MonitoringApiResponse<NotificationChannel[]>>('/monitoring/notification-channels');
    return response;
  },

  // Get notification channel by ID
  async getNotificationChannel(id: string): Promise<MonitoringApiResponse<NotificationChannel>> {
    const response = await api.get<MonitoringApiResponse<NotificationChannel>>(`/monitoring/notification-channels/${id}`);
    return response;
  },

  // Create new notification channel
  async createNotificationChannel(channel: NotificationChannelInsert): Promise<MonitoringApiResponse<NotificationChannel>> {
    const response = await api.post<MonitoringApiResponse<NotificationChannel>>('/monitoring/notification-channels', channel);
    return response;
  },

  // Update notification channel
  async updateNotificationChannel(id: string, channel: NotificationChannelUpdate): Promise<MonitoringApiResponse<NotificationChannel>> {
    const response = await api.put<MonitoringApiResponse<NotificationChannel>>(`/monitoring/notification-channels/${id}`, channel);
    return response;
  },

  // Delete notification channel
  async deleteNotificationChannel(id: string): Promise<MonitoringApiResponse<void>> {
    const response = await api.delete<MonitoringApiResponse<void>>(`/monitoring/notification-channels/${id}`);
    return response;
  },

  // Test notification channel
  async testNotificationChannel(id: string): Promise<MonitoringApiResponse<{ success: boolean; message: string }>> {
    const response = await api.post<MonitoringApiResponse<{ success: boolean; message: string }>>(`/monitoring/notification-channels/${id}/test`, {});
    return response;
  },
};

// =====================================================
// DASHBOARD API
// =====================================================

export const monitoringDashboardApi = {
  // Get complete dashboard data
  async getDashboard(): Promise<MonitoringApiResponse<MonitoringDashboard>> {
    const response = await api.get<MonitoringApiResponse<MonitoringDashboard>>('/monitoring/dashboard');
    return response;
  },

  // Get metrics trends for charts
  async getMetricsTrends(
    metricNames: string[],
    startTime: string,
    endTime: string
  ): Promise<MonitoringApiResponse<TimeSeriesData[]>> {
    const response = await api.post<MonitoringApiResponse<TimeSeriesData[]>>('/monitoring/dashboard/trends', {
      metric_names: metricNames,
      start_time: startTime,
      end_time: endTime,
    });
    return response;
  },

  // Get recent activity
  async getRecentActivity(limit: number = 50): Promise<MonitoringApiResponse<{
    alerts: Alert[];
    health_checks: HealthCheck[];
    metrics: Metric[];
  }>> {
    const response = await api.get<MonitoringApiResponse<{
      alerts: Alert[];
      health_checks: HealthCheck[];
      metrics: Metric[];
    }>>(`/monitoring/dashboard/activity?limit=${limit}`);
    return response;
  },
};

// =====================================================
// SYSTEM HEALTH API
// =====================================================

export const systemHealthApi = {
  // Get system health status
  async getSystemHealth(): Promise<MonitoringApiResponse<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Array<{
      name: string;
      status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
      response_time_ms: number | null;
      last_check: string;
    }>;
    uptime: number;
    version: string;
  }>> {
    const response = await api.get<MonitoringApiResponse<{
      status: 'healthy' | 'degraded' | 'unhealthy';
      services: Array<{
        name: string;
        status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
        response_time_ms: number | null;
        last_check: string;
      }>;
      uptime: number;
      version: string;
    }>>('/monitoring/system/health');
    return response;
  },

  // Get system metrics
  async getSystemMetrics(): Promise<MonitoringApiResponse<{
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_io: {
      bytes_in: number;
      bytes_out: number;
    };
    active_connections: number;
  }>> {
    const response = await api.get<MonitoringApiResponse<{
      cpu_usage: number;
      memory_usage: number;
      disk_usage: number;
      network_io: {
        bytes_in: number;
        bytes_out: number;
      };
      active_connections: number;
    }>>('/monitoring/system/metrics');
    return response;
  },
};