-- Quantum Market Matrix Database Schema

-- Portfolio positions
CREATE TABLE IF NOT EXISTS portfolio_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  symbol TEXT NOT NULL,
  qty NUMERIC NOT NULL,
  avg_price NUMERIC NOT NULL,
  current_price NUMERIC,
  account TEXT,
  sector TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market signals
CREATE TABLE IF NOT EXISTS market_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL, -- 'buy', 'sell', 'rebalance', 'hedge'
  confidence NUMERIC NOT NULL,
  suggested_action JSONB NOT NULL,
  explainability JSONB,
  model_version TEXT,
  audit_ref TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'executed', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insider activity tracking
CREATE TABLE IF NOT EXISTS insider_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  symbol TEXT NOT NULL,
  insider_name TEXT,
  transaction_type TEXT, -- 'buy', 'sell'
  shares NUMERIC,
  price NUMERIC,
  filing_date TIMESTAMPTZ,
  anomaly_score NUMERIC,
  cluster_id TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI mappings (business metrics to market exposure)
CREATE TABLE IF NOT EXISTS kpi_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  kpi_name TEXT NOT NULL,
  kpi_value NUMERIC,
  related_symbols TEXT[],
  correlation_score NUMERIC,
  impact_type TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Correlation graph nodes
CREATE TABLE IF NOT EXISTS correlation_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  symbol TEXT NOT NULL,
  node_type TEXT, -- 'stock', 'commodity', 'index', 'rate', 'kpi'
  position_x NUMERIC,
  position_y NUMERIC,
  position_z NUMERIC,
  volatility NUMERIC,
  strength NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Correlation graph edges
CREATE TABLE IF NOT EXISTS correlation_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  from_node_id UUID REFERENCES correlation_nodes(id),
  to_node_id UUID REFERENCES correlation_nodes(id),
  correlation_value NUMERIC,
  edge_type TEXT, -- 'supply_chain', 'sector', 'macro', 'sentiment'
  weight NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Execution orders
CREATE TABLE IF NOT EXISTS execution_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  signal_id UUID REFERENCES market_signals(id),
  symbol TEXT NOT NULL,
  order_type TEXT NOT NULL, -- 'market', 'limit', 'stop'
  side TEXT NOT NULL, -- 'buy', 'sell'
  quantity NUMERIC NOT NULL,
  price NUMERIC,
  status TEXT DEFAULT 'pending', -- 'pending', 'submitted', 'filled', 'rejected', 'cancelled'
  execution_mode TEXT DEFAULT 'advisory', -- 'advisory', 'automated'
  compliance_checked BOOLEAN DEFAULT false,
  broker TEXT,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictive flow data
CREATE TABLE IF NOT EXISTS predictive_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  symbol TEXT NOT NULL,
  sector TEXT,
  predicted_inflow NUMERIC,
  predicted_outflow NUMERIC,
  net_flow NUMERIC,
  confidence NUMERIC,
  prediction_horizon TEXT, -- '1d', '7d', '30d'
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sentiment data
CREATE TABLE IF NOT EXISTS sentiment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  symbol TEXT NOT NULL,
  source TEXT, -- 'news', 'social', 'sec_filing', 'analyst'
  sentiment_score NUMERIC, -- -1 to 1
  content TEXT,
  url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market scenarios (simulations)
CREATE TABLE IF NOT EXISTS market_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scenario_name TEXT NOT NULL,
  scenario_type TEXT, -- 'shock', 'stress', 'custom'
  parameters JSONB,
  results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE portfolio_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE insider_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE correlation_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE correlation_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentiment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own portfolio positions"
  ON portfolio_positions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own signals"
  ON market_signals FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own insider activities"
  ON insider_activities FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own KPI mappings"
  ON kpi_mappings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own correlation nodes"
  ON correlation_nodes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own correlation edges"
  ON correlation_edges FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own execution orders"
  ON execution_orders FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own predictive flows"
  ON predictive_flows FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sentiment data"
  ON sentiment_data FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own scenarios"
  ON market_scenarios FOR ALL
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_portfolio_positions_updated_at
  BEFORE UPDATE ON portfolio_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kpi_mappings_updated_at
  BEFORE UPDATE ON kpi_mappings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();