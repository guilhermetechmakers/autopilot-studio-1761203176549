/**
 * Database types for projects table
 * Generated: 2024-12-13T12:00:00Z
 */

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client_name: string | null;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  progress_percentage: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  status?: 'active' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  client_name?: string | null;
  budget?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  progress_percentage?: number;
  metadata?: Record<string, any>;
}

export interface ProjectUpdate {
  name?: string;
  description?: string | null;
  status?: 'active' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  client_name?: string | null;
  budget?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  progress_percentage?: number;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type ProjectRow = Project;
