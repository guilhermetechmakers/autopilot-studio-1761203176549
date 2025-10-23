/**
 * Profile validation schemas using Zod
 * Provides form validation for all profile-related forms
 */

import { z } from 'zod';

// User Profile validation
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  role: z.enum(['admin', 'owner', 'pm', 'dev', 'client', 'billing'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  preferences: z.record(z.any()).optional(),
});

// Billing Contact validation
export const billingContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  address_line1: z.string().max(200, 'Address line 1 must be less than 200 characters').optional(),
  address_line2: z.string().max(200, 'Address line 2 must be less than 200 characters').optional(),
  city: z.string().max(100, 'City must be less than 100 characters').optional(),
  state: z.string().max(100, 'State must be less than 100 characters').optional(),
  postal_code: z.string().max(20, 'Postal code must be less than 20 characters').optional(),
  country: z.string().min(2, 'Country code is required').max(2, 'Country code must be 2 characters'),
  is_primary: z.boolean().optional(),
  tax_id: z.string().max(50, 'Tax ID must be less than 50 characters').optional(),
});

// API Key validation
export const apiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(100, 'Name must be less than 100 characters'),
  permissions: z.array(z.string()).min(1, 'At least one permission must be selected'),
  expires_at: z.string().datetime().optional(),
});

// Security Settings validation
export const securitySettingsSchema = z.object({
  two_factor_enabled: z.boolean().optional(),
  require_2fa_for_api: z.boolean().optional(),
  session_timeout_minutes: z.number().min(15, 'Session timeout must be at least 15 minutes').max(1440, 'Session timeout cannot exceed 24 hours'),
  max_concurrent_sessions: z.number().min(1, 'Must allow at least 1 session').max(20, 'Cannot exceed 20 concurrent sessions'),
  data_retention_days: z.number().min(30, 'Data retention must be at least 30 days').max(3650, 'Data retention cannot exceed 10 years'),
  allow_analytics: z.boolean().optional(),
  allow_marketing_emails: z.boolean().optional(),
});

// Password change validation
export const passwordChangeSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

// 2FA setup validation
export const twoFactorSetupSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/, 'Verification code must contain only numbers'),
});

// Connected App validation
export const connectedAppSchema = z.object({
  app_name: z.string().min(1, 'App name is required').max(100, 'App name must be less than 100 characters'),
  app_type: z.enum(['oauth', 'api_key', 'webhook'], {
    errorMap: () => ({ message: 'Please select a valid app type' })
  }),
  provider: z.string().min(1, 'Provider is required').max(50, 'Provider must be less than 50 characters'),
  scopes: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
});

// Export types
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type BillingContactFormData = z.infer<typeof billingContactSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type TwoFactorSetupFormData = z.infer<typeof twoFactorSetupSchema>;
export type ConnectedAppFormData = z.infer<typeof connectedAppSchema>;
