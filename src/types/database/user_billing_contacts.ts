/**
 * Database types for user_billing_contacts table
 * Generated: 2024-10-13T12:00:00Z
 */

export interface UserBillingContact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  is_primary: boolean;
  tax_id: string | null;
  payment_method_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserBillingContactInsert {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string;
  is_primary?: boolean;
  tax_id?: string | null;
  payment_method_id?: string | null;
}

export interface UserBillingContactUpdate {
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string;
  is_primary?: boolean;
  tax_id?: string | null;
  payment_method_id?: string | null;
}

// Supabase query result type
export type UserBillingContactRow = UserBillingContact;
