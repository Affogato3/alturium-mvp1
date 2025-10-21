-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in minutes
  participants JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'scheduled',
  summary TEXT,
  sentiment_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meeting_transcripts table
CREATE TABLE IF NOT EXISTS public.meeting_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  speaker TEXT,
  content TEXT NOT NULL,
  timestamp_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meeting_decisions table
CREATE TABLE IF NOT EXISTS public.meeting_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  decision_text TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meeting_tasks table
CREATE TABLE IF NOT EXISTS public.meeting_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  task_title TEXT NOT NULL,
  assignee TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meeting_insights table
CREATE TABLE IF NOT EXISTS public.meeting_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employee_logs table
CREATE TABLE IF NOT EXISTS public.employee_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  talk_time_percent NUMERIC(5,2),
  key_actions INTEGER DEFAULT 0,
  sentiment_score NUMERIC(3,2),
  attendance_score NUMERIC(5,2),
  contribution_keywords JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meeting_analytics table
CREATE TABLE IF NOT EXISTS public.meeting_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  sentiment_timeline JSONB DEFAULT '[]'::jsonb,
  speaker_balance JSONB DEFAULT '[]'::jsonb,
  task_density JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meetings
CREATE POLICY "Users can view their own meetings"
  ON public.meetings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meetings"
  ON public.meetings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings"
  ON public.meetings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetings"
  ON public.meetings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for related tables (via meetings)
CREATE POLICY "Users can view transcripts of their meetings"
  ON public.meeting_transcripts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_transcripts.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert transcripts for their meetings"
  ON public.meeting_transcripts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_transcripts.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can view decisions of their meetings"
  ON public.meeting_decisions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_decisions.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert decisions for their meetings"
  ON public.meeting_decisions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_decisions.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can view tasks of their meetings"
  ON public.meeting_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_tasks.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage tasks of their meetings"
  ON public.meeting_tasks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_tasks.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can view insights of their meetings"
  ON public.meeting_insights FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_insights.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage insights of their meetings"
  ON public.meeting_insights FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_insights.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can view employee logs of their meetings"
  ON public.employee_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = employee_logs.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert employee logs for their meetings"
  ON public.employee_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = employee_logs.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can view analytics of their meetings"
  ON public.meeting_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_analytics.meeting_id
    AND meetings.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert analytics for their meetings"
  ON public.meeting_analytics FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.meetings
    WHERE meetings.id = meeting_analytics.meeting_id
    AND meetings.user_id = auth.uid()
  ));

-- Triggers for updated_at
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();