/**
 * SSO (Single Sign-On) buttons component
 */

import { useState } from 'react';
import { Chrome, Github, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { SSO_PROVIDERS } from '@/types/auth';

interface SSOButtonsProps {
  onError?: (error: string) => void;
}

export function SSOButtons({ onError }: SSOButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { signInWithProvider } = useAuth();

  const handleSSOSignIn = async (provider: string) => {
    try {
      setLoadingProvider(provider);
      await signInWithProvider(provider);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'SSO sign in failed');
    } finally {
      setLoadingProvider(null);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return <Chrome className="h-5 w-5" />;
      case 'microsoft':
        return <div className="h-5 w-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">M</div>;
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'saml':
        return <Shield className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const enabledProviders = SSO_PROVIDERS.filter(provider => provider.enabled);

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-text-secondary">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {enabledProviders.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            className="w-full h-12 justify-start"
            onClick={() => handleSSOSignIn(provider.id)}
            disabled={loadingProvider === provider.id}
            style={{
              borderColor: provider.color,
              color: provider.color,
            }}
          >
            {loadingProvider === provider.id ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <div className="mr-3" style={{ color: provider.color }}>
                {getProviderIcon(provider.id)}
              </div>
            )}
            <span className="font-medium">
              {loadingProvider === provider.id ? 'Signing in...' : `Continue with ${provider.name}`}
            </span>
          </Button>
        ))}
      </div>

      {/* Enterprise SSO Notice */}
      {SSO_PROVIDERS.some(p => !p.enabled) && (
        <div className="text-center">
          <p className="text-xs text-text-secondary">
            Need SAML SSO?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      )}
    </div>
  );
}