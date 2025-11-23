-- Daily Briefing System Tables

-- Table: daily_briefs
CREATE TABLE IF NOT EXISTS public.daily_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  brief_date DATE NOT NULL,
  status TEXT DEFAULT 'draft',
  email_sent_at TIMESTAMPTZ,
  email_opened_at TIMESTAMPTZ,
  cash_amount NUMERIC(15,2),
  cash_change NUMERIC(15,2),
  revenue NUMERIC(15,2),
  revenue_change NUMERIC(15,2),
  expenses NUMERIC(15,2),
  burn_rate NUMERIC(15,2),
  runway_months NUMERIC(5,2),
  action_items_count INTEGER DEFAULT 0,
  ai_insights JSONB,
  raw_metrics JSONB,
  email_html TEXT,
  email_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: action_items
CREATE TABLE IF NOT EXISTS public.action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES public.daily_briefs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  urgency TEXT NOT NULL,
  impact TEXT,
  status TEXT DEFAULT 'pending',
  amount NUMERIC(15,2),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  snoozed_until TIMESTAMPTZ,
  metadata JSONB
);

-- Table: metric_history
CREATE TABLE IF NOT EXISTS public.metric_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  metric_date DATE NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC(15,2),
  comparison_type TEXT,
  comparison_value NUMERIC(15,2),
  percentile NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: financial_anomalies
CREATE TABLE IF NOT EXISTS public.financial_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  anomaly_date DATE NOT NULL,
  anomaly_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  context JSONB,
  acknowledged BOOLEAN DEFAULT false,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: brief_preferences
CREATE TABLE IF NOT EXISTS public.brief_preferences (
  user_id UUID PRIMARY KEY,
  delivery_time TIME DEFAULT '07:00:00',
  timezone TEXT DEFAULT 'America/New_York',
  verbosity TEXT DEFAULT 'standard',
  metric_priorities JSONB,
  alert_thresholds JSONB,
  enabled_sections JSONB DEFAULT '["cash", "revenue", "actions", "stats", "priorities"]'::jsonb,
  email_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brief_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_briefs
CREATE POLICY "Users can view their own briefs" ON public.daily_briefs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own briefs" ON public.daily_briefs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own briefs" ON public.daily_briefs
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for action_items
CREATE POLICY "Users can view their own action items" ON public.action_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own action items" ON public.action_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own action items" ON public.action_items
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for metric_history
CREATE POLICY "Users can view their own metrics" ON public.metric_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics" ON public.metric_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for financial_anomalies
CREATE POLICY "Users can view their own anomalies" ON public.financial_anomalies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create anomalies" ON public.financial_anomalies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anomalies" ON public.financial_anomalies
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for brief_preferences
CREATE POLICY "Users can view their own preferences" ON public.brief_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.brief_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.brief_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_daily_briefs_user_date ON public.daily_briefs(user_id, brief_date DESC);
CREATE INDEX idx_action_items_user_status ON public.action_items(user_id, status);
CREATE INDEX idx_metric_history_user_date ON public.metric_history(user_id, metric_date DESC);
CREATE INDEX idx_anomalies_user_date ON public.financial_anomalies(user_id, anomaly_date DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_briefs_updated_at
  BEFORE UPDATE ON public.daily_briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brief_preferences_updated_at
  BEFORE UPDATE ON public.brief_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();