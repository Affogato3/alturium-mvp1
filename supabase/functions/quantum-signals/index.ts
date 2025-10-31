import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[quantum-signals] No Authorization header');
      return new Response(JSON.stringify({ 
        error: 'Authentication required. Please log in.' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[quantum-signals] Auth error:', authError);
      return new Response(JSON.stringify({ 
        error: 'Invalid authentication token' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, symbol, portfolioData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    console.log(`[quantum-signals] Processing ${action} for ${symbol || 'portfolio'}`);

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'generate_signal':
        systemPrompt = `You are an advanced market intelligence AI using temporal transformers and graph neural networks. 
Analyze the provided market data and generate actionable trading signals with high confidence.`;
        userPrompt = `Analyze ${symbol} and generate a trading signal. Consider:
- Current price momentum and volatility
- Sector correlations and co-movement patterns
- Recent insider activity and institutional flows
- Sentiment from news and social media
- Macro economic factors

Provide: signal_type (buy/sell/hold/hedge), confidence (0-1), reasoning, and specific suggested_action.`;
        break;

      case 'predict_flows':
        systemPrompt = `You are a predictive flow engine using temporal fusion transformers to forecast capital movements before they reflect in prices.`;
        userPrompt = `Predict upcoming inflows/outflows for ${symbol} over the next 1-7 days. Analyze:
- Historical flow patterns and seasonality
- Institutional positioning changes
- Options market signals (put/call ratios, unusual activity)
- ETF rebalancing schedules
- Macro liquidity conditions

Provide predicted_inflow, predicted_outflow, net_flow, and confidence.`;
        break;

      case 'detect_insider_activity':
        systemPrompt = `You are an insider activity tracker that detects coordinated institutional buying/selling patterns using anomaly clustering.`;
        userPrompt = `Analyze recent SEC Form 4 filings and trading patterns for ${symbol}. Detect:
- Coordinated insider transactions
- Unusual timing or volume
- Cluster patterns suggesting institutional positioning
- Anomaly scores for each activity

Identify key insiders, transaction types, and anomaly scores.`;
        break;

      case 'sentiment_fusion':
        systemPrompt = `You are an AI sentiment fusion layer combining news, social media, SEC filings, and geopolitical data to adjust market exposure.`;
        userPrompt = `Perform sentiment analysis for ${symbol} across multiple sources:
- Recent news headlines and articles
- Social media mentions and trends
- SEC filings and regulatory updates
- Geopolitical events impacting the sector

Provide overall_sentiment (-1 to 1), key_drivers, and exposure_adjustment recommendations.`;
        break;

      case 'correlation_analysis':
        systemPrompt = `You are a quantum correlation engine mapping stocks to external market variables using graph neural networks.`;
        userPrompt = `Map correlation relationships for ${symbol} to:
- Related stocks in the same sector
- Commodities and raw materials
- Interest rates and currency pairs
- Supply chain dependencies
- Competitor stocks

Provide correlation_map with symbols, correlation_values, and edge_types (supply_chain/sector/macro/sentiment).`;
        break;

      case 'risk_compliance_check':
        systemPrompt = `You are a risk and compliance shield that validates trading decisions against KYC, AML, and jurisdictional rules.`;
        userPrompt = `Check the following trade for compliance:
Symbol: ${symbol}
Action: ${portfolioData?.action}
Quantity: ${portfolioData?.quantity}

Validate against:
- KYC/AML requirements
- Position limits and concentration risk
- Jurisdictional trading restrictions
- Regulatory blackout periods

Provide: compliance_status (approved/rejected/review), issues[], and recommendations.`;
        break;

      case 'simulate_scenario':
        systemPrompt = `You are a scenario simulation engine using Monte Carlo methods and cached AI models to predict financial outcomes.`;
        userPrompt = `Simulate a ${portfolioData?.scenarioType} scenario for the portfolio:
${JSON.stringify(portfolioData?.positions || [])}

Scenario parameters:
- Type: ${portfolioData?.scenarioType} (market_shock/interest_rate_change/sector_rotation)
- Magnitude: ${portfolioData?.magnitude}%
- Duration: ${portfolioData?.duration} days

Calculate impact on portfolio value, risk metrics, and optimal rebalancing strategy.`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[quantum-signals] AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`AI API error: ${errorText}`);
    }

    const aiResponse = await response.json();
    const result = aiResponse.choices[0]?.message?.content || '';

    console.log(`[quantum-signals] AI response generated for ${action}`);

    // Store the result in appropriate table based on action
    if (action === 'generate_signal') {
      await supabaseClient.from('market_signals').insert({
        user_id: user.id,
        symbol: symbol,
        signal_type: 'buy', // Parse from AI response
        confidence: 0.85,
        suggested_action: { action: 'buy', qty: 100 },
        explainability: { reasoning: result },
        model_version: 'gemini-2.5-flash',
        audit_ref: crypto.randomUUID(),
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      result,
      action,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[quantum-signals] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});