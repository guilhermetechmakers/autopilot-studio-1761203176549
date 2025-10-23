import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, title: "Project Details", description: "Tell us about your project" },
  { id: 2, title: "Requirements", description: "Define your needs and goals" },
  { id: 3, title: "Timeline & Budget", description: "Set expectations and budget" },
  { id: 4, title: "Review & Submit", description: "Review and submit your intake" }
];

export default function IntakePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    description: "",
    requirements: "",
    timeline: "",
    budget: "",
    contactInfo: {
      name: "",
      email: "",
      company: "",
      phone: ""
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

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

  const handleSubmit = () => {
    console.log("Intake submitted:", formData);
    // TODO: Implement submission logic
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Sign In</Button>
              <Button variant="outline">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border text-text-secondary'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-secondary">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Project Name</label>
                  <Input
                    placeholder="Enter your project name"
                    value={formData.projectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('projectName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Project Type</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md"
                      value={formData.projectType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('projectType', e.target.value)}
                    >
                    <option value="">Select project type</option>
                    <option value="web-app">Web Application</option>
                    <option value="mobile-app">Mobile Application</option>
                    <option value="e-commerce">E-commerce Platform</option>
                    <option value="ai-integration">AI Integration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Project Description</label>
                    <textarea
                      className="w-full p-2 border border-border rounded-md h-32 resize-none"
                      placeholder="Describe your project in detail..."
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                    />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Key Requirements</label>
                    <textarea
                      className="w-full p-2 border border-border rounded-md h-32 resize-none"
                      placeholder="List your key requirements and features..."
                      value={formData.requirements}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('requirements', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Timeline</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md"
                      value={formData.timeline}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('timeline', e.target.value)}
                    >
                      <option value="">Select timeline</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6+months">6+ months</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Budget Range</label>
                    <select 
                      className="w-full p-2 border border-border rounded-md"
                      value={formData.budget}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('budget', e.target.value)}
                    >
                      <option value="">Select budget range</option>
                      <option value="under-10k">Under $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">$100,000+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-text-primary">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Full Name</label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.contactInfo.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contactInfo.name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.contactInfo.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contactInfo.email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Company</label>
                    <Input
                      placeholder="Enter your company name"
                      value={formData.contactInfo.company}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contactInfo.company', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Phone</label>
                    <Input
                      placeholder="Enter your phone number"
                      value={formData.contactInfo.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contactInfo.phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-text-primary mb-4">Review Your Intake</h3>
                  <p className="text-text-secondary">Please review your information before submitting</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-text-primary">Project Details</h4>
                      <p className="text-sm text-text-secondary">Name: {formData.projectName}</p>
                      <p className="text-sm text-text-secondary">Type: {formData.projectType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">Timeline & Budget</h4>
                      <p className="text-sm text-text-secondary">Timeline: {formData.timeline}</p>
                      <p className="text-sm text-text-secondary">Budget: {formData.budget}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-text-primary">Contact Information</h4>
                    <p className="text-sm text-text-secondary">Name: {formData.contactInfo.name}</p>
                    <p className="text-sm text-text-secondary">Email: {formData.contactInfo.email}</p>
                    <p className="text-sm text-text-secondary">Company: {formData.contactInfo.company}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="btn-primary">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="btn-primary">
                  Submit Intake
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}