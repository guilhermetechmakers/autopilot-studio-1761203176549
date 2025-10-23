/**
 * Monitoring Dashboard Component
 * Main dashboard for performance monitoring and alerting
 */

import { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  BarChart3,
  Bell,
  Heart,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMonitoringDashboard, useAlertSummary, useHealthSummary, useSystemHealth } from '@/hooks/useMonitoring';
import { MetricsChart } from './MetricsChart';
import { AlertsList } from './AlertsList';
import { HealthChecksList } from './HealthChecksList';
import { SystemMetrics } from './SystemMetrics';

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: dashboardData, isLoading: dashboardLoading } = useMonitoringDashboard();
  const { data: alertSummary, isLoading: alertSummaryLoading } = useAlertSummary();
  const { data: healthSummary, isLoading: healthSummaryLoading } = useHealthSummary();
  const { data: systemHealth, isLoading: systemHealthLoading } = useSystemHealth();

  const isLoading = dashboardLoading || alertSummaryLoading || healthSummaryLoading || systemHealthLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.data?.metrics || {
    total_metrics: 0,
    active_alerts: 0,
    healthy_services: 0,
    avg_response_time: 0,
  };

  const alerts = alertSummary?.data || {
    total: 0,
    firing: 0,
    resolved: 0,
    acknowledged: 0,
    by_severity: { low: 0, medium: 0, high: 0, critical: 0 },
  };

  const health = healthSummary?.data || {
    total_services: 0,
    healthy: 0,
    unhealthy: 0,
    degraded: 0,
    unknown: 0,
    avg_response_time: 0,
  };

  const system = systemHealth?.data || {
    status: 'unknown',
    services: [],
    uptime: 0,
    version: '1.0.0',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance Monitoring</h1>
              <p className="text-muted-foreground mt-1">
                Real-time system health, metrics, and alerting dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Metrics</p>
                  <p className="text-2xl font-bold text-foreground">{metrics.total_metrics.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-foreground">{alerts.firing}</p>
                  <p className="text-xs text-muted-foreground">
                    {alerts.by_severity.critical > 0 && `${alerts.by_severity.critical} critical`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Healthy Services</p>
                  <p className="text-2xl font-bold text-foreground">{health.healthy}</p>
                  <p className="text-xs text-muted-foreground">
                    of {health.total_services} total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold text-foreground">
                    {metrics.avg_response_time.toFixed(0)}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  variant={system.status === 'healthy' ? 'success' : system.status === 'degraded' ? 'warning' : 'destructive'}
                >
                  {system.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Uptime: {Math.floor(system.uptime / 3600)}h {Math.floor((system.uptime % 3600) / 60)}m
                </span>
              </div>
              <div className="space-y-2">
                {system.services.slice(0, 3).map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={service.status === 'healthy' ? 'success' : 'destructive'}
                        className="text-xs"
                      >
                        {service.status}
                      </Badge>
                      {service.response_time_ms && (
                        <span className="text-muted-foreground">
                          {service.response_time_ms}ms
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Firing</span>
                  <Badge variant="destructive">{alerts.firing}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Acknowledged</span>
                  <Badge variant="secondary">{alerts.acknowledged}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Resolved</span>
                  <Badge variant="success">{alerts.resolved}</Badge>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Critical:</span>
                      <span className="font-medium">{alerts.by_severity.critical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High:</span>
                      <span className="font-medium">{alerts.by_severity.high}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medium:</span>
                      <span className="font-medium">{alerts.by_severity.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Low:</span>
                      <span className="font-medium">{alerts.by_severity.low}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Healthy</span>
                  <Badge variant="success">{health.healthy}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unhealthy</span>
                  <Badge variant="destructive">{health.unhealthy}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Degraded</span>
                  <Badge variant="warning">{health.degraded}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unknown</span>
                  <Badge variant="secondary">{health.unknown}</Badge>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Avg Response: {health.avg_response_time.toFixed(0)}ms
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="health">Health Checks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Metrics</CardTitle>
                  <CardDescription>Real-time system performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemMetrics />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.data?.recent_alerts?.slice(0, 5).map((alert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.fired_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Historical performance data and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsList />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <HealthChecksList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}