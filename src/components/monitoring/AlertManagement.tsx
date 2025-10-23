/**
 * Alert Management Component
 * Comprehensive interface for managing alert rules and notifications
 */

import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Bell, 
  Settings, 
  CheckCircle,
  XCircle,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useAlertRules, 
  useDeleteAlertRule, 
  useToggleAlertRule,
  useNotificationChannels,
  useDeleteNotificationChannel,
  useTestNotificationChannel
} from '@/hooks/useMonitoring';
import { AlertRuleForm } from './AlertRuleForm';
import { NotificationChannelForm } from './NotificationChannelForm';
import type { AlertRule, NotificationChannel } from '@/types/monitoring';

export function AlertManagement() {
  const [activeTab, setActiveTab] = useState('rules');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [editingChannel, setEditingChannel] = useState<NotificationChannel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Alert Rules
  const { data: alertRulesData, isLoading: rulesLoading } = useAlertRules();
  const deleteRuleMutation = useDeleteAlertRule();
  const toggleRuleMutation = useToggleAlertRule();

  // Notification Channels
  const { data: channelsData, isLoading: channelsLoading } = useNotificationChannels();
  const deleteChannelMutation = useDeleteNotificationChannel();
  const testChannelMutation = useTestNotificationChannel();

  const alertRules = alertRulesData?.data || [];
  const notificationChannels = channelsData?.data || [];

  const filteredRules = alertRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.metric_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'enabled' && rule.enabled) ||
                         (statusFilter === 'disabled' && !rule.enabled);
    return matchesSearch && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getConditionSymbol = (condition: string) => {
    switch (condition) {
      case 'gt': return '>';
      case 'gte': return '≥';
      case 'lt': return '<';
      case 'lte': return '≤';
      case 'eq': return '=';
      case 'neq': return '≠';
      default: return condition;
    }
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setShowRuleForm(true);
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule(rule);
    setShowRuleForm(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this alert rule?')) {
      deleteRuleMutation.mutate(ruleId);
    }
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    toggleRuleMutation.mutate({ id: ruleId, enabled });
  };

  const handleCreateChannel = () => {
    setEditingChannel(null);
    setShowChannelForm(true);
  };

  const handleEditChannel = (channel: NotificationChannel) => {
    setEditingChannel(channel);
    setShowChannelForm(true);
  };

  const handleDeleteChannel = (channelId: string) => {
    if (window.confirm('Are you sure you want to delete this notification channel?')) {
      deleteChannelMutation.mutate(channelId);
    }
  };

  const handleTestChannel = (channelId: string) => {
    testChannelMutation.mutate(channelId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Alert Management</h2>
          <p className="text-muted-foreground">
            Configure alert rules and notification channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab(activeTab === 'rules' ? 'channels' : 'rules')}
          >
            {activeTab === 'rules' ? (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Switch to Channels
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Switch to Rules
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
        </TabsList>

        {/* Alert Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Rule Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search rules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rules</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Rule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rules List */}
          <div className="space-y-4">
            {rulesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredRules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No alert rules found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your filters to see more rules.'
                      : 'Create your first alert rule to get started.'}
                  </p>
                  <Button onClick={handleCreateRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert Rule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredRules.map((rule) => (
                <Card key={rule.id} className="card-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {rule.name}
                          </h3>
                          <Badge variant={getSeverityColor(rule.severity)}>
                            {rule.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={rule.enabled ? 'success' : 'secondary'}>
                            {rule.enabled ? 'ENABLED' : 'DISABLED'}
                          </Badge>
                        </div>
                        
                        {rule.description && (
                          <p className="text-muted-foreground text-sm mb-3">
                            {rule.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            <strong>Metric:</strong> {rule.metric_name}
                          </span>
                          <span>
                            <strong>Condition:</strong> {rule.metric_name} {getConditionSymbol(rule.condition)} {rule.threshold_value}
                          </span>
                          <span>
                            <strong>Cooldown:</strong> {rule.cooldown_minutes} minutes
                          </span>
                          <span>
                            <strong>Channels:</strong> {rule.notification_channels.length}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                          disabled={toggleRuleMutation.isPending}
                        >
                          {rule.enabled ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={deleteRuleMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Notification Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          {/* Channels List */}
          <div className="space-y-4">
            {channelsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : notificationChannels.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No notification channels</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create notification channels to receive alerts.
                  </p>
                  <Button onClick={handleCreateChannel}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Channel
                  </Button>
                </CardContent>
              </Card>
            ) : (
              notificationChannels.map((channel) => (
                <Card key={channel.id} className="card-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {channel.name}
                          </h3>
                          <Badge variant="outline">
                            {channel.type.toUpperCase()}
                          </Badge>
                          <Badge variant={channel.enabled ? 'success' : 'secondary'}>
                            {channel.enabled ? 'ENABLED' : 'DISABLED'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <strong>Type:</strong> {channel.type} • 
                          <strong> Created:</strong> {new Date(channel.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestChannel(channel.id)}
                          disabled={testChannelMutation.isPending}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditChannel(channel)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteChannel(channel.id)}
                          disabled={deleteChannelMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreateChannel}>
              <Plus className="h-4 w-4 mr-2" />
              New Channel
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      {showRuleForm && (
        <AlertRuleForm
          rule={editingRule}
          onClose={() => {
            setShowRuleForm(false);
            setEditingRule(null);
          }}
          onSuccess={() => {
            setShowRuleForm(false);
            setEditingRule(null);
          }}
        />
      )}

      {showChannelForm && (
        <NotificationChannelForm
          channel={editingChannel}
          onClose={() => {
            setShowChannelForm(false);
            setEditingChannel(null);
          }}
          onSuccess={() => {
            setShowChannelForm(false);
            setEditingChannel(null);
          }}
        />
      )}
    </div>
  );
}