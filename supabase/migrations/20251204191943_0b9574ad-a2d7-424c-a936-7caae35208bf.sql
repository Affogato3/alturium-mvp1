-- Kalman Filter Metric Estimation System Tables

-- Store Kalman filter state for each metric per user
CREATE TABLE public.kalman_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  state_vector JSONB NOT NULL DEFAULT '[]'::jsonb,
  covariance_matrix JSONB NOT NULL DEFAULT '[]'::jsonb,
  kalman_gain NUMERIC(10,6),
  signal_to_noise_ratio NUMERIC(10,4),
  model_type TEXT DEFAULT 'simple_trend',
  process_noise JSONB DEFAULT '[]'::jsonb,
  measurement_noise JSONB DEFAULT '[]'::jsonb,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, metric_name)
);

-- Store raw observations from various data sources
CREATE TABLE public.metric_observations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  observed_value NUMERIC(15,4) NOT NULL,
  source TEXT NOT NULL,
  confidence NUMERIC(5,4) DEFAULT 0.8,
  latency_seconds INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store Kalman filter estimates with confidence intervals
CREATE TABLE public.metric_estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  estimated_value NUMERIC(15,4) NOT NULL,
  confidence_interval_95_lower NUMERIC(15,4),
  confidence_interval_95_upper NUMERIC(15,4),
  confidence_interval_68_lower NUMERIC(15,4),
  confidence_interval_68_upper NUMERIC(15,4),
  innovation NUMERIC(15,4),
  kalman_gain NUMERIC(10,6),
  data_quality_score NUMERIC(5,4),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store metric forecasts
CREATE TABLE public.metric_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_value NUMERIC(15,4) NOT NULL,
  confidence_interval_lower NUMERIC(15,4),
  confidence_interval_upper NUMERIC(15,4),
  forecast_horizon_days INTEGER,
  model_confidence NUMERIC(5,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store detected anomalies
CREATE TABLE public.kalman_anomalies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  anomaly_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  innovation NUMERIC(15,4),
  std_deviations NUMERIC(10,4),
  ai_classification JSONB DEFAULT '{}'::jsonb,
  impact_analysis JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'detected',
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store AI-generated insights
CREATE TABLE public.kalman_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  insight_type TEXT NOT NULL,
  explanation TEXT,
  executive_summary TEXT,
  recommendations JSONB DEFAULT '[]'::jsonb,
  confidence NUMERIC(5,4),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kalman_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kalman_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kalman_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage their own kalman_states" ON public.kalman_states FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own metric_observations" ON public.metric_observations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own metric_estimates" ON public.metric_estimates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own metric_forecasts" ON public.metric_forecasts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own kalman_anomalies" ON public.kalman_anomalies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own kalman_insights" ON public.kalman_insights FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_kalman_states_user_metric ON public.kalman_states(user_id, metric_name);
CREATE INDEX idx_metric_observations_user_metric ON public.metric_observations(user_id, metric_name, timestamp);
CREATE INDEX idx_metric_estimates_user_metric ON public.metric_estimates(user_id, metric_name, timestamp);
CREATE INDEX idx_metric_forecasts_user_metric ON public.metric_forecasts(user_id, metric_name, forecast_date);
CREATE INDEX idx_kalman_anomalies_user_metric ON public.kalman_anomalies(user_id, metric_name, detected_at);