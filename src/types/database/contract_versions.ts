/**
 * Database types for contract_versions table
 * Generated: 2024-12-20T12:00:01Z
 */

export interface ContractVersion {
  id: string;
  contract_id: string;
  user_id: string;
  version_number: number;
  content: string;
  change_summary: string | null;
  is_current: boolean;
  created_by_name: string | null;
  created_by_email: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContractVersionInsert {
  id?: string;
  contract_id: string;
  user_id: string;
  version_number: number;
  content: string;
  change_summary?: string | null;
  is_current?: boolean;
  created_by_name?: string | null;
  created_by_email?: string | null;
  metadata?: Record<string, any>;
}

export interface ContractVersionUpdate {
  version_number?: number;
  content?: string;
  change_summary?: string | null;
  is_current?: boolean;
  created_by_name?: string | null;
  created_by_email?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type ContractVersionRow = ContractVersion;
