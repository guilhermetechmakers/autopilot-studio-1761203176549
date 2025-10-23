/**
 * Monitoring Utilities
 * Client-side utilities for metrics collection and monitoring
 */

import { metricsApi } from '@/api/monitoring';
import type { MetricInsert } from '@/types/monitoring';

// =====================================================
// METRICS COLLECTOR
// =====================================================

class MetricsCollector {
  private metrics: MetricInsert[] = [];
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private timer: number | null = null;
  private tenantId: string;

  constructor(tenantId: string = 'current-tenant') {
    this.tenantId = tenantId;
    this.startBatchFlush();
  }

  /**
   * Add a metric to the collection queue
   */
  addMetric(metric: Omit<MetricInsert, 'tenant_id'>) {
    this.metrics.push({
      ...metric,
      tenant_id: this.tenantId,
    });

    // Flush immediately if batch size is reached
    if (this.metrics.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Add multiple metrics at once
   */
  addMetrics(metrics: Omit<MetricInsert, 'tenant_id'>[]) {
    const metricsWithTenant = metrics.map(metric => ({
      ...metric,
      tenant_id: this.tenantId,
    }));
    
    this.metrics.push(...metricsWithTenant);

    // Flush immediately if batch size is reached
    if (this.metrics.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush all pending metrics to the server
   */
  async flush() {
    if (this.metrics.length === 0) return;

    try {
      const metricsToSend = [...this.metrics];
      this.metrics = [];

      await metricsApi.createMetrics({
        metrics: metricsToSend,
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
      // Re-add metrics to queue for retry
      this.metrics.unshift(...this.metrics);
    }
  }

  /**
   * Start automatic batch flushing
   */
  private startBatchFlush() {
    this.timer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop automatic batch flushing
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Flush remaining metrics
    this.flush();
  }

  /**
   * Update tenant ID
   */
  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }
}

// Global metrics collector instance
let globalMetricsCollector: MetricsCollector | null = null;

export function getMetricsCollector(tenantId?: string): MetricsCollector {
  if (!globalMetricsCollector) {
    globalMetricsCollector = new MetricsCollector(tenantId);
  } else if (tenantId) {
    globalMetricsCollector.setTenantId(tenantId);
  }
  return globalMetricsCollector;
}

// =====================================================
// PERFORMANCE METRICS
// =====================================================

export class PerformanceMetrics {
  private collector: MetricsCollector;

  constructor(tenantId?: string) {
    this.collector = getMetricsCollector(tenantId);
  }

  /**
   * Record page load time
   */
  recordPageLoadTime(pageName: string, loadTime: number) {
    this.collector.addMetric({
      metric_name: 'page_load_time',
      metric_type: 'histogram',
      metric_value: loadTime,
      labels: { page: pageName },
    });
  }

  /**
   * Record API response time
   */
  recordApiResponseTime(endpoint: string, method: string, responseTime: number, statusCode: number) {
    this.collector.addMetric({
      metric_name: 'api_response_time',
      metric_type: 'histogram',
      metric_value: responseTime,
      labels: { 
        endpoint, 
        method, 
        status_code: statusCode.toString() 
      },
    });
  }

  /**
   * Record API error
   */
  recordApiError(endpoint: string, method: string, errorCode: string) {
    this.collector.addMetric({
      metric_name: 'api_errors_total',
      metric_type: 'counter',
      metric_value: 1,
      labels: { 
        endpoint, 
        method, 
        error_code: errorCode 
      },
    });
  }

  /**
   * Record user interaction
   */
  recordUserInteraction(action: string, component: string, value?: string) {
    this.collector.addMetric({
      metric_name: 'user_interactions_total',
      metric_type: 'counter',
      metric_value: 1,
      labels: { 
        action, 
        component,
        ...(value && { value })
      },
    });
  }

  /**
   * Record custom business metric
   */
  recordBusinessMetric(name: string, value: number, labels: Record<string, string> = {}) {
    this.collector.addMetric({
      metric_name: name,
      metric_type: 'gauge',
      metric_value: value,
      labels,
    });
  }

  /**
   * Record system resource usage
   */
  recordSystemMetrics() {
    // Memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        this.collector.addMetric({
          metric_name: 'memory_usage_bytes',
          metric_type: 'gauge',
          metric_value: memory.usedJSHeapSize,
          labels: { type: 'used' },
        });
        
        this.collector.addMetric({
          metric_name: 'memory_usage_bytes',
          metric_type: 'gauge',
          metric_value: memory.totalJSHeapSize,
          labels: { type: 'total' },
        });
      }
    }

    // Navigation timing
    if (performance.timing) {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      this.collector.addMetric({
        metric_name: 'page_load_time',
        metric_type: 'histogram',
        metric_value: loadTime,
        labels: { page: window.location.pathname },
      });
    }
  }
}

// =====================================================
// ERROR TRACKING
// =====================================================

export class ErrorTracker {
  private collector: MetricsCollector;

