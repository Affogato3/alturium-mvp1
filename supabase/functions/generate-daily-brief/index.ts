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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token || '');
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { date = new Date().toISOString().split('T')[0] } = await req.json().catch(() => ({}));

    console.log(`Generating daily brief for user ${user.id} for date ${date}`);

    // Fetch financial accounts for cash position
    const { data: accounts } = await supabase
      .from('financial_accounts')
      .select('*')
      .eq('user_id', user.id);

    // Fetch recent transactions
    const yesterdayStart = new Date(date);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('transaction_date', yesterdayStart.toISOString())
      .lt('transaction_date', date)
      .order('transaction_date', { ascending: false });

    // Calculate metrics
    const totalCash = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;
    const yesterdayRevenue = transactions?.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const yesterdayExpenses = transactions?.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0;
    
    // Get previous day's cash
    const { data: prevBriefs } = await supabase
      .from('daily_briefs')
      .select('cash_amount')
      .eq('user_id', user.id)
      .lt('brief_date', date)
      .order('brief_date', { ascending: false })
      .limit(1);

    const previousCash = prevBriefs?.[0]?.cash_amount || totalCash;
    const cashChange = totalCash - previousCash;

    // Fetch anomalies
    const { data: anomalies } = await supabase
      .from('financial_anomalies')
      .select('*')
      .eq('user_id', user.id)
      .eq('anomaly_date', date)
      .eq('resolved', false);

    // Generate AI insights using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const aiPrompt = `You are a financial analyst preparing a daily brief for a CFO.

Company Financial Data for ${date}:
- Current Cash: $${totalCash.toLocaleString()} (${cashChange >= 0 ? '+' : ''}$${Math.abs(cashChange).toLocaleString()} from previous day)
- Yesterday's Revenue: $${yesterdayRevenue.toLocaleString()}
- Yesterday's Expenses: $${yesterdayExpenses.toLocaleString()}
- Net Burn: $${(yesterdayExpenses - yesterdayRevenue).toLocaleString()}
- Transactions Count: ${transactions?.length || 0}

${anomalies && anomalies.length > 0 ? `Flagged Anomalies:\n${anomalies.map(a => `- ${a.description} (${a.severity})`).join('\n')}` : 'No anomalies detected.'}

Task: Generate a concise, actionable daily brief focusing on:
1. What happened financially that matters
2. What needs the CFO's attention TODAY
3. Today's top 3 priorities

Be specific with numbers. Focus on actionability. Highlight concerns but don't be alarmist.`;

    let aiInsights: any = {
      executive_summary: "Financial data collected successfully.",
      key_insights: [],
      priority_actions: []
    };

    if (LOVABLE_API_KEY) {
      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'You are a financial analyst. Provide concise, actionable insights.' },
              { role: 'user', content: aiPrompt }
            ],
            temperature: 0.3,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const aiText = aiData.choices?.[0]?.message?.content || '';
          aiInsights = {
            executive_summary: aiText.substring(0, 500),
            generated_text: aiText,
            confidence: 0.85
          };
        }
      } catch (error) {
        console.error('AI generation failed:', error);
      }
    }

    // Create action items from anomalies
    const actionItems: any[] = [];
    anomalies?.forEach((anomaly: any) => {
      actionItems.push({
        type: anomaly.anomaly_type,
        title: `Review: ${anomaly.description}`,
        description: anomaly.context?.explanation || 'Requires attention',
        urgency: anomaly.severity === 'high' ? 'urgent' : 'today',
        impact: 'medium',
        user_id: user.id
      });
    });

    // Store the brief
    const { data: brief, error: briefError } = await supabase
      .from('daily_briefs')
      .insert({
        user_id: user.id,
        brief_date: date,
        status: 'generated',
        cash_amount: totalCash,
        cash_change: cashChange,
        revenue: yesterdayRevenue,
        revenue_change: 0,
        expenses: yesterdayExpenses,
        burn_rate: yesterdayExpenses - yesterdayRevenue,
        runway_months: totalCash / Math.max((yesterdayExpenses - yesterdayRevenue) * 30, 1),
        action_items_count: actionItems.length,
        ai_insights: aiInsights,
        raw_metrics: {
          total_cash: totalCash,
          transactions: transactions?.length || 0,
          anomalies: anomalies?.length || 0
        }
      })
      .select()
      .single();

    if (briefError) throw briefError;

    // Create action items
    if (actionItems.length > 0) {
      await supabase
        .from('action_items')
        .insert(actionItems.map(item => ({ ...item, brief_id: brief.id })));
    }

    return new Response(
      JSON.stringify({
        success: true,
        brief,
        action_items_created: actionItems.length,
        message: `Daily brief generated for ${date}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error generating daily brief:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});