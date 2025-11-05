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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { department } = await req.json();

    console.log(`Generating forecast for user: ${user.id}, department: ${department || 'all'}`);

    // Fetch budgets and actuals
    let budgetQuery = supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id);

    if (department) {
      budgetQuery = budgetQuery.eq('department', department);
    }

    const { data: budgets, error: budgetsError } = await budgetQuery;

    if (budgetsError) throw budgetsError;

    const forecasts = [];

    for (const budget of budgets || []) {
      // Fetch actuals for this budget
      const { data: actuals } = await supabase
        .from('budget_actuals')
        .select('*')
        .eq('budget_id', budget.id)
        .order('transaction_date', { ascending: true });

      const totalActual = actuals?.reduce((sum, a) => sum + Number(a.actual_amount), 0) || 0;
      const plannedAmount = Number(budget.planned_amount);
      const variance = plannedAmount > 0 ? ((totalActual - plannedAmount) / plannedAmount) * 100 : 0;

      // Simple forecasting logic (linear projection)
      const daysInPeriod = 30;
      const daysPassed = actuals?.length || 1;
      const dailyAverage = totalActual / daysPassed;
      const predictedTotal = dailyAverage * daysInPeriod;
      const predictedVariance = plannedAmount > 0 ? ((predictedTotal - plannedAmount) / plannedAmount) * 100 : 0;

      // Generate forecasts for next 30 days
      for (let i = 1; i <= 30; i++) {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i);

        const predictedAmount = dailyAverage * (daysPassed + i);
        const driftPercentage = plannedAmount > 0 ? ((predictedAmount - plannedAmount) / plannedAmount) * 100 : 0;

        // AI recommendation based on drift
        let recommendation = 'Budget on track';
        if (driftPercentage > 10) {
          recommendation = `Reduce spending by ${Math.round(driftPercentage - 10)}% to stay within budget`;
        } else if (driftPercentage < -10) {
          recommendation = `Budget underutilized. Consider reallocating ${Math.abs(Math.round(driftPercentage + 10))}% to other departments`;
        }

        const confidence = Math.max(0.5, 1 - (i / 60)); // Confidence decreases with distance

        forecasts.push({
          budget_id: budget.id,
          user_id: user.id,
          forecast_date: forecastDate.toISOString().split('T')[0],
          predicted_amount: predictedAmount,
          confidence_score: confidence,
          drift_percentage: driftPercentage,
          ai_recommendation: recommendation,
        });
      }
    }

    // Insert forecasts (delete existing ones first)
    await supabase
      .from('budget_forecasts')
      .delete()
      .eq('user_id', user.id);

    const { error: insertError } = await supabase
      .from('budget_forecasts')
      .insert(forecasts);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Forecasts generated successfully',
        forecasts: forecasts.slice(0, 7) // Return first week
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Budget forecast error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});