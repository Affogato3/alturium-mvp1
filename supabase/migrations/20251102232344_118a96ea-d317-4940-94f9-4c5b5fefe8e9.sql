-- FinSynapse™ Database Schema

-- Financial Accounts Table
CREATE TABLE public.financial_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  balance DECIMAL(20, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transactions Table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_id UUID REFERENCES public.financial_accounts(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount DECIMAL(20, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  metadata JSONB DEFAULT '{}',
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reconciliation Logs Table
CREATE TABLE public.reconciliation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL,
  sources_checked INTEGER DEFAULT 0,
  anomalies_found INTEGER DEFAULT 0,
  confidence_score DECIMAL(5, 2),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Liquidity Forecasts Table
CREATE TABLE public.liquidity_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_balance DECIMAL(20, 2),
  confidence_level DECIMAL(5, 2),
  risk_level TEXT,
  recommendations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Anomaly Detections Table
CREATE TABLE public.anomaly_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  anomaly_type TEXT NOT NULL,
  risk_score DECIMAL(5, 2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Insights Table
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  message TEXT NOT NULL,
  confidence DECIMAL(5, 2),
  priority TEXT NOT NULL DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit Trail Table
CREATE TABLE public.audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  hash_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Smart Contracts Table
CREATE TABLE public.smart_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contract_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  contract_data JSONB DEFAULT '{}',
  executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liquidity_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_accounts
CREATE POLICY "Users can view their own accounts" ON public.financial_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own accounts" ON public.financial_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON public.financial_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON public.financial_accounts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reconciliation_logs
CREATE POLICY "Users can view their own reconciliation logs" ON public.reconciliation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reconciliation logs" ON public.reconciliation_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for liquidity_forecasts
CREATE POLICY "Users can view their own forecasts" ON public.liquidity_forecasts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create forecasts" ON public.liquidity_forecasts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for anomaly_detections
CREATE POLICY "Users can view their own anomalies" ON public.anomaly_detections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create anomaly detections" ON public.anomaly_detections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update anomaly status" ON public.anomaly_detections FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_insights
CREATE POLICY "Users can view their own insights" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create insights" ON public.ai_insights FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for audit_trail
CREATE POLICY "Users can view their own audit trail" ON public.audit_trail FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create audit entries" ON public.audit_trail FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for smart_contracts
CREATE POLICY "Users can view their own contracts" ON public.smart_contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create contracts" ON public.smart_contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contracts" ON public.smart_contracts FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_financial_accounts_user_id ON public.financial_accounts(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_anomaly_detections_user_id ON public.anomaly_detections(user_id);
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_audit_trail_user_id ON public.audit_trail(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_financial_accounts_updated_at BEFORE UPDATE ON public.financial_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_smart_contracts_updated_at BEFORE UPDATE ON public.smart_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();