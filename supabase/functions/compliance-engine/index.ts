import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'validate_transaction':
        systemPrompt = `You are an expert regulatory compliance AI. Analyze transactions against global regulatory frameworks (AML, KYC, sanctions, tax laws). Return a structured assessment with decision (allow/block/require_review), confidence score (0-1), applicable regulations, risk level, and required actions.`;
        userPrompt = `Validate this transaction: ${JSON.stringify(data)}. Consider jurisdiction-specific rules, sanction lists, and compliance requirements.`;
        break;

      case 'audit_compliance':
        systemPrompt = `You are a comprehensive compliance auditor. Analyze the company's current state against regulatory requirements. Identify gaps, violations, and recommend remediation steps. Focus on actionable insights.`;
        userPrompt = `Perform compliance audit for: ${JSON.stringify(data)}. Check against current regulations and best practices.`;
        break;

      case 'parse_regulation':
        systemPrompt = `You are a legal AI that extracts structured obligations from regulatory text. Parse laws into: obligation_id, summary, severity (low/medium/high/critical), affected_entities, deadline, sanctions, and required_controls.`;
        userPrompt = `Parse this regulation: ${data.text}. Extract all actionable obligations in structured format.`;
        break;

      case 'assess_risk':
        systemPrompt = `You are a financial risk analyst. Assess regulatory and operational risks. Provide risk_level (low/medium/high/critical), affected_jurisdictions, potential_impact (financial + operational), likelihood (0-1), and mitigation_strategies.`;
        userPrompt = `Assess risk for: ${JSON.stringify(data)}`;
        break;

      case 'generate_evidence':
        systemPrompt = `You are a compliance documentation expert. Generate audit-ready evidence bundles that satisfy regulator requirements. Include: executive_summary, findings, supporting_documents_needed, compliance_score, and recommendations.`;
        userPrompt = `Create evidence package for: ${JSON.stringify(data)}`;
        break;

      case 'monitor_regulations':
        systemPrompt = `You are a regulatory intelligence system. Monitor and summarize recent regulatory changes. For each update provide: jurisdiction, regulation_name, effective_date, impact_summary, affected_operations, and action_required.`;
        userPrompt = `Analyze recent regulatory updates for jurisdictions: ${data.jurisdictions?.join(', ')}`;
        break;

      case 'simulate_scenario':
        systemPrompt = `You are a predictive compliance simulator. Model the impact of proposed actions on compliance status. Return: projected_compliance_score, potential_violations, remediation_cost_estimate, timeline, and approval_requirements.`;
        userPrompt = `Simulate scenario: ${JSON.stringify(data)}`;
        break;

      default:
        throw new Error('Invalid action');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const aiData = await response.json();
    const recommendation = aiData.choices[0].message.content;

    // Log compliance event
    const eventHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify({ action, data, timestamp: Date.now() }))
    );
    const hashArray = Array.from(new Uint8Array(eventHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    await supabaseClient.from('compliance_events').insert({
      user_id: user.id,
      event_type: action,
      event_data: data,
      payload_hash: hashHex,
      decision: recommendation.includes('block') ? 'block' : 'allow',
      decision_payload: { recommendation },
      ledger_tx_hash: `tx_${hashHex.slice(0, 16)}`,
      confidence_score: 0.85
    });

    return new Response(
      JSON.stringify({ success: true, recommendation, tx_hash: `tx_${hashHex.slice(0, 16)}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Compliance engine error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});