/**
 * React Query hooks for monitoring system
 * Provides data fetching and caching for all monitoring features
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  metricsApi,
  alertRulesApi,
  alertsApi,
  healthChecksApi,
  notificationChannelsApi,
  monitoringDashboardApi,
  systemHealthApi,
} from '@/api/monitoring';
import type {
  MetricQuery,
  AlertQuery,
  HealthCheckQuery,
  MetricInsert,
  AlertRuleInsert,
  AlertRuleUpdate,
  AlertInsert,
  AlertUpdate,
  HealthCheckInsert,
  HealthCheckUpdate,
  NotificationChannelInsert,
  NotificationChannelUpdate,
  MetricsCollectionRequest,
  HealthCheckRequest,
} from '@/types/monitoring';

// =====================================================
// QUERY KEYS
// =====================================================

export const monitoringKeys = {
  all: ['monitoring'] as const,
  metrics: () => [...monitoringKeys.all, 'metrics'] as const,
  metricsList: (query: MetricQuery) => [...monitoringKeys.metrics(), 'list', query] as const,
  metric: (id: string) => [...monitoringKeys.metrics(), 'detail', id] as const,
  metricsDashboard: () => [...monitoringKeys.metrics(), 'dashboard'] as const,
  metricsTimeSeries: (metricName: string, startTime: string, endTime: string, labels?: Record<string, any>) => 
    [...monitoringKeys.metrics(), 'timeseries', metricName, startTime, endTime, labels] as const,
  
  alertRules: () => [...monitoringKeys.all, 'alert-rules'] as const,
  alertRulesList: () => [...monitoringKeys.alertRules(), 'list'] as const,
  alertRule: (id: string) => [...monitoringKeys.alertRules(), 'detail', id] as const,
  
  alerts: () => [...monitoringKeys.all, 'alerts'] as const,
  alertsList: (query: AlertQuery) => [...monitoringKeys.alerts(), 'list', query] as const,
  alert: (id: string) => [...monitoringKeys.alerts(), 'detail', id] as const,
  alertsSummary: () => [...monitoringKeys.alerts(), 'summary'] as const,
  
  healthChecks: () => [...monitoringKeys.all, 'health-checks'] as const,
  healthChecksList: (query: HealthCheckQuery) => [...monitoringKeys.healthChecks(), 'list', query] as const,
  healthCheck: (id: string) => [...monitoringKeys.healthChecks(), 'detail', id] as const,
  healthChecksSummary: () => [...monitoringKeys.healthChecks(), 'summary'] as const,
  
  notificationChannels: () => [...monitoringKeys.all, 'notification-channels'] as const,
  notificationChannelsList: () => [...monitoringKeys.notificationChannels(), 'list'] as const,
  notificationChannel: (id: string) => [...monitoringKeys.notificationChannels(), 'detail', id] as const,
  
  dashboard: () => [...monitoringKeys.all, 'dashboard'] as const,
  dashboardData: () => [...monitoringKeys.dashboard(), 'data'] as const,
  dashboardTrends: (metricNames: string[], startTime: string, endTime: string) => 
    [...monitoringKeys.dashboard(), 'trends', metricNames, startTime, endTime] as const,
  dashboardActivity: (limit: number) => [...monitoringKeys.dashboard(), 'activity', limit] as const,
  
  systemHealth: () => [...monitoringKeys.all, 'system-health'] as const,
  systemHealthStatus: () => [...monitoringKeys.systemHealth(), 'status'] as const,
  systemMetrics: () => [...monitoringKeys.systemHealth(), 'metrics'] as const,
};

// =====================================================
// METRICS HOOKS
// =====================================================

export function useMetrics(query: MetricQuery = {}) {
  return useQuery({
    queryKey: monitoringKeys.metricsList(query),
    queryFn: () => metricsApi.getMetrics(query),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useMetric(id: string) {
  return useQuery({
    queryKey: monitoringKeys.metric(id),
    queryFn: () => metricsApi.getMetric(id),
    enabled: !!id,
  });
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: monitoringKeys.metricsDashboard(),
    queryFn: () => metricsApi.getDashboardMetrics(),
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // 30 seconds
  });
}

export function useTimeSeriesData(
  metricName: string,
  startTime: string,
  endTime: string,
  labels?: Record<string, any>
) {
  return useQuery({
    queryKey: monitoringKeys.metricsTimeSeries(metricName, startTime, endTime, labels),
    queryFn: () => metricsApi.getTimeSeriesData(metricName, startTime, endTime, labels),
    enabled: !!metricName && !!startTime && !!endTime,
    staleTime: 30000,
  });
}

export function useCreateMetric() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (metric: MetricInsert) => metricsApi.createMetric(metric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.metrics() });
      toast.success('Metric created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create metric');
    },
  });
}

export function useCreateMetrics() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (metrics: MetricsCollectionRequest) => metricsApi.createMetrics(metrics),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.metrics() });
      toast.success(`${data.data.created} metrics created successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create metrics');
    },
  });
}

// =====================================================
// ALERT RULES HOOKS
// =====================================================

export function useAlertRules() {
  return useQuery({
    queryKey: monitoringKeys.alertRulesList(),
    queryFn: () => alertRulesApi.getAlertRules(),
    staleTime: 60000, // 1 minute
  });
}

export function useAlertRule(id: string) {
  return useQuery({
    queryKey: monitoringKeys.alertRule(id),
    queryFn: () => alertRulesApi.getAlertRule(id),
    enabled: !!id,
  });
}

export function useCreateAlertRule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (rule: AlertRuleInsert) => alertRulesApi.createAlertRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alertRules() });
      toast.success('Alert rule created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create alert rule');
    },
  });
}

export function useUpdateAlertRule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, rule }: { id: string; rule: AlertRuleUpdate }) => 
      alertRulesApi.updateAlertRule(id, rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alertRules() });
      toast.success('Alert rule updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update alert rule');
    },
  });
}

export function useDeleteAlertRule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => alertRulesApi.deleteAlertRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alertRules() });
      toast.success('Alert rule deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete alert rule');
    },
  });
}

export function useToggleAlertRule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => 
      alertRulesApi.toggleAlertRule(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alertRules() });
      toast.success('Alert rule status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update alert rule status');
    },
  });
}

// =====================================================
// ALERTS HOOKS
// =====================================================

export function useAlerts(query: AlertQuery = {}) {
  return useQuery({
    queryKey: monitoringKeys.alertsList(query),
    queryFn: () => alertsApi.getAlerts(query),
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // 30 seconds
  });
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: monitoringKeys.alert(id),
    queryFn: () => alertsApi.getAlert(id),
    enabled: !!id,
  });
}

export function useAlertSummary() {
  return useQuery({
    queryKey: monitoringKeys.alertsSummary(),
    queryFn: () => alertsApi.getAlertSummary(),
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alert: AlertInsert) => alertsApi.createAlert(alert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alerts() });
      toast.success('Alert created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create alert');
    },
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, alert }: { id: string; alert: AlertUpdate }) => 
      alertsApi.updateAlert(id, alert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alerts() });
      toast.success('Alert updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update alert');
    },
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      alertsApi.acknowledgeAlert(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alerts() });
      toast.success('Alert acknowledged');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to acknowledge alert');
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      alertsApi.resolveAlert(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alerts() });
      toast.success('Alert resolved');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resolve alert');
    },
  });
}

export function useSilenceAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      alertsApi.silenceAlert(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.alerts() });
      toast.success('Alert silenced');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to silence alert');
    },
  });
}

// =====================================================
// HEALTH CHECKS HOOKS
// =====================================================

export function useHealthChecks(query: HealthCheckQuery = {}) {
  return useQuery({
    queryKey: monitoringKeys.healthChecksList(query),
    queryFn: () => healthChecksApi.getHealthChecks(query),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useHealthCheck(id: string) {
  return useQuery({
    queryKey: monitoringKeys.healthCheck(id),
    queryFn: () => healthChecksApi.getHealthCheck(id),
    enabled: !!id,
  });
}

export function useHealthSummary() {
  return useQuery({
    queryKey: monitoringKeys.healthChecksSummary(),
    queryFn: () => healthChecksApi.getHealthSummary(),
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

export function useCreateHealthCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (check: HealthCheckInsert) => healthChecksApi.createHealthCheck(check),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.healthChecks() });
      toast.success('Health check created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create health check');
    },
  });
}

export function useUpdateHealthCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, check }: { id: string; check: HealthCheckUpdate }) => 
      healthChecksApi.updateHealthCheck(id, check),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.healthChecks() });
      toast.success('Health check updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update health check');
    },
  });
}

export function useDeleteHealthCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => healthChecksApi.deleteHealthCheck(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.healthChecks() });
      toast.success('Health check deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete health check');
    },
  });
}

export function usePerformHealthCheck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: HealthCheckRequest) => healthChecksApi.performHealthCheck(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.healthChecks() });
      toast.success('Health check performed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to perform health check');
    },
  });
}

// =====================================================
// NOTIFICATION CHANNELS HOOKS
// =====================================================

export function useNotificationChannels() {
  return useQuery({
    queryKey: monitoringKeys.notificationChannelsList(),
    queryFn: () => notificationChannelsApi.getNotificationChannels(),
    staleTime: 300000, // 5 minutes
  });
}

export function useNotificationChannel(id: string) {
  return useQuery({
    queryKey: monitoringKeys.notificationChannel(id),
    queryFn: () => notificationChannelsApi.getNotificationChannel(id),
    enabled: !!id,
  });
}

export function useCreateNotificationChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channel: NotificationChannelInsert) => 
      notificationChannelsApi.createNotificationChannel(channel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.notificationChannels() });
      toast.success('Notification channel created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create notification channel');
    },
  });
}

export function useUpdateNotificationChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, channel }: { id: string; channel: NotificationChannelUpdate }) => 
      notificationChannelsApi.updateNotificationChannel(id, channel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.notificationChannels() });
      toast.success('Notification channel updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update notification channel');
    },
  });
}

export function useDeleteNotificationChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationChannelsApi.deleteNotificationChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringKeys.notificationChannels() });
      toast.success('Notification channel deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete notification channel');
    },
  });
}

export function useTestNotificationChannel() {
  return useMutation({
    mutationFn: (id: string) => notificationChannelsApi.testNotificationChannel(id),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success('Test notification sent successfully');
      } else {
        toast.error(data.data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to test notification channel');
    },
  });
}

// =====================================================
// DASHBOARD HOOKS
// =====================================================

export function useMonitoringDashboard() {
  return useQuery({
    queryKey: monitoringKeys.dashboardData(),
    queryFn: () => monitoringDashboardApi.getDashboard(),
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

export function useMetricsTrends(
  metricNames: string[],
  startTime: string,
  endTime: string
) {
  return useQuery({
    queryKey: monitoringKeys.dashboardTrends(metricNames, startTime, endTime),
    queryFn: () => monitoringDashboardApi.getMetricsTrends(metricNames, startTime, endTime),
    enabled: metricNames.length > 0 && !!startTime && !!endTime,
    staleTime: 30000,
  });
}

export function useRecentActivity(limit: number = 50) {
  return useQuery({
    queryKey: monitoringKeys.dashboardActivity(limit),
    queryFn: () => monitoringDashboardApi.getRecentActivity(limit),
    staleTime: 10000,
    refetchInterval: 30000,
  });
}

// =====================================================
// SYSTEM HEALTH HOOKS
// =====================================================

export function useSystemHealth() {
  return useQuery({
    queryKey: monitoringKeys.systemHealthStatus(),
    queryFn: () => systemHealthApi.getSystemHealth(),
    staleTime: 5000, // 5 seconds
    refetchInterval: 10000, // 10 seconds
  });
}

export function useSystemMetrics() {
  return useQuery({
    queryKey: monitoringKeys.systemMetrics(),
    queryFn: () => systemHealthApi.getSystemMetrics(),
    staleTime: 5000,
    refetchInterval: 10000,
  });
}