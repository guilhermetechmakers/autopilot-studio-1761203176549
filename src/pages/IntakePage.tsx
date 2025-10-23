import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IntakeForm } from "@/components/intake/IntakeForm";
import { CheckCircle, ArrowRight, Brain, Zap } from "lucide-react";

export default function IntakePage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedFormId, setSubmittedFormId] = useState<string | null>(null);

  const handleSuccess = (formId: string) => {
    setSubmittedFormId(formId);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
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

        {/* Success Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-900">Intake Submitted Successfully!</CardTitle>
              <CardDescription className="text-lg text-green-700">
                Thank you for your interest in working with us. Our AI has analyzed your project and our team will review it shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">AI Analysis Complete</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  Our AI has processed your project details and provided initial insights. 
                  You'll receive a detailed analysis and next steps via email within 24 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Quick Response</h4>
                  <p className="text-sm text-gray-600">We'll get back to you within 24 hours</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">AI-Powered Analysis</h4>
                  <p className="text-sm text-gray-600">Detailed project assessment included</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Next Steps</h4>
                  <p className="text-sm text-gray-600">Proposal and timeline coming soon</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Return Home
                </Button>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setSubmittedFormId(null);
                  }}
                  className="flex items-center gap-2"
                >
                  Submit Another Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {submittedFormId && (
                <div className="text-xs text-gray-500 mt-4">
                  Reference ID: {submittedFormId}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Let's Build Something Amazing Together
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Tell us about your project and our AI will analyze it to provide insights, 
              recommendations, and connect you with the perfect team.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                AI-Powered Analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Free Consultation
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                24-Hour Response
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intake Form */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <IntakeForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}