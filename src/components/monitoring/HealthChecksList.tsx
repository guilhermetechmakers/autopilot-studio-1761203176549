/**
 * Health Checks List Component
 * Displays system health check status and results
 */

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  RefreshCw,
  Clock,
  Server,
  Database,
  Globe,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useHealthChecks, usePerformHealthCheck } from '@/hooks/useMonitoring';

export function HealthChecksList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: healthChecksData, isLoading, refetch } = useHealthChecks({
    limit: 100,
  });

  const performHealthCheckMutation = usePerformHealthCheck();

  const healthChecks = healthChecksData?.data || [];

  const filteredHealthChecks = healthChecks.filter(check => {
    const matchesSearch = check.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.endpoint_url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || check.status === statusFilter;
    const matchesType = typeFilter === 'all' || check.check_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'unhealthy': return 'destructive';
      case 'degraded': return 'warning';
      case 'unknown': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unknown': return <HelpCircle className="h-4 w-4 text-gray-500" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'http': return <Globe className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'redis': return <Server className="h-4 w-4" />;
      case 'external_api': return <Zap className="h-4 w-4" />;
      case 'custom': return <Server className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePerformCheck = (serviceName: string, checkType: string, endpointUrl?: string) => {
    performHealthCheckMutation.mutate({
      service_name: serviceName,
      check_type: checkType as any,
      endpoint_url: endpointUrl,
    });
  };

  // Group health checks by status for summary
  const statusSummary = healthChecks.reduce((acc, check) => {
    acc[check.status] = (acc[check.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalChecks = healthChecks.length;
  const healthyChecks = statusSummary.healthy || 0;
  const healthPercentage = totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold text-foreground">{healthPercentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-3">
              <Progress value={healthPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Checks</p>
                <p className="text-2xl font-bold text-foreground">{totalChecks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Healthy</p>
                <p className="text-2xl font-bold text-foreground">{healthyChecks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issues</p>
                <p className="text-2xl font-bold text-foreground">
                  {(statusSummary.unhealthy || 0) + (statusSummary.degraded || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Health Check Filters
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="unhealthy">Unhealthy</SelectItem>
                <SelectItem value="degraded">Degraded</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="redis">Redis</SelectItem>
                <SelectItem value="external_api">External API</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Health Checks List */}
      <div className="space-y-4">
        {filteredHealthChecks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Server className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No health checks found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters to see more health checks.'
                  : 'No health checks are configured yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredHealthChecks.map((check) => (
            <Card key={check.id} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(check.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(check.check_type)}
                          <h3 className="text-lg font-semibold text-foreground">
                            {check.service_name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {check.check_type.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {check.endpoint_url && (
                          <p className="text-sm text-muted-foreground mb-3 font-mono">
                            {check.endpoint_url}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last check: {new Date(check.checked_at).toLocaleString()}
                          </span>
                          {check.response_time_ms && (
                            <span>
                              Response time: {check.response_time_ms}ms
                            </span>
                          )}
                          {check.status_code && (
                            <span>
                              Status code: {check.status_code}
                            </span>
                          )}
                        </div>
                        
                        {check.error_message && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Error:</strong> {check.error_message}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(check.status)}>
                          {check.status.toUpperCase()}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePerformCheck(
                            check.service_name, 
                            check.check_type, 
                            check.endpoint_url || undefined
                          )}
                          disabled={performHealthCheckMutation.isPending}
                        >
                          <RefreshCw className={`h-4 w-4 ${performHealthCheckMutation.isPending ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredHealthChecks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              Showing {filteredHealthChecks.length} of {healthChecks.length} health checks
              {searchTerm && ` matching "${searchTerm}"`}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              {typeFilter !== 'all' && ` of type "${typeFilter}"`}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}