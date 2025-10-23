/**
 * Contract API functions
 * Handles all contract-related API operations
 */

import { supabase } from '@/lib/supabase';
import type { 
  Contract, 
  ContractInsert, 
  ContractUpdate,
  ContractTemplate,
  ContractTemplateInsert,
  ContractTemplateUpdate,
  ContractVersion,
  ContractVersionInsert,
  ContractSignature,
  ContractSignatureInsert
} from '@/types/database';

// =====================================================
// CONTRACT TEMPLATES API
// =====================================================

export const contractTemplatesApi = {
  // Get all templates for user
  async getTemplates(): Promise<ContractTemplate[]> {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get public templates
  async getPublicTemplates(): Promise<ContractTemplate[]> {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get template by ID
  async getTemplate(id: string): Promise<ContractTemplate | null> {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new template
  async createTemplate(template: ContractTemplateInsert): Promise<ContractTemplate> {
    const { data, error } = await supabase
      .from('contract_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update template
  async updateTemplate(id: string, updates: ContractTemplateUpdate): Promise<ContractTemplate> {
    const { data, error } = await supabase
      .from('contract_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete template
  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('contract_templates')
      .update({ status: 'deleted' })
      .eq('id', id);

    if (error) throw error;
  }
};

// =====================================================
// CONTRACTS API
// =====================================================

export const contractsApi = {
  // Get all contracts for user
  async getContracts(): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get contract by ID
  async getContract(id: string): Promise<Contract | null> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new contract
  async createContract(contract: ContractInsert): Promise<Contract> {
    const { data, error } = await supabase
      .from('contracts')
      .insert(contract)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update contract
  async updateContract(id: string, updates: ContractUpdate): Promise<Contract> {
    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete contract
  async deleteContract(id: string): Promise<void> {
    const { error } = await supabase
      .from('contracts')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
  },

  // Get contracts by status
  async getContractsByStatus(status: Contract['status']): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// =====================================================
// CONTRACT VERSIONS API
// =====================================================

export const contractVersionsApi = {
  // Get all versions for a contract
  async getContractVersions(contractId: string): Promise<ContractVersion[]> {
    const { data, error } = await supabase
      .from('contract_versions')
      .select('*')
      .eq('contract_id', contractId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get specific version
  async getVersion(contractId: string, versionNumber: number): Promise<ContractVersion | null> {
    const { data, error } = await supabase
      .from('contract_versions')
      .select('*')
      .eq('contract_id', contractId)
      .eq('version_number', versionNumber)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new version
  async createVersion(version: ContractVersionInsert): Promise<ContractVersion> {
    const { data, error } = await supabase
      .from('contract_versions')
      .insert(version)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get current version
  async getCurrentVersion(contractId: string): Promise<ContractVersion | null> {
    const { data, error } = await supabase
      .from('contract_versions')
      .select('*')
      .eq('contract_id', contractId)
      .eq('is_current', true)
      .single();

    if (error) throw error;
    return data;
  }
};

// =====================================================
// CONTRACT SIGNATURES API
// =====================================================

export const contractSignaturesApi = {
  // Get all signatures for a contract
  async getContractSignatures(contractId: string): Promise<ContractSignature[]> {
    const { data, error } = await supabase
      .from('contract_signatures')
      .select('*')
      .eq('contract_id', contractId)
      .order('signed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create signature
  async createSignature(signature: ContractSignatureInsert): Promise<ContractSignature> {
    const { data, error } = await supabase
      .from('contract_signatures')
      .insert(signature)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get signature by ID
  async getSignature(id: string): Promise<ContractSignature | null> {
    const { data, error } = await supabase
      .from('contract_signatures')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Check if user has signed contract
  async hasUserSigned(contractId: string, userEmail: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('contract_signatures')
      .select('id')
      .eq('contract_id', contractId)
      .eq('signer_email', userEmail)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return !!data;
  }
};

// =====================================================
// CONTRACT WORKFLOW API
// =====================================================

export const contractWorkflowApi = {
  // Send contract for signature
  async sendForSignature(contractId: string, clientEmail: string): Promise<void> {
    const { error } = await supabase
      .from('contracts')
      .update({ 
        status: 'pending_signature',
        client_email: clientEmail,
        updated_at: new Date().toISOString()
      })
      .eq('id', contractId);

    if (error) throw error;
  },

  // Mark contract as executed
  async markAsExecuted(contractId: string): Promise<void> {
    const { error } = await supabase
      .from('contracts')
      .update({ 
        status: 'executed',
        updated_at: new Date().toISOString()
      })
      .eq('id', contractId);

    if (error) throw error;
  },

  // Create contract from template
  async createFromTemplate(templateId: string, contractData: Partial<ContractInsert>): Promise<Contract> {
    // Get template
    const template = await contractTemplatesApi.getTemplate(templateId);
    if (!template) throw new Error('Template not found');

    // Create contract with template content
    const contract: ContractInsert = {
      ...contractData,
      template_id: templateId,
      content: template.template_content,
      contract_type: template.category,
    } as ContractInsert;

    return await contractsApi.createContract(contract);
  },

  // Generate contract PDF (placeholder - would integrate with PDF service)
  async generatePDF(contractId: string): Promise<string> {
    // This would integrate with a PDF generation service
    // For now, return a placeholder URL
    return `/api/contracts/${contractId}/pdf`;
  }
};
