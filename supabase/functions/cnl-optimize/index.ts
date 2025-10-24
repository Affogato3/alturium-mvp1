import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "optimize":
        systemPrompt = "You are an elite financial AI optimizer for CNL Grid™. Analyze capital allocation and provide specific, actionable recommendations with precise dollar amounts and ROI projections.";
        userPrompt = `Analyze this liquidity data and provide optimization recommendations:\n${JSON.stringify(data)}\n\nProvide: 1) Idle capital amount, 2) Recommended reallocations, 3) Expected ROI, 4) Risk assessment.`;
        break;
      
      case "simulate_risk":
        systemPrompt = "You are a financial risk simulation AI. Predict impacts of market scenarios on liquidity and capital positions.";
        userPrompt = `Simulate this risk scenario: ${data.scenario}\nCurrent portfolio: ${JSON.stringify(data.portfolio)}\n\nProvide: 1) Expected loss/gain, 2) Volatility impact, 3) Recommended hedges, 4) Countermeasures.`;
        break;
      
      case "generate_insight":
        systemPrompt = "You are a cognitive financial decision AI. Convert complex liquidity tensor analysis into clear CFO-ready insights.";
        userPrompt = `Command: ${data.command}\n\nProvide: Clear, actionable financial insight with specific recommendations and dollar amounts.`;
        break;
      
      case "predict_liquidity":
        systemPrompt = "You are a predictive liquidity AI. Forecast future cash flow positions and potential volatility events.";
        userPrompt = `Analyze current liquidity state: ${JSON.stringify(data)}\n\nProvide: 1) 90-day forecast, 2) Risk events timeline, 3) Preventive measures, 4) Opportunity windows.`;
        break;
    }

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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds to Lovable AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "No recommendation generated";

    return new Response(JSON.stringify({ 
      success: true, 
      recommendation: content,
      action,
      timestamp: new Date().toISOString()
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
