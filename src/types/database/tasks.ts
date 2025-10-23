/**
 * Database types for tasks table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface Task {
  id: string;
  project_id: string;
  milestone_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours: number | null;
  actual_hours: number | null;
  assignee_id: string | null;
  due_date: string | null;
  completed_date: string | null;
  depends_on: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TaskInsert {
  id?: string;
  project_id: string;
  milestone_id?: string | null;
  user_id: string;
  title: string;
  description?: string | null;
  status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number | null;
  actual_hours?: number | null;
  assignee_id?: string | null;
  due_date?: string | null;
  completed_date?: string | null;
  depends_on?: string | null;
  metadata?: Record<string, any>;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number | null;
  actual_hours?: number | null;
  assignee_id?: string | null;
  due_date?: string | null;
  completed_date?: string | null;
  depends_on?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type TaskRow = Task;
