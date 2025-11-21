import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { fileData, fileName, analysisType, layer } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (analysisType === 'full') {
      systemPrompt = `You are an elite financial analyst with institutional-grade expertise. You combine:
- Goldman Sachs equity research rigor
- Hedge fund quantitative precision
- McKinsey strategic consulting insight

You produce comprehensive, actionable financial intelligence with probabilistic forecasting and optimization.`;

      userPrompt = `Analyze this financial data comprehensively across all 7 layers:

FILE: ${fileName}
DATA:
${fileData}

Provide a complete institutional-grade analysis including:

1. DATA VALIDATION & NORMALIZATION
- Missing fields and data quality assessment
- Balance sheet validation
- Data health score (0-100)

2. STATISTICAL ANALYSIS
- Descriptive statistics (mean, median, std dev)
- Trend analysis (MoM, YoY, CAGR)
- Correlation analysis
- Seasonality detection
- Outlier detection
- Volatility analysis

3. FINANCIAL RATIO ANALYSIS
Calculate and interpret:
- Liquidity ratios (Current, Quick, Cash)
- Profitability ratios (Gross Margin, Operating Margin, Net Margin, ROA, ROE, ROIC)
- Efficiency ratios (Asset Turnover, DSO, DPO, Cash Conversion Cycle)
- Leverage ratios (Debt-to-Equity, Interest Coverage)
- Growth ratios (Revenue Growth, Customer Growth)
- SaaS metrics if applicable (MRR, ARR, NRR, CAC, LTV, Rule of 40)

4. CONCENTRATION & RISK ANALYSIS
- Customer concentration (HHI, Gini coefficient)
- Revenue stream concentration
- Supplier/vendor dependencies
- Geographic concentration risk

5. PREDICTIVE ANALYSIS
- Revenue forecast (3, 6, 12 months) with confidence intervals
- Expense forecasting
- Cash flow projection
- Runway calculation
- Break-even analysis
- Early warning indicators

6. SCENARIO MODELING
Model three scenarios:
- Base case (most likely)
- Upside case (optimistic)
- Downside case (stress test)
Include sensitivity analysis.

7. STRATEGIC SYNTHESIS
- Executive summary with letter grade (A/B/C/D/F)
- Top 5 non-obvious insights
- Critical red flags
- Growth opportunities
- Prioritized recommendations
- Key questions for management

Return structured JSON:
{
  "healthScore": "A/B/C/D/F",
  "dataQuality": "High/Medium/Low",
  "confidence": "High/Medium/Low",
  "executiveSummary": "3 paragraph summary",
  "keyMetrics": {
    "revenue": { "value": 0, "growth": 0, "status": "Strong/Acceptable/Concerning" },
    "grossMargin": { "value": 0, "change": 0, "status": "" },
    "burnRate": { "value": 0, "change": 0, "status": "" },
    "runway": { "value": 0, "change": 0, "status": "" }
  },
  "topInsights": [
    {
      "title": "Insight Title",
      "finding": "Specific quantified finding",
      "implication": "Business impact",
      "action": "Recommended response"
    }
  ],
  "detailedAnalysis": {
    "layer1": {},
    "layer2": {},
    "layer3": {},
    "layer4": {},
    "layer5": {},
    "layer6": {}
  },
  "redFlags": ["Critical issue 1", "Critical issue 2"],
  "recommendations": [
    {
      "title": "Action title",
      "action": "Specific action",
      "impact": "High/Medium/Low",
      "urgency": "Immediate/Short-term/Medium-term"
    }
  ],
  "questions": ["Question 1", "Question 2"],
  "timestamp": "${new Date().toISOString()}"
}

Be quantitative, specific, and actionable. Every claim must have numbers.`;

    } else if (analysisType === 'layer') {
      const layerDescriptions = {
        1: "DATA VALIDATION & NORMALIZATION - Validate data quality, identify missing fields, check balances, assess data health",
        2: "STATISTICAL ANALYSIS - Calculate descriptive stats, trends, correlations, seasonality, outliers, volatility",
        3: "FINANCIAL RATIO ANALYSIS - Calculate liquidity, profitability, efficiency, leverage, growth, and SaaS metrics",
        4: "CONCENTRATION & RISK - Analyze customer concentration, revenue streams, supplier dependencies, geographic risks",
        5: "PREDICTIVE ANALYSIS - Forecast revenue, expenses, cash flow, runway, break-even, early warnings",
        6: "SCENARIO MODELING - Model base/upside/downside cases with sensitivity analysis",
        7: "STRATEGIC SYNTHESIS - Executive summary, top insights, red flags, recommendations, key questions"
      };

      systemPrompt = "You are an elite financial analyst specializing in institutional-grade analysis. Provide precise, quantitative insights.";
      
      userPrompt = `Analyze this financial data for LAYER ${layer}: ${layerDescriptions[layer as keyof typeof layerDescriptions]}

FILE: ${fileName}
DATA:
${fileData}

Focus exclusively on layer ${layer}. Provide detailed, quantitative analysis with specific numbers and actionable insights.

Return structured JSON with relevant fields for this layer.`;
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
    let content = result.choices?.[0]?.message?.content || "{}";
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }
    
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a structured response from the text
      analysis = {
        healthScore: "B",
        dataQuality: "Medium",
        confidence: "Medium",
        executiveSummary: content,
        keyMetrics: {},
        topInsights: [],
        detailedAnalysis: { raw: content },
        redFlags: [],
        recommendations: [],
        questions: [],
        timestamp: new Date().toISOString()
      };
    }

    return new Response(JSON.stringify({ 
      success: true,
      analysis,
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
