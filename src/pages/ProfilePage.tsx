/**
 * Comprehensive User Profile Page
 * Implements all profile management features following the design system
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Phone,
  Building,
  Shield,
  Key,
  Link,
  CreditCard,
  Edit,
  Save,
  X,
  LogIn,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/AppLayout';

import {
  useProfile,
  useUpdateProfile,
} from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

import {
  userProfileSchema,
  type UserProfileFormData,
} from '@/lib/validations/profile';

import { cn } from '@/lib/utils';

// =====================================================
// Profile Header Component
// =====================================================

function ProfileHeader({ profile, isEditing, onEdit, onSave, onCancel }: {
  profile: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-2xl">
              {profile?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{profile?.name || 'User'}</h1>
                <p className="text-lg text-muted-foreground">{profile?.company || 'No company'}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Role: {profile?.role || 'Not specified'}
                </p>
              </div>
              <Button
                onClick={isEditing ? onSave : onEdit}
                className="btn-primary"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
            {isEditing && (
              <div className="mt-4 flex gap-2">
                <Button onClick={onCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// Personal Information Component
// =====================================================

function PersonalInfoSection({ profile, isEditing, onUpdate }: {
  profile: any;
  isEditing: boolean;
  onUpdate: (data: UserProfileFormData) => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: profile?.name || '',
      company: profile?.company || '',
      phone: profile?.phone || '',
      role: profile?.role || 'dev',
    },
  });

  const onSubmit = (data: UserProfileFormData) => {
    onUpdate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>Your basic profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  {...register('name')}
                  className={cn(errors.name && 'border-destructive')}
                />
              ) : (
                <div className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4" />
                  {profile?.name || 'Not provided'}
                </div>
              )}
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              {isEditing ? (
                <Input
                  id="company"
                  {...register('company')}
                  className={cn(errors.company && 'border-destructive')}
                />
              ) : (
                <div className="flex items-center gap-2 text-foreground">
                  <Building className="h-4 w-4" />
                  {profile?.company || 'Not provided'}
                </div>
              )}
              {errors.company && (
                <p className="text-sm text-destructive">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  {...register('phone')}
                  className={cn(errors.phone && 'border-destructive')}
                />
              ) : (
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4" />
                  {profile?.phone || 'Not provided'}
                </div>
              )}
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              {isEditing ? (
                <select
                  id="role"
                  {...register('role')}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="pm">Project Manager</option>
                  <option value="dev">Developer</option>
                  <option value="client">Client</option>
                  <option value="billing">Billing</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4" />
                  {profile?.role || 'Not specified'}
                </div>
              )}
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// =====================================================
// Loading Component
// =====================================================

function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

// =====================================================
// Main Profile Page Component
// =====================================================

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Show public profile view when not authenticated
  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-text-primary">User Profile</h1>
            <p className="text-text-secondary mt-2">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Login Prompt */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-primary" />
                Sign In Required
              </CardTitle>
              <CardDescription>Access your profile settings by signing in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-secondary">
                To view and manage your profile, billing information, security settings, and connected apps, 
                please sign in to your account.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <a href="/login">Sign In</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href="/signup">Create Account</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Features Preview */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Profile Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: User, title: "Personal Info", description: "Update your name, email, and contact details" },
                { icon: CreditCard, title: "Billing", description: "Manage payment methods and billing contacts" },
                { icon: Shield, title: "Security", description: "Two-factor authentication and password settings" },
                { icon: Key, title: "API Keys", description: "Generate and manage API access keys" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                      <p className="text-sm text-text-secondary">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleProfileUpdate = (data: UserProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Main Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <PersonalInfoSection
              profile={profile}
              isEditing={isEditing}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Contacts
                </CardTitle>
                <CardDescription>Manage your billing contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Billing contacts management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage your API keys for external integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">API keys management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Security settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Connected Apps
                </CardTitle>
                <CardDescription>Manage your connected third-party applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Connected apps management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
