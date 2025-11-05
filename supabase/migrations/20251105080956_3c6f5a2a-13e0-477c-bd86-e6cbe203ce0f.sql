-- Create budgets table for master budget framework
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  department TEXT NOT NULL,
  category TEXT NOT NULL,
  planned_amount NUMERIC NOT NULL DEFAULT 0,
  fiscal_period TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget actuals table for tracking real spending
CREATE TABLE IF NOT EXISTS public.budget_actuals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL,
  user_id UUID NOT NULL,
  actual_amount NUMERIC NOT NULL DEFAULT 0,
  transaction_date DATE NOT NULL,
  vendor_name TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget forecasts table for AI predictions
CREATE TABLE IF NOT EXISTS public.budget_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL,
  user_id UUID NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_amount NUMERIC NOT NULL,
  confidence_score NUMERIC,
  drift_percentage NUMERIC,
  ai_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget rules table for thresholds and alerts
CREATE TABLE IF NOT EXISTS public.budget_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  department TEXT NOT NULL,
  threshold_percentage NUMERIC NOT NULL,
  notification_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget rebalances table for tracking reallocations
CREATE TABLE IF NOT EXISTS public.budget_rebalances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  from_department TEXT NOT NULL,
  to_department TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  reason TEXT,
  ai_confidence NUMERIC,
  approved_at TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_actuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_rebalances ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for budgets
CREATE POLICY "Users can manage their own budgets"
  ON public.budgets
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for budget_actuals
CREATE POLICY "Users can manage their own budget actuals"
  ON public.budget_actuals
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for budget_forecasts
CREATE POLICY "Users can view their own forecasts"
  ON public.budget_forecasts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create forecasts"
  ON public.budget_forecasts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for budget_rules
CREATE POLICY "Users can manage their own budget rules"
  ON public.budget_rules
  FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for budget_rebalances
CREATE POLICY "Users can manage their own rebalances"
  ON public.budget_rebalances
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_department ON public.budgets(department);
CREATE INDEX idx_budget_actuals_budget_id ON public.budget_actuals(budget_id);
CREATE INDEX idx_budget_forecasts_budget_id ON public.budget_forecasts(budget_id);
CREATE INDEX idx_budget_rules_user_id ON public.budget_rules(user_id);
CREATE INDEX idx_budget_rebalances_user_id ON public.budget_rebalances(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_rules_updated_at
  BEFORE UPDATE ON public.budget_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();