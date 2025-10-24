-- Create enum for compliance status
CREATE TYPE public.compliance_status AS ENUM ('compliant', 'pending_update', 'audit_flagged', 'non_compliant');

-- Create enum for risk levels
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Create enum for policy status
CREATE TYPE public.policy_status AS ENUM ('draft', 'staging', 'canary', 'production', 'archived');

-- Create jurisdictions table
CREATE TABLE public.jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    code VARCHAR(10) NOT NULL,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    compliance_status compliance_status NOT NULL DEFAULT 'pending_update',
    last_audit_date TIMESTAMPTZ,
    next_review_date TIMESTAMPTZ,
    regulators JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create policies table
CREATE TABLE public.policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    rule_id TEXT NOT NULL,
    jurisdiction TEXT[] NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    rule_json JSONB NOT NULL,
    status policy_status NOT NULL DEFAULT 'draft',
    version TEXT NOT NULL,
    priority INTEGER DEFAULT 100,
    created_by UUID,
    effective_from TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create compliance_events table (audit trail)
CREATE TABLE public.compliance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    payload_hash TEXT NOT NULL,
    policy_version TEXT,
    decision TEXT NOT NULL,
    decision_payload JSONB,
    rules_evaluated TEXT[],
    ledger_tx_hash TEXT,
    confidence_score NUMERIC(5,4),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create evidence_artifacts table
CREATE TABLE public.evidence_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    compliance_event_id UUID REFERENCES public.compliance_events(id),
    artifact_type TEXT NOT NULL,
    artifact_hash TEXT NOT NULL,
    file_name TEXT,
    file_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create risk_clusters table
CREATE TABLE public.risk_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    cluster_name TEXT NOT NULL,
    risk_level risk_level NOT NULL,
    jurisdiction TEXT NOT NULL,
    description TEXT,
    affected_entities TEXT[],
    mitigation_status TEXT DEFAULT 'pending',
    detected_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create regulation_feed table
CREATE TABLE public.regulation_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    source TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT,
    published_at TIMESTAMPTZ,
    relevance_score NUMERIC(5,4),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulation_feed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jurisdictions
CREATE POLICY "Users can view their jurisdictions"
ON public.jurisdictions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their jurisdictions"
ON public.jurisdictions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their jurisdictions"
ON public.jurisdictions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their jurisdictions"
ON public.jurisdictions FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for policies
CREATE POLICY "Users can view their policies"
ON public.policies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their policies"
ON public.policies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their policies"
ON public.policies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their policies"
ON public.policies FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for compliance_events
CREATE POLICY "Users can view their compliance events"
ON public.compliance_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their compliance events"
ON public.compliance_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for evidence_artifacts
CREATE POLICY "Users can view their evidence"
ON public.evidence_artifacts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their evidence"
ON public.evidence_artifacts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for risk_clusters
CREATE POLICY "Users can view their risk clusters"
ON public.risk_clusters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their risk clusters"
ON public.risk_clusters FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for regulation_feed
CREATE POLICY "Users can view their regulation feed"
ON public.regulation_feed FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their regulation feed"
ON public.regulation_feed FOR ALL
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_jurisdictions_user_id ON public.jurisdictions(user_id);
CREATE INDEX idx_jurisdictions_compliance_status ON public.jurisdictions(compliance_status);
CREATE INDEX idx_policies_user_id ON public.policies(user_id);
CREATE INDEX idx_policies_jurisdiction ON public.policies USING GIN(jurisdiction);
CREATE INDEX idx_policies_status ON public.policies(status);
CREATE INDEX idx_compliance_events_user_id ON public.compliance_events(user_id);
CREATE INDEX idx_compliance_events_created_at ON public.compliance_events(created_at DESC);
CREATE INDEX idx_evidence_artifacts_user_id ON public.evidence_artifacts(user_id);
CREATE INDEX idx_risk_clusters_user_id ON public.risk_clusters(user_id);
CREATE INDEX idx_risk_clusters_risk_level ON public.risk_clusters(risk_level);
CREATE INDEX idx_regulation_feed_user_id ON public.regulation_feed(user_id);
CREATE INDEX idx_regulation_feed_created_at ON public.regulation_feed(created_at DESC);

-- Add triggers for updated_at
CREATE TRIGGER update_jurisdictions_updated_at
BEFORE UPDATE ON public.jurisdictions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_policies_updated_at
BEFORE UPDATE ON public.policies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();