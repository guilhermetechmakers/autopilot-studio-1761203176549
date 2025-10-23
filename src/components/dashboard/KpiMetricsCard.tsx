/**
 * KPI Metrics Card Component
 * Displays key performance indicators with charts
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLatestKpiMetrics } from '@/hooks/useDashboard';
import { BarChart3, TrendingUp, TrendingDown, Minus, Plus, DollarSign, Users, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface KpiMetricsCardProps {
  className?: string;
}

export function KpiMetricsCard({ className }: KpiMetricsCardProps) {
  const { data: metrics, isLoading, error } = useLatestKpiMetrics();

  if (isLoading) {
    return (
      <Card className={cn('card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Key Metrics
          </CardTitle>
          <CardDescription>Your performance indicators and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('card-hover', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Key Metrics
          </CardTitle>
          <CardDescription>Your performance indicators and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-text-secondary">Failed to load metrics</p>
            <Button variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <DollarSign className="h-4 w-4" />;
      case 'projects':
        return <Target className="h-4 w-4" />;
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'performance':
        return <Zap className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (direction: string | null) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-positive" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-negative" />;
      default:
        return <Minus className="h-4 w-4 text-text-secondary" />;
    }
  };

  const getTrendColor = (direction: string | null) => {
    switch (direction) {
      case 'up':
        return 'text-positive';
      case 'down':
        return 'text-negative';
      default:
        return 'text-text-secondary';
    }
  };

  const formatMetricValue = (value: number, unit: string | null) => {
    if (unit === 'currency') {
      return `$${value.toLocaleString()}`;
    } else if (unit === 'percentage') {
      return `${value}%`;
    } else if (unit === 'count') {
      return value.toLocaleString();
    } else {
      return value.toString();
    }
  };

  // Sample chart data - in a real app, this would come from historical metrics
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ];

  const pieData = [
    { name: 'Active', value: 45, color: '#3AC569' },
    { name: 'In Progress', value: 30, color: '#4998F3' },
    { name: 'On Hold', value: 15, color: '#8A8F98' },
    { name: 'Completed', value: 10, color: '#FFA86A' },
  ];

  return (
    <Card className={cn('card-hover', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Key Metrics
            </CardTitle>
            <CardDescription>Your performance indicators and trends</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Metric
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {metrics && metrics.length > 0 ? (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.slice(0, 4).map((metric) => (
                <div key={metric.id} className="border border-border rounded-lg p-4 hover:bg-hover-overlay transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(metric.metric_category)}
                      <span className="text-sm font-medium text-text-primary">
                        {metric.metric_name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {metric.metric_category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-text-primary">
                        {formatMetricValue(metric.metric_value, metric.metric_unit)}
                      </div>
                      {metric.change_percentage && (
                        <div className={cn('flex items-center gap-1 text-sm', getTrendColor(metric.trend_direction))}>
                          {getTrendIcon(metric.trend_direction)}
                          <span>{Math.abs(metric.change_percentage)}%</span>
                        </div>
                      )}
                    </div>
                    {metric.previous_value && (
                      <div className="text-right text-xs text-text-secondary">
                        <div>Previous: {formatMetricValue(metric.previous_value, metric.metric_unit)}</div>
                        <div>Period: {new Date(metric.period_start).toLocaleDateString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <div className="space-y-4">
                <h4 className="font-semibold text-text-primary">Revenue Trend</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgb(var(--text-secondary))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="rgb(var(--text-secondary))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgb(var(--card))',
                          border: '1px solid rgb(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="rgb(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'rgb(var(--primary))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="space-y-4">
                <h4 className="font-semibold text-text-primary">Project Status</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgb(var(--card))',
                          border: '1px solid rgb(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-text-secondary">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {metrics.length > 4 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  View All Metrics ({metrics.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">No Metrics Available</h3>
            <p className="text-text-secondary mb-4">Start tracking your performance with key metrics</p>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Metric
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
