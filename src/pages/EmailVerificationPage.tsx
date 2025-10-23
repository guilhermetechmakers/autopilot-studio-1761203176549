/**
 * Email Verification Page
 * Handles email verification with token validation and resend functionality
 */

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { useVerifyEmail, useResendVerification } from '@/hooks/useEmailVerification';

type VerificationState = 'loading' | 'success' | 'error' | 'idle';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [email, setEmail] = useState<string>('');
  const mainContentRef = useRef<HTMLDivElement>(null);

  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  // Set email from URL params or localStorage
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Try to get email from localStorage
      const storedEmail = localStorage.getItem('signup_email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [emailParam]);

  // Verify email mutation
  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();

  // Auto-verify on component mount if token is present
  useEffect(() => {
    if (token && verificationState === 'idle') {
      setVerificationState('loading');
      verifyEmailMutation.mutate(token, {
        onSuccess: (response) => {
          if (response.success) {
            setVerificationState('success');
            // Clear stored email
            localStorage.removeItem('signup_email');
            // Focus on success message for screen readers
            setTimeout(() => {
              mainContentRef.current?.focus();
            }, 100);
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          } else {
            setVerificationState('error');
            // Focus on error message for screen readers
            setTimeout(() => {
              mainContentRef.current?.focus();
            }, 100);
          }
        },
        onError: () => {
          setVerificationState('error');
          // Focus on error message for screen readers
          setTimeout(() => {
            mainContentRef.current?.focus();
          }, 100);
        },
      });
    }
  }, [token, verificationState, verifyEmailMutation, navigate]);

  const handleResendVerification = () => {
    if (email) {
      resendVerificationMutation.mutate(email);
    } else {
      // Try to get email from localStorage or prompt user
      const storedEmail = localStorage.getItem('signup_email');
      if (storedEmail) {
        setEmail(storedEmail);
        resendVerificationMutation.mutate(storedEmail);
      } else {
        toast.error('Email address not found. Please try signing up again.');
      }
    }
  };

  const handleContinueToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-text-primary">Verifying your email...</h1>
              <p className="text-text-secondary">
                Please wait while we verify your email address.
              </p>
            </div>
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-positive/10 rounded-full flex items-center justify-center animate-bounce-in">
              <CheckCircle className="w-8 h-8 text-positive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-text-primary">Email Verified!</h1>
              <p className="text-text-secondary">
                Your email has been successfully verified. You can now access all features of Autopilot Studio.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleContinueToDashboard}
                className="w-full"
                size="lg"
                aria-label="Continue to your dashboard"
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
              <p className="text-sm text-text-secondary">
                You'll be automatically redirected in a few seconds...
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-negative/10 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-negative" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-text-primary">Verification Failed</h1>
              <p className="text-text-secondary">
                The verification link is invalid or has expired. Please request a new verification email.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending}
                className="w-full"
                size="lg"
                aria-label={resendVerificationMutation.isPending ? "Sending verification email" : "Resend verification email"}
              >
                {resendVerificationMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 w-4 h-4" aria-hidden="true" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              <Button 
                onClick={handleGoToLogin}
                variant="outline"
                className="w-full"
                size="lg"
                aria-label="Return to login page"
              >
                Back to Login
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-text-primary">
                {token ? 'Check Your Email' : 'Email Verification Required'}
              </h1>
              <p className="text-text-secondary">
                {token 
                  ? "We've sent a verification link to your email address. Please click the link to verify your account."
                  : "Please check your email for a verification link, or use the resend button below."
                }
              </p>
              {email && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    Verification email sent to: <span className="font-medium text-text-primary">{email}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending}
                className="w-full"
                size="lg"
                aria-label={resendVerificationMutation.isPending ? "Sending verification email" : "Resend verification email"}
              >
                {resendVerificationMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 w-4 h-4" aria-hidden="true" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              <Button 
                onClick={handleGoToLogin}
                variant="outline"
                className="w-full"
                size="lg"
                aria-label="Return to login page"
              >
                Back to Login
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-card border-border hover-lift" role="main" aria-labelledby="page-title">
          <CardHeader className="text-center pb-2">
            <CardTitle id="page-title" className="text-3xl font-bold text-text-primary">
              Autopilot Studio
            </CardTitle>
            <CardDescription className="text-text-secondary">
              AI-Powered Business Automation Platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6" role="region" aria-live="polite" ref={mainContentRef} tabIndex={-1}>
            {renderContent()}
          </CardContent>
        </Card>

        {/* Help section */}
        <div className="text-center space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="text-sm font-medium text-text-primary mb-2">Need Help?</h3>
            <p className="text-xs text-text-secondary mb-3">
              If you're having trouble verifying your email, we're here to help.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:support@autopilotstudio.com" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </a>
            </div>
          </div>
          
          <p className="text-xs text-text-secondary">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}