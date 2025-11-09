import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { alert_id, action } = await req.json();

    console.log(`Executing action "${action}" for alert ${alert_id}`);

    // Simulate action execution
    const actionResults = {
      investigate: {
        status: "initiated",
        workflow_id: `WF_${Date.now()}`,
        assigned_to: "analytics_team",
        priority: "high"
      },
      dismiss: {
        status: "dismissed",
        dismissed_at: new Date().toISOString()
      }
    };

    const result = actionResults[action as keyof typeof actionResults] || actionResults.investigate;

    return new Response(JSON.stringify({ 
      success: true,
      alert_id,
      action,
      result,
      executed_at: new Date().toISOString()
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
