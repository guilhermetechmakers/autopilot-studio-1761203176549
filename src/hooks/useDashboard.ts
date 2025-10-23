/**
 * Dashboard React Query hooks
 * Provides data fetching and state management for dashboard components
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  projectsApi, 
  meetingsApi, 
  notificationsApi, 
  kpiMetricsApi, 
  dashboardApi 
} from '@/api/dashboard';
import type { 
  ProjectInsert, 
  ProjectUpdate,
  MeetingInsert,
  MeetingUpdate,
  NotificationInsert,
  KpiMetricInsert,
  KpiMetricUpdate
} from '@/types/database';

// =====================================================
// QUERY KEYS
// =====================================================

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  projects: () => [...dashboardKeys.all, 'projects'] as const,
  activeProjects: () => [...dashboardKeys.projects(), 'active'] as const,
  meetings: () => [...dashboardKeys.all, 'meetings'] as const,
  upcomingMeetings: () => [...dashboardKeys.meetings(), 'upcoming'] as const,
  notifications: () => [...dashboardKeys.all, 'notifications'] as const,
  unreadNotifications: () => [...dashboardKeys.notifications(), 'unread'] as const,
  kpiMetrics: () => [...dashboardKeys.all, 'kpiMetrics'] as const,
  latestKpiMetrics: () => [...dashboardKeys.kpiMetrics(), 'latest'] as const,
};

// =====================================================
// DASHBOARD SUMMARY HOOKS
// =====================================================

export function useDashboardSummary() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardApi.getDashboardSummary(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// =====================================================
// PROJECTS HOOKS
// =====================================================

export function useProjects() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.projects(),
    queryFn: () => projectsApi.getProjects(user?.id || ''),
    enabled: !!user?.id,
  });
}

export function useActiveProjects() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.activeProjects(),
    queryFn: () => projectsApi.getActiveProjects(user?.id || ''),
    enabled: !!user?.id,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: [...dashboardKeys.projects(), projectId],
    queryFn: () => projectsApi.getProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: ProjectInsert) => projectsApi.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.projects() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, updates }: { projectId: string; updates: ProjectUpdate }) =>
      projectsApi.updateProject(projectId, updates),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.projects(), projectId] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.projects() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectId: string) => projectsApi.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.projects() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

// =====================================================
// MEETINGS HOOKS
// =====================================================

export function useMeetings() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.meetings(),
    queryFn: () => meetingsApi.getMeetings(user?.id || ''),
    enabled: !!user?.id,
  });
}

export function useUpcomingMeetings() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.upcomingMeetings(),
    queryFn: () => meetingsApi.getUpcomingMeetings(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMeeting(meetingId: string) {
  return useQuery({
    queryKey: [...dashboardKeys.meetings(), meetingId],
    queryFn: () => meetingsApi.getMeeting(meetingId),
    enabled: !!meetingId,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (meeting: MeetingInsert) => meetingsApi.createMeeting(meeting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.meetings() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ meetingId, updates }: { meetingId: string; updates: MeetingUpdate }) =>
      meetingsApi.updateMeeting(meetingId, updates),
    onSuccess: (_, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.meetings(), meetingId] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.meetings() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (meetingId: string) => meetingsApi.deleteMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.meetings() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

// =====================================================
// NOTIFICATIONS HOOKS
// =====================================================

export function useNotifications() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.notifications(),
    queryFn: () => notificationsApi.getNotifications(user?.id || ''),
    enabled: !!user?.id,
  });
}

export function useUnreadNotifications() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.unreadNotifications(),
    queryFn: () => notificationsApi.getUnreadNotifications(user?.id || ''),
    enabled: !!user?.id,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

export function useNotification(notificationId: string) {
  return useQuery({
    queryKey: [...dashboardKeys.notifications(), notificationId],
    queryFn: () => notificationsApi.getNotification(notificationId),
    enabled: !!notificationId,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notification: NotificationInsert) => notificationsApi.createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

// =====================================================
// KPI METRICS HOOKS
// =====================================================

export function useKpiMetrics() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.kpiMetrics(),
    queryFn: () => kpiMetricsApi.getKpiMetrics(user?.id || ''),
    enabled: !!user?.id,
  });
}

export function useKpiMetricsByCategory(category: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [...dashboardKeys.kpiMetrics(), 'category', category],
    queryFn: () => kpiMetricsApi.getKpiMetricsByCategory(user?.id || '', category),
    enabled: !!user?.id && !!category,
  });
}

export function useLatestKpiMetrics() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: dashboardKeys.latestKpiMetrics(),
    queryFn: () => kpiMetricsApi.getLatestKpiMetrics(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useKpiMetric(metricId: string) {
  return useQuery({
    queryKey: [...dashboardKeys.kpiMetrics(), metricId],
    queryFn: () => kpiMetricsApi.getKpiMetric(metricId),
    enabled: !!metricId,
  });
}

export function useCreateKpiMetric() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (metric: KpiMetricInsert) => kpiMetricsApi.createKpiMetric(metric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.kpiMetrics() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useUpdateKpiMetric() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ metricId, updates }: { metricId: string; updates: KpiMetricUpdate }) =>
      kpiMetricsApi.updateKpiMetric(metricId, updates),
    onSuccess: (_, { metricId }) => {
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.kpiMetrics(), metricId] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.kpiMetrics() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}

export function useDeleteKpiMetric() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (metricId: string) => kpiMetricsApi.deleteKpiMetric(metricId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.kpiMetrics() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() });
    },
  });
}
