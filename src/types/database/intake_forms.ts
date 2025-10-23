/**
 * Database types for intake_forms table
 * Generated: 2024-12-13T12:00:01Z
 */

export interface IntakeForm {
  id: string;
  user_id: string | null;
  
  // Contact Information
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  company_name: string | null;
  
  // Project Details
  project_name: string;
  project_type: 'web-app' | 'mobile-app' | 'e-commerce' | 'ai-integration' | 'data-analytics' | 'api-development' | 'custom-software' | 'other';
  project_description: string;
  
  // Requirements & Goals
  key_requirements: string;
  business_goals: string | null;
  success_metrics: string | null;
  
  // Timeline & Budget
  timeline: '1-2-weeks' | '1-month' | '2-3-months' | '3-6-months' | '6+months';
  budget_range: 'under-10k' | '10k-25k' | '25k-50k' | '50k-100k' | '100k+';
  budget_flexibility: 'fixed' | 'somewhat-flexible' | 'very-flexible' | null;
  
  // Technical Stack
  preferred_tech_stack: string[];
  existing_systems: string | null;
  integration_requirements: string | null;
  
  // AI Processing
  ai_qualification_score: number;
  ai_confidence_score: number;
  ai_insights: Record<string, any>;
  ai_recommendations: string | null;
  
  // Status & Workflow
  status: 'submitted' | 'under-review' | 'qualified' | 'disqualified' | 'scheduled' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Calendar Integration
  preferred_meeting_times: string[];
  timezone: string;
  meeting_scheduled_at: string | null;
  meeting_completed_at: string | null;
  
  // Flexible metadata
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface IntakeFormInsert {
  id?: string;
  user_id?: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone?: string | null;
  company_name?: string | null;
  project_name: string;
  project_type: 'web-app' | 'mobile-app' | 'e-commerce' | 'ai-integration' | 'data-analytics' | 'api-development' | 'custom-software' | 'other';
  project_description: string;
  key_requirements: string;
  business_goals?: string | null;
  success_metrics?: string | null;
  timeline: '1-2-weeks' | '1-month' | '2-3-months' | '3-6-months' | '6+months';
  budget_range: 'under-10k' | '10k-25k' | '25k-50k' | '50k-100k' | '100k+';
  budget_flexibility?: 'fixed' | 'somewhat-flexible' | 'very-flexible' | null;
  preferred_tech_stack?: string[];
  existing_systems?: string | null;
  integration_requirements?: string | null;
  ai_qualification_score?: number;
  ai_confidence_score?: number;
  ai_insights?: Record<string, any>;
  ai_recommendations?: string | null;
  status?: 'submitted' | 'under-review' | 'qualified' | 'disqualified' | 'scheduled' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  preferred_meeting_times?: string[];
  timezone?: string;
  meeting_scheduled_at?: string | null;
  meeting_completed_at?: string | null;
  metadata?: Record<string, any>;
}

export interface IntakeFormUpdate {
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string | null;
  company_name?: string | null;
  project_name?: string;
  project_type?: 'web-app' | 'mobile-app' | 'e-commerce' | 'ai-integration' | 'data-analytics' | 'api-development' | 'custom-software' | 'other';
  project_description?: string;
  key_requirements?: string;
  business_goals?: string | null;
  success_metrics?: string | null;
  timeline?: '1-2-weeks' | '1-month' | '2-3-months' | '3-6-months' | '6+months';
  budget_range?: 'under-10k' | '10k-25k' | '25k-50k' | '50k-100k' | '100k+';
  budget_flexibility?: 'fixed' | 'somewhat-flexible' | 'very-flexible' | null;
  preferred_tech_stack?: string[];
  existing_systems?: string | null;
  integration_requirements?: string | null;
  ai_qualification_score?: number;
  ai_confidence_score?: number;
  ai_insights?: Record<string, any>;
  ai_recommendations?: string | null;
  status?: 'submitted' | 'under-review' | 'qualified' | 'disqualified' | 'scheduled' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  preferred_meeting_times?: string[];
  timezone?: string;
  meeting_scheduled_at?: string | null;
  meeting_completed_at?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type IntakeFormRow = IntakeForm;
