/**
 * Database types for proposals table
 * Generated: 2024-12-13T12:00:03Z
 */

export interface Proposal {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  description: string | null;
  type: 'proposal' | 'sow' | 'contract';
  status: 'draft' | 'sent' | 'under_review' | 'negotiating' | 'approved' | 'rejected' | 'signed';
  client_name: string;
  client_email: string | null;
  client_company: string | null;
  content: Record<string, any>;
  variables: Record<string, any>;
  pricing: Record<string, any>;
  redlines: any[];
  comments: any[];
  version: number;
  signature_status: 'pending' | 'sent' | 'signed' | 'declined';
  signature_data: Record<string, any>;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
}

export interface ProposalInsert {
  id?: string;
  user_id: string;
  template_id?: string | null;
  title: string;
  description?: string | null;
  type?: 'proposal' | 'sow' | 'contract';
  status?: 'draft' | 'sent' | 'under_review' | 'negotiating' | 'approved' | 'rejected' | 'signed';
  client_name: string;
  client_email?: string | null;
  client_company?: string | null;
  content?: Record<string, any>;
  variables?: Record<string, any>;
  pricing?: Record<string, any>;
  redlines?: any[];
  comments?: any[];
  version?: number;
  signature_status?: 'pending' | 'sent' | 'signed' | 'declined';
  signature_data?: Record<string, any>;
  signed_at?: string | null;
  sent_at?: string | null;
}

export interface ProposalUpdate {
  title?: string;
  description?: string | null;
  type?: 'proposal' | 'sow' | 'contract';
  status?: 'draft' | 'sent' | 'under_review' | 'negotiating' | 'approved' | 'rejected' | 'signed';
  client_name?: string;
  client_email?: string | null;
  client_company?: string | null;
  content?: Record<string, any>;
  variables?: Record<string, any>;
  pricing?: Record<string, any>;
  redlines?: any[];
  comments?: any[];
  version?: number;
  signature_status?: 'pending' | 'sent' | 'signed' | 'declined';
  signature_data?: Record<string, any>;
  signed_at?: string | null;
  sent_at?: string | null;
}

// Supabase query result type
export type ProposalRow = Proposal;

// Redline interface
export interface Redline {
  id: string;
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content: string;
  author: string;
  created_at: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

// Comment interface
export interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
  position?: number;
  redline_id?: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

// Signature data interface
export interface SignatureData {
  provider: 'docusign' | 'hellosign' | 'adobe_sign';
  envelope_id?: string;
  document_id?: string;
  signers: Array<{
    email: string;
    name: string;
    status: 'pending' | 'signed' | 'declined';
    signed_at?: string;
  }>;
  completed_at?: string;
  declined_reason?: string;
}
