/**
 * React Query hooks for contract operations
 * Provides data fetching and mutation hooks for contracts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  contractsApi, 
  contractTemplatesApi, 
  contractVersionsApi, 
  contractSignaturesApi,
  contractWorkflowApi 
} from '@/api/contracts';
import type { 
  Contract, 
  ContractInsert, 
  ContractUpdate,
  ContractTemplateUpdate
} from '@/types/database';

// =====================================================
// CONTRACT TEMPLATES HOOKS
// =====================================================

export function useContractTemplates() {
  return useQuery({
    queryKey: ['contract-templates'],
    queryFn: contractTemplatesApi.getTemplates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePublicTemplates() {
  return useQuery({
    queryKey: ['contract-templates', 'public'],
    queryFn: contractTemplatesApi.getPublicTemplates,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useContractTemplate(id: string) {
  return useQuery({
    queryKey: ['contract-templates', id],
    queryFn: () => contractTemplatesApi.getTemplate(id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractTemplatesApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      toast.success('Template created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create template');
      console.error('Create template error:', error);
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ContractTemplateUpdate }) =>
      contractTemplatesApi.updateTemplate(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      queryClient.invalidateQueries({ queryKey: ['contract-templates', id] });
      toast.success('Template updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update template');
      console.error('Update template error:', error);
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractTemplatesApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-templates'] });
      toast.success('Template deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete template');
      console.error('Delete template error:', error);
    },
  });
}

// =====================================================
// CONTRACTS HOOKS
// =====================================================

export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getContracts,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => contractsApi.getContract(id),
    enabled: !!id,
  });
}

export function useContractsByStatus(status: Contract['status']) {
  return useQuery({
    queryKey: ['contracts', 'status', status],
    queryFn: () => contractsApi.getContractsByStatus(status),
    enabled: !!status,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractsApi.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create contract');
      console.error('Create contract error:', error);
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ContractUpdate }) =>
      contractsApi.updateContract(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts', id] });
      toast.success('Contract updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update contract');
      console.error('Update contract error:', error);
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractsApi.deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract cancelled successfully');
    },
    onError: (error) => {
      toast.error('Failed to cancel contract');
      console.error('Delete contract error:', error);
    },
  });
}

// =====================================================
// CONTRACT VERSIONS HOOKS
// =====================================================

export function useContractVersions(contractId: string) {
  return useQuery({
    queryKey: ['contract-versions', contractId],
    queryFn: () => contractVersionsApi.getContractVersions(contractId),
    enabled: !!contractId,
  });
}

export function useContractVersion(contractId: string, versionNumber: number) {
  return useQuery({
    queryKey: ['contract-versions', contractId, versionNumber],
    queryFn: () => contractVersionsApi.getVersion(contractId, versionNumber),
    enabled: !!contractId && !!versionNumber,
  });
}

export function useCurrentVersion(contractId: string) {
  return useQuery({
    queryKey: ['contract-versions', contractId, 'current'],
    queryFn: () => contractVersionsApi.getCurrentVersion(contractId),
    enabled: !!contractId,
  });
}

export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractVersionsApi.createVersion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contract-versions', variables.contract_id] });
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.contract_id] });
      toast.success('New version created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create new version');
      console.error('Create version error:', error);
    },
  });
}

// =====================================================
// CONTRACT SIGNATURES HOOKS
// =====================================================

export function useContractSignatures(contractId: string) {
  return useQuery({
    queryKey: ['contract-signatures', contractId],
    queryFn: () => contractSignaturesApi.getContractSignatures(contractId),
    enabled: !!contractId,
  });
}

export function useCreateSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractSignaturesApi.createSignature,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contract-signatures', variables.contract_id] });
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.contract_id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract signed successfully');
    },
    onError: (error) => {
      toast.error('Failed to sign contract');
      console.error('Create signature error:', error);
    },
  });
}

export function useHasUserSigned(contractId: string, userEmail: string) {
  return useQuery({
    queryKey: ['contract-signatures', contractId, 'user-signed', userEmail],
    queryFn: () => contractSignaturesApi.hasUserSigned(contractId, userEmail),
    enabled: !!contractId && !!userEmail,
  });
}

// =====================================================
// CONTRACT WORKFLOW HOOKS
// =====================================================

export function useSendForSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, clientEmail }: { contractId: string; clientEmail: string }) =>
      contractWorkflowApi.sendForSignature(contractId, clientEmail),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract sent for signature');
    },
    onError: (error) => {
      toast.error('Failed to send contract for signature');
      console.error('Send for signature error:', error);
    },
  });
}

export function useMarkAsExecuted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractWorkflowApi.markAsExecuted,
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract marked as executed');
    },
    onError: (error) => {
      toast.error('Failed to mark contract as executed');
      console.error('Mark as executed error:', error);
    },
  });
}

export function useCreateFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, contractData }: { templateId: string; contractData: Partial<ContractInsert> }) =>
      contractWorkflowApi.createFromTemplate(templateId, contractData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract created from template');
    },
    onError: (error) => {
      toast.error('Failed to create contract from template');
      console.error('Create from template error:', error);
    },
  });
}

export function useGeneratePDF() {
  return useMutation({
    mutationFn: contractWorkflowApi.generatePDF,
    onSuccess: (pdfUrl) => {
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
      toast.success('PDF generated successfully');
    },
    onError: (error) => {
      toast.error('Failed to generate PDF');
      console.error('Generate PDF error:', error);
    },
  });
}
