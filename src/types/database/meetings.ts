/**
 * Database types for meetings table
 * Generated: 2024-12-13T12:00:00Z
 */

export interface Meeting {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_time: string;
  end_time: string;
  location: string | null;
  meeting_url: string | null;
  participants: Array<{
    name: string;
    email: string;
    role?: string;
  }>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MeetingInsert {
  id?: string;
  user_id: string;
  title: string;
  description?: string | null;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_time: string;
  end_time: string;
  location?: string | null;
  meeting_url?: string | null;
  participants?: Array<{
    name: string;
    email: string;
    role?: string;
  }>;
  metadata?: Record<string, any>;
}

export interface MeetingUpdate {
  title?: string;
  description?: string | null;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  location?: string | null;
  meeting_url?: string | null;
  participants?: Array<{
    name: string;
    email: string;
    role?: string;
  }>;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type MeetingRow = Meeting;
