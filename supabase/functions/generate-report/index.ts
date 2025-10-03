import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportType, data, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating comprehensive report for:", reportType);

    // Build comprehensive prompt for AI
    const systemPrompt = `You are an expert business analyst and report writer. Generate comprehensive, professional analysis reports with:
- Executive Summary (key findings and recommendations)
- Detailed Analysis (data-driven insights with specific metrics)
- Trend Analysis (patterns, correlations, and predictions)
- Risk Assessment (potential issues and mitigation strategies)
- Strategic Recommendations (actionable next steps with expected outcomes)
- Financial Impact Analysis (revenue implications, cost analysis)
- Competitive Intelligence (market positioning and opportunities)

Format the report in clear sections with headers. Include specific numbers, percentages, and metrics from the provided data.
Make the report comprehensive (2-3 pages worth of content) with deep insights.`;

    const userPrompt = `Generate a comprehensive business analysis report for ${reportType}.

Context: ${context || "General business analysis"}

Data Summary:
${JSON.stringify(data, null, 2)}

Requirements:
- Minimum 2 pages of detailed analysis
- Include specific metrics and numbers from the data
- Provide actionable recommendations
- Analyze trends and patterns
- Assess risks and opportunities
- Include financial impact analysis
- Format with clear section headers (use ## for main sections)`;

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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const reportContent = aiResponse.choices[0].message.content;

    console.log("Report generated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        report: reportContent,
        metadata: {
          reportType,
          generatedAt: new Date().toISOString(),
          dataPoints: Object.keys(data).length,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating report:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
