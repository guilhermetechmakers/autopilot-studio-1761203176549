/**
 * Authentication types for Autopilot Studio
 * Generated: 2024-01-13T12:00:00Z
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  email_verified?: boolean;
  phone?: string;
  company?: string;
  role?: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  acceptTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: string;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

export interface SSOProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export const SSO_PROVIDERS: SSOProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'Chrome',
    color: '#4285F4',
    enabled: true,
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: 'Microsoft',
    color: '#00BCF2',
    enabled: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'Github',
    color: '#333333',
    enabled: true,
  },
  {
    id: 'saml',
    name: 'SAML SSO',
    icon: 'Shield',
    color: '#6366F1',
    enabled: false, // Enterprise feature
  },
];

// Form validation schemas
export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  acceptTerms: boolean;
}

export interface PasswordResetFormData {
  email: string;
}

export interface PasswordResetConfirmFormData {
  password: string;
  confirmPassword: string;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    session: AuthSession;
  };
  error?: AuthError;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  error?: AuthError;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<PasswordResetResponse>;
  confirmPasswordReset: (token: string, password: string) => Promise<PasswordResetResponse>;
  resendVerification: (email: string) => Promise<PasswordResetResponse>;
  signInWithProvider: (provider: string) => Promise<void>;
  clearError: () => void;
}