-- Cross-Border Payment Intelligence Platform Schema

-- Payment rails table (SWIFT, stablecoins, CBDCs, local networks)
CREATE TABLE IF NOT EXISTS payment_rails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rail_name TEXT NOT NULL,
  rail_type TEXT NOT NULL CHECK (rail_type IN ('swift_gpi', 'stablecoin', 'cbdc', 'local_network', 'blockchain')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'error')),
  health_score DECIMAL(5,2) DEFAULT 100.00,
  avg_latency_ms INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 100.00,
  last_ping_at TIMESTAMP WITH TIME ZONE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment routes table (optimized paths)
CREATE TABLE IF NOT EXISTS payment_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  corridor TEXT NOT NULL,
  rail_id UUID REFERENCES payment_rails(id),
  cost_usd DECIMAL(10,2) NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  compliance_score DECIMAL(3,2) DEFAULT 1.00,
  liquidity_available BOOLEAN DEFAULT true,
  ai_confidence DECIMAL(3,2) DEFAULT 0.00,
  route_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cross-border payments table
CREATE TABLE IF NOT EXISTS cross_border_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transaction_ref TEXT UNIQUE NOT NULL,
  amount DECIMAL(20,2) NOT NULL,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  from_country TEXT NOT NULL,
  to_country TEXT NOT NULL,
  corridor TEXT NOT NULL,
  selected_route_id UUID REFERENCES payment_routes(id),
  selected_rail_id UUID REFERENCES payment_rails(id),
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'routing', 'processing', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0,
  cost_savings_pct DECIMAL(5,2) DEFAULT 0,
  compliance_validated BOOLEAN DEFAULT false,
  purpose TEXT,
  tracking_data JSONB DEFAULT '{}',
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment analytics aggregates
CREATE TABLE IF NOT EXISTS payment_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period TEXT NOT NULL,
  total_volume DECIMAL(20,2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  avg_cost_savings_pct DECIMAL(5,2) DEFAULT 0,
  avg_settlement_minutes INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  top_corridor TEXT,
  top_rail_type TEXT,
  analytics_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Liquidity pools table
CREATE TABLE IF NOT EXISTS liquidity_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rail_id UUID REFERENCES payment_rails(id),
  currency TEXT NOT NULL,
  available_amount DECIMAL(20,2) DEFAULT 0,
  reserved_amount DECIMAL(20,2) DEFAULT 0,
  rebalance_threshold DECIMAL(20,2) DEFAULT 10000,
  last_rebalanced_at TIMESTAMP WITH TIME ZONE,
  pool_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_rails ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_border_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE liquidity_pools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_rails
CREATE POLICY "Users can view their own rails"
  ON payment_rails FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rails"
  ON payment_rails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rails"
  ON payment_rails FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_routes
CREATE POLICY "Users can view their own routes"
  ON payment_routes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own routes"
  ON payment_routes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cross_border_payments
CREATE POLICY "Users can view their own payments"
  ON cross_border_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON cross_border_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON cross_border_payments FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_analytics
CREATE POLICY "Users can view their own analytics"
  ON payment_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
  ON payment_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for liquidity_pools
CREATE POLICY "Users can view their own liquidity pools"
  ON liquidity_pools FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liquidity pools"
  ON liquidity_pools FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liquidity pools"
  ON liquidity_pools FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_payment_rails_user ON payment_rails(user_id);
CREATE INDEX idx_payment_rails_status ON payment_rails(status);
CREATE INDEX idx_payment_routes_user ON payment_routes(user_id);
CREATE INDEX idx_payment_routes_corridor ON payment_routes(corridor);
CREATE INDEX idx_cross_border_payments_user ON cross_border_payments(user_id);
CREATE INDEX idx_cross_border_payments_status ON cross_border_payments(status);
CREATE INDEX idx_cross_border_payments_ref ON cross_border_payments(transaction_ref);
CREATE INDEX idx_payment_analytics_user ON payment_analytics(user_id);
CREATE INDEX idx_liquidity_pools_user ON liquidity_pools(user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_rails_updated_at BEFORE UPDATE ON payment_rails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cross_border_payments_updated_at BEFORE UPDATE ON cross_border_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liquidity_pools_updated_at BEFORE UPDATE ON liquidity_pools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();