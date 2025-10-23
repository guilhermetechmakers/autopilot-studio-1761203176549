/**
 * Database types for contract_signatures table
 * Generated: 2024-12-20T12:00:01Z
 */

export interface ContractSignature {
  id: string;
  contract_id: string;
  user_id: string;
  signer_name: string;
  signer_email: string;
  signer_role: 'client' | 'provider' | 'witness' | 'notary';
  signature_data: string | null;
  signature_method: 'digital' | 'electronic' | 'wet_signature';
  ip_address: string | null;
  user_agent: string | null;
  signed_at: string;
  is_legally_binding: boolean;
  compliance_metadata: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContractSignatureInsert {
  id?: string;
  contract_id: string;
  user_id: string;
  signer_name: string;
  signer_email: string;
  signer_role?: 'client' | 'provider' | 'witness' | 'notary';
  signature_data?: string | null;
  signature_method?: 'digital' | 'electronic' | 'wet_signature';
  ip_address?: string | null;
  user_agent?: string | null;
  signed_at?: string;
  is_legally_binding?: boolean;
  compliance_metadata?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ContractSignatureUpdate {
  signer_name?: string;
  signer_email?: string;
  signer_role?: 'client' | 'provider' | 'witness' | 'notary';
  signature_data?: string | null;
  signature_method?: 'digital' | 'electronic' | 'wet_signature';
  ip_address?: string | null;
  user_agent?: string | null;
  signed_at?: string;
  is_legally_binding?: boolean;
  compliance_metadata?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type ContractSignatureRow = ContractSignature;
