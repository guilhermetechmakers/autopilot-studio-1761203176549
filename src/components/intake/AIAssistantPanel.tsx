/**
 * AI Assistant Panel for Intake Forms
 * Provides real-time AI insights and suggestions during form completion
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IntakeFormData } from '@/lib/validations/intake';

interface AIAssistantPanelProps {
  formData: Partial<IntakeFormData>;
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

interface AISuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'tip' | 'success';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

export function AIAssistantPanel({ formData, onSuggestionClick, className }: AIAssistantPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate AI analysis based on form data
  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const newSuggestions = generateSuggestions(formData);
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    }, 1000);
  }, [formData]);

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement':
        return <Lightbulb className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'tip':
        return <Zap className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'tip':
        return 'border-purple-200 bg-purple-50 text-purple-800';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* AI Analysis Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900">AI Assistant</CardTitle>
              <CardDescription className="text-blue-700">
                Real-time insights and suggestions for your project
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                Analyzing your project details...
              </div>
              <Progress value={75} className="h-2" />
            </div>
          ) : (
            <div className="text-sm text-blue-700">
              AI has analyzed your project and provided insights below.
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  'p-3 rounded-lg border transition-all hover:shadow-sm',
                  getSuggestionColor(suggestion.type)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{suggestion.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{suggestion.description}</p>
                    {suggestion.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => onSuggestionClick?.(suggestion.action!)}
                      >
                        {suggestion.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {formData.project_name && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium">
                  {formData.budget_range ? getBudgetLabel(formData.budget_range) : 'Not specified'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">Timeline:</span>
                <span className="font-medium">
                  {formData.timeline ? getTimelineLabel(formData.timeline) : 'Not specified'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  {formData.project_type ? getProjectTypeLabel(formData.project_type) : 'Not specified'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-gray-600">Tech Stack:</span>
                <span className="font-medium">
                  {formData.preferred_tech_stack?.length || 0} selected
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions for generating AI suggestions
function generateSuggestions(formData: Partial<IntakeFormData>): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  // Check for missing required fields
  if (!formData.contact_name) {
    suggestions.push({
      id: 'missing-name',
      type: 'warning',
      title: 'Missing Contact Name',
      description: 'Please provide your full name for better lead qualification.',
      action: 'Add your name',
      priority: 'high'
    });
  }

  if (!formData.project_description || formData.project_description.length < 50) {
    suggestions.push({
      id: 'insufficient-description',
      type: 'improvement',
      title: 'Enhance Project Description',
      description: 'A detailed description helps us better understand your project needs.',
      action: 'Add more details',
      priority: 'medium'
    });
  }

  if (!formData.key_requirements || formData.key_requirements.length < 20) {
    suggestions.push({
      id: 'insufficient-requirements',
      type: 'improvement',
      title: 'Specify Key Requirements',
      description: 'Detailed requirements help us provide accurate project estimates.',
      action: 'Add requirements',
      priority: 'medium'
    });
  }

  // Check for tech stack selection
  if (!formData.preferred_tech_stack || formData.preferred_tech_stack.length === 0) {
    suggestions.push({
      id: 'no-tech-stack',
      type: 'tip',
      title: 'Select Preferred Technologies',
      description: 'Choosing your preferred tech stack helps us match you with the right team.',
      action: 'Select technologies',
      priority: 'low'
    });
  }

  return suggestions;
}

// Helper functions for labels
function getBudgetLabel(budgetRange: string): string {
  const labels: Record<string, string> = {
    'under-10k': 'Under $10K',
    '10k-25k': '$10K - $25K',
    '25k-50k': '$25K - $50K',
    '50k-100k': '$50K - $100K',
    '100k+': '$100K+'
  };
  return labels[budgetRange] || budgetRange;
}

function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    '1-2-weeks': '1-2 weeks',
    '1-month': '1 month',
    '2-3-months': '2-3 months',
    '3-6-months': '3-6 months',
    '6+months': '6+ months'
  };
  return labels[timeline] || timeline;
}

function getProjectTypeLabel(projectType: string): string {
  const labels: Record<string, string> = {
    'web-app': 'Web App',
    'mobile-app': 'Mobile App',
    'e-commerce': 'E-commerce',
    'ai-integration': 'AI Integration',
    'data-analytics': 'Data Analytics',
    'api-development': 'API Development',
    'custom-software': 'Custom Software',
    'other': 'Other'
  };
  return labels[projectType] || projectType;
}
