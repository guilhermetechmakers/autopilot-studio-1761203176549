/**
 * Database types for notifications table
 * Generated: 2024-12-13T12:00:00Z
 */

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  status: 'unread' | 'read' | 'archived';
  action_url: string | null;
  action_text: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  read_at: string | null;
}

export interface NotificationInsert {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  status?: 'unread' | 'read' | 'archived';
  action_url?: string | null;
  action_text?: string | null;
  metadata?: Record<string, any>;
}

export interface NotificationUpdate {
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  status?: 'unread' | 'read' | 'archived';
  action_url?: string | null;
  action_text?: string | null;
  metadata?: Record<string, any>;
  read_at?: string | null;
}

// Supabase query result type
export type NotificationRow = Notification;
