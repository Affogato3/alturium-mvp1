-- Create budget scenarios table
CREATE TABLE IF NOT EXISTS public.budget_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scenario_name TEXT NOT NULL,
  description TEXT,
  base_year INTEGER NOT NULL,
  base_period TEXT NOT NULL,
  scenario_data JSONB NOT NULL DEFAULT '{}',
  simulation_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.budget_scenarios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own scenarios"
  ON public.budget_scenarios
  FOR ALL
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_budget_scenarios_user_id ON public.budget_scenarios(user_id);
CREATE INDEX idx_budget_scenarios_created_at ON public.budget_scenarios(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_budget_scenarios_updated_at
  BEFORE UPDATE ON public.budget_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();