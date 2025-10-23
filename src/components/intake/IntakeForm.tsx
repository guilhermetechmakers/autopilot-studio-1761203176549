/**
 * Enhanced Intake Form with AI Assistant
 * Multi-step form with real-time AI insights and suggestions
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { AIAssistantPanel } from './AIAssistantPanel';
import { useSubmitIntakeForm } from '@/hooks/useIntake';
import { 
  intakeFormSchema, 
  type IntakeFormData,
  projectTypeOptions,
  timelineOptions,
  budgetRangeOptions,
  budgetFlexibilityOptions,
  techStackOptions
} from '@/lib/validations/intake';

const steps = [
  { id: 1, title: 'Contact Information', description: 'Tell us about yourself' },
  { id: 2, title: 'Project Details', description: 'Describe your project' },
  { id: 3, title: 'Requirements & Goals', description: 'Define your needs' },
  { id: 4, title: 'Timeline & Budget', description: 'Set expectations' },
  { id: 5, title: 'Technical Stack', description: 'Choose technologies' },
  { id: 6, title: 'Review & Submit', description: 'Review and submit' }
];

interface IntakeFormProps {
  onSuccess?: (formId: string) => void;
  className?: string;
}

export function IntakeForm({ onSuccess, className }: IntakeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitIntakeForm = useSubmitIntakeForm();

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      preferred_tech_stack: [],
      preferred_meeting_times: [],
      timezone: 'UTC'
    }
  });

  const { watch, setValue, formState: { errors, isValid } } = form;
  const formData = watch();

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitIntakeForm.mutateAsync(data);
      onSuccess?.(result.form.id);
    } catch (error) {
      console.error('Failed to submit intake form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTechStackChange = (tech: string, checked: boolean) => {
    const currentStack = formData.preferred_tech_stack || [];
    if (checked) {
      setValue('preferred_tech_stack', [...currentStack, tech]);
    } else {
      setValue('preferred_tech_stack', currentStack.filter(t => t !== tech));
    }
  };

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.contact_name && formData.contact_email;
      case 2:
        return formData.project_name && formData.project_type && formData.project_description;
      case 3:
        return formData.key_requirements;
      case 4:
        return formData.timeline && formData.budget_range;
      case 5:
        return true; // Tech stack is optional
      case 6:
        return isValid;
      default:
        return false;
    }
  };

  return (
    <div className={className}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Project Intake Form</h2>
          <Badge variant="outline" className="text-sm">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{steps[currentStep - 1].title}</span>
          <span>{Math.round(getStepProgress())}% Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Contact Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_name">Full Name *</Label>
                          <Input
                            id="contact_name"
                            {...form.register('contact_name')}
                            placeholder="Enter your full name"
                          />
                          {errors.contact_name && (
                            <p className="text-sm text-red-600">{errors.contact_name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact_email">Email Address *</Label>
                          <Input
                            id="contact_email"
                            type="email"
                            {...form.register('contact_email')}
                            placeholder="Enter your email"
                          />
                          {errors.contact_email && (
                            <p className="text-sm text-red-600">{errors.contact_email.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_phone">Phone Number</Label>
                          <Input
                            id="contact_phone"
                            {...form.register('contact_phone')}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company_name">Company Name</Label>
                          <Input
                            id="company_name"
                            {...form.register('company_name')}
                            placeholder="Enter your company name"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Project Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="project_name">Project Name *</Label>
                        <Input
                          id="project_name"
                          {...form.register('project_name')}
                          placeholder="Enter your project name"
                        />
                        {errors.project_name && (
                          <p className="text-sm text-red-600">{errors.project_name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project_type">Project Type *</Label>
                        <Select onValueChange={(value) => setValue('project_type', value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.project_type && (
                          <p className="text-sm text-red-600">{errors.project_type.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project_description">Project Description *</Label>
                        <Textarea
                          id="project_description"
                          {...form.register('project_description')}
                          placeholder="Describe your project in detail..."
                          rows={4}
                        />
                        {errors.project_description && (
                          <p className="text-sm text-red-600">{errors.project_description.message}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formData.project_description?.length || 0}/2000 characters
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Requirements & Goals */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="key_requirements">Key Requirements *</Label>
                        <Textarea
                          id="key_requirements"
                          {...form.register('key_requirements')}
                          placeholder="List your key requirements and features..."
                          rows={4}
                        />
                        {errors.key_requirements && (
                          <p className="text-sm text-red-600">{errors.key_requirements.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business_goals">Business Goals</Label>
                        <Textarea
                          id="business_goals"
                          {...form.register('business_goals')}
                          placeholder="What are your business objectives?"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="success_metrics">Success Metrics</Label>
                        <Textarea
                          id="success_metrics"
                          {...form.register('success_metrics')}
                          placeholder="How will you measure success?"
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Timeline & Budget */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Project Timeline *</Label>
                          <Select onValueChange={(value) => setValue('timeline', value as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              {timelineOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.timeline && (
                            <p className="text-sm text-red-600">{errors.timeline.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget_range">Budget Range *</Label>
                          <Select onValueChange={(value) => setValue('budget_range', value as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetRangeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.budget_range && (
                            <p className="text-sm text-red-600">{errors.budget_range.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget_flexibility">Budget Flexibility</Label>
                        <Select onValueChange={(value) => setValue('budget_flexibility', value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget flexibility" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetFlexibilityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Technical Stack */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <Label>Preferred Technologies</Label>
                          <p className="text-sm text-gray-600 mb-3">
                            Select the technologies you'd like to use (optional)
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {techStackOptions.map((tech) => (
                              <div key={tech.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={tech.value}
                                  checked={formData.preferred_tech_stack?.includes(tech.value) || false}
                                  onCheckedChange={(checked) => 
                                    handleTechStackChange(tech.value, checked as boolean)
                                  }
                                />
                                <Label htmlFor={tech.value} className="text-sm">
                                  {tech.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="existing_systems">Existing Systems</Label>
                          <Textarea
                            id="existing_systems"
                            {...form.register('existing_systems')}
                            placeholder="Describe any existing systems or integrations..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="integration_requirements">Integration Requirements</Label>
                          <Textarea
                            id="integration_requirements"
                            {...form.register('integration_requirements')}
                            placeholder="Any specific integration requirements?"
                            rows={3}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Review & Submit */}
                  {currentStep === 6 && (
                    <motion.div
                      key="step-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Review Your Information
                        </h3>
                        <p className="text-gray-600">
                          Please review your project details before submitting
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Contact Information</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Name:</strong> {formData.contact_name}</p>
                              <p><strong>Email:</strong> {formData.contact_email}</p>
                              {formData.contact_phone && (
                                <p><strong>Phone:</strong> {formData.contact_phone}</p>
                              )}
                              {formData.company_name && (
                                <p><strong>Company:</strong> {formData.company_name}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Project Details</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Name:</strong> {formData.project_name}</p>
                              <p><strong>Type:</strong> {formData.project_type}</p>
                              <p><strong>Timeline:</strong> {formData.timeline}</p>
                              <p><strong>Budget:</strong> {formData.budget_range}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Project Description</h4>
                          <p className="text-sm text-gray-600">{formData.project_description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Key Requirements</h4>
                          <p className="text-sm text-gray-600">{formData.key_requirements}</p>
                        </div>
                        
                        {formData.preferred_tech_stack && formData.preferred_tech_stack.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Preferred Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {formData.preferred_tech_stack.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {techStackOptions.find(t => t.value === tech)?.label || tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Intake
                          <CheckCircle className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Panel */}
        <div className="lg:col-span-1">
          <AIAssistantPanel 
            formData={formData} 
            onSuggestionClick={(suggestion) => {
              // Handle suggestion clicks
              console.log('Suggestion clicked:', suggestion);
            }}
          />
        </div>
      </div>
    </div>
  );
}
