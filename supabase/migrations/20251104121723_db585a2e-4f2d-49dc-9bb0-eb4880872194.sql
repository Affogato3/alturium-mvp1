-- Create financial documents table
CREATE TABLE public.financial_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('invoice', 'receipt', 'contract', 'payment_proof', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid', 'processed')),
  vendor_name TEXT,
  amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  issue_date DATE,
  description TEXT,
  file_url TEXT,
  extracted_data JSONB DEFAULT '{}'::jsonb,
  ai_confidence DECIMAL(3,2),
  category TEXT,
  priority INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  total_spent DECIMAL(15,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  risk_score DECIMAL(3,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation rules table
CREATE TABLE public.automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  condition_json JSONB NOT NULL,
  action_json JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit events table
CREATE TABLE public.audit_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_documents
CREATE POLICY "Users can view their own documents"
ON public.financial_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents"
ON public.financial_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
ON public.financial_documents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON public.financial_documents FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for vendors
CREATE POLICY "Users can view their own vendors"
ON public.vendors FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vendors"
ON public.vendors FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendors"
ON public.vendors FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for automation_rules
CREATE POLICY "Users can view their own rules"
ON public.automation_rules FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rules"
ON public.automation_rules FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules"
ON public.automation_rules FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules"
ON public.automation_rules FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for audit_events
CREATE POLICY "Users can view their own audit events"
ON public.audit_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audit events"
ON public.audit_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_financial_documents_user_id ON public.financial_documents(user_id);
CREATE INDEX idx_financial_documents_status ON public.financial_documents(status);
CREATE INDEX idx_financial_documents_due_date ON public.financial_documents(due_date);
CREATE INDEX idx_vendors_user_id ON public.vendors(user_id);
CREATE INDEX idx_automation_rules_user_id ON public.automation_rules(user_id);
CREATE INDEX idx_audit_events_user_id ON public.audit_events(user_id);

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_financial_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_financial_documents_updated_at
BEFORE UPDATE ON public.financial_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_financial_documents_updated_at();