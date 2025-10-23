/**
 * API functions for proposal management
 * Handles CRUD operations for proposals and proposal templates
 */

import { supabase } from '@/lib/supabase';
import type { 
  ProposalInsert, 
  ProposalUpdate,
  ProposalTemplateInsert,
  ProposalTemplateUpdate
} from '@/types/database';

// =====================================================
// PROPOSAL TEMPLATES API
// =====================================================

export const proposalTemplatesApi = {
  // Get all templates for a user
  async getTemplates(userId: string, filters?: {
    type?: string;
    category?: string;
    status?: string;
    includePublic?: boolean;
  }) {
    let query = supabase
      .from('proposal_templates')
      .select('*')
      .eq('user_id', userId);

    if (filters?.includePublic) {
      query = supabase
        .from('proposal_templates')
        .select('*')
        .or(`user_id.eq.${userId},is_public.eq.true`);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  // Get a single template by ID
  async getTemplate(id: string) {
    const { data, error } = await supabase
      .from('proposal_templates')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create a new template
  async createTemplate(template: ProposalTemplateInsert) {
    const { data, error } = await supabase
      .from('proposal_templates')
      .insert(template)
      .select()
      .single();

    return { data, error };
  },

  // Update a template
  async updateTemplate(id: string, updates: ProposalTemplateUpdate) {
    const { data, error } = await supabase
      .from('proposal_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete a template
  async deleteTemplate(id: string) {
    const { error } = await supabase
      .from('proposal_templates')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Duplicate a template
  async duplicateTemplate(id: string, newName: string) {
    // First get the original template
    const { data: original, error: fetchError } = await this.getTemplate(id);
    if (fetchError || !original) {
      return { data: null, error: fetchError };
    }

    // Create a copy with new name and reset metadata
    const duplicate: ProposalTemplateInsert = {
      ...original,
      name: newName,
      version: 1,
      status: 'draft',
      is_public: false,
    };

    return await this.createTemplate(duplicate);
  },
};

// =====================================================
// PROPOSALS API
// =====================================================

export const proposalsApi = {
  // Get all proposals for a user
  async getProposals(userId: string, filters?: {
    status?: string;
    type?: string;
    clientName?: string;
  }) {
    let query = supabase
      .from('proposals')
      .select(`
        *,
        proposal_templates (
          id,
          name,
          type,
          category
        )
      `)
      .eq('user_id', userId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.clientName) {
      query = query.ilike('client_name', `%${filters.clientName}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  // Get a single proposal by ID
  async getProposal(id: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        proposal_templates (
          id,
          name,
          type,
          category,
          content,
          variables,
          pricing_structure
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create a new proposal
  async createProposal(proposal: ProposalInsert) {
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposal)
      .select(`
        *,
        proposal_templates (
          id,
          name,
          type,
          category
        )
      `)
      .single();

    return { data, error };
  },

  // Update a proposal
  async updateProposal(id: string, updates: ProposalUpdate) {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        proposal_templates (
          id,
          name,
          type,
          category
        )
      `)
      .single();

    return { data, error };
  },

  // Delete a proposal
  async deleteProposal(id: string) {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Generate proposal from template
  async generateFromTemplate(templateId: string, variables: Record<string, any>, clientInfo: {
    name: string;
    email?: string;
    company?: string;
  }) {
    // Get the template
    const { data: template, error: templateError } = await proposalTemplatesApi.getTemplate(templateId);
    if (templateError || !template) {
      return { data: null, error: templateError };
    }

    // Generate content by replacing variables
    const generatedContent = this.replaceVariables(template.content, variables);
    const generatedPricing = this.replaceVariables(template.pricing_structure, variables);

    // Create the proposal
    const proposal: ProposalInsert = {
      user_id: template.user_id, // Get user_id from template
      template_id: templateId,
      title: this.replaceVariables(template.name, variables),
      type: template.type,
      client_name: clientInfo.name,
      client_email: clientInfo.email,
      client_company: clientInfo.company,
      content: generatedContent,
      variables,
      pricing: generatedPricing,
      status: 'draft',
    };

    return await this.createProposal(proposal);
  },

  // Send proposal for review
  async sendProposal(id: string) {
    const { data, error } = await supabase
      .from('proposals')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Add redline to proposal
  async addRedline(id: string, redline: any) {
    const { data: proposal, error: fetchError } = await this.getProposal(id);
    if (fetchError || !proposal) {
      return { data: null, error: fetchError };
    }

    const updatedRedlines = [...(proposal.redlines || []), {
      ...redline,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }];

    return await this.updateProposal(id, {
      redlines: updatedRedlines,
      status: 'negotiating',
    });
  },

  // Add comment to proposal
  async addComment(id: string, comment: any) {
    const { data: proposal, error: fetchError } = await this.getProposal(id);
    if (fetchError || !proposal) {
      return { data: null, error: fetchError };
    }

    const updatedComments = [...(proposal.comments || []), {
      ...comment,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }];

    return await this.updateProposal(id, {
      comments: updatedComments,
    });
  },

  // Helper function to replace variables in content
  replaceVariables(content: any, variables: Record<string, any>): any {
    if (typeof content === 'string') {
      return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] || match;
      });
    }

    if (Array.isArray(content)) {
      return content.map(item => this.replaceVariables(item, variables));
    }

    if (typeof content === 'object' && content !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(content)) {
        result[key] = this.replaceVariables(value, variables);
      }
      return result;
    }

    return content;
  },
};

// =====================================================
// E-SIGNATURE API (Placeholder)
// =====================================================

export const eSignatureApi = {
  // Initiate e-signature process
  async initiateSignature(_proposalId: string, signers: Array<{ email: string; name: string }>) {
    // This would integrate with DocuSign, HelloSign, or Adobe Sign
    // For now, return a placeholder response
    return {
      data: {
        envelope_id: `env_${crypto.randomUUID()}`,
        status: 'sent',
        signers: signers.map(signer => ({
          ...signer,
          status: 'pending',
        })),
      },
      error: null,
    };
  },

  // Get signature status
  async getSignatureStatus(_envelopeId: string) {
    // This would check the e-signature provider for status
    return {
      data: {
        status: 'pending',
        completed_at: null,
      },
      error: null,
    };
  },

  // Handle signature webhook
  async handleSignatureWebhook(_webhookData: any) {
    // This would process webhook data from the e-signature provider
    // and update the proposal status accordingly
    return { data: null, error: null };
  },
};
