/**
 * Database types for tickets table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface Ticket {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'bug' | 'feature' | 'task' | 'improvement' | 'question';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  assignee_id: string | null;
  reporter_id: string | null;
  external_id: string | null;
  external_url: string | null;
  resolution: string | null;
  resolved_date: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TicketInsert {
  id?: string;
  project_id: string;
  user_id: string;
  title: string;
  description?: string | null;
  type?: 'bug' | 'feature' | 'task' | 'improvement' | 'question';
  status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  assignee_id?: string | null;
  reporter_id?: string | null;
  external_id?: string | null;
  external_url?: string | null;
  resolution?: string | null;
  resolved_date?: string | null;
  metadata?: Record<string, any>;
}

export interface TicketUpdate {
  title?: string;
  description?: string | null;
  type?: 'bug' | 'feature' | 'task' | 'improvement' | 'question';
  status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  assignee_id?: string | null;
  reporter_id?: string | null;
  external_id?: string | null;
  external_url?: string | null;
  resolution?: string | null;
  resolved_date?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type TicketRow = Ticket;
