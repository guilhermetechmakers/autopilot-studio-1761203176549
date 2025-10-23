/**
 * Alerts List Component
 * Displays and manages system alerts
 */

import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Bell,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlerts, useAcknowledgeAlert, useResolveAlert, useSilenceAlert } from '@/hooks/useMonitoring';

export function AlertsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const { data: alertsData, isLoading } = useAlerts({
    limit: 50,
  });

  const acknowledgeAlertMutation = useAcknowledgeAlert();
  const resolveAlertMutation = useResolveAlert();
  const silenceAlertMutation = useSilenceAlert();

  const alerts = alertsData?.data || [];

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'firing': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'silenced': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlertMutation.mutate({ id: alertId });
  };

  const handleResolve = (alertId: string) => {
    resolveAlertMutation.mutate({ id: alertId });
  };

  const handleSilence = (alertId: string) => {
    silenceAlertMutation.mutate({ id: alertId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Alert Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="firing">Firing</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="silenced">Silenced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No alerts found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || statusFilter !== 'all' || severityFilter !== 'all'
                  ? 'Try adjusting your filters to see more alerts.'
                  : 'All systems are running smoothly. No alerts at this time.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(alert.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {alert.title}
                        </h3>
                        {alert.description && (
                          <p className="text-muted-foreground text-sm mb-3">
                            {alert.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Fired: {new Date(alert.fired_at).toLocaleString()}
                          </span>
                          <span>
                            Value: {alert.metric_value.toFixed(2)} (threshold: {alert.threshold_value.toFixed(2)})
                          </span>
                          {alert.acknowledged_at && (
                            <span>
                              Acknowledged: {new Date(alert.acknowledged_at).toLocaleString()}
                            </span>
                          )}
                          {alert.resolved_at && (
                            <span>
                              Resolved: {new Date(alert.resolved_at).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {alert.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {alert.status === 'firing' && (
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                          disabled={acknowledgeAlertMutation.isPending}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(alert.id)}
                          disabled={resolveAlertMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSilence(alert.id)}
                          disabled={silenceAlertMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Silence
                        </Button>
                      </div>
                    )}
                    
                    {alert.resolution_notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Resolution Notes:</strong> {alert.resolution_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredAlerts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} of {alerts.length} alerts
              {searchTerm && ` matching "${searchTerm}"`}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              {severityFilter !== 'all' && ` with severity "${severityFilter}"`}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}