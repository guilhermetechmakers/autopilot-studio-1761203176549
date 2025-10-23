/**
 * Validation schemas for intake forms
 */

import { z } from 'zod';

// Project type options
export const projectTypeOptions = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile Application' },
  { value: 'e-commerce', label: 'E-commerce Platform' },
  { value: 'ai-integration', label: 'AI Integration' },
  { value: 'data-analytics', label: 'Data Analytics' },
  { value: 'api-development', label: 'API Development' },
  { value: 'custom-software', label: 'Custom Software' },
  { value: 'other', label: 'Other' },
] as const;

// Timeline options
export const timelineOptions = [
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '1-month', label: '1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6+months', label: '6+ months' },
] as const;

// Budget range options
export const budgetRangeOptions = [
  { value: 'under-10k', label: 'Under $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k+', label: '$100,000+' },
] as const;

// Budget flexibility options
export const budgetFlexibilityOptions = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'somewhat-flexible', label: 'Somewhat Flexible' },
  { value: 'very-flexible', label: 'Very Flexible' },
] as const;

// Tech stack options
export const techStackOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'fastapi', label: 'FastAPI' },
  { value: 'php', label: 'PHP' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rails', label: 'Ruby on Rails' },
  { value: 'java', label: 'Java' },
  { value: 'spring', label: 'Spring Boot' },
  { value: 'csharp', label: 'C#' },
  { value: 'dotnet', label: '.NET' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'react-native', label: 'React Native' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'redis', label: 'Redis' },
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'gcp', label: 'Google Cloud' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
] as const;

// Intake form validation schema
export const intakeFormSchema = z.object({
  // Contact Information
  contact_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  contact_email: z.string().email('Please enter a valid email address'),
  contact_phone: z.string().optional().or(z.literal('')),
  company_name: z.string().optional().or(z.literal('')),
  
  // Project Details
  project_name: z.string().min(3, 'Project name must be at least 3 characters').max(200, 'Project name must be less than 200 characters'),
  project_type: z.enum(['web-app', 'mobile-app', 'e-commerce', 'ai-integration', 'data-analytics', 'api-development', 'custom-software', 'other']),
  project_description: z.string().min(50, 'Project description must be at least 50 characters').max(2000, 'Project description must be less than 2000 characters'),
  
  // Requirements & Goals
  key_requirements: z.string().min(20, 'Key requirements must be at least 20 characters').max(1000, 'Key requirements must be less than 1000 characters'),
  business_goals: z.string().optional().or(z.literal('')),
  success_metrics: z.string().optional().or(z.literal('')),
  
  // Timeline & Budget
  timeline: z.enum(['1-2-weeks', '1-month', '2-3-months', '3-6-months', '6+months']),
  budget_range: z.enum(['under-10k', '10k-25k', '25k-50k', '50k-100k', '100k+']),
  budget_flexibility: z.enum(['fixed', 'somewhat-flexible', 'very-flexible']).optional().or(z.literal('')).transform(val => val === '' ? null : val),
  
  // Technical Stack
  preferred_tech_stack: z.array(z.string()).default([]),
  existing_systems: z.string().optional().or(z.literal('')),
  integration_requirements: z.string().optional().or(z.literal('')),
  
  // Calendar Integration
  preferred_meeting_times: z.array(z.string()).default([]),
  timezone: z.string().default('UTC'),
});

// Type for the form data
export type IntakeFormData = z.infer<typeof intakeFormSchema>;

// Validation schema for updating intake form
export const updateIntakeFormSchema = intakeFormSchema.partial();

// Helper function to get option label by value
export function getOptionLabel<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string
): string {
  const option = options.find(opt => opt.value === value);
  return option?.label || value;
}

// Helper function to get score color based on value
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

// Helper function to get score label
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Very Poor';
}

// Helper function to get priority color
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-50';
    case 'high':
      return 'text-orange-600 bg-orange-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// Helper function to get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'qualified':
      return 'text-green-600 bg-green-50';
    case 'under-review':
      return 'text-yellow-600 bg-yellow-50';
    case 'disqualified':
      return 'text-red-600 bg-red-50';
    case 'scheduled':
      return 'text-blue-600 bg-blue-50';
    case 'completed':
      return 'text-purple-600 bg-purple-50';
    case 'archived':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}
