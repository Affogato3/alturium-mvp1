import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dateRange, format, config, companyData, branding } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare comprehensive prompt for AI
    const systemPrompt = `You are a seasoned CFO and financial analyst creating a comprehensive board-ready presentation. 
Your analysis should be:
- Data-driven and specific with numbers
- Confident yet balanced in tone
- Forward-looking with actionable insights
- Professional and executive-level
- Focused on key metrics that matter to boards and investors`;

    const userPrompt = `Generate a comprehensive board deck for ${companyData.company_name || "the company"} based on the following data:

**Financial Metrics:**
- Revenue: $${companyData.revenue || 0}
- Monthly Burn Rate: $${companyData.burn_rate || 0}
- Cash Position: $${companyData.cash_position || 0}
- Runway: ${companyData.runway || 0} months

**Customer Metrics:**
- Total Customers: ${companyData.total_customers || 0}
- MRR: $${companyData.mrr || 0}
- ARR: $${companyData.arr || 0}
- Net Revenue Retention: ${companyData.nrr || 0}%
- Monthly Churn: ${companyData.churn_rate || 0}%

**Unit Economics:**
- CAC: $${companyData.cac || 0}
- LTV: $${companyData.ltv || 0}

**Context:**
${companyData.recent_events || "No recent events provided"}

Generate comprehensive slide content for a 15-20 slide board deck including:

1. Title Slide
2. Agenda
3. Financial Snapshot (key metrics dashboard)
4. Revenue Performance Analysis
5. Revenue Deep Dive (breakdown by segment/product)
6. Expense Analysis
7. Cash Flow & Runway
8. Unit Economics Analysis
9. Customer Metrics & Health
10. Key Wins & Highlights
11. Challenges & Headwinds
12. Risk Overview
13. Operational Updates
14. Next Quarter Plan
15. Strategic Recommendations

For each slide, provide:
- Slide title
- Key talking points (3-5 bullet points)
- Data visualization suggestions
- Executive commentary

Format your response as a JSON array of slide objects.`;

    // Call Lovable AI to generate content
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        tools: [
          {
            type: "function",
            function: {
              name: "generate_board_deck",
              description: "Generate comprehensive board deck with slides",
              parameters: {
                type: "object",
                properties: {
                  slides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        slide_number: { type: "number" },
                        title: { type: "string" },
                        talking_points: {
                          type: "array",
                          items: { type: "string" },
                        },
                        visualization_suggestion: { type: "string" },
                        commentary: { type: "string" },
                      },
                      required: ["slide_number", "title", "talking_points"],
                    },
                  },
                },
                required: ["slides"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_board_deck" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    const slides = toolCall
      ? JSON.parse(toolCall.function.arguments).slides
      : [];

    // In production, this would generate the actual PDF/PowerPoint file
    // For now, return the structured data
    const result = {
      success: true,
      slide_count: slides.length,
      slides: slides,
      format: format,
      generated_at: new Date().toISOString(),
      branding: branding,
      message: `Board deck with ${slides.length} slides generated successfully`,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error generating board deck:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate board deck" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
