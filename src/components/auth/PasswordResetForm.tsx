/**
 * Password reset form component
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePasswordReset } from '@/hooks/useAuth';
import { passwordResetSchema, type PasswordResetFormData } from '@/lib/validations/auth';

interface PasswordResetFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function PasswordResetForm({ onBack, onSuccess }: PasswordResetFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isResetting } = usePasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook and displayed via toast
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-positive/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-positive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-text-primary">
            Check your email
          </h3>
          <p className="text-text-secondary">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-text-primary">
          Reset your password
        </h3>
        <p className="text-text-secondary">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-text-primary">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="h-12 px-4"
            {...register('email')}
            disabled={isResetting}
          />
          {errors.email && (
            <p className="text-sm text-negative">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={isResetting}
        >
          {isResetting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
      </div>
    </div>
  );
}