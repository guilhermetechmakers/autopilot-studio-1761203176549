/**
 * Database types for contract_templates table
 * Generated: 2024-12-20T12:00:01Z
 */

export interface ContractTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: 'general' | 'nda' | 'sow' | 'msa' | 'custom';
  template_content: string;
  variables: Record<string, any>;
  status: 'active' | 'archived' | 'deleted';
  is_public: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContractTemplateInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  category?: 'general' | 'nda' | 'sow' | 'msa' | 'custom';
  template_content: string;
  variables?: Record<string, any>;
  status?: 'active' | 'archived' | 'deleted';
  is_public?: boolean;
  metadata?: Record<string, any>;
}

export interface ContractTemplateUpdate {
  name?: string;
  description?: string | null;
  category?: 'general' | 'nda' | 'sow' | 'msa' | 'custom';
  template_content?: string;
  variables?: Record<string, any>;
  status?: 'active' | 'archived' | 'deleted';
  is_public?: boolean;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type ContractTemplateRow = ContractTemplate;
