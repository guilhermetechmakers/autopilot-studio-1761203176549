/**
 * Metrics Chart Component
 * Displays performance metrics using Recharts
 */

import { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTimeSeriesData } from '@/hooks/useMonitoring';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

interface MetricsChartProps {
  className?: string;
}

export function MetricsChart({ className }: MetricsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState('response_time');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState('1h');

  // Calculate time range
  const now = new Date();
  const timeRanges = {
    '1h': new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    '6h': new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const { data: timeSeriesData, isLoading } = useTimeSeriesData(
    selectedMetric,
    timeRanges[timeRange as keyof typeof timeRanges],
    now.toISOString()
  );

  // Mock data for demonstration
  const mockData = useMemo(() => {
    const data = [];
    const points = timeRange === '1h' ? 12 : timeRange === '6h' ? 24 : timeRange === '24h' ? 48 : 168;
    const interval = timeRange === '1h' ? 5 : timeRange === '6h' ? 15 : timeRange === '24h' ? 30 : 60;
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now.getTime() - (points - i) * interval * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString(),
        response_time: Math.random() * 200 + 50,
        cpu_usage: Math.random() * 40 + 20,
        memory_usage: Math.random() * 30 + 40,
        error_rate: Math.random() * 5,
        requests_per_second: Math.random() * 100 + 50,
      });
    }
    return data;
  }, [timeRange, now]);

  const data = timeSeriesData?.data?.data || mockData;

  const chartColors = {
    response_time: '#4998F3',
    cpu_usage: '#FFA86A',
    memory_usage: '#3AC569',
    error_rate: '#F44336',
    requests_per_second: '#7CB8F7',
  };

  const metricConfigs = {
    response_time: {
      name: 'Response Time',
      unit: 'ms',
      color: chartColors.response_time,
      icon: Activity,
    },
    cpu_usage: {
      name: 'CPU Usage',
      unit: '%',
      color: chartColors.cpu_usage,
      icon: TrendingUp,
    },
    memory_usage: {
      name: 'Memory Usage',
      unit: '%',
      color: chartColors.memory_usage,
      icon: BarChart3,
    },
    error_rate: {
      name: 'Error Rate',
      unit: '%',
      color: chartColors.error_rate,
      icon: Activity,
    },
    requests_per_second: {
      name: 'Requests/sec',
      unit: 'req/s',
      color: chartColors.requests_per_second,
      icon: Activity,
    },
  };

  const currentConfig = metricConfigs[selectedMetric as keyof typeof metricConfigs];

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="rgb(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="rgb(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(var(--popover))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentConfig.color}
              fill={currentConfig.color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="rgb(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="rgb(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(var(--popover))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar
              dataKey={selectedMetric}
              fill={currentConfig.color}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="rgb(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="rgb(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(var(--popover))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentConfig.color}
              strokeWidth={2}
              dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: currentConfig.color, strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(metricConfigs).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{config.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            <Activity className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('area')}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="6h">6 Hours</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold" style={{ color: currentConfig.color }}>
            {data.length > 0 ? (data[data.length - 1] as any)[selectedMetric]?.toFixed(1) : '0'}
          </div>
          <div className="text-sm text-muted-foreground">
            Current {currentConfig.unit}
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold" style={{ color: currentConfig.color }}>
            {data.length > 0 ? Math.max(...data.map(d => (d as any)[selectedMetric])).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-muted-foreground">
            Max {currentConfig.unit}
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold" style={{ color: currentConfig.color }}>
            {data.length > 0 ? Math.min(...data.map(d => (d as any)[selectedMetric])).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-muted-foreground">
            Min {currentConfig.unit}
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold" style={{ color: currentConfig.color }}>
            {data.length > 0 ? (data.reduce((sum, d) => sum + (d as any)[selectedMetric], 0) / data.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-muted-foreground">
            Avg {currentConfig.unit}
          </div>
        </div>
      </div>
    </div>
  );
}