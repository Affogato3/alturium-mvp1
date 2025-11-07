-- AI Insights and Analytics Tables
CREATE TABLE IF NOT EXISTS ai_analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  analysis_type TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}',
  output_data JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC(5,2),
  ai_model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entity_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  entity_type TEXT NOT NULL,
  source_system TEXT NOT NULL,
  source_id TEXT NOT NULL,
  canonical_id UUID NOT NULL,
  confidence_score NUMERIC(5,2),
  mapping_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS data_quality_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  report_type TEXT NOT NULL,
  dataset_name TEXT NOT NULL,
  quality_score NUMERIC(5,2),
  issues_found JSONB DEFAULT '[]',
  auto_fixes_applied JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  overall_score NUMERIC(5,2) NOT NULL,
  data_completeness_score NUMERIC(5,2),
  forecast_accuracy_score NUMERIC(5,2),
  compliance_readiness_score NUMERIC(5,2),
  score_breakdown JSONB DEFAULT '{}',
  industry_percentile NUMERIC(5,2),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS optimization_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  impact_amount NUMERIC(20,2),
  confidence_level NUMERIC(5,2),
  implementation_complexity TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  applied_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS scenario_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scenario_name TEXT NOT NULL,
  scenario_type TEXT NOT NULL,
  base_assumptions JSONB DEFAULT '{}',
  forecast_data JSONB DEFAULT '{}',
  confidence_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  narrative_type TEXT NOT NULL,
  context_data JSONB DEFAULT '{}',
  generated_text TEXT NOT NULL,
  key_insights JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS connector_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  connector_name TEXT NOT NULL,
  connector_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  health_score NUMERIC(5,2),
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  auto_heal_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_health ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage their own ai_analysis_logs" ON ai_analysis_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own entity_mappings" ON entity_mappings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own data_quality_reports" ON data_quality_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own trust_scores" ON trust_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own optimization_recommendations" ON optimization_recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own scenario_forecasts" ON scenario_forecasts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own ai_narratives" ON ai_narratives FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own connector_health" ON connector_health FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_ai_analysis_logs_user ON ai_analysis_logs(user_id, created_at DESC);
CREATE INDEX idx_entity_mappings_user ON entity_mappings(user_id, entity_type);
CREATE INDEX idx_trust_scores_user ON trust_scores(user_id, calculated_at DESC);
CREATE INDEX idx_optimization_recommendations_user ON optimization_recommendations(user_id, status);
CREATE INDEX idx_connector_health_user ON connector_health(user_id, status);