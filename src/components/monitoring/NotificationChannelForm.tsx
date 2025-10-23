/**
 * Notification Channel Form Component
 * Form for creating and editing notification channels
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Mail, MessageSquare, Webhook, Phone, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateNotificationChannel, useUpdateNotificationChannel } from '@/hooks/useMonitoring';
import type { NotificationChannel } from '@/types/monitoring';

const notificationChannelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['email', 'slack', 'webhook', 'sms', 'pagerduty']),
  enabled: z.boolean(),
  settings: z.record(z.any()),
});

type NotificationChannelFormData = z.infer<typeof notificationChannelSchema>;

interface NotificationChannelFormProps {
  channel?: NotificationChannel | null;
  onClose: () => void;
  onSuccess: () => void;
}

const channelTypes = {
  email: {
    label: 'Email',
    icon: Mail,
    description: 'Send alerts via email',
    settings: {
      smtp_host: { label: 'SMTP Host', type: 'text', required: true },
      smtp_port: { label: 'SMTP Port', type: 'number', required: true },
      smtp_user: { label: 'SMTP Username', type: 'text', required: true },
      smtp_password: { label: 'SMTP Password', type: 'password', required: true },
      from_email: { label: 'From Email', type: 'email', required: true },
      to_emails: { label: 'To Emails (comma-separated)', type: 'text', required: true },
    },
  },
  slack: {
    label: 'Slack',
    icon: MessageSquare,
    description: 'Send alerts to Slack channel',
    settings: {
      webhook_url: { label: 'Webhook URL', type: 'url', required: true },
      channel: { label: 'Channel', type: 'text', required: false },
      username: { label: 'Username', type: 'text', required: false },
    },
  },
  webhook: {
    label: 'Webhook',
    icon: Webhook,
    description: 'Send alerts to custom webhook',
    settings: {
      url: { label: 'Webhook URL', type: 'url', required: true },
      method: { label: 'HTTP Method', type: 'select', required: true, options: ['POST', 'PUT', 'PATCH'] },
      headers: { label: 'Headers (JSON)', type: 'textarea', required: false },
    },
  },
  sms: {
    label: 'SMS',
    icon: Phone,
    description: 'Send alerts via SMS',
    settings: {
      provider: { label: 'Provider', type: 'select', required: true, options: ['twilio', 'aws_sns'] },
      account_sid: { label: 'Account SID', type: 'text', required: true },
      auth_token: { label: 'Auth Token', type: 'password', required: true },
      from_number: { label: 'From Number', type: 'text', required: true },
      to_numbers: { label: 'To Numbers (comma-separated)', type: 'text', required: true },
    },
  },
  pagerduty: {
    label: 'PagerDuty',
    icon: Zap,
    description: 'Send alerts to PagerDuty',
    settings: {
      integration_key: { label: 'Integration Key', type: 'text', required: true },
      service_name: { label: 'Service Name', type: 'text', required: true },
    },
  },
};

export function NotificationChannelForm({ channel, onClose, onSuccess }: NotificationChannelFormProps) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [selectedType, setSelectedType] = useState<string>('email');
  
  const createMutation = useCreateNotificationChannel();
  const updateMutation = useUpdateNotificationChannel();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<NotificationChannelFormData>({
    resolver: zodResolver(notificationChannelSchema),
    defaultValues: {
      name: '',
      type: 'email',
      enabled: true,
      settings: {},
    },
  });

  const watchedType = watch('type');

  useEffect(() => {
    if (channel) {
      reset({
        name: channel.name,
        type: channel.type,
        enabled: channel.enabled,
        settings: channel.settings,
      });
      setSettings(channel.settings);
      setSelectedType(channel.type);
    } else {
      setSettings({});
      setSelectedType('email');
    }
  }, [channel, reset]);

  useEffect(() => {
    setSelectedType(watchedType);
    if (!channel) {
      setSettings({});
    }
  }, [watchedType, channel]);

  const onSubmit = async (data: NotificationChannelFormData) => {
    try {
      const formData = {
        ...data,
        settings,
        tenant_id: 'current-tenant', // This should come from auth context
      };

      if (channel) {
        await updateMutation.mutateAsync({ id: channel.id, channel: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving notification channel:', error);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSettingField = (key: string, config: any) => {
    const value = settings[key] || '';

    switch (config.type) {
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => updateSetting(key, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${config.label}`} />
            </SelectTrigger>
            <SelectContent>
              {config.options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateSetting(key, e.target.value)}
            placeholder={`Enter ${config.label}`}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
          />
        );
      case 'password':
        return (
          <Input
            type="password"
            value={value}
            onChange={(e) => updateSetting(key, e.target.value)}
            placeholder={`Enter ${config.label}`}
          />
        );
      default:
        return (
          <Input
            type={config.type}
            value={value}
            onChange={(e) => updateSetting(key, e.target.value)}
            placeholder={`Enter ${config.label}`}
          />
        );
    }
  };

  const currentChannelConfig = channelTypes[selectedType as keyof typeof channelTypes];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {channel ? 'Edit Notification Channel' : 'Create Notification Channel'}
              </CardTitle>
              <CardDescription>
                {channel ? 'Update the notification channel configuration' : 'Configure a new notification channel'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <label className="text-sm font-medium">Channel Name *</label>
                <Input
                  {...register('name')}
                  placeholder="e.g., Production Alerts"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Channel Type *</label>
                <Select
                  value={watchedType}
                  onValueChange={(value) => setValue('type', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(channelTypes).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  {...register('enabled')}
                  className="rounded"
                />
                <label htmlFor="enabled" className="text-sm font-medium">
                  Enable this notification channel
                </label>
              </div>
            </div>

            {/* Channel Configuration */}
            {currentChannelConfig && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <currentChannelConfig.icon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">{currentChannelConfig.label} Configuration</h3>
                </div>
                <p className="text-sm text-muted-foreground">{currentChannelConfig.description}</p>
                
                <div className="space-y-4">
                  {Object.entries(currentChannelConfig.settings).map(([key, config]) => (
                    <div key={key}>
                      <label className="text-sm font-medium">
                        {config.label}
                        {config.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="mt-1">
                        {renderSettingField(key, config)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : channel ? 'Update Channel' : 'Create Channel'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}