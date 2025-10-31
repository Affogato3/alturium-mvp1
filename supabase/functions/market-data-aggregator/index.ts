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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { symbols, dataType } = await req.json();
    
    console.log(`[market-data-aggregator] Fetching ${dataType} for symbols:`, symbols);

    // Simulate market data aggregation from multiple sources
    // In production, this would call Polygon.io, AlphaVantage, etc.
    const mockData: Record<string, any> = {};

    for (const symbol of symbols) {
      const basePrice = 100 + Math.random() * 900;
      const volatility = 0.02 + Math.random() * 0.08;
      
      mockData[symbol] = {
        symbol,
        price: basePrice,
        change: (Math.random() - 0.5) * basePrice * 0.05,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 10000000),
        high: basePrice * (1 + volatility),
        low: basePrice * (1 - volatility),
        volatility: volatility * 100,
        sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'][Math.floor(Math.random() * 5)],
        marketCap: Math.floor(Math.random() * 1000000000000),
        pe: 15 + Math.random() * 30,
        sentiment: (Math.random() - 0.5) * 2, // -1 to 1
        timestamp: new Date().toISOString(),
      };
    }

    // Update portfolio positions with latest prices
    for (const symbol of symbols) {
      await supabaseClient
        .from('portfolio_positions')
        .update({ current_price: mockData[symbol].price })
        .eq('user_id', user.id)
        .eq('symbol', symbol);
    }

    // Store predictive flows
    for (const symbol of symbols) {
      const inflowMultiplier = Math.random() * 2 - 1;
      await supabaseClient.from('predictive_flows').insert({
        user_id: user.id,
        symbol,
        sector: mockData[symbol].sector,
        predicted_inflow: Math.abs(inflowMultiplier) * 1000000,
        predicted_outflow: Math.abs(inflowMultiplier) * -1000000,
        net_flow: inflowMultiplier * 1000000,
        confidence: 0.7 + Math.random() * 0.25,
        prediction_horizon: '7d',
        model_version: 'tft-v1.0',
      });
    }

    console.log(`[market-data-aggregator] Data aggregated for ${symbols.length} symbols`);

    return new Response(JSON.stringify({ 
      success: true,
      data: mockData,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[market-data-aggregator] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});