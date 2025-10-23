/**
 * React Query hooks for intake forms and AI scoring
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { intakeApi } from '@/api/intake';
import type { IntakeFormInsert, IntakeFormUpdate } from '@/types/database/intake_forms';
import type { IntakeScoreUpdate } from '@/types/database/intake_scores';

// Query keys
export const intakeKeys = {
  all: ['intake'] as const,
  forms: () => [...intakeKeys.all, 'forms'] as const,
  form: (id: string) => [...intakeKeys.forms(), id] as const,
  scores: () => [...intakeKeys.all, 'scores'] as const,
  score: (formId: string) => [...intakeKeys.scores(), formId] as const,
};

// Get all intake forms
export function useIntakeForms(userId?: string) {
  return useQuery({
    queryKey: intakeKeys.forms(),
    queryFn: () => intakeApi.getIntakeForms(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single intake form
export function useIntakeForm(id: string) {
  return useQuery({
    queryKey: intakeKeys.form(id),
    queryFn: () => intakeApi.getIntakeForm(id),
    enabled: !!id,
  });
}

// Get intake score
export function useIntakeScore(formId: string) {
  return useQuery({
    queryKey: intakeKeys.score(formId),
    queryFn: () => intakeApi.getIntakeScore(formId),
    enabled: !!formId,
  });
}

// Create intake form
export function useCreateIntakeForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IntakeFormInsert) => intakeApi.createIntakeForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.forms() });
      toast.success('Intake form created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create intake form: ${error.message}`);
    },
  });
}

// Submit intake form with AI processing
export function useSubmitIntakeForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IntakeFormInsert) => intakeApi.submitIntakeForm(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.forms() });
      queryClient.invalidateQueries({ queryKey: intakeKeys.scores() });
      
      const { score } = result;
      const scoreText = score.overall_score >= 70 ? 'qualified' : 'needs review';
      
      toast.success(`Intake form submitted! AI Score: ${score.overall_score}/100 (${scoreText})`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit intake form: ${error.message}`);
    },
  });
}

// Update intake form
export function useUpdateIntakeForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IntakeFormUpdate }) =>
      intakeApi.updateIntakeForm(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.form(id) });
      queryClient.invalidateQueries({ queryKey: intakeKeys.forms() });
      toast.success('Intake form updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update intake form: ${error.message}`);
    },
  });
}

// Delete intake form
export function useDeleteIntakeForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => intakeApi.deleteIntakeForm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.forms() });
      queryClient.removeQueries({ queryKey: intakeKeys.form(id) });
      toast.success('Intake form deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete intake form: ${error.message}`);
    },
  });
}

// Update intake score
export function useUpdateIntakeScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IntakeScoreUpdate }) =>
      intakeApi.updateIntakeScore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.scores() });
      toast.success('Intake score updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update intake score: ${error.message}`);
    },
  });
}

// Score intake form (re-score existing form)
export function useScoreIntakeForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, formData }: { formId: string; formData: IntakeFormInsert }) =>
      intakeApi.scoreIntakeForm(formId, formData),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.form(formId) });
      queryClient.invalidateQueries({ queryKey: intakeKeys.score(formId) });
      queryClient.invalidateQueries({ queryKey: intakeKeys.forms() });
      toast.success('Intake form re-scored successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to score intake form: ${error.message}`);
    },
  });
}
