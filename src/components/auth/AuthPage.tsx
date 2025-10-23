/**
 * Main authentication page component with login/signup tabs and SSO
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { SSOButtons } from './SSOButtons';
import { PasswordResetForm } from './PasswordResetForm';

type AuthMode = 'login' | 'signup' | 'reset';

interface AuthPageProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
}

export function AuthPage({ initialMode = 'login', onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    setError(null);
    onSuccess?.();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as AuthMode);
    setError(null);
  };

  const handleBackToLogin = () => {
    setMode('login');
    setError(null);
  };

  const handleForgotPassword = () => {
    setMode('reset');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-2xl">A</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-text-primary">Autopilot Studio</h1>
              <p className="text-sm text-text-secondary">AI-Powered Business OS</p>
            </div>
          </div>
        </div>

        {/* Main Auth Card */}
        <Card className="shadow-card border-0">
          <CardHeader className="text-center pb-6">
            {mode === 'reset' ? (
              <>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                  We'll help you get back into your account
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </CardTitle>
                <CardDescription>
                  {mode === 'login'
                    ? 'Sign in to your account to continue'
                    : 'Get started with Autopilot Studio today'}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {mode === 'reset' ? (
              <PasswordResetForm
                onBack={handleBackToLogin}
                onSuccess={handleSuccess}
              />
            ) : (
              <>
                {/* Auth Forms */}
                <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-6">
                    <LoginForm
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6">
                    <SignupForm
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  </TabsContent>
                </Tabs>

                {/* SSO Buttons */}
                <SSOButtons onError={handleError} />

                {/* Forgot Password Link */}
                {mode === 'login' && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg bg-negative/10 border border-negative/20">
                <p className="text-sm text-negative text-center">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-text-secondary">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
          <p className="text-xs text-text-secondary">
            Need help?{' '}
            <a href="/support" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}