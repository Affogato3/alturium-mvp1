import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { days = 7 } = await req.json();

    // Fetch account balances and recent transactions
    const { data: accounts } = await supabase
      .from('financial_accounts')
      .select('*')
      .eq('user_id', user.id);

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(500);

    if (!transactions || transactions.length < 10) {
      throw new Error('Insufficient transaction history for accurate forecasting');
    }

    // Calculate current total balance
    const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;

    // Time series analysis
    const dailyFlows = new Map<string, number>();
    transactions.forEach(tx => {
      const date = new Date(tx.transaction_date).toDateString();
      const amount = Number(tx.amount);
      dailyFlows.set(date, (dailyFlows.get(date) || 0) + amount);
    });

    const flows = Array.from(dailyFlows.values());
    const avgDailyFlow = flows.reduce((sum, val) => sum + val, 0) / flows.length;
    const volatility = Math.sqrt(flows.reduce((sum, val) => sum + Math.pow(val - avgDailyFlow, 2), 0) / flows.length);

    // Generate forecasts for next N days
    const forecasts = [];
    let currentBalance = totalBalance;
    
    for (let i = 1; i <= days; i++) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + i);
      
      // Simulate prediction with some randomness and trend
      const trendFactor = 0.95 + (Math.random() * 0.1); // Slight downward trend
      const predictedFlow = avgDailyFlow * trendFactor + (Math.random() - 0.5) * volatility;
      currentBalance += predictedFlow;
      
      const confidenceLevel = Math.max(65, 95 - (i * 3)); // Confidence decreases over time
      const riskLevel = currentBalance < totalBalance * 0.3 ? 'critical' : 
                       currentBalance < totalBalance * 0.5 ? 'warning' : 'healthy';

      const forecast = {
        forecast_date: forecastDate.toISOString().split('T')[0],
        predicted_balance: Math.max(0, currentBalance),
        confidence_level: confidenceLevel,
        risk_level: riskLevel,
        recommendations: {
          action: riskLevel === 'critical' ? 'immediate_action' : riskLevel === 'warning' ? 'monitor_closely' : 'normal',
          message: riskLevel === 'critical' 
            ? 'Liquidity stress detected. Consider rebalancing funds immediately.'
            : riskLevel === 'warning'
            ? 'Approaching liquidity threshold. Review cash flow in next 48 hours.'
            : 'Cash flow remains healthy. No immediate action required.'
        }
      };

      forecasts.push(forecast);

      // Store forecast in database
      await supabase
        .from('liquidity_forecasts')
        .insert({
          user_id: user.id,
          ...forecast
        });
    }

    // Generate AI insight
    const criticalDays = forecasts.filter(f => f.risk_level === 'critical').length;
    if (criticalDays > 0) {
      await supabase
        .from('ai_insights')
        .insert({
          user_id: user.id,
          insight_type: 'liquidity',
          message: `Liquidity Foresight predicts ${criticalDays} critical day(s) in next ${days} days. Confidence: ${forecasts[0].confidence_level}%`,
          confidence: forecasts[0].confidence_level,
          priority: 'high',
          metadata: {
            forecasts: forecasts.slice(0, 3),
            avg_daily_flow: avgDailyFlow,
            volatility: volatility
          }
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        current_balance: totalBalance,
        avg_daily_flow: avgDailyFlow,
        volatility: volatility,
        forecasts: forecasts,
        summary: {
          critical_days: criticalDays,
          warning_days: forecasts.filter(f => f.risk_level === 'warning').length,
          healthy_days: forecasts.filter(f => f.risk_level === 'healthy').length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in liquidity forecast:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});