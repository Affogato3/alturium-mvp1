import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, dataset, patterns } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "scan":
        systemPrompt = "You are an AI pattern recognition expert. Analyze time-series data to detect trends, seasonality, anomalies, and correlations. Return patterns in JSON format.";
        userPrompt = `Analyze this dataset for patterns: ${dataset}\n\nReturn JSON with: patterns array containing {type, description, confidence, insight, chart_data}`;
        break;
      
      case "anomalies":
        systemPrompt = "You are an anomaly detection specialist. Identify unusual deviations and their potential business impact.";
        userPrompt = `Detect anomalies in recent data. Return JSON with: anomalies array containing {title, description, impact}`;
        break;
      
      case "action_plan":
        systemPrompt = "You are a strategic business advisor. Based on detected patterns, recommend specific operational actions.";
        userPrompt = `Given these patterns: ${JSON.stringify(patterns)}\n\nProvide a detailed action plan to capitalize on opportunities and mitigate risks.`;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI processing failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Try to parse JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { plan: content };
    } catch {
      result = action === "action_plan" ? { plan: content } : { patterns: [], anomalies: [] };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in pattern-recognition:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