  constructor(tenantId?: string) {
    this.collector = getMetricsCollector(tenantId);
  }

  /**
   * Track JavaScript errors
   */
  trackError(error: Error, context?: string) {
    this.collector.addMetric({
      metric_name: 'javascript_errors_total',
      metric_type: 'counter',
      metric_value: 1,
      labels: {
        error_name: error.name,
        error_message: error.message,
        context: context || 'unknown',
        url: window.location.href,
      },
    });
  }

  /**
   * Track unhandled promise rejections
   */
  trackUnhandledRejection(reason: any, context?: string) {
    this.collector.addMetric({
      metric_name: 'unhandled_rejections_total',
      metric_type: 'counter',
      metric_value: 1,
      labels: {
        reason: String(reason),
        context: context || 'unknown',
        url: window.location.href,
      },
    });
  }

  /**
   * Track network errors
   */
  trackNetworkError(url: string, status: number, method: string) {
    this.collector.addMetric({
      metric_name: 'network_errors_total',
      metric_type: 'counter',
      metric_value: 1,
      labels: {
        url,
        status: status.toString(),
        method,
      },
    });
  }
}

// =====================================================
// HEALTH CHECK UTILITIES
// =====================================================

export class HealthChecker {
  private collector: MetricsCollector;

  constructor(tenantId?: string) {
    this.collector = getMetricsCollector(tenantId);
  }

  /**
   * Perform HTTP health check
   */
  async checkHttpEndpoint(url: string, serviceName: string): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, { 
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok;
      
      this.collector.addMetric({
        metric_name: 'health_check_duration_ms',
        metric_type: 'histogram',
        metric_value: responseTime,
        labels: {
          service: serviceName,
          type: 'http',
          status: isHealthy ? 'healthy' : 'unhealthy',
        },
      });

      return isHealthy;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.collector.addMetric({
        metric_name: 'health_check_duration_ms',
        metric_type: 'histogram',
        metric_value: responseTime,
        labels: {
          service: serviceName,
          type: 'http',
          status: 'error',
        },
      });

      return false;
    }
  }

  /**
   * Check local storage availability
   */
  checkLocalStorage(): boolean {
    try {
      const testKey = '__health_check_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check session storage availability
   */
  checkSessionStorage(): boolean {
    try {
      const testKey = '__health_check_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check WebSocket connectivity
   */
  async checkWebSocket(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(url);
        
        const timeout = setTimeout(() => {
          ws.close();
          resolve(false);
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  }
}

// =====================================================
// INITIALIZATION
// =====================================================

export function initializeMonitoring(tenantId: string) {
  const collector = getMetricsCollector(tenantId);
  const performanceMetrics = new PerformanceMetrics(tenantId);
  const errorTracker = new ErrorTracker(tenantId);
  const healthChecker = new HealthChecker(tenantId);

  // Set up global error handlers
  window.addEventListener('error', (event) => {
    errorTracker.trackError(event.error, 'global');
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.trackUnhandledRejection(event.reason, 'global');
  });

  // Set up performance monitoring
  if (document.readyState === 'complete') {
    performanceMetrics.recordSystemMetrics();
  } else {
    window.addEventListener('load', () => {
      performanceMetrics.recordSystemMetrics();
    });
  }

  // Set up periodic system metrics collection
  setInterval(() => {
    performanceMetrics.recordSystemMetrics();
  }, 60000); // Every minute

  return {
    collector,
    performanceMetrics,
    errorTracker,
    healthChecker,
  };
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Create a timer for measuring duration
 */
export function createTimer() {
  const start = Date.now();
  return {
    end: () => Date.now() - start,
  };
}

/**
 * Measure function execution time
 */
export async function measureExecution<T>(
  fn: () => Promise<T>,
  metricName: string,
  labels: Record<string, string> = {}
): Promise<T> {
  const timer = createTimer();
  try {
    const result = await fn();
    const duration = timer.end();
    
    getMetricsCollector().addMetric({
      metric_name: metricName,
      metric_type: 'histogram',
      metric_value: duration,
      labels,
    });
    
    return result;
  } catch (error) {
    const duration = timer.end();
    
    getMetricsCollector().addMetric({
      metric_name: `${metricName}_error`,
      metric_type: 'histogram',
      metric_value: duration,
      labels: { ...labels, error: 'true' },
    });
    
    throw error;
  }
}

/**
 * Debounced metric collection
 */
const debounceCache = new Map<string, number>();

export function debounceMetric(
  metricName: string,
  value: number,
  labels: Record<string, string> = {},
  delay: number = 1000
) {
  const key = `${metricName}_${JSON.stringify(labels)}`;
  
  clearTimeout(debounceCache.get(key));
  
  debounceCache.set(key, setTimeout(() => {
    getMetricsCollector().addMetric({
      metric_name: metricName,
      metric_type: 'gauge',
      metric_value: value,
      labels,
    });
    debounceCache.delete(key);
  }, delay));
}