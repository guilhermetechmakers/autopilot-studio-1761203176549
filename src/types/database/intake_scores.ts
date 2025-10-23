/**
 * Database types for intake_scores table
 * Generated: 2024-12-13T12:00:01Z
 */

export interface IntakeScore {
  id: string;
  intake_form_id: string;
  
  // Scoring Categories
  budget_score: number;
  timeline_score: number;
  technical_complexity_score: number;
  business_impact_score: number;
  market_potential_score: number;
  
  // Overall Scores
  overall_score: number;
  confidence_level: number;
  
  // AI Analysis
  ai_analysis: Record<string, any>;
  risk_factors: string[];
  opportunity_factors: string[];
  
  // Recommendations
  recommended_approach: string | null;
  estimated_project_duration: string | null;
  suggested_team_size: number | null;
  next_steps: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface IntakeScoreInsert {
  id?: string;
  intake_form_id: string;
  budget_score?: number;
  timeline_score?: number;
  technical_complexity_score?: number;
  business_impact_score?: number;
  market_potential_score?: number;
  overall_score?: number;
  confidence_level?: number;
  ai_analysis?: Record<string, any>;
  risk_factors?: string[];
  opportunity_factors?: string[];
  recommended_approach?: string | null;
  estimated_project_duration?: string | null;
  suggested_team_size?: number | null;
  next_steps?: string[];
}

export interface IntakeScoreUpdate {
  budget_score?: number;
  timeline_score?: number;
  technical_complexity_score?: number;
  business_impact_score?: number;
  market_potential_score?: number;
  overall_score?: number;
  confidence_level?: number;
  ai_analysis?: Record<string, any>;
  risk_factors?: string[];
  opportunity_factors?: string[];
  recommended_approach?: string | null;
  estimated_project_duration?: string | null;
  suggested_team_size?: number | null;
  next_steps?: string[];
}

// Supabase query result type
export type IntakeScoreRow = IntakeScore;
