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
    const { scenarioData, userId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Running budget simulation for user:', userId);

    // Get current budgets as baseline
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);

    if (budgetError) throw budgetError;

    // Calculate baseline totals
    const baselineTotals: Record<string, number> = {};
    for (const budget of budgets || []) {
      if (!baselineTotals[budget.department]) {
        baselineTotals[budget.department] = 0;
      }
      baselineTotals[budget.department] += parseFloat(budget.planned_amount);
    }

    // Apply scenario changes
    const adjustments = scenarioData.adjustments || [];
    const simulatedBudgets: any[] = [];
    const impactAnalysis: any[] = [];

    for (const budget of budgets || []) {
      let newPlannedAmount = parseFloat(budget.planned_amount);
      let changePercent = 0;
      let changeType = 'none';

      // Find if this department has an adjustment
      const adjustment = adjustments.find((adj: any) => 
        adj.department === budget.department
      );

      if (adjustment) {
        if (adjustment.type === 'percentage') {
          changePercent = adjustment.value;
          newPlannedAmount = newPlannedAmount * (1 + adjustment.value / 100);
          changeType = adjustment.value > 0 ? 'increase' : 'decrease';
        } else if (adjustment.type === 'absolute') {
          const absoluteChange = adjustment.value;
          changePercent = (absoluteChange / parseFloat(budget.planned_amount)) * 100;
          newPlannedAmount = parseFloat(budget.planned_amount) + absoluteChange;
          changeType = adjustment.value > 0 ? 'increase' : 'decrease';
        }
      }

      simulatedBudgets.push({
        ...budget,
        original_planned: parseFloat(budget.planned_amount),
        simulated_planned: newPlannedAmount,
        change_percent: changePercent,
        change_type: changeType,
        change_amount: newPlannedAmount - parseFloat(budget.planned_amount)
      });
    }

    // Calculate department-level impacts
    const departmentImpacts: Record<string, any> = {};
    for (const simBudget of simulatedBudgets) {
      if (!departmentImpacts[simBudget.department]) {
        departmentImpacts[simBudget.department] = {
          department: simBudget.department,
          original_total: 0,
          simulated_total: 0,
          total_change: 0,
          change_percent: 0,
          categories_affected: 0
        };
      }
      
      departmentImpacts[simBudget.department].original_total += simBudget.original_planned;
      departmentImpacts[simBudget.department].simulated_total += simBudget.simulated_planned;
      departmentImpacts[simBudget.department].categories_affected++;
    }

    // Calculate totals and variances
    for (const dept in departmentImpacts) {
      const impact = departmentImpacts[dept];
      impact.total_change = impact.simulated_total - impact.original_total;
      impact.change_percent = impact.original_total > 0 
        ? (impact.total_change / impact.original_total) * 100 
        : 0;
    }

    // Generate AI insights
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let aiInsights = 'Simulation completed successfully.';
    
    if (LOVABLE_API_KEY) {
      try {
        const insightPrompt = `Analyze this budget scenario simulation and provide 3-5 key insights:

Scenario: ${scenarioData.name || 'Budget Scenario'}
Description: ${scenarioData.description || 'N/A'}

Department Impacts:
${Object.values(departmentImpacts).map((d: any) => 
  `- ${d.department}: ${d.change_percent > 0 ? '+' : ''}${d.change_percent.toFixed(1)}% (${d.change_percent > 0 ? '+' : ''}$${d.total_change.toFixed(0)})`
).join('\n')}

Total Budget Change: $${Object.values(departmentImpacts).reduce((sum: number, d: any) => sum + d.total_change, 0).toFixed(0)}

Provide actionable insights about risks, opportunities, and recommendations.`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "You are a financial analyst providing concise budget scenario insights. Keep response under 200 words."
              },
              {
                role: "user",
                content: insightPrompt
              }
            ]
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiInsights = aiData.choices[0].message.content;
        }
      } catch (error: any) {
        console.error('AI insights generation failed:', error);
      }
    }

    // Calculate summary metrics
    const totalOriginal = Object.values(departmentImpacts).reduce((sum: number, d: any) => sum + d.original_total, 0);
    const totalSimulated = Object.values(departmentImpacts).reduce((sum: number, d: any) => sum + d.simulated_total, 0);
    const totalChange = totalSimulated - totalOriginal;
    const totalChangePercent = totalOriginal > 0 ? (totalChange / totalOriginal) * 100 : 0;

    const results = {
      simulated_budgets: simulatedBudgets,
      department_impacts: Object.values(departmentImpacts),
      summary: {
        total_original: totalOriginal,
        total_simulated: totalSimulated,
        total_change: totalChange,
        total_change_percent: totalChangePercent,
        departments_affected: Object.keys(departmentImpacts).length,
        categories_affected: simulatedBudgets.length
      },
      ai_insights: aiInsights,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Budget simulation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        simulated_budgets: [],
        department_impacts: [],
        summary: null
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
