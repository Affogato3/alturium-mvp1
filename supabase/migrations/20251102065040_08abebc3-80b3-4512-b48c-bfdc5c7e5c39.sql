-- Finance Fabric Nexus Tables

-- Fabric Accounts Table
CREATE TABLE public.fabric_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  account_number TEXT NOT NULL UNIQUE,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  balance DECIMAL(20,6) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  account_type TEXT NOT NULL DEFAULT 'virtual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fabric Transactions Table
CREATE TABLE public.fabric_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_id UUID REFERENCES public.fabric_accounts(id),
  tx_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(20,6) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  category TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'failed', 'blocked')),
  initiated_by TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fabric Ledger Entries (Double-entry bookkeeping)
CREATE TABLE public.fabric_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  debit_account UUID REFERENCES public.fabric_accounts(id),
  credit_account UUID REFERENCES public.fabric_accounts(id),
  amount DECIMAL(20,6) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  description TEXT,
  block_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fabric Compliance Events
CREATE TABLE public.fabric_compliance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transaction_id UUID REFERENCES public.fabric_transactions(id),
  rule_triggered TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'cleared', 'under_review', 'blocked')),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fabric Integrations
CREATE TABLE public.fabric_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('bank', 'payment_gateway', 'erp', 'blockchain')),
  provider TEXT NOT NULL,
  api_key_encrypted TEXT,
  config JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fabric API Keys
CREATE TABLE public.fabric_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL,
  scopes JSONB DEFAULT '[]',
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fabric_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_compliance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fabric_accounts
CREATE POLICY "Users can manage their fabric accounts"
  ON public.fabric_accounts FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for fabric_transactions
CREATE POLICY "Users can manage their fabric transactions"
  ON public.fabric_transactions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for fabric_ledger_entries
CREATE POLICY "Users can manage their ledger entries"
  ON public.fabric_ledger_entries FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for fabric_compliance_events
CREATE POLICY "Users can view their compliance events"
  ON public.fabric_compliance_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their compliance events"
  ON public.fabric_compliance_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for fabric_integrations
CREATE POLICY "Users can manage their integrations"
  ON public.fabric_integrations FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for fabric_api_keys
CREATE POLICY "Users can manage their API keys"
  ON public.fabric_api_keys FOR ALL
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_fabric_accounts_user_id ON public.fabric_accounts(user_id);
CREATE INDEX idx_fabric_accounts_status ON public.fabric_accounts(status);
CREATE INDEX idx_fabric_transactions_user_id ON public.fabric_transactions(user_id);
CREATE INDEX idx_fabric_transactions_account_id ON public.fabric_transactions(account_id);
CREATE INDEX idx_fabric_transactions_status ON public.fabric_transactions(status);
CREATE INDEX idx_fabric_ledger_entries_user_id ON public.fabric_ledger_entries(user_id);
CREATE INDEX idx_fabric_compliance_events_user_id ON public.fabric_compliance_events(user_id);
CREATE INDEX idx_fabric_compliance_events_transaction_id ON public.fabric_compliance_events(transaction_id);
CREATE INDEX idx_fabric_integrations_user_id ON public.fabric_integrations(user_id);
CREATE INDEX idx_fabric_api_keys_user_id ON public.fabric_api_keys(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_fabric_accounts_updated_at
  BEFORE UPDATE ON public.fabric_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fabric_integrations_updated_at
  BEFORE UPDATE ON public.fabric_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();