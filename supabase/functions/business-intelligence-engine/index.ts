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
    const { module, action, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    // Module-specific prompts
    switch (module) {
      case "compliance":
        systemPrompt = `You are an AI Compliance Risk Management expert. Analyze compliance risks, policy violations, and regulatory requirements. Provide structured JSON responses with risk_score (0-100), findings array, recommendations array, and summary.`;
        switch (action) {
          case "scan_documents":
            userPrompt = `Analyze the following documents for compliance risks and policy violations. Identify potential issues, assign risk scores, and provide actionable recommendations:\n${JSON.stringify(data)}`;
            break;
          case "generate_risk_report":
            userPrompt = `Generate a comprehensive compliance risk report based on the current organizational data. Include risk heat map data, trend analysis, and priority actions:\n${JSON.stringify(data)}`;
            break;
          case "policy_analysis":
            userPrompt = `Compare and analyze compliance policies. Identify gaps, conflicts, and areas needing updates:\n${JSON.stringify(data)}`;
            break;
          case "audit_preparation":
            userPrompt = `Prepare audit documentation and checklists based on regulatory requirements:\n${JSON.stringify(data)}`;
            break;
          default:
            userPrompt = `Analyze compliance requirements and provide recommendations:\n${JSON.stringify(data)}`;
        }
        break;

      case "strategic":
        systemPrompt = `You are a Strategic Decision Intelligence AI. Analyze market conditions, competitive landscape, and business strategy. Provide structured JSON responses with analysis, scenarios array, recommendations array, financial_projections, and confidence_score.`;
        switch (action) {
          case "market_analysis":
            userPrompt = `Conduct comprehensive market analysis including industry trends, competitive positioning, and growth opportunities:\n${JSON.stringify(data)}`;
            break;
          case "scenario_planning":
            userPrompt = `Create strategic scenarios with projected outcomes, probability assessments, and recommended actions:\n${JSON.stringify(data)}`;
            break;
          case "swot_analysis":
            userPrompt = `Generate detailed SWOT analysis with quantified strengths, weaknesses, opportunities, and threats:\n${JSON.stringify(data)}`;
            break;
          case "financial_modeling":
            userPrompt = `Build financial models including DCF valuation, NPV calculations, and sensitivity analysis:\n${JSON.stringify(data)}`;
            break;
          case "competitive_intelligence":
            userPrompt = `Analyze competitive landscape, market positioning, and strategic advantages:\n${JSON.stringify(data)}`;
            break;
          default:
            userPrompt = `Provide strategic analysis and recommendations:\n${JSON.stringify(data)}`;
        }
        break;

      case "client":
        systemPrompt = `You are a Client Relationship and Transaction Management AI. Analyze client data, predict behaviors, score leads, and optimize relationships. Provide structured JSON responses with client_score, predictions, recommendations, and action_items.`;
        switch (action) {
          case "lead_scoring":
            userPrompt = `Score and prioritize leads based on conversion probability, engagement metrics, and fit criteria:\n${JSON.stringify(data)}`;
            break;
          case "churn_prediction":
            userPrompt = `Analyze client health indicators and predict churn risk with early warning signals:\n${JSON.stringify(data)}`;
            break;
          case "clv_calculation":
            userPrompt = `Calculate Customer Lifetime Value with segmentation and revenue projections:\n${JSON.stringify(data)}`;
            break;
          case "pipeline_forecast":
            userPrompt = `Forecast sales pipeline with probability-weighted revenue and close date predictions:\n${JSON.stringify(data)}`;
            break;
          case "relationship_analysis":
            userPrompt = `Analyze client relationship health, engagement patterns, and optimization opportunities:\n${JSON.stringify(data)}`;
            break;
          default:
            userPrompt = `Analyze client data and provide recommendations:\n${JSON.stringify(data)}`;
        }
        break;

      case "operations":
        systemPrompt = `You are an Operations and Process Optimization AI. Analyze workflows, identify bottlenecks, calculate efficiency metrics, and recommend improvements. Provide structured JSON responses with efficiency_score, bottlenecks array, optimizations array, and projected_savings.`;
        switch (action) {
          case "workflow_analysis":
            userPrompt = `Analyze workflow efficiency, identify bottlenecks, and calculate cycle times:\n${JSON.stringify(data)}`;
            break;
          case "process_mining":
            userPrompt = `Discover process patterns, deviations, and optimization opportunities from execution data:\n${JSON.stringify(data)}`;
            break;
          case "resource_optimization":
            userPrompt = `Optimize resource allocation using queueing theory and workload balancing:\n${JSON.stringify(data)}`;
            break;
          case "sla_monitoring":
            userPrompt = `Monitor SLA compliance, predict breaches, and recommend preventive actions:\n${JSON.stringify(data)}`;
            break;
          case "automation_opportunities":
            userPrompt = `Identify automation opportunities with ROI projections and implementation roadmap:\n${JSON.stringify(data)}`;
            break;
          default:
            userPrompt = `Analyze operations and provide optimization recommendations:\n${JSON.stringify(data)}`;
        }
        break;

      case "analytics":
        systemPrompt = `You are a Business Intelligence and Analytics AI. Analyze data patterns, generate forecasts, detect anomalies, and provide actionable insights. Provide structured JSON responses with insights array, forecasts, anomalies, visualizations array, and recommendations.`;
        switch (action) {
          case "trend_analysis":
            userPrompt = `Analyze trends, patterns, and correlations in business data:\n${JSON.stringify(data)}`;
            break;
          case "predictive_forecast":
            userPrompt = `Generate predictive forecasts for key metrics with confidence intervals:\n${JSON.stringify(data)}`;
            break;
          case "anomaly_detection":
            userPrompt = `Detect anomalies and unusual patterns in business data with root cause analysis:\n${JSON.stringify(data)}`;
            break;
          case "cohort_analysis":
            userPrompt = `Perform cohort analysis for customer behavior and retention patterns:\n${JSON.stringify(data)}`;
            break;
          case "nlq_query":
            userPrompt = `Convert natural language query to insights and generate visualizations:\nQuery: ${data.query}\nContext: ${JSON.stringify(data.context)}`;
            break;
          default:
            userPrompt = `Analyze business data and provide insights:\n${JSON.stringify(data)}`;
        }
        break;

      case "infrastructure":
        systemPrompt = `You are an AI-Powered Technology Infrastructure expert. Analyze system health, predict issues, optimize resources, and ensure security. Provide structured JSON responses with health_score, issues array, optimizations array, security_findings, and cost_savings.`;
        switch (action) {
          case "system_health":
            userPrompt = `Analyze system health metrics, predict potential issues, and recommend preventive actions:\n${JSON.stringify(data)}`;
            break;
          case "security_scan":
            userPrompt = `Perform security assessment, identify vulnerabilities, and prioritize remediation:\n${JSON.stringify(data)}`;
            break;
          case "cost_optimization":
            userPrompt = `Analyze infrastructure costs and recommend optimization strategies:\n${JSON.stringify(data)}`;
            break;
          case "capacity_planning":
            userPrompt = `Plan capacity requirements based on growth projections and usage patterns:\n${JSON.stringify(data)}`;
            break;
          case "incident_analysis":
            userPrompt = `Analyze incident patterns and recommend prevention strategies:\n${JSON.stringify(data)}`;
            break;
          default:
            userPrompt = `Analyze infrastructure and provide recommendations:\n${JSON.stringify(data)}`;
        }
        break;

      default:
        throw new Error(`Unknown module: ${module}`);
    }

    console.log(`Processing ${module}/${action} request`);

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
        temperature: 0.3,
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
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Try to parse as JSON, otherwise return as narrative
    let result;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else if (content.trim().startsWith("{") || content.trim().startsWith("[")) {
        result = JSON.parse(content);
      } else {
        result = { narrative: content, type: "text" };
      }
    } catch {
      result = { narrative: content, type: "text" };
    }

    return new Response(
      JSON.stringify({
        success: true,
        module,
        action,
        result,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Business intelligence engine error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
