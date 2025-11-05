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
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    console.log("Generating liquidity forecast for user:", user.id);

    // Get pending documents
    const { data: documents, error: docsError } = await supabase
      .from('financial_documents')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'approved'])
      .order('due_date', { ascending: true });

    if (docsError) throw docsError;

    // Calculate forecast
    const forecast = [];
    let cumulativeBalance = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Calculate outflows for this date
      const outflow = documents
        ?.filter(doc => doc.due_date === dateStr && doc.amount)
        ?.reduce((sum, doc) => sum + parseFloat(doc.amount), 0) || 0;

      cumulativeBalance -= outflow;

      forecast.push({
        date: dateStr,
        predicted_balance: cumulativeBalance,
        outflow,
        risk_level: cumulativeBalance < -10000 ? 'high' : cumulativeBalance < 0 ? 'medium' : 'low'
      });
    }

    // Generate recommendations
    const recommendations = [];
    const highRiskDays = forecast.filter(f => f.risk_level === 'high');
    
    if (highRiskDays.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Liquidity gap detected in ${highRiskDays.length} days`,
        action: 'Consider delaying non-critical payments or accelerating collections'
      });
    }

    const largePendingDocs = documents?.filter(d => d.amount && parseFloat(d.amount) > 5000) || [];
    if (largePendingDocs.length > 0) {
      recommendations.push({
        type: 'info',
        message: `${largePendingDocs.length} large payments pending approval`,
        action: 'Review high-value documents for approval'
      });
    }

    return new Response(JSON.stringify({ 
      forecast: forecast.slice(0, 14), // Return 14 days
      recommendations,
      summary: {
        total_pending: documents?.length || 0,
        total_amount: documents?.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0) || 0,
        high_risk_days: highRiskDays.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in inbox-forecast:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});