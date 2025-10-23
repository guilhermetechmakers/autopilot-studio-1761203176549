/**
 * Notification System for Intake Forms
 * Handles email/SMS notifications for intake process
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  CheckCircle, 
  Clock,
  Send,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  intakeConfirmation: boolean;
  aiAnalysisComplete: boolean;
  meetingReminder: boolean;
  proposalReady: boolean;
  statusUpdates: boolean;
}

interface NotificationSystemProps {
  intakeFormId?: string;
  userEmail?: string;
  userPhone?: string;
  onNotificationSent?: (type: string, status: 'success' | 'error') => void;
  className?: string;
}

export function NotificationSystem({ 
  userEmail, 
  userPhone, 
  onNotificationSent,
  className 
}: NotificationSystemProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    push: true,
    intakeConfirmation: true,
    aiAnalysisComplete: true,
    meetingReminder: true,
    proposalReady: true,
    statusUpdates: true
  });

  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<Record<string, string>>({});

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const sendTestNotification = async (type: string) => {
    setIsSending(true);
    
    try {
      // Simulate sending notification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLastSent(prev => ({ 
        ...prev, 
        [type]: new Date().toLocaleTimeString() 
      }));
      
      onNotificationSent?.(type, 'success');
    } catch (error) {
      onNotificationSent?.(type, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const notificationTypes = [
    {
      id: 'intakeConfirmation',
      title: 'Intake Confirmation',
      description: 'Confirmation when intake form is submitted',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'aiAnalysisComplete',
      title: 'AI Analysis Complete',
      description: 'Notification when AI analysis is finished',
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'meetingReminder',
      title: 'Meeting Reminder',
      description: 'Reminder before scheduled meetings',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'proposalReady',
      title: 'Proposal Ready',
      description: 'Notification when proposal is available',
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'statusUpdates',
      title: 'Status Updates',
      description: 'Updates on project status changes',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900">Notification Preferences</CardTitle>
              <CardDescription className="text-blue-700">
                Choose how you'd like to be notified about your project
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
          <CardDescription>
            Update your contact details for notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notification_email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="notification_email"
                  type="email"
                  value={userEmail || ''}
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification_phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="notification_phone"
                  value={userPhone || ''}
                  placeholder="Enter your phone number"
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Channels</CardTitle>
          <CardDescription>
            Select your preferred notification methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email_notifications"
                checked={preferences.email}
                onCheckedChange={(checked) => handlePreferenceChange('email', checked as boolean)}
              />
              <Label htmlFor="email_notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sms_notifications"
                checked={preferences.sms}
                onCheckedChange={(checked) => handlePreferenceChange('sms', checked as boolean)}
              />
              <Label htmlFor="sms_notifications" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="push_notifications"
                checked={preferences.push}
                onCheckedChange={(checked) => handlePreferenceChange('push', checked as boolean)}
              />
              <Label htmlFor="push_notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Push
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Types</CardTitle>
          <CardDescription>
            Choose which events you want to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((notification) => {
            const Icon = notification.icon;
            const isEnabled = preferences[notification.id as keyof NotificationPreferences];
            
            return (
              <div
                key={notification.id}
                className={cn(
                  'p-4 rounded-lg border transition-all',
                  isEnabled 
                    ? `${notification.bgColor} ${notification.borderColor}` 
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', isEnabled ? notification.bgColor : 'bg-gray-100')}>
                      <Icon className={cn('h-4 w-4', isEnabled ? notification.color : 'text-gray-500')} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isEnabled}
                      onCheckedChange={(checked) => 
                        handlePreferenceChange(notification.id as keyof NotificationPreferences, checked as boolean)
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendTestNotification(notification.id)}
                      disabled={isSending || !isEnabled}
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                </div>
                {lastSent[notification.id] && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last sent: {lastSent[notification.id]}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Notifications</CardTitle>
          <CardDescription>
            View your recent notification activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: '1',
                type: 'Intake Confirmation',
                message: 'Your intake form has been submitted successfully',
                time: '2 minutes ago',
                status: 'sent',
                icon: CheckCircle
              },
              {
                id: '2',
                type: 'AI Analysis',
                message: 'AI analysis of your project is complete',
                time: '5 minutes ago',
                status: 'sent',
                icon: Bell
              },
              {
                id: '3',
                type: 'Meeting Reminder',
                message: 'Reminder: Intake call scheduled for tomorrow at 2 PM',
                time: '1 hour ago',
                status: 'sent',
                icon: Clock
              }
            ].map((notification) => {
              const Icon = notification.icon;
              return (
                <div key={notification.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">{notification.type}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {notification.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Preferences */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
            <Button variant="outline">
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
