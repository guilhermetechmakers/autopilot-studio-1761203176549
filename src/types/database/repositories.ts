/**
 * Database types for repositories table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface Repository {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description: string | null;
  url: string;
  provider: 'github' | 'gitlab' | 'bitbucket' | 'azure';
  full_name: string;
  private: boolean;
  default_branch: string;
  is_connected: boolean;
  last_sync: string | null;
  sync_status: 'pending' | 'syncing' | 'success' | 'failed';
  external_id: string | null;
  webhook_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RepositoryInsert {
  id?: string;
  project_id: string;
  user_id: string;
  name: string;
  description?: string | null;
  url: string;
  provider: 'github' | 'gitlab' | 'bitbucket' | 'azure';
  full_name: string;
  private?: boolean;
  default_branch?: string;
  is_connected?: boolean;
  last_sync?: string | null;
  sync_status?: 'pending' | 'syncing' | 'success' | 'failed';
  external_id?: string | null;
  webhook_id?: string | null;
  metadata?: Record<string, any>;
}

export interface RepositoryUpdate {
  name?: string;
  description?: string | null;
  url?: string;
  provider?: 'github' | 'gitlab' | 'bitbucket' | 'azure';
  full_name?: string;
  private?: boolean;
  default_branch?: string;
  is_connected?: boolean;
  last_sync?: string | null;
  sync_status?: 'pending' | 'syncing' | 'success' | 'failed';
  external_id?: string | null;
  webhook_id?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type RepositoryRow = Repository;
