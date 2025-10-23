/**
 * Database types for proposal_templates table
 * Generated: 2024-12-13T12:00:02Z
 */

export interface ProposalTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  type: 'proposal' | 'sow' | 'contract';
  category: 'general' | 'web_development' | 'mobile_app' | 'ai_ml' | 'consulting' | 'maintenance';
  content: Record<string, any>;
  variables: any[];
  pricing_structure: Record<string, any>;
  status: 'active' | 'archived' | 'draft';
  is_public: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ProposalTemplateInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  type?: 'proposal' | 'sow' | 'contract';
  category?: 'general' | 'web_development' | 'mobile_app' | 'ai_ml' | 'consulting' | 'maintenance';
  content?: Record<string, any>;
  variables?: any[];
  pricing_structure?: Record<string, any>;
  status?: 'active' | 'archived' | 'draft';
  is_public?: boolean;
  version?: number;
}

export interface ProposalTemplateUpdate {
  name?: string;
  description?: string | null;
  type?: 'proposal' | 'sow' | 'contract';
  category?: 'general' | 'web_development' | 'mobile_app' | 'ai_ml' | 'consulting' | 'maintenance';
  content?: Record<string, any>;
  variables?: any[];
  pricing_structure?: Record<string, any>;
  status?: 'active' | 'archived' | 'draft';
  is_public?: boolean;
  version?: number;
}

// Supabase query result type
export type ProposalTemplateRow = ProposalTemplate;

// Template variable interface
export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select type
  description?: string;
}

// Pricing structure interface
export interface PricingStructure {
  currency: string;
  milestones: Array<{
    name: string;
    description: string;
    amount: number;
    percentage?: number;
    dueDate?: string;
  }>;
  totalAmount: number;
  taxRate?: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}
