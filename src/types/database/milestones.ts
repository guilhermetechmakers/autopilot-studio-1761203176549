/**
 * Database types for milestones table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface Milestone {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  progress_percentage: number;
  depends_on: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MilestoneInsert {
  id?: string;
  project_id: string;
  user_id: string;
  title: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string | null;
  due_date?: string | null;
  completed_date?: string | null;
  progress_percentage?: number;
  depends_on?: string | null;
  metadata?: Record<string, any>;
}

export interface MilestoneUpdate {
  title?: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string | null;
  due_date?: string | null;
  completed_date?: string | null;
  progress_percentage?: number;
  depends_on?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type MilestoneRow = Milestone;
