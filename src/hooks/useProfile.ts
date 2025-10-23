/**
 * React Query hooks for profile management
 * Provides data fetching, caching, and mutation capabilities for profile data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import {
  profileApi,
  billingApi,
  apiKeysApi,
  securityApi,
  connectedAppsApi,
  sessionsApi,
} from '@/api/profile';

// =====================================================
// Query Keys
// =====================================================

export const profileQueryKeys = {
  all: ['profile'] as const,
  profile: (userId: string) => [...profileQueryKeys.all, 'profile', userId] as const,
  billingContacts: (userId: string) => [...profileQueryKeys.all, 'billing', userId] as const,
  primaryBillingContact: (userId: string) => [...profileQueryKeys.all, 'billing', userId, 'primary'] as const,
  apiKeys: (userId: string) => [...profileQueryKeys.all, 'apiKeys', userId] as const,
  securitySettings: (userId: string) => [...profileQueryKeys.all, 'security', userId] as const,
  connectedApps: (userId: string) => [...profileQueryKeys.all, 'connectedApps', userId] as const,
  sessions: (userId: string) => [...profileQueryKeys.all, 'sessions', userId] as const,
};

// =====================================================
// User Profile Hooks
// =====================================================

export function useProfile() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: profileQueryKeys.profile(userId!),
    queryFn: () => profileApi.getProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: any) => profileApi.updateProfile(userId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile(userId!) });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useCreateProfile() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: any) => profileApi.createProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile(userId!) });
      toast.success('Profile created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create profile');
    },
  });
}

// =====================================================
// Billing Contacts Hooks
// =====================================================

export function useBillingContacts() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: profileQueryKeys.billingContacts(userId!),
    queryFn: () => billingApi.getBillingContacts(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePrimaryBillingContact() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: profileQueryKeys.primaryBillingContact(userId!),
    queryFn: () => billingApi.getPrimaryBillingContact(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBillingContact() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: any) => billingApi.createBillingContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.billingContacts(userId!) });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.primaryBillingContact(userId!) });
      toast.success('Billing contact created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create billing contact');
    },
  });
}

export function useUpdateBillingContact() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, updates }: { contactId: string; updates: any }) =>
      billingApi.updateBillingContact(contactId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.billingContacts(userId!) });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.primaryBillingContact(userId!) });
      toast.success('Billing contact updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update billing contact');
    },
  });
}

export function useDeleteBillingContact() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => billingApi.deleteBillingContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.billingContacts(userId!) });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.primaryBillingContact(userId!) });
      toast.success('Billing contact deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete billing contact');
    },
  });
}

export function useSetPrimaryBillingContact() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => billingApi.setPrimaryBillingContact(userId!, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.billingContacts(userId!) });
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.primaryBillingContact(userId!) });
      toast.success('Primary billing contact updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to set primary billing contact');
    },
  });
}

// =====================================================
// API Keys Hooks
// =====================================================

export function useApiKeys() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: profileQueryKeys.apiKeys(userId!),
    queryFn: () => apiKeysApi.getApiKeys(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateApiKey() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apiKey: any) => apiKeysApi.createApiKey(apiKey),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.apiKeys(userId!) });
      toast.success('API key created successfully');
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create API key');
    },
  });
}

export function useUpdateApiKey() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ apiKeyId, updates }: { apiKeyId: string; updates: any }) =>
      apiKeysApi.updateApiKey(apiKeyId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.apiKeys(userId!) });
      toast.success('API key updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update API key');
    },
  });
}

export function useDeleteApiKey() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apiKeyId: string) => apiKeysApi.deleteApiKey(apiKeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.apiKeys(userId!) });
      toast.success('API key deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete API key');
    },
  });
}

export function useRegenerateApiKey() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apiKeyId: string) => apiKeysApi.regenerateApiKey(apiKeyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.apiKeys(userId!) });
      toast.success('API key regenerated successfully');
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to regenerate API key');
    },
  });
}

// =====================================================
// Security Settings Hooks
// =====================================================

export function useSecuritySettings() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: profileQueryKeys.securitySettings(userId!),
    queryFn: () => securityApi.getSecuritySettings(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSecuritySettings() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: any) => securityApi.updateSecuritySettings(userId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.securitySettings(userId!) });
      toast.success('Security settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update security settings');
    },
  });
}

export function useEnable2FA() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ secret, backupCodes }: { secret: string; backupCodes: string[] }) =>
      securityApi.enable2FA(userId!, secret, backupCodes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.securitySettings(userId!) });
      toast.success('Two-factor authentication enabled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to enable two-factor authentication');
    },
  });
}

export function useDisable2FA() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => securityApi.disable2FA(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.securitySettings(userId!) });
      toast.success('Two-factor authentication disabled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to disable two-factor authentication');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (newPassword: string) => securityApi.changePassword(newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}

// =====================================================
// Connected Apps Hooks
// =====================================================

export function useConnectedApps() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: profileQueryKeys.connectedApps(userId!),
    queryFn: () => connectedAppsApi.getConnectedApps(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateConnectedApp() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (app: any) => connectedAppsApi.createConnectedApp(app),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.connectedApps(userId!) });
      toast.success('Connected app created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create connected app');
    },
  });
}

export function useUpdateConnectedApp() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, updates }: { appId: string; updates: any }) =>
      connectedAppsApi.updateConnectedApp(appId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.connectedApps(userId!) });
      toast.success('Connected app updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update connected app');
    },
  });
}

export function useDeleteConnectedApp() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appId: string) => connectedAppsApi.deleteConnectedApp(appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.connectedApps(userId!) });
      toast.success('Connected app deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete connected app');
    },
  });
}

export function useSyncConnectedApp() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appId: string) => connectedAppsApi.syncConnectedApp(appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.connectedApps(userId!) });
      toast.success('Connected app synced successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to sync connected app');
    },
  });
}

// =====================================================
// Sessions Hooks
// =====================================================

export function useSessions() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: profileQueryKeys.sessions(userId!),
    queryFn: () => sessionsApi.getSessions(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useTerminateSession() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.terminateSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.sessions(userId!) });
      toast.success('Session terminated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to terminate session');
    },
  });
}

export function useTerminateAllOtherSessions() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currentSessionId: string) => sessionsApi.terminateAllOtherSessions(userId!, currentSessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.sessions(userId!) });
      toast.success('All other sessions terminated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to terminate all other sessions');
    },
  });
}
