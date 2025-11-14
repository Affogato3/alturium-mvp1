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
    const { action, ...params } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";
    let result: any = {};

    switch (action) {
      case "scan":
        systemPrompt = "You are a global event intelligence AI. Analyze and detect geopolitical, economic, and supply chain events from various sources.";
        userPrompt = `Scan global events from sources: ${JSON.stringify(params.sources)}. Return JSON with: events array containing {id, title, description, severity (1-10), x (0-100), y (0-100), type, region}`;
        break;

      case "analyze_impact":
        systemPrompt = "You are a business impact analyst AI. Analyze how global events affect business operations, supply chains, and financial metrics.";
        userPrompt = `Analyze impact of this event: ${JSON.stringify(params.event)}\n\nReturn JSON with: {summary (detailed analysis), confidence (percentage), affected_metrics array, recommendations array}`;
        break;

      case "simulate_impact":
        systemPrompt = "You are a financial simulation AI. Model business impact scenarios with probabilistic forecasting.";
        userPrompt = `Simulate impact for: Duration ${params.duration} days, Severity ${params.severity}/10, Event type: ${params.event_type}\n\nReturn JSON with: {revenue_impact, margin_impact, cost_increase, confidence, timeline array with {day, baseline, pessimistic, optimistic}}`;
        
        // Generate timeline data
        const timeline = [];
        for (let day = 0; day <= params.duration; day += Math.ceil(params.duration / 20)) {
          timeline.push({
            day,
            baseline: -params.severity * 0.3 * (1 - Math.exp(-day / 30)),
            pessimistic: -params.severity * 0.5 * (1 - Math.exp(-day / 25)),
            optimistic: -params.severity * 0.1 * (1 - Math.exp(-day / 35))
          });
        }
        
        result = {
          revenue_impact: `-${(params.severity * 0.3).toFixed(1)}`,
          margin_impact: `-${(params.severity * 0.2).toFixed(1)}`,
          cost_increase: `+${(params.severity * 0.4).toFixed(1)}`,
          confidence: Math.floor(85 + Math.random() * 10),
          timeline
        };
        break;

      case "generate_actions":
        systemPrompt = "You are an AI action recommendation engine. Generate specific, executable business actions based on events and context.";
        userPrompt = `Generate action recommendations for context: ${params.context}\n\nReturn JSON with: actions array containing {id, title, description, priority (high/medium/low), confidence (percentage), expected_impact, reasoning, sources array, status}`;
        break;

      case "execute_action":
        // Simulate action execution
        result = {
          success: true,
          executed_at: new Date().toISOString(),
          message: "Action queued for execution"
        };
        break;

      case "list_playbooks":
        result = {
          playbooks: [
            {
              id: "pb_1",
              name: "Supply Chain Disruption Response",
              description: "Automated response to supply chain events",
              active: true,
              success_rate: 92,
              execution_count: 47,
              steps: [
                "Identify affected suppliers",
                "Assess inventory levels",
                "Trigger alternative supplier search",
                "Notify procurement team",
                "Hedge commodity exposure"
              ]
            },
            {
              id: "pb_2",
              name: "Currency Volatility Buffer",
              description: "FX risk management automation",
              active: true,
              success_rate: 88,
              execution_count: 31,
              steps: [
                "Detect currency movement threshold",
                "Calculate exposure across operations",
                "Recommend forward contracts",
                "Execute approved hedges"
              ]
            }
          ]
        };
        break;

      case "generate_playbook":
        systemPrompt = "You are a business process automation AI. Create executable workflow playbooks for responding to specific event types.";
        userPrompt = `Create a new playbook for event type: ${params.event_type}\n\nReturn JSON with: {id, name, description, active, success_rate, execution_count, steps array}`;
        break;

      case "generate_causal_graph":
        // Generate causal network visualization data
        const nodes = [
          { id: "n1", label: "Supply Disruption", type: "event", x: 20, y: 30, importance: 0.9, description: "Primary supply chain event" },
          { id: "n2", label: "Cost Increase", type: "impact", x: 50, y: 20, importance: 0.8, value: "+8%", description: "Direct cost impact" },
          { id: "n3", label: "Margin Pressure", type: "impact", x: 80, y: 30, importance: 0.7, value: "-2.4%", description: "Margin compression" },
          { id: "n4", label: "Revenue Risk", type: "impact", x: 80, y: 60, importance: 0.6, value: "-$1.2M", description: "Revenue at risk" },
          { id: "n5", label: "Supplier X", type: "entity", x: 20, y: 70, importance: 0.8, description: "Critical supplier" },
          { id: "n6", label: "Alternative Sources", type: "action", x: 50, y: 80, importance: 0.5, description: "Mitigation strategy" },
        ];

        const edges = [
          { from: "n1", to: "n2", weight: 0.9 },
          { from: "n2", to: "n3", weight: 0.8 },
          { from: "n1", to: "n4", weight: 0.7 },
          { from: "n5", to: "n1", weight: 0.9 },
          { from: "n6", to: "n2", weight: 0.6 },
        ];

        result = { nodes, edges };
        break;

      case "get_outcomes":
        result = {
          outcomes: [
            {
              id: "o1",
              action: "Hedge FX Exposure",
              description: "Forward contract for EUR/USD",
              predicted_impact: "+$120k",
              actual_impact: "+$118k",
              accuracy: 98,
              success: true,
              date: "2025-10-15"
            },
            {
              id: "o2",
              action: "Alternative Supplier Activation",
              description: "Switched to backup supplier",
              predicted_impact: "-$45k cost reduction",
              actual_impact: "-$38k cost reduction",
              accuracy: 84,
              success: true,
              date: "2025-10-22"
            },
            {
              id: "o3",
              action: "Demand Forecast Adjustment",
              description: "Reduced inventory orders",
              predicted_impact: "+$80k savings",
              actual_impact: "+$55k savings",
              accuracy: 69,
              success: false,
              date: "2025-11-02"
            }
          ]
        };
        break;

      case "create_alert":
        result = {
          alert: {
            id: `alert_${Date.now()}`,
            ...params.rule,
            active: true,
            trigger_count: 0,
            created_at: new Date().toISOString()
          }
        };
        break;

      case "test_alert":
        result = {
          match_count: Math.floor(Math.random() * 20) + 5,
          sample_matches: ["Event A", "Event B", "Event C"]
        };
        break;
    }

    // If we need AI processing and haven't generated result yet
    if (!Object.keys(result).length && systemPrompt && userPrompt) {
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
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds to Lovable AI." }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error(`AI processing failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        result = jsonMatch ? JSON.parse(jsonMatch[0]) : { response: content };
      } catch {
        result = { response: content };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in market-synapse:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
