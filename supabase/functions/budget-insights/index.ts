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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
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

    console.log(`Generating AI insights for user: ${user.id}`);

    // Fetch budgets and actuals
    const { data: budgets } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id);

    const insights = [];

    for (const budget of budgets || []) {
      const { data: actuals } = await supabase
        .from('budget_actuals')
        .select('*')
        .eq('budget_id', budget.id);

      const totalActual = actuals?.reduce((sum, a) => sum + Number(a.actual_amount), 0) || 0;
      const plannedAmount = Number(budget.planned_amount);
      const variance = plannedAmount > 0 ? ((totalActual - plannedAmount) / plannedAmount) * 100 : 0;

      let message = '';
      let priority = 'medium';
      let insightType = 'budget_analysis';

      if (variance > 10) {
        message = `${budget.department} is ${variance.toFixed(1)}% over budget. Consider reducing spending in ${budget.category}.`;
        priority = 'high';
        insightType = 'budget_warning';
      } else if (variance < -10) {
        message = `${budget.department} is ${Math.abs(variance).toFixed(1)}% under budget. Funds could be reallocated to high-priority departments.`;
        priority = 'medium';
        insightType = 'budget_opportunity';
      } else {
        message = `${budget.department} showing ${variance > 0 ? '+' : ''}${variance.toFixed(1)}% variance — within acceptable range.`;
        priority = 'low';
        insightType = 'budget_status';
      }

      insights.push({
        message,
        variance,
        department: budget.department,
        priority,
        insightType
      });
    }

    // Use AI to generate summary if Lovable API key is available
    let aiSummary = null;
    if (lovableApiKey && insights.length > 0) {
      try {
        const prompt = `Analyze these budget insights and provide a concise executive summary (2-3 sentences):
${insights.map(i => `- ${i.message}`).join('\n')}

Focus on the most critical financial risks and opportunities.`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'You are a financial analyst AI providing budget insights.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiSummary = aiData.choices?.[0]?.message?.content;
        }
      } catch (aiError) {
        console.error('AI summary generation failed:', aiError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        insights,
        summary: aiSummary || `Analyzed ${budgets?.length || 0} budget categories. ${insights.filter(i => i.priority === 'high').length} high-priority alerts detected.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Budget insights error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});