/**
 * Loading components for better UX
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );
}

interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({ message = 'Loading...', className }: LoadingPageProps) {
  return (
    <div className={cn(
      'min-h-screen bg-background flex items-center justify-center',
      className
    )}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-secondary">{message}</p>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export function LoadingCard({ message = 'Loading...', className }: LoadingCardProps) {
  return (
    <div className={cn(
      'flex items-center justify-center p-8',
      className
    )}>
      <div className="text-center space-y-3">
        <LoadingSpinner size="md" />
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </div>
  );
}