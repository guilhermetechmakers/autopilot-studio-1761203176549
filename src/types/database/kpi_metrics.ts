/**
 * Database types for kpi_metrics table
 * Generated: 2024-12-13T12:00:00Z
 */

export interface KpiMetric {
  id: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string | null;
  metric_category: 'revenue' | 'projects' | 'team' | 'performance' | 'general';
  previous_value: number | null;
  change_percentage: number | null;
  trend_direction: 'up' | 'down' | 'stable' | null;
  period_start: string;
  period_end: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KpiMetricInsert {
  id?: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string | null;
  metric_category?: 'revenue' | 'projects' | 'team' | 'performance' | 'general';
  previous_value?: number | null;
  change_percentage?: number | null;
  trend_direction?: 'up' | 'down' | 'stable' | null;
  period_start: string;
  period_end: string;
  metadata?: Record<string, any>;
}

export interface KpiMetricUpdate {
  metric_name?: string;
  metric_value?: number;
  metric_unit?: string | null;
  metric_category?: 'revenue' | 'projects' | 'team' | 'performance' | 'general';
  previous_value?: number | null;
  change_percentage?: number | null;
  trend_direction?: 'up' | 'down' | 'stable' | null;
  period_start?: string;
  period_end?: string;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type KpiMetricRow = KpiMetric;
