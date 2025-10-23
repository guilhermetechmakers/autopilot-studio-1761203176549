-- =====================================================
-- Migration: Create Monitoring System Tables
-- Created: 2024-12-20T12:00:00Z
-- Tables: metrics, alerts, health_checks, alert_rules
-- Purpose: Enable comprehensive performance monitoring and alerting
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: metrics
-- Purpose: Store application performance metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  
  -- Metric identification
  metric_name TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('counter', 'gauge', 'histogram', 'summary')),
  metric_value NUMERIC NOT NULL,
  
  -- Labels for grouping and filtering
  labels JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT metrics_name_not_empty CHECK (length(trim(metric_name)) > 0),
  CONSTRAINT metrics_value_valid CHECK (metric_value >= 0)
);

-- Performance indexes for metrics
CREATE INDEX IF NOT EXISTS metrics_tenant_id_idx ON metrics(tenant_id);
CREATE INDEX IF NOT EXISTS metrics_name_idx ON metrics(metric_name);
CREATE INDEX IF NOT EXISTS metrics_timestamp_idx ON metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS metrics_type_idx ON metrics(metric_type);
CREATE INDEX IF NOT EXISTS metrics_labels_idx ON metrics USING GIN(labels);

-- =====================================================
-- TABLE: alert_rules
-- Purpose: Define alerting rules and thresholds
-- =====================================================
CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  
  -- Rule definition
  name TEXT NOT NULL,
  description TEXT,
  metric_name TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('gt', 'gte', 'lt', 'lte', 'eq', 'neq')),
  threshold_value NUMERIC NOT NULL,
  
  -- Alert configuration
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  enabled BOOLEAN DEFAULT true,
  
  -- Notification settings
  notification_channels JSONB DEFAULT '[]'::jsonb,
  cooldown_minutes INTEGER DEFAULT 15,
  
  -- Labels for filtering
  label_filters JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT alert_rules_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT alert_rules_metric_name_not_empty CHECK (length(trim(metric_name)) > 0),
  CONSTRAINT alert_rules_cooldown_positive CHECK (cooldown_minutes > 0)
);

-- Performance indexes for alert_rules
CREATE INDEX IF NOT EXISTS alert_rules_tenant_id_idx ON alert_rules(tenant_id);
CREATE INDEX IF NOT EXISTS alert_rules_enabled_idx ON alert_rules(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS alert_rules_metric_name_idx ON alert_rules(metric_name);

-- Auto-update trigger for alert_rules
DROP TRIGGER IF EXISTS update_alert_rules_updated_at ON alert_rules;
CREATE TRIGGER update_alert_rules_updated_at
  BEFORE UPDATE ON alert_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: alerts
-- Purpose: Store triggered alerts and their status
-- =====================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  rule_id UUID REFERENCES alert_rules(id) ON DELETE CASCADE NOT NULL,
  
  -- Alert details
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'firing' CHECK (status IN ('firing', 'resolved', 'acknowledged', 'silenced')),
  
  -- Metric data at time of alert
  metric_value NUMERIC NOT NULL,
  threshold_value NUMERIC NOT NULL,
  labels JSONB DEFAULT '{}'::jsonb,
  
  -- Resolution tracking
  resolved_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID,
  resolution_notes TEXT,
  
  -- Timestamps
  fired_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT alerts_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT alerts_metric_value_valid CHECK (metric_value >= 0),
  CONSTRAINT alerts_threshold_value_valid CHECK (threshold_value >= 0)
);

-- Performance indexes for alerts
CREATE INDEX IF NOT EXISTS alerts_tenant_id_idx ON alerts(tenant_id);
CREATE INDEX IF NOT EXISTS alerts_rule_id_idx ON alerts(rule_id);
CREATE INDEX IF NOT EXISTS alerts_status_idx ON alerts(status);
CREATE INDEX IF NOT EXISTS alerts_severity_idx ON alerts(severity);
CREATE INDEX IF NOT EXISTS alerts_fired_at_idx ON alerts(fired_at DESC);
CREATE INDEX IF NOT EXISTS alerts_labels_idx ON alerts USING GIN(labels);

