import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) throw new Error('Unauthorized');

    const { amount, fromCurrency, toCurrency, fromCountry, toCountry, mode = 'optimize' } = await req.json();

    console.log(`Route optimization request: ${amount} ${fromCurrency} → ${toCurrency}`);

    const corridor = `${fromCountry}-${toCountry}`;

    // Get available rails
    const { data: rails } = await supabase
      .from('payment_rails')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (!rails || rails.length === 0) {
      // Initialize default rails if none exist
      const defaultRails = [
        {
          user_id: user.id,
          rail_name: 'SWIFT gpi',
          rail_type: 'swift_gpi',
          health_score: 98.5,
          avg_latency_ms: 2700000,
          success_rate: 99.2
        },
        {
          user_id: user.id,
          rail_name: 'USDC Stablecoin',
          rail_type: 'stablecoin',
          health_score: 99.8,
          avg_latency_ms: 900000,
          success_rate: 99.9
        },
        {
          user_id: user.id,
          rail_name: 'Digital Yuan CBDC',
          rail_type: 'cbdc',
          health_score: 97.5,
          avg_latency_ms: 7200000,
          success_rate: 98.5
        },
        {
          user_id: user.id,
          rail_name: 'Local ACH Network',
          rail_type: 'local_network',
          health_score: 96.0,
          avg_latency_ms: 10800000,
          success_rate: 97.5
        }
      ];

      await supabase.from('payment_rails').insert(defaultRails);
    }

    // AI-powered route optimization (simulated)
    const routes = await generateOptimalRoutes(amount, fromCurrency, toCurrency, corridor, rails || []);

    // Store routes in database
    for (const route of routes) {
      await supabase.from('payment_routes').insert({
        user_id: user.id,
        from_currency: fromCurrency,
        to_currency: toCurrency,
        corridor,
        rail_id: route.rail_id,
        cost_usd: route.cost,
        estimated_minutes: route.estimatedMinutes,
        compliance_score: route.complianceScore,
        ai_confidence: route.aiConfidence,
        route_data: route.details
      });
    }

    return new Response(JSON.stringify({
      success: true,
      recommended: routes[0],
      alternatives: routes.slice(1),
      totalRoutes: routes.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in payment-route-optimize:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateOptimalRoutes(amount: number, fromCurr: string, toCurr: string, corridor: string, rails: any[]) {
  const routes = [
    {
      rail_id: rails[0]?.id,
      railName: 'SWIFT gpi',
      railType: 'swift_gpi',
      cost: parseFloat((amount * 0.0015 + 12.50).toFixed(2)),
      estimatedMinutes: 45,
      complianceScore: 1.0,
      savingsPct: 67,
      aiConfidence: 0.94,
      details: { clearingHouse: 'SWIFT Network', intermediaries: 1, fxSpread: '0.15%' }
    },
    {
      rail_id: rails[1]?.id,
      railName: 'Stablecoin (USDC)',
      railType: 'stablecoin',
      cost: parseFloat((amount * 0.0008 + 8.50).toFixed(2)),
      estimatedMinutes: 15,
      complianceScore: 0.95,
      savingsPct: 78,
      aiConfidence: 0.89,
      details: { blockchain: 'Ethereum', gasEstimate: '$3.50', liquidityPool: 'Curve' }
    },
    {
      rail_id: rails[2]?.id,
      railName: 'CBDC Network',
      railType: 'cbdc',
      cost: parseFloat((amount * 0.002 + 15.00).toFixed(2)),
      estimatedMinutes: 120,
      complianceScore: 1.0,
      savingsPct: 60,
      aiConfidence: 0.91,
      details: { centralBank: 'PBOC', settlementType: 'Real-time gross settlement' }
    },
    {
      rail_id: rails[3]?.id,
      railName: 'Local Network',
      railType: 'local_network',
      cost: parseFloat((amount * 0.003 + 25.00).toFixed(2)),
      estimatedMinutes: 180,
      complianceScore: 0.98,
      savingsPct: 50,
      aiConfidence: 0.85,
      details: { network: 'ACH', processingWindows: '2-3 business days' }
    }
  ];

  // Sort by cost-effectiveness (lower cost + faster = better)
  return routes.sort((a, b) => {
    const scoreA = (a.cost / amount) * 100 + (a.estimatedMinutes / 60);
    const scoreB = (b.cost / amount) * 100 + (b.estimatedMinutes / 60);
    return scoreA - scoreB;
  });
}