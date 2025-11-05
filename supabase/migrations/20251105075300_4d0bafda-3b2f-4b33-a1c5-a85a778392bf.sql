-- Create payment approval workflows table
CREATE TABLE public.payment_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_id UUID REFERENCES public.financial_documents(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  vendor_name TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'ach',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed', 'failed')),
  requested_by TEXT,
  approved_by TEXT,
  approval_notes TEXT,
  scheduled_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  approval_id UUID REFERENCES public.payment_approvals(id) ON DELETE SET NULL,
  document_id UUID REFERENCES public.financial_documents(id) ON DELETE SET NULL,
  transaction_ref TEXT UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  vendor_name TEXT NOT NULL,
  vendor_account TEXT,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'processing', 'completed', 'failed', 'cancelled')),
  failure_reason TEXT,
  bank_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create banking connections table
CREATE TABLE public.banking_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bank_name TEXT NOT NULL,
  account_number_encrypted TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'checking',
  routing_number TEXT,
  api_provider TEXT NOT NULL DEFAULT 'plaid',
  connection_status TEXT NOT NULL DEFAULT 'active' CHECK (connection_status IN ('active', 'inactive', 'error')),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.payment_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banking_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_approvals
CREATE POLICY "Users can view their own payment approvals"
  ON public.payment_approvals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment approvals"
  ON public.payment_approvals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment approvals"
  ON public.payment_approvals FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view their own payment transactions"
  ON public.payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment transactions"
  ON public.payment_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for banking_connections
CREATE POLICY "Users can manage their own banking connections"
  ON public.banking_connections FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_payment_approvals_user_id ON public.payment_approvals(user_id);
CREATE INDEX idx_payment_approvals_status ON public.payment_approvals(status);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_banking_connections_user_id ON public.banking_connections(user_id);