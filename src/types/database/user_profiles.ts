/**
 * Database types for user_profiles table
 * Generated: 2024-01-13T12:00:00Z
 */

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  company: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProfileInsert {
  id?: string;
  user_id: string;
  name?: string | null;
  company?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  role?: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
  preferences?: Record<string, any>;
}

export interface UserProfileUpdate {
  name?: string | null;
  company?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  role?: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
  preferences?: Record<string, any>;
}

// Supabase query result type
export type UserProfileRow = UserProfile;