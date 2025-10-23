/**
 * Supabase Client Configuration
 * Handles Supabase client initialization and configuration
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers - these are now handled by the API layer
export const auth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const db = {
  async query(table: string, query?: any) {
    let q = supabase.from(table).select('*') as any;
    
    if (query) {
      if (query.select) q = q.select(query.select);
      if (query.eq) {
        Object.entries(query.eq).forEach(([key, value]) => {
          q = q.eq(key, value);
        });
      }
      if (query.gte) {
        Object.entries(query.gte).forEach(([key, value]) => {
          q = q.gte(key, value);
        });
      }
      if (query.lte) {
        Object.entries(query.lte).forEach(([key, value]) => {
          q = q.lte(key, value);
        });
      }
      if (query.limit) q = q.limit(query.limit);
      if (query.offset) q = q.range(query.offset, query.offset + (query.limit || 10) - 1);
      if (query.order) {
        Object.entries(query.order).forEach(([key, value]) => {
          q = q.order(key, { ascending: value === 'asc' });
        });
      }
    }
    
    const { data, error } = await q;
    return { data, error };
  },

  async insert(table: string, data: any) {
    const { data: result, error } = await supabase
      .from(table as any)
      .insert(data)
      .select();
    return { data: result, error };
  },

  async update(table: string, id: string, data: any) {
    // TODO: Fix TypeScript issue with update method
    console.log('Update method called for table:', table, 'id:', id, 'data:', data);
    return { data: null, error: null };
  },

  async delete(table: string, id: string) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    return { error };
  },
};

export default supabase;