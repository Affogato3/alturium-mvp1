import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simulate pattern discovery with meaningful business insights
    const patterns = [
      {
        title: "Customers with invoice cycle >45 days are 3× more likely to churn",
        description: "Analysis of 2,400 customer records shows strong correlation between extended payment terms and churn risk. Customers with 60+ day payment cycles have 24% churn rate vs 8% baseline.",
        confidence: 94,
        impact: "high",
        category: "Customer"
      },
      {
        title: "Sales reps with <10 client calls/week deliver 40% lower close rate",
        description: "Activity tracking data reveals optimal call volume threshold. Reps making 10-15 calls weekly achieve 32% close rate vs 19% for those below 10 calls.",
        confidence: 91,
        impact: "high",
        category: "Sales"
      },
      {
        title: "Ad campaigns with >3 visuals outperform text-only ads by 28% ROI",
        description: "Marketing performance analysis across 150 campaigns shows visual-rich campaigns (3+ images) generate $3.20 per dollar spent vs $2.50 for text-only campaigns.",
        confidence: 88,
        impact: "medium",
        category: "Marketing"
      },
      {
        title: "Employee tenure <6 months correlates with 2× higher support ticket escalation",
        description: "Support metrics indicate new employees (0-6 months) escalate 42% of tickets vs 21% for tenured staff. Training investment may reduce escalation rates.",
        confidence: 86,
        impact: "medium",
        category: "Operations"
      },
      {
        title: "Revenue per customer increases 15% when onboarding includes video demo",
        description: "Customer success data shows accounts with video onboarding sessions have higher feature adoption and 15% higher lifetime value ($12K vs $10.4K).",
        confidence: 92,
        impact: "high",
        category: "Revenue"
      },
      {
        title: "Weekend deployments have 3.5× lower bug rate than Friday deployments",
        description: "Engineering metrics reveal weekend releases (with longer QA cycles) show 0.8 bugs per 100 lines vs 2.8 for Friday releases rushed before weekend.",
        confidence: 89,
        impact: "medium",
        category: "Operations"
      }
    ];

    return new Response(
      JSON.stringify({
        success: true,
        patterns,
        count: patterns.length,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Pattern discovery error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
