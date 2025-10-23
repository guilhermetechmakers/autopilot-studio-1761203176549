/**
 * React Query hooks for email verification
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { verifyEmail, resendEmailVerification } from '@/api/auth';

/**
 * Hook for verifying email with token
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate auth queries to refresh user state
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        toast.success('Email verified successfully!');
      } else {
        toast.error(response.message || 'Email verification failed');
      }
    },
    onError: (error) => {
      console.error('Email verification error:', error);
      toast.error('An unexpected error occurred during verification');
    },
  });
}

/**
 * Hook for resending verification email
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: resendEmailVerification,
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Verification email sent! Check your inbox.');
      } else {
        toast.error(response.message || 'Failed to resend verification email');
      }
    },
    onError: (error) => {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email');
    },
  });
}