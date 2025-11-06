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

    console.log('Fetching payment analytics');

    // Get all completed payments
    const { data: payments } = await supabase
      .from('cross_border_payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!payments || payments.length === 0) {
      return new Response(JSON.stringify({
        totalVolume: 0,
        totalTransactions: 0,
        avgCostSavings: 0,
        avgSettlementMinutes: 0,
        successRate: 0,
        corridorPerformance: [],
        railPerformance: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate metrics
    const totalVolume = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalTransactions = payments.length;
    const avgCostSavings = payments.reduce((sum, p) => sum + (p.cost_savings_pct || 0), 0) / totalTransactions;
    
    // Calculate avg settlement time
    const avgSettlementMinutes = payments.reduce((sum, p) => {
      const initiated = new Date(p.initiated_at).getTime();
      const completed = new Date(p.completed_at).getTime();
      return sum + ((completed - initiated) / 60000);
    }, 0) / totalTransactions;

    const successRate = 100; // All completed payments are successful

    // Corridor performance
    const corridorMap = new Map();
    payments.forEach(p => {
      const corridor = p.corridor;
      if (!corridorMap.has(corridor)) {
        corridorMap.set(corridor, { count: 0, volume: 0, savings: 0 });
      }
      const stats = corridorMap.get(corridor);
      stats.count += 1;
      stats.volume += parseFloat(p.amount);
      stats.savings += p.cost_savings_pct || 0;
    });

    const corridorPerformance = Array.from(corridorMap.entries()).map(([corridor, stats]) => ({
      corridor,
      transactions: stats.count,
      volume: stats.volume,
      avgSavings: stats.savings / stats.count
    })).sort((a, b) => b.volume - a.volume);

    // Rail performance
    const { data: rails } = await supabase
      .from('payment_rails')
      .select('*')
      .eq('user_id', user.id);

    const railPerformance = (rails || []).map(rail => {
      const railPayments = payments.filter(p => p.selected_rail_id === rail.id);
      return {
        railName: rail.rail_name,
        railType: rail.rail_type,
        transactions: railPayments.length,
        healthScore: rail.health_score,
        avgLatency: rail.avg_latency_ms,
        successRate: rail.success_rate
      };
    }).sort((a, b) => b.transactions - a.transactions);

    return new Response(JSON.stringify({
      totalVolume: Math.round(totalVolume),
      totalTransactions,
      avgCostSavings: Math.round(avgCostSavings * 10) / 10,
      avgSettlementMinutes: Math.round(avgSettlementMinutes),
      successRate,
      corridorPerformance,
      railPerformance
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in payment-analytics-fetch:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});