/**
 * API functions for intake forms and AI scoring
 */

import { supabase } from '@/lib/supabase';
import type { IntakeFormInsert, IntakeFormUpdate, IntakeFormRow } from '@/types/database/intake_forms';
import type { IntakeScoreInsert, IntakeScoreUpdate, IntakeScoreRow } from '@/types/database/intake_scores';

// Intake Forms API
export const intakeApi = {
  // Create a new intake form
  async createIntakeForm(data: IntakeFormInsert): Promise<IntakeFormRow> {
    const { data: result, error } = await supabase
      .from('intake_forms')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create intake form: ${error.message}`);
    }

    return result;
  },

  // Get intake form by ID
  async getIntakeForm(id: string): Promise<IntakeFormRow> {
    const { data, error } = await supabase
      .from('intake_forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to get intake form: ${error.message}`);
    }

    return data;
  },

  // Get all intake forms for a user
  async getIntakeForms(userId?: string): Promise<IntakeFormRow[]> {
    let query = supabase
      .from('intake_forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get intake forms: ${error.message}`);
    }

    return data || [];
  },

  // Update intake form
  async updateIntakeForm(id: string, data: IntakeFormUpdate): Promise<IntakeFormRow> {
    const { data: result, error } = await supabase
      .from('intake_forms')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update intake form: ${error.message}`);
    }

    return result;
  },

  // Delete intake form
  async deleteIntakeForm(id: string): Promise<void> {
    const { error } = await supabase
      .from('intake_forms')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete intake form: ${error.message}`);
    }
  },

  // Submit intake form with AI processing
  async submitIntakeForm(formData: IntakeFormInsert): Promise<{ form: IntakeFormRow; score: IntakeScoreRow }> {
    // Create the intake form
    const form = await this.createIntakeForm(formData);

    // Process with AI scoring
    const score = await this.scoreIntakeForm(form.id, formData);

    return { form, score };
  },

  // AI scoring for intake form
  async scoreIntakeForm(intakeFormId: string, formData: IntakeFormInsert): Promise<IntakeScoreRow> {
    // Simulate AI scoring - in production, this would call an AI service
    const scores = calculateAIScores(formData);
    
    const scoreData: IntakeScoreInsert = {
      intake_form_id: intakeFormId,
      ...scores
    };

    const { data: result, error } = await supabase
      .from('intake_scores')
      .insert(scoreData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create intake score: ${error.message}`);
    }

    // Update the intake form with AI scores
    await this.updateIntakeForm(intakeFormId, {
      ai_qualification_score: scores.overall_score,
      ai_confidence_score: scores.confidence_level,
      ai_insights: scores.ai_analysis,
      ai_recommendations: scores.recommended_approach,
      status: scores.overall_score >= 70 ? 'qualified' : 'under-review'
    });

    return result;
  },

  // Get intake score by form ID
  async getIntakeScore(intakeFormId: string): Promise<IntakeScoreRow | null> {
    const { data, error } = await supabase
      .from('intake_scores')
      .select('*')
      .eq('intake_form_id', intakeFormId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to get intake score: ${error.message}`);
    }

    return data;
  },

  // Update intake score
  async updateIntakeScore(id: string, data: IntakeScoreUpdate): Promise<IntakeScoreRow> {
    const { data: result, error } = await supabase
      .from('intake_scores')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update intake score: ${error.message}`);
    }

    return result;
  }
};

// AI Scoring Logic (simplified for demo)
function calculateAIScores(formData: IntakeFormInsert) {
  let budgetScore = 0;
  let timelineScore = 0;
  let technicalScore = 0;
  let businessScore = 0;
  let marketScore = 0;

  // Budget scoring
  switch (formData.budget_range) {
    case 'under-10k':
      budgetScore = 30;
      break;
    case '10k-25k':
      budgetScore = 50;
      break;
    case '25k-50k':
      budgetScore = 70;
      break;
    case '50k-100k':
      budgetScore = 85;
      break;
    case '100k+':
      budgetScore = 95;
      break;
  }

  // Timeline scoring
  switch (formData.timeline) {
    case '1-2-weeks':
      timelineScore = 20;
      break;
    case '1-month':
      timelineScore = 40;
      break;
    case '2-3-months':
      timelineScore = 70;
      break;
    case '3-6-months':
      timelineScore = 85;
      break;
    case '6+months':
      timelineScore = 90;
      break;
  }

  // Technical complexity scoring (based on project type and description)
  const techKeywords = ['ai', 'machine learning', 'blockchain', 'iot', 'microservices', 'scalable', 'real-time'];
  const description = formData.project_description.toLowerCase();
  const hasComplexTech = techKeywords.some(keyword => description.includes(keyword));
  
  switch (formData.project_type) {
    case 'ai-integration':
      technicalScore = 90;
      break;
    case 'data-analytics':
      technicalScore = 80;
      break;
    case 'api-development':
      technicalScore = 70;
      break;
    case 'web-app':
      technicalScore = hasComplexTech ? 75 : 60;
      break;
    case 'mobile-app':
      technicalScore = hasComplexTech ? 80 : 65;
      break;
    case 'e-commerce':
      technicalScore = 70;
      break;
    default:
      technicalScore = 50;
  }

  // Business impact scoring (based on requirements and goals)
  const businessKeywords = ['revenue', 'growth', 'efficiency', 'automation', 'roi', 'cost reduction'];
  const requirements = (formData.key_requirements + ' ' + (formData.business_goals || '')).toLowerCase();
  const hasBusinessImpact = businessKeywords.some(keyword => requirements.includes(keyword));
  businessScore = hasBusinessImpact ? 80 : 50;

  // Market potential scoring (based on project type and company size)
  const marketScores: Record<string, number> = {
    'ai-integration': 95,
    'data-analytics': 85,
    'e-commerce': 80,
    'web-app': 70,
    'mobile-app': 75,
    'api-development': 65,
    'custom-software': 60,
    'other': 50
  };
  marketScore = marketScores[formData.project_type] || 50;

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (budgetScore * 0.25) +
    (timelineScore * 0.20) +
    (technicalScore * 0.25) +
    (businessScore * 0.20) +
    (marketScore * 0.10)
  );

  // Calculate confidence level
  const confidenceLevel = Math.min(0.95, Math.max(0.3, overallScore / 100));

  // Generate AI analysis
  const aiAnalysis = {
    strengths: generateStrengths(budgetScore, timelineScore, technicalScore, businessScore, marketScore),
    concerns: generateConcerns(budgetScore, timelineScore, technicalScore, businessScore, marketScore),
    market_fit: marketScore >= 70 ? 'High' : marketScore >= 50 ? 'Medium' : 'Low',
    technical_feasibility: technicalScore >= 70 ? 'High' : technicalScore >= 50 ? 'Medium' : 'Low'
  };

  // Generate risk factors
  const riskFactors = [];
  if (budgetScore < 50) riskFactors.push('Limited budget may constrain project scope');
  if (timelineScore < 50) riskFactors.push('Aggressive timeline may impact quality');
  if (technicalScore > 80) riskFactors.push('High technical complexity requires experienced team');
  if (marketScore < 60) riskFactors.push('Limited market validation for this project type');

  // Generate opportunity factors
  const opportunityFactors = [];
  if (budgetScore >= 70) opportunityFactors.push('Adequate budget for comprehensive solution');
  if (timelineScore >= 70) opportunityFactors.push('Realistic timeline allows for proper development');
  if (businessScore >= 70) opportunityFactors.push('Clear business value and ROI potential');
  if (marketScore >= 80) opportunityFactors.push('Strong market demand for this solution');

  // Generate recommendations
  let recommendedApproach = '';
  if (overallScore >= 80) {
    recommendedApproach = 'High-priority lead. Recommend immediate engagement and proposal generation.';
  } else if (overallScore >= 60) {
    recommendedApproach = 'Qualified lead. Schedule technical discussion to refine requirements.';
  } else if (overallScore >= 40) {
    recommendedApproach = 'Potential lead. Gather more information through discovery call.';
  } else {
    recommendedApproach = 'Low-priority lead. Consider if project aligns with company capabilities.';
  }

  // Estimate project duration
  const durationMap: Record<string, string> = {
    '1-2-weeks': '2-4 weeks',
    '1-month': '1-2 months',
    '2-3-months': '2-4 months',
    '3-6-months': '3-6 months',
    '6+months': '6+ months'
  };
  const estimatedProjectDuration = durationMap[formData.timeline] || 'TBD';

  // Suggest team size
  let suggestedTeamSize = 2;
  if (technicalScore >= 80) suggestedTeamSize = 4;
  else if (technicalScore >= 60) suggestedTeamSize = 3;
  else if (overallScore >= 70) suggestedTeamSize = 3;

  // Generate next steps
  const nextSteps = [];
  if (overallScore >= 70) {
    nextSteps.push('Schedule technical discovery call');
    nextSteps.push('Prepare detailed proposal');
    nextSteps.push('Identify key stakeholders');
  } else if (overallScore >= 50) {
    nextSteps.push('Schedule initial consultation');
    nextSteps.push('Gather additional requirements');
    nextSteps.push('Assess technical feasibility');
  } else {
    nextSteps.push('Review project alignment');
    nextSteps.push('Consider referral to partner');
  }

  return {
    budget_score: budgetScore,
    timeline_score: timelineScore,
    technical_complexity_score: technicalScore,
    business_impact_score: businessScore,
    market_potential_score: marketScore,
    overall_score: overallScore,
    confidence_level: confidenceLevel,
    ai_analysis: aiAnalysis,
    risk_factors: riskFactors,
    opportunity_factors: opportunityFactors,
    recommended_approach: recommendedApproach,
    estimated_project_duration: estimatedProjectDuration,
    suggested_team_size: suggestedTeamSize,
    next_steps: nextSteps
  };
}

function generateStrengths(budget: number, timeline: number, technical: number, business: number, market: number): string[] {
  const strengths = [];
  if (budget >= 70) strengths.push('Strong budget allocation');
  if (timeline >= 70) strengths.push('Realistic timeline expectations');
  if (technical >= 70) strengths.push('Clear technical requirements');
  if (business >= 70) strengths.push('Strong business value proposition');
  if (market >= 70) strengths.push('High market potential');
  return strengths;
}

function generateConcerns(budget: number, timeline: number, technical: number, business: number, market: number): string[] {
  const concerns = [];
  if (budget < 50) concerns.push('Limited budget may impact scope');
  if (timeline < 50) concerns.push('Aggressive timeline may affect quality');
  if (technical < 50) concerns.push('Unclear technical requirements');
  if (business < 50) concerns.push('Unclear business value');
  if (market < 50) concerns.push('Limited market validation');
  return concerns;
}
