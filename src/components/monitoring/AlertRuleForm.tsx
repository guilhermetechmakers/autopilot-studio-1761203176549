/**
 * Alert Rule Form Component
 * Form for creating and editing alert rules
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAlertRule, useUpdateAlertRule, useNotificationChannels } from '@/hooks/useMonitoring';
import type { AlertRule } from '@/types/monitoring';

const alertRuleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  metric_name: z.string().min(1, 'Metric name is required'),
  condition: z.enum(['gt', 'gte', 'lt', 'lte', 'eq', 'neq']),
  threshold_value: z.number().min(0, 'Threshold must be positive'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  enabled: z.boolean(),
  notification_channels: z.array(z.string()),
  cooldown_minutes: z.number().min(1, 'Cooldown must be at least 1 minute'),
  label_filters: z.record(z.any()).optional(),
});

type AlertRuleFormData = z.infer<typeof alertRuleSchema>;

interface AlertRuleFormProps {
  rule?: AlertRule | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AlertRuleForm({ rule, onClose, onSuccess }: AlertRuleFormProps) {
  const [labelFilters, setLabelFilters] = useState<Record<string, string>>({});
  
  const { data: channelsData } = useNotificationChannels();
  const createMutation = useCreateAlertRule();
  const updateMutation = useUpdateAlertRule();

  const notificationChannels = channelsData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<AlertRuleFormData>({
    resolver: zodResolver(alertRuleSchema),
    defaultValues: {
      name: '',
      description: '',
      metric_name: '',
      condition: 'gt',
      threshold_value: 0,
      severity: 'medium',
      enabled: true,
      notification_channels: [],
      cooldown_minutes: 15,
      label_filters: {},
    },
  });

  const watchedChannels = watch('notification_channels');

  useEffect(() => {
    if (rule) {
      reset({
        name: rule.name,
        description: rule.description || '',
        metric_name: rule.metric_name,
        condition: rule.condition,
        threshold_value: rule.threshold_value,
        severity: rule.severity,
        enabled: rule.enabled,
        notification_channels: rule.notification_channels,
        cooldown_minutes: rule.cooldown_minutes,
        label_filters: rule.label_filters || {},
      });
      setLabelFilters(rule.label_filters || {});
    }
  }, [rule, reset]);

  const onSubmit = async (data: AlertRuleFormData) => {
    try {
      const formData = {
        ...data,
        label_filters: labelFilters,
        tenant_id: 'current-tenant', // This should come from auth context
      };

      if (rule) {
        await updateMutation.mutateAsync({ id: rule.id, rule: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving alert rule:', error);
    }
  };

  const addLabelFilter = () => {
    const key = prompt('Enter label key:');
    if (key) {
      setLabelFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const updateLabelFilter = (key: string, value: string) => {
    setLabelFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeLabelFilter = (key: string) => {
    setLabelFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {rule ? 'Edit Alert Rule' : 'Create Alert Rule'}
              </CardTitle>
              <CardDescription>
                {rule ? 'Update the alert rule configuration' : 'Configure a new alert rule'}
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
                <label className="text-sm font-medium">Rule Name *</label>
                <Input
                  {...register('name')}
                  placeholder="e.g., High CPU Usage Alert"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  {...register('description')}
                  placeholder="Optional description of the alert rule"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Metric Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Metric Configuration</h3>
              
              <div>
                <label className="text-sm font-medium">Metric Name *</label>
                <Input
                  {...register('metric_name')}
                  placeholder="e.g., cpu_usage, memory_usage, response_time"
                  className="mt-1"
                />
                {errors.metric_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.metric_name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Condition *</label>
                  <Select
                    value={watch('condition')}
                    onValueChange={(value) => setValue('condition', value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gt">Greater than (&gt;)</SelectItem>
                      <SelectItem value="gte">Greater than or equal (≥)</SelectItem>
                      <SelectItem value="lt">Less than (&lt;)</SelectItem>
                      <SelectItem value="lte">Less than or equal (≤)</SelectItem>
                      <SelectItem value="eq">Equal (=)</SelectItem>
                      <SelectItem value="neq">Not equal (≠)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Threshold Value *</label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('threshold_value', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                  {errors.threshold_value && (
                    <p className="text-sm text-red-500 mt-1">{errors.threshold_value.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Alert Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alert Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Severity *</label>
                  <Select
                    value={watch('severity')}
                    onValueChange={(value) => setValue('severity', value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Cooldown (minutes) *</label>
                  <Input
                    type="number"
                    min="1"
                    {...register('cooldown_minutes', { valueAsNumber: true })}
                    placeholder="15"
                    className="mt-1"
                  />
                  {errors.cooldown_minutes && (
                    <p className="text-sm text-red-500 mt-1">{errors.cooldown_minutes.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  {...register('enabled')}
                  className="rounded"
                />
                <label htmlFor="enabled" className="text-sm font-medium">
                  Enable this alert rule
                </label>
              </div>
            </div>

            {/* Notification Channels */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Channels</h3>
              
              <div>
                <label className="text-sm font-medium">Select Channels</label>
                <div className="mt-2 space-y-2">
                  {notificationChannels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`channel-${channel.id}`}
                        checked={watchedChannels.includes(channel.id)}
                        onChange={(e) => {
                          const newChannels = e.target.checked
                            ? [...watchedChannels, channel.id]
                            : watchedChannels.filter(id => id !== channel.id);
                          setValue('notification_channels', newChannels);
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`channel-${channel.id}`} className="text-sm">
                        {channel.name} ({channel.type})
                      </label>
                    </div>
                  ))}
                </div>
                {notificationChannels.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No notification channels available. Create one first.
                  </p>
                )}
              </div>
            </div>

            {/* Label Filters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Label Filters</h3>
                <Button type="button" variant="outline" size="sm" onClick={addLabelFilter}>
                  Add Filter
                </Button>
              </div>
              
              <div className="space-y-2">
                {Object.entries(labelFilters).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const newFilters = { ...labelFilters };
                        delete newFilters[key];
                        newFilters[newKey] = value;
                        setLabelFilters(newFilters);
                      }}
                      placeholder="Label key"
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">=</span>
                    <Input
                      value={value}
                      onChange={(e) => updateLabelFilter(key, e.target.value)}
                      placeholder="Label value"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLabelFilter(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {Object.keys(labelFilters).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No label filters. Add filters to target specific metric instances.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : rule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}