-- Auto-update trigger for alerts
DROP TRIGGER IF EXISTS update_alerts_updated_at ON alerts;
CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: health_checks
-- Purpose: Store health check results and status
-- =====================================================
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  
  -- Health check identification
  service_name TEXT NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('http', 'database', 'redis', 'external_api', 'custom')),
  endpoint_url TEXT,
  
  -- Check results
  status TEXT NOT NULL CHECK (status IN ('healthy', 'unhealthy', 'degraded', 'unknown')),
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  
  -- Check metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  checked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT health_checks_service_name_not_empty CHECK (length(trim(service_name)) > 0),
  CONSTRAINT health_checks_response_time_positive CHECK (response_time_ms IS NULL OR response_time_ms >= 0),
  CONSTRAINT health_checks_status_code_valid CHECK (status_code IS NULL OR (status_code >= 100 AND status_code < 600))
);

-- Performance indexes for health_checks
CREATE INDEX IF NOT EXISTS health_checks_tenant_id_idx ON health_checks(tenant_id);
CREATE INDEX IF NOT EXISTS health_checks_service_name_idx ON health_checks(service_name);
CREATE INDEX IF NOT EXISTS health_checks_status_idx ON health_checks(status);
CREATE INDEX IF NOT EXISTS health_checks_checked_at_idx ON health_checks(checked_at DESC);
CREATE INDEX IF NOT EXISTS health_checks_type_idx ON health_checks(check_type);

-- =====================================================
-- TABLE: notification_channels
-- Purpose: Store notification channel configurations
-- =====================================================
CREATE TABLE IF NOT EXISTS notification_channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  
  -- Channel configuration
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'slack', 'webhook', 'sms', 'pagerduty')),
  enabled BOOLEAN DEFAULT true,
  
  -- Channel-specific settings
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT notification_channels_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT notification_channels_settings_not_empty CHECK (jsonb_typeof(settings) = 'object')
);

-- Performance indexes for notification_channels
CREATE INDEX IF NOT EXISTS notification_channels_tenant_id_idx ON notification_channels(tenant_id);
CREATE INDEX IF NOT EXISTS notification_channels_type_idx ON notification_channels(type);
CREATE INDEX IF NOT EXISTS notification_channels_enabled_idx ON notification_channels(enabled) WHERE enabled = true;

-- Auto-update trigger for notification_channels
DROP TRIGGER IF EXISTS update_notification_channels_updated_at ON notification_channels;
CREATE TRIGGER update_notification_channels_updated_at
  BEFORE UPDATE ON notification_channels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_channels ENABLE ROW LEVEL SECURITY;

-- Metrics policies
CREATE POLICY "metrics_select_tenant"
  ON metrics FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "metrics_insert_tenant"
  ON metrics FOR INSERT
  WITH CHECK (tenant_id = auth.uid());

-- Alert rules policies
CREATE POLICY "alert_rules_select_tenant"
  ON alert_rules FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "alert_rules_insert_tenant"
  ON alert_rules FOR INSERT
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "alert_rules_update_tenant"
  ON alert_rules FOR UPDATE
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "alert_rules_delete_tenant"
  ON alert_rules FOR DELETE
  USING (tenant_id = auth.uid());

-- Alerts policies
CREATE POLICY "alerts_select_tenant"
  ON alerts FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "alerts_insert_tenant"
  ON alerts FOR INSERT
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "alerts_update_tenant"
  ON alerts FOR UPDATE
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());

-- Health checks policies
CREATE POLICY "health_checks_select_tenant"
  ON health_checks FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "health_checks_insert_tenant"
  ON health_checks FOR INSERT
  WITH CHECK (tenant_id = auth.uid());

-- Notification channels policies
CREATE POLICY "notification_channels_select_tenant"
  ON notification_channels FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "notification_channels_insert_tenant"
  ON notification_channels FOR INSERT
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "notification_channels_update_tenant"
  ON notification_channels FOR UPDATE
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "notification_channels_delete_tenant"
  ON notification_channels FOR DELETE
  USING (tenant_id = auth.uid());

-- =====================================================
-- DOCUMENTATION
-- =====================================================
COMMENT ON TABLE metrics IS 'Application performance metrics storage';
COMMENT ON TABLE alert_rules IS 'Alerting rules and threshold definitions';
COMMENT ON TABLE alerts IS 'Triggered alerts and their resolution status';
COMMENT ON TABLE health_checks IS 'Health check results for various services';
COMMENT ON TABLE notification_channels IS 'Notification channel configurations for alerts';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS notification_channels CASCADE;
-- DROP TABLE IF EXISTS health_checks CASCADE;
-- DROP TABLE IF EXISTS alerts CASCADE;
-- DROP TABLE IF EXISTS alert_rules CASCADE;
-- DROP TABLE IF EXISTS metrics CASCADE;