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
    const { analysisType, data, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are Finalyst, an elite AI Finance Analyst specializing in trading operations, risk management, and financial reporting. You provide accurate financial analysis, insightful market commentary, and proactive risk assessment with the precision of a seasoned analyst.

Your responses should be:
- Professional and authoritative yet accessible
- Data-driven with supporting evidence
- Structured with clear sections and metrics
- Actionable with specific recommendations

Always format monetary values with proper currency symbols and thousands separators.
Use percentages with 2 decimal places.
Include timestamps and data freshness notes.`;

    let userPrompt = "";

    switch (analysisType) {
      case "daily_pnl":
        userPrompt = `Generate a comprehensive Daily P&L Analysis Report based on this trading data:
${JSON.stringify(data, null, 2)}

Provide:
1. EXECUTIVE SUMMARY with total P&L, key driver, and attention items
2. DESK BREAKDOWN with top contributors and movements for each desk
3. VARIANCE ANALYSIS comparing budget vs actual with explanations
4. RISK HIGHLIGHTS with key metrics and concerns
5. ACTION ITEMS requiring management attention

Use realistic financial figures and professional terminology.`;
        break;

      case "market_commentary":
        userPrompt = `Generate a professional Market Commentary Report for senior management based on current market conditions:
${JSON.stringify(data, null, 2)}

Include:
1. MARKET OVERVIEW - 2-3 sentence summary of market conditions
2. PERFORMANCE DRIVERS - Key factors affecting portfolio performance
3. SECTOR ANALYSIS - Breakdown by major sectors
4. PORTFOLIO IMPACT - How market moves affected positions
5. OUTLOOK - Forward-looking considerations and catalysts
6. RECOMMENDATIONS - Actionable insights

Write in a professional, executive-ready tone.`;
        break;

      case "risk_analysis":
        userPrompt = `Perform a comprehensive Risk Exposure Analysis based on this portfolio data:
${JSON.stringify(data, null, 2)}

Provide:
1. RISK SUMMARY with traffic light indicators (🟢🟡🔴)
2. VALUE AT RISK (VaR) - Historical, Parametric, and Monte Carlo estimates
3. CONCENTRATION RISK by counterparty, sector, and geography
4. STRESS TEST RESULTS under various scenarios
5. LIMIT MONITORING with current utilization vs limits
6. RISK MITIGATION recommendations
7. EARLY WARNING INDICATORS

Include specific numerical metrics and percentages.`;
        break;

      case "monthly_report":
        userPrompt = `Generate a comprehensive Monthly Financial Report based on this data:
${JSON.stringify(data, null, 2)}

Include:
1. FINANCIAL HIGHLIGHTS - Key metrics summary
2. INCOME STATEMENT - P&L by business line
3. BALANCE SHEET SUMMARY - Asset/liability breakdown
4. CASH FLOW ANALYSIS - Liquidity position
5. KPI DASHBOARD - Critical success metrics
6. BUDGET VS ACTUAL - Variance analysis with explanations
7. FORWARD GUIDANCE - Outlook and recommendations

Format as an executive-ready report with clear sections.`;
        break;

      case "process_review":
        userPrompt = `Analyze this process and provide re-engineering recommendations:
${JSON.stringify(data, null, 2)}

Deliver:
1. CURRENT STATE ASSESSMENT - Pain points and inefficiencies
2. GAP ANALYSIS - Root causes of issues
3. AUTOMATION OPPORTUNITIES - Specific areas to automate
4. WORKFLOW OPTIMIZATION - Before/after comparisons
5. TECHNOLOGY RECOMMENDATIONS - Tools and integrations
6. IMPLEMENTATION ROADMAP - Phased approach with timeline
7. EXPECTED BENEFITS - Quantified improvements (time, cost, errors)
8. SUCCESS METRICS - KPIs for measuring improvement

Be specific and actionable.`;
        break;

      case "variance_analysis":
        userPrompt = `Perform detailed Variance Analysis on this financial data:
${JSON.stringify(data, null, 2)}

Provide:
1. SUMMARY - Overall variance with key drivers
2. REVENUE VARIANCE - By product/region/client
3. COST VARIANCE - Fixed vs variable, by category
4. MARGIN ANALYSIS - Gross and net margin changes
5. VOLUME VS PRICE EFFECTS - Decomposition
6. ROOT CAUSES - Detailed explanations
7. CORRECTIVE ACTIONS - Recommendations

Include specific dollar amounts and percentages.`;
        break;

      case "portfolio_attribution":
        userPrompt = `Generate a Portfolio Attribution Analysis based on this data:
${JSON.stringify(data, null, 2)}

Include:
1. TOTAL RETURN BREAKDOWN - Absolute and relative performance
2. ASSET ALLOCATION EFFECT - Impact of allocation decisions
3. SECURITY SELECTION EFFECT - Stock picking contribution
4. SECTOR ATTRIBUTION - Performance by sector
5. FACTOR ATTRIBUTION - Style, size, momentum effects
6. CURRENCY EFFECTS - FX impact on returns
7. BENCHMARK COMPARISON - vs relevant indices
8. RECOMMENDATIONS - Portfolio optimization suggestions

Use professional investment terminology.`;
        break;

      default:
        userPrompt = `Provide financial analysis for: ${context || "General financial inquiry"}
Data: ${JSON.stringify(data, null, 2)}

Deliver professional, actionable insights with specific metrics and recommendations.`;
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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "API credits depleted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysisContent = aiResponse.choices?.[0]?.message?.content || "Analysis unavailable";

    // Parse sections from the response
    const sections = parseAnalysisSections(analysisContent, analysisType);

    return new Response(
      JSON.stringify({
        success: true,
        analysisType,
        timestamp: new Date().toISOString(),
        content: analysisContent,
        sections,
        metadata: {
          model: "google/gemini-2.5-flash",
          tokens: aiResponse.usage?.total_tokens || 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Finalyst analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Analysis failed",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function parseAnalysisSections(content: string, analysisType: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Common section patterns
  const sectionPatterns = [
    /(?:^|\n)(?:#{1,3}\s*)?(EXECUTIVE SUMMARY|SUMMARY)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
    /(?:^|\n)(?:#{1,3}\s*)?(DESK BREAKDOWN|BREAKDOWN)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
    /(?:^|\n)(?:#{1,3}\s*)?(VARIANCE ANALYSIS|VARIANCE)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
    /(?:^|\n)(?:#{1,3}\s*)?(RISK HIGHLIGHTS|RISK SUMMARY|RISK)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
    /(?:^|\n)(?:#{1,3}\s*)?(ACTION ITEMS|ACTIONS|RECOMMENDATIONS)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
    /(?:^|\n)(?:#{1,3}\s*)?(MARKET OVERVIEW|OVERVIEW)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
    /(?:^|\n)(?:#{1,3}\s*)?(PERFORMANCE DRIVERS|DRIVERS)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
    /(?:^|\n)(?:#{1,3}\s*)?(OUTLOOK|FORWARD)[:\s]*\n([\s\S]*?)(?=\n(?:#{1,3}\s*)?[A-Z]{2,}|\n---|\Z)/gi,
  ];

  for (const pattern of sectionPatterns) {
    const match = pattern.exec(content);
    if (match) {
      const sectionName = match[1].toLowerCase().replace(/\s+/g, '_');
      sections[sectionName] = match[2].trim();
    }
  }

  // If no sections found, use full content
  if (Object.keys(sections).length === 0) {
    sections['full_analysis'] = content;
  }

  return sections;
}
