/**
 * System Metrics Component
 * Displays real-time system performance metrics
 */

import { useSystemMetrics } from '@/hooks/useMonitoring';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Network, 
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export function SystemMetrics() {
  const { data: systemMetrics, isLoading } = useSystemMetrics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = systemMetrics?.data || {
    cpu_usage: 0,
    memory_usage: 0,
    disk_usage: 0,
    network_io: { bytes_in: 0, bytes_out: 0 },
    active_connections: 0,
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const getUsageVariant = (usage: number) => {
    if (usage >= 90) return 'destructive';
    if (usage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="space-y-4">
      {/* CPU Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">CPU Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getUsageVariant(metrics.cpu_usage)}>
              {metrics.cpu_usage.toFixed(1)}%
            </Badge>
            {metrics.cpu_usage > 75 ? (
              <TrendingUp className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
          </div>
        </div>
        <Progress 
          value={metrics.cpu_usage} 
          className="h-2"
        />
        <div className="text-xs text-muted-foreground">
          {metrics.cpu_usage < 50 ? 'Low usage' : 
           metrics.cpu_usage < 75 ? 'Moderate usage' : 
           metrics.cpu_usage < 90 ? 'High usage' : 'Critical usage'}
        </div>
      </div>

      {/* Memory Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Memory Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getUsageVariant(metrics.memory_usage)}>
              {metrics.memory_usage.toFixed(1)}%
            </Badge>
            {metrics.memory_usage > 75 ? (
              <TrendingUp className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
          </div>
        </div>
        <Progress 
          value={metrics.memory_usage} 
          className="h-2"
        />
        <div className="text-xs text-muted-foreground">
          {metrics.memory_usage < 50 ? 'Low usage' : 
           metrics.memory_usage < 75 ? 'Moderate usage' : 
           metrics.memory_usage < 90 ? 'High usage' : 'Critical usage'}
        </div>
      </div>

      {/* Disk Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Disk Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getUsageVariant(metrics.disk_usage)}>
              {metrics.disk_usage.toFixed(1)}%
            </Badge>
            {metrics.disk_usage > 75 ? (
              <TrendingUp className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
          </div>
        </div>
        <Progress 
          value={metrics.disk_usage} 
          className="h-2"
        />
        <div className="text-xs text-muted-foreground">
          {metrics.disk_usage < 50 ? 'Low usage' : 
           metrics.disk_usage < 75 ? 'Moderate usage' : 
           metrics.disk_usage < 90 ? 'High usage' : 'Critical usage'}
        </div>
      </div>

      {/* Network I/O */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium">Network I/O</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">In</span>
            <span className="font-medium">{formatBytes(metrics.network_io.bytes_in)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Out</span>
            <span className="font-medium">{formatBytes(metrics.network_io.bytes_out)}</span>
          </div>
        </div>
      </div>

      {/* Active Connections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-medium">Active Connections</span>
          </div>
          <Badge variant="outline">
            {metrics.active_connections}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Current active network connections
        </div>
      </div>

      {/* System Status Summary */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">System Status</span>
          <Badge 
            variant={
              metrics.cpu_usage < 75 && metrics.memory_usage < 75 && metrics.disk_usage < 75
                ? 'success' 
                : 'warning'
            }
          >
            {metrics.cpu_usage < 75 && metrics.memory_usage < 75 && metrics.disk_usage < 75
              ? 'Healthy'
              : 'Attention Needed'
            }
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {metrics.cpu_usage < 75 && metrics.memory_usage < 75 && metrics.disk_usage < 75
            ? 'All system resources are within normal operating ranges.'
            : 'One or more system resources are approaching critical levels.'}
        </div>
      </div>
    </div>
  );
}