import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { insight_id, channels, message } = await req.json();

    // Simulate sending to multiple channels
    const results = channels.map((channel: string) => ({
      channel,
      status: "sent",
      timestamp: new Date().toISOString()
    }));

    console.log(`Alert sent to ${channels.join(', ')}:`, message);

    return new Response(JSON.stringify({ 
      success: true,
      insight_id,
      delivery_results: results,
      message: `Insight delivered to ${channels.length} channel(s)`
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
