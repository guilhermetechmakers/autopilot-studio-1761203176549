/**
 * Profile API functions
 * Handles all profile-related API calls with Supabase integration
 */

import { supabase } from '@/lib/supabase';

// =====================================================
// User Profile API
// =====================================================

export const profileApi = {
  // Get user profile
  async getProfile(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }

    return data;
  },

  // Create user profile
  async createProfile(profile: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw new Error('Failed to create profile');
    }

    return data;
  },
};

// =====================================================
// Billing Contacts API
// =====================================================

export const billingApi = {
  // Get all billing contacts for user
  async getBillingContacts(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_billing_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching billing contacts:', error);
      return [];
    }

    return data || [];
  },

  // Get primary billing contact
  async getPrimaryBillingContact(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('user_billing_contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error) {
      console.error('Error fetching primary billing contact:', error);
      return null;
    }

    return data;
  },

  // Create billing contact
  async createBillingContact(contact: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_billing_contacts')
      .insert(contact)
      .select()
      .single();

    if (error) {
      console.error('Error creating billing contact:', error);
      throw new Error('Failed to create billing contact');
    }

    return data;
  },

  // Update billing contact
  async updateBillingContact(contactId: string, updates: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_billing_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      console.error('Error updating billing contact:', error);
      throw new Error('Failed to update billing contact');
    }

    return data;
  },

  // Delete billing contact
  async deleteBillingContact(contactId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_billing_contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      console.error('Error deleting billing contact:', error);
      throw new Error('Failed to delete billing contact');
    }

    return true;
  },

  // Set primary billing contact
  async setPrimaryBillingContact(userId: string, contactId: string): Promise<boolean> {
    // First, unset all primary contacts
    await (supabase as any)
      .from('user_billing_contacts')
      .update({ is_primary: false })
      .eq('user_id', userId);

    // Then set the selected contact as primary
    const { error } = await (supabase as any)
      .from('user_billing_contacts')
      .update({ is_primary: true })
      .eq('id', contactId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting primary billing contact:', error);
      throw new Error('Failed to set primary billing contact');
    }

    return true;
  },
};

// =====================================================
// API Keys API
// =====================================================

export const apiKeysApi = {
  // Get all API keys for user
  async getApiKeys(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return [];
    }

    return data || [];
  },

  // Create API key
  async createApiKey(apiKey: any): Promise<{ apiKey: any; keyValue: string } | null> {
    // Generate a secure API key
    const keyValue = `ask_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyValue));
    const keyHashString = Array.from(new Uint8Array(keyHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const keyPrefix = keyValue.substring(0, 8);

    const apiKeyData = {
      ...apiKey,
      key_hash: keyHashString,
      key_prefix: keyPrefix,
    };

    const { data, error } = await (supabase as any)
      .from('user_api_keys')
      .insert(apiKeyData)
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      throw new Error('Failed to create API key');
    }

    return { apiKey: data, keyValue };
  },

  // Update API key
  async updateApiKey(apiKeyId: string, updates: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_api_keys')
      .update(updates)
      .eq('id', apiKeyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating API key:', error);
      throw new Error('Failed to update API key');
    }

    return data;
  },

  // Delete API key
  async deleteApiKey(apiKeyId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('id', apiKeyId);

    if (error) {
      console.error('Error deleting API key:', error);
      throw new Error('Failed to delete API key');
    }

    return true;
  },

  // Regenerate API key
  async regenerateApiKey(apiKeyId: string): Promise<{ apiKey: any; keyValue: string } | null> {
    const keyValue = `ask_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyValue));
    const keyHashString = Array.from(new Uint8Array(keyHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const keyPrefix = keyValue.substring(0, 8);

    const { data, error } = await (supabase as any)
      .from('user_api_keys')
      .update({
        key_hash: keyHashString,
        key_prefix: keyPrefix,
        last_used_at: null,
      })
      .eq('id', apiKeyId)
      .select()
      .single();

    if (error) {
      console.error('Error regenerating API key:', error);
      throw new Error('Failed to regenerate API key');
    }

    return { apiKey: data, keyValue };
  },
};

// =====================================================
// Security Settings API
// =====================================================

export const securityApi = {
  // Get security settings
  async getSecuritySettings(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('user_security_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching security settings:', error);
      return null;
    }

    return data;
  },

  // Create security settings
  async createSecuritySettings(settings: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_security_settings')
      .insert(settings)
      .select()
      .single();

    if (error) {
      console.error('Error creating security settings:', error);
      throw new Error('Failed to create security settings');
    }

    return data;
  },

  // Update security settings
  async updateSecuritySettings(userId: string, updates: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_security_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating security settings:', error);
      throw new Error('Failed to update security settings');
    }

    return data;
  },

  // Enable 2FA
  async enable2FA(userId: string, secret: string, backupCodes: string[]): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('user_security_settings')
      .update({
        two_factor_enabled: true,
        two_factor_secret: secret,
        backup_codes: backupCodes,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error enabling 2FA:', error);
      throw new Error('Failed to enable 2FA');
    }

    return true;
  },

  // Disable 2FA
  async disable2FA(userId: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('user_security_settings')
      .update({
        two_factor_enabled: false,
        two_factor_secret: null,
        backup_codes: [],
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error disabling 2FA:', error);
      throw new Error('Failed to disable 2FA');
    }

    return true;
  },

  // Change password
  async changePassword(newPassword: string): Promise<boolean> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error changing password:', error);
      throw new Error('Failed to change password');
    }

    return true;
  },
};

// =====================================================
// Connected Apps API
// =====================================================

export const connectedAppsApi = {
  // Get all connected apps for user
  async getConnectedApps(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_connected_apps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connected apps:', error);
      return [];
    }

    return data || [];
  },

  // Create connected app
  async createConnectedApp(app: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_connected_apps')
      .insert(app)
      .select()
      .single();

    if (error) {
      console.error('Error creating connected app:', error);
      throw new Error('Failed to create connected app');
    }

    return data;
  },

  // Update connected app
  async updateConnectedApp(appId: string, updates: any): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('user_connected_apps')
      .update(updates)
      .eq('id', appId)
      .select()
      .single();

    if (error) {
      console.error('Error updating connected app:', error);
      throw new Error('Failed to update connected app');
    }

    return data;
  },

  // Delete connected app
  async deleteConnectedApp(appId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_connected_apps')
      .delete()
      .eq('id', appId);

    if (error) {
      console.error('Error deleting connected app:', error);
      throw new Error('Failed to delete connected app');
    }

    return true;
  },

  // Sync connected app
  async syncConnectedApp(appId: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('user_connected_apps')
      .update({
        last_sync_at: new Date().toISOString(),
        sync_status: 'success',
        sync_error: null,
      })
      .eq('id', appId);

    if (error) {
      console.error('Error syncing connected app:', error);
      throw new Error('Failed to sync connected app');
    }

    return true;
  },
};

// =====================================================
// Sessions API
// =====================================================

export const sessionsApi = {
  // Get all active sessions for user
  async getSessions(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_activity', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return data || [];
  },

  // Terminate session
  async terminateSession(sessionId: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) {
      console.error('Error terminating session:', error);
      throw new Error('Failed to terminate session');
    }

    return true;
  },

  // Terminate all other sessions
  async terminateAllOtherSessions(userId: string, currentSessionId: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .neq('id', currentSessionId);

    if (error) {
      console.error('Error terminating all other sessions:', error);
      throw new Error('Failed to terminate all other sessions');
    }

    return true;
  },
};
