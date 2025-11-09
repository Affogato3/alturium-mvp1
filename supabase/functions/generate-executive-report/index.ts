import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, format, includeCharts } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an executive report writer. Create concise, data-driven summaries that highlight key metrics, insights, and actionable recommendations. Use clear, professional language suitable for C-level executives.`;

    const userPrompt = `Generate a ${type} executive report with the following structure:

EXECUTIVE SUMMARY
- Key performance highlights
- Critical metrics and trends
- Top 3 strategic insights

FINANCIAL PERFORMANCE
- Revenue: trends and variance analysis
- Cost structure: efficiency metrics
- Profitability: margins and projections

OPERATIONAL INSIGHTS
- Department performance
- Resource utilization
- Process efficiency gains

RISKS & OPPORTUNITIES
- Identified risks with mitigation strategies
- Growth opportunities with ROI projections

RECOMMENDATIONS
- Top 3 priority actions with timelines and expected impact

Keep it under 500 words. Use specific numbers and percentages.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI processing failed");
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "Report generation failed";

    return new Response(JSON.stringify({ 
      success: true,
      preview: content,
      format,
      generated_at: new Date().toISOString(),
      includes_charts: includeCharts
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
