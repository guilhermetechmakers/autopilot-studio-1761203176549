/**
 * Authentication API layer for Autopilot Studio
 * Handles all authentication operations with Supabase
 */

import { supabase } from '@/lib/supabase';
import type {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  PasswordResetResponse,
  User,
  AuthSession,
  AuthError,
} from '@/types/auth';

/**
 * Convert Supabase user to our User type
 */
function mapSupabaseUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
    avatar_url: supabaseUser.user_metadata?.avatar_url,
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at,
    email_verified: supabaseUser.email_confirmed_at !== null,
    phone: supabaseUser.phone,
    company: supabaseUser.user_metadata?.company,
    role: supabaseUser.user_metadata?.role || 'dev',
  };
}

/**
 * Convert Supabase session to our AuthSession type
 */
function mapSupabaseSession(supabaseSession: any): AuthSession {
  return {
    access_token: supabaseSession.access_token,
    refresh_token: supabaseSession.refresh_token,
    expires_in: supabaseSession.expires_in,
    token_type: supabaseSession.token_type,
    user: mapSupabaseUser(supabaseSession.user),
  };
}

/**
 * Handle Supabase auth errors
 */
function handleAuthError(error: any): AuthError {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please check your email and click the confirmation link.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
    'Signup is disabled': 'Account creation is currently disabled.',
    'Email rate limit exceeded': 'Too many requests. Please try again later.',
    'Invalid email': 'Please enter a valid email address.',
  };

  return {
    message: errorMap[error.message] || error.message || 'An unexpected error occurred',
    code: error.code,
    details: error.details,
  };
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: {
          message: 'Authentication failed. Please try again.',
        },
      };
    }

    return {
      success: true,
      data: {
        user: mapSupabaseUser(data.user),
        session: mapSupabaseSession(data.session),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Network error. Please check your connection and try again.',
      },
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithPassword(credentials: SignupCredentials): Promise<AuthResponse> {
  try {
    // Validate password confirmation
    if (credentials.password !== credentials.confirmPassword) {
      return {
        success: false,
        error: {
          message: 'Passwords do not match.',
        },
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          company: credentials.company,
          role: 'dev',
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: handleAuthError(error),
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: {
          message: 'Account creation failed. Please try again.',
        },
      };
    }

    return {
      success: true,
      data: {
        user: mapSupabaseUser(data.user),
        session: data.session ? mapSupabaseSession(data.session) : null as any,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Network error. Please check your connection and try again.',
      },
    };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get current user error:', error);
      return null;
    }

    return user ? mapSupabaseUser(user) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Get current session
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get current session error:', error);
      return null;
    }

    return session ? mapSupabaseSession(session) : null;
  } catch (error) {
    console.error('Get current session error:', error);
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<PasswordResetResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        message: 'Failed to send reset email. Please try again.',
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Confirm password reset
 */
export async function confirmPasswordReset(_token: string, password: string): Promise<PasswordResetResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return {
        success: false,
        message: 'Failed to reset password. Please try again.',
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message: 'Password has been reset successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Resend email verification
 */
export async function resendEmailVerification(email: string): Promise<PasswordResetResponse> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      return {
        success: false,
        message: 'Failed to resend verification email. Please try again.',
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithProvider(provider: string): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('OAuth sign in error:', error);
    throw error;
  }
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<PasswordResetResponse> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) {
      return {
        success: false,
        message: 'Invalid or expired verification token. Please request a new one.',
        error: handleAuthError(error),
      };
    }

    return {
      success: true,
      message: 'Email verified successfully! You can now access your account.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session ? mapSupabaseSession(session) : null);
  });
}