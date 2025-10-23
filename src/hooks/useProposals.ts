/**
 * React Query hooks for proposal management
 * Provides data fetching and mutation hooks for proposals and templates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { 
  proposalTemplatesApi, 
  proposalsApi, 
  eSignatureApi 
} from '@/api/proposals';
import type { 
  ProposalTemplateInsert, 
  ProposalTemplateUpdate,
  ProposalInsert,
  ProposalUpdate
} from '@/types/database';

// =====================================================
// PROPOSAL TEMPLATES HOOKS
// =====================================================

export const useProposalTemplates = (filters?: {
  type?: string;
  category?: string;
  status?: string;
  includePublic?: boolean;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['proposal-templates', user?.id, filters],
    queryFn: () => proposalTemplatesApi.getTemplates(user!.id, filters),
    enabled: !!user,
  });
};

export const useProposalTemplate = (id: string) => {
  return useQuery({
    queryKey: ['proposal-template', id],
    queryFn: () => proposalTemplatesApi.getTemplate(id),
    enabled: !!id,
  });
};

export const useCreateProposalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: ProposalTemplateInsert) => 
      proposalTemplatesApi.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-templates'] });
      toast.success('Template created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create template');
    },
  });
};

export const useUpdateProposalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProposalTemplateUpdate }) =>
      proposalTemplatesApi.updateTemplate(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-templates'] });
      queryClient.invalidateQueries({ queryKey: ['proposal-template', variables.id] });
      toast.success('Template updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update template');
    },
  });
};

export const useDeleteProposalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalTemplatesApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-templates'] });
      toast.success('Template deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete template');
    },
  });
};

export const useDuplicateProposalTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) =>
      proposalTemplatesApi.duplicateTemplate(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-templates'] });
      toast.success('Template duplicated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to duplicate template');
    },
  });
};

// =====================================================
// PROPOSALS HOOKS
// =====================================================

export const useProposals = (filters?: {
  status?: string;
  type?: string;
  clientName?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['proposals', user?.id, filters],
    queryFn: () => proposalsApi.getProposals(user!.id, filters),
    enabled: !!user,
  });
};

export const useProposal = (id: string) => {
  return useQuery({
    queryKey: ['proposal', id],
    queryFn: () => proposalsApi.getProposal(id),
    enabled: !!id,
  });
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposal: ProposalInsert) => 
      proposalsApi.createProposal(proposal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposal created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create proposal');
    },
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProposalUpdate }) =>
      proposalsApi.updateProposal(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', variables.id] });
      toast.success('Proposal updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update proposal');
    },
  });
};

export const useDeleteProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsApi.deleteProposal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposal deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete proposal');
    },
  });
};

export const useGenerateFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      templateId, 
      variables, 
      clientInfo 
    }: { 
      templateId: string; 
      variables: Record<string, any>; 
      clientInfo: { name: string; email?: string; company?: string; } 
    }) => proposalsApi.generateFromTemplate(templateId, variables, clientInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposal generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate proposal');
    },
  });
};

export const useSendProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsApi.sendProposal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposal sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send proposal');
    },
  });
};

export const useAddRedline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, redline }: { id: string; redline: any }) =>
      proposalsApi.addRedline(id, redline),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal', variables.id] });
      toast.success('Redline added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add redline');
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: any }) =>
      proposalsApi.addComment(id, comment),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal', variables.id] });
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
};

// =====================================================
// E-SIGNATURE HOOKS
// =====================================================

export const useInitiateSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      proposalId, 
      signers 
    }: { 
      proposalId: string; 
      signers: Array<{ email: string; name: string }> 
    }) => eSignatureApi.initiateSignature(proposalId, signers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Signature process initiated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to initiate signature');
    },
  });
};

export const useSignatureStatus = (envelopeId: string) => {
  return useQuery({
    queryKey: ['signature-status', envelopeId],
    queryFn: () => eSignatureApi.getSignatureStatus(envelopeId),
    enabled: !!envelopeId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
