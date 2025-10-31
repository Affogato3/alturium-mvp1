-- Create tasks table for Predictive Interlock
CREATE TABLE IF NOT EXISTS public.interlock_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  department TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'blocked', 'completed', 'delayed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner_name TEXT NOT NULL,
  resource_requirement TEXT,
  conflict_probability DECIMAL(3,2) DEFAULT 0.00 CHECK (conflict_probability >= 0 AND conflict_probability <= 1),
  predicted_delay_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task dependencies table
CREATE TABLE IF NOT EXISTS public.interlock_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.interlock_tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES public.interlock_tasks(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL CHECK (dependency_type IN ('data_flow', 'time_dependency', 'resource_allocation')),
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, depends_on_task_id)
);

-- Create conflicts table
CREATE TABLE IF NOT EXISTS public.interlock_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID NOT NULL REFERENCES public.interlock_tasks(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  affected_departments TEXT[] NOT NULL,
  predicted_impact_hours INTEGER NOT NULL,
  resolution_status TEXT NOT NULL DEFAULT 'detected' CHECK (resolution_status IN ('detected', 'analyzing', 'resolved', 'dismissed')),
  auto_resolution_suggested JSONB,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reschedule history table
CREATE TABLE IF NOT EXISTS public.interlock_reschedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID NOT NULL REFERENCES public.interlock_tasks(id) ON DELETE CASCADE,
  conflict_id UUID REFERENCES public.interlock_conflicts(id) ON DELETE SET NULL,
  old_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  old_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  new_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  new_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT NOT NULL,
  ai_confidence DECIMAL(3,2),
  stakeholders_notified TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interlock_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interlock_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interlock_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interlock_reschedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON public.interlock_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON public.interlock_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.interlock_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.interlock_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for dependencies
CREATE POLICY "Users can view dependencies for their tasks"
  ON public.interlock_dependencies FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.interlock_tasks
    WHERE id = interlock_dependencies.task_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create dependencies for their tasks"
  ON public.interlock_dependencies FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.interlock_tasks
    WHERE id = interlock_dependencies.task_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete dependencies for their tasks"
  ON public.interlock_dependencies FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.interlock_tasks
    WHERE id = interlock_dependencies.task_id AND user_id = auth.uid()
  ));

-- Create RLS policies for conflicts
CREATE POLICY "Users can view their own conflicts"
  ON public.interlock_conflicts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conflicts"
  ON public.interlock_conflicts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conflicts"
  ON public.interlock_conflicts FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for reschedules
CREATE POLICY "Users can view their own reschedules"
  ON public.interlock_reschedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reschedules"
  ON public.interlock_reschedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_interlock_tasks_updated_at
  BEFORE UPDATE ON public.interlock_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interlock_conflicts_updated_at
  BEFORE UPDATE ON public.interlock_conflicts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();