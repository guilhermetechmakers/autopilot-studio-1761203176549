/**
 * Database types for contracts table
 * Generated: 2024-12-20T12:00:01Z
 */

export interface Contract {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  description: string | null;
  content: string;
  status: 'draft' | 'pending_review' | 'pending_signature' | 'signed' | 'executed' | 'cancelled' | 'expired';
  client_email: string | null;
  client_name: string | null;
  client_company: string | null;
  contract_type: 'general' | 'nda' | 'sow' | 'msa' | 'custom';
  effective_date: string | null;
  expiration_date: string | null;
  current_version: number;
  is_negotiable: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContractInsert {
  id?: string;
  user_id: string;
  template_id?: string | null;
  title: string;
  description?: string | null;
  content: string;
  status?: 'draft' | 'pending_review' | 'pending_signature' | 'signed' | 'executed' | 'cancelled' | 'expired';
  client_email?: string | null;
  client_name?: string | null;
  client_company?: string | null;
  contract_type?: 'general' | 'nda' | 'sow' | 'msa' | 'custom';
  effective_date?: string | null;
  expiration_date?: string | null;
  current_version?: number;
  is_negotiable?: boolean;
  metadata?: Record<string, any>;
}

export interface ContractUpdate {
  title?: string;
  description?: string | null;
  content?: string;
  status?: 'draft' | 'pending_review' | 'pending_signature' | 'signed' | 'executed' | 'cancelled' | 'expired';
  client_email?: string | null;
  client_name?: string | null;
  client_company?: string | null;
  contract_type?: 'general' | 'nda' | 'sow' | 'msa' | 'custom';
  effective_date?: string | null;
  expiration_date?: string | null;
  current_version?: number;
  is_negotiable?: boolean;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type ContractRow = Contract;
