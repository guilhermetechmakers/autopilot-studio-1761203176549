/**
 * Dashboard API functions
 * Handles all dashboard-related data fetching and mutations
 */

import { supabase } from '@/lib/supabase';
import type { 
  Project, 
  ProjectInsert, 
  ProjectUpdate,
  Meeting,
  MeetingInsert,
  MeetingUpdate,
  Notification,
  NotificationInsert,
  KpiMetric,
  KpiMetricInsert,
  KpiMetricUpdate
} from '@/types/database';

// =====================================================
// PROJECTS API
// =====================================================

export const projectsApi = {
  // Get all projects for a user
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get active projects only
  async getActiveProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'in_progress'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get project by ID
  async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new project
  async createProject(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update project
  async updateProject(projectId: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete project
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }
};

// =====================================================
// MEETINGS API
// =====================================================

export const meetingsApi = {
  // Get all meetings for a user
  async getMeetings(userId: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get upcoming meetings (next 7 days)
  async getUpcomingMeetings(userId: string): Promise<Meeting[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', now.toISOString())
      .lte('start_time', nextWeek.toISOString())
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get meeting by ID
  async getMeeting(meetingId: string): Promise<Meeting | null> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new meeting
  async createMeeting(meeting: MeetingInsert): Promise<Meeting> {
    const { data, error } = await supabase
      .from('meetings')
      .insert(meeting)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update meeting
  async updateMeeting(meetingId: string, updates: MeetingUpdate): Promise<Meeting> {
    const { data, error } = await supabase
      .from('meetings')
      .update(updates)
      .eq('id', meetingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete meeting
  async deleteMeeting(meetingId: string): Promise<void> {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meetingId);

    if (error) throw error;
  }
};

// =====================================================
// NOTIFICATIONS API
// =====================================================

export const notificationsApi = {
  // Get all notifications for a user
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get unread notifications
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'unread')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get notification by ID
  async getNotification(notificationId: string): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notificationId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new notification
  async createNotification(notification: NotificationInsert): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'unread');

    if (error) throw error;
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  }
};

// =====================================================
// KPI METRICS API
// =====================================================

export const kpiMetricsApi = {
  // Get all KPI metrics for a user
  async getKpiMetrics(userId: string): Promise<KpiMetric[]> {
    const { data, error } = await supabase
      .from('kpi_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('period_start', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get KPI metrics by category
  async getKpiMetricsByCategory(userId: string, category: string): Promise<KpiMetric[]> {
    const { data, error } = await supabase
      .from('kpi_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_category', category)
      .order('period_start', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get latest KPI metrics (most recent period for each metric)
  async getLatestKpiMetrics(userId: string): Promise<KpiMetric[]> {
    const { data, error } = await supabase
      .from('kpi_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('period_start', { ascending: false });

    if (error) throw error;
    
    // Group by metric_name and get the latest for each
    const latestMetrics = new Map<string, KpiMetric>();
    data?.forEach((metric: any) => {
      if (!latestMetrics.has(metric.metric_name) || 
          new Date(metric.period_start) > new Date(latestMetrics.get(metric.metric_name)!.period_start)) {
        latestMetrics.set(metric.metric_name, metric);
      }
    });

    return Array.from(latestMetrics.values());
  },

  // Get KPI metric by ID
  async getKpiMetric(metricId: string): Promise<KpiMetric | null> {
    const { data, error } = await supabase
      .from('kpi_metrics')
      .select('*')
      .eq('id', metricId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new KPI metric
  async createKpiMetric(metric: KpiMetricInsert): Promise<KpiMetric> {
    const { data, error } = await supabase
      .from('kpi_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update KPI metric
  async updateKpiMetric(metricId: string, updates: KpiMetricUpdate): Promise<KpiMetric> {
    const { data, error } = await supabase
      .from('kpi_metrics')
      .update(updates)
      .eq('id', metricId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete KPI metric
  async deleteKpiMetric(metricId: string): Promise<void> {
    const { error } = await supabase
      .from('kpi_metrics')
      .delete()
      .eq('id', metricId);

    if (error) throw error;
  }
};

// =====================================================
// DASHBOARD SUMMARY API
// =====================================================

export const dashboardApi = {
  // Get dashboard summary data
  async getDashboardSummary(userId: string) {
    const [projects, meetings, notifications, kpiMetrics] = await Promise.all([
      projectsApi.getActiveProjects(userId),
      meetingsApi.getUpcomingMeetings(userId),
      notificationsApi.getUnreadNotifications(userId),
      kpiMetricsApi.getLatestKpiMetrics(userId)
    ]);

    return {
      projects,
      meetings,
      notifications,
      kpiMetrics,
      stats: {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        upcomingMeetings: meetings.length,
        unreadNotifications: notifications.length
      }
    };
  }
};
