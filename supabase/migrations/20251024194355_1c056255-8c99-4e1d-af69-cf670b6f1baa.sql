-- Create liquidity_nodes table for Data Fusion Layer
CREATE TABLE IF NOT EXISTS public.liquidity_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    entity VARCHAR(255) NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    balance NUMERIC(18, 2) NOT NULL DEFAULT 0,
    maturity_date DATE,
    risk_weight FLOAT DEFAULT 0,
    flow_direction VARCHAR(50) CHECK (flow_direction IN ('inflow', 'outflow', 'neutral')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.liquidity_nodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own liquidity nodes"
ON public.liquidity_nodes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liquidity nodes"
ON public.liquidity_nodes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liquidity nodes"
ON public.liquidity_nodes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liquidity nodes"
ON public.liquidity_nodes FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_liquidity_nodes_user_id ON public.liquidity_nodes(user_id);
CREATE INDEX idx_liquidity_nodes_timestamp ON public.liquidity_nodes(timestamp DESC);
CREATE INDEX idx_liquidity_nodes_flow_direction ON public.liquidity_nodes(flow_direction);

-- Add trigger for updated_at
CREATE TRIGGER update_liquidity_nodes_updated_at
BEFORE UPDATE ON public.liquidity_nodes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();