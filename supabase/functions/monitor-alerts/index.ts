import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Simulate real-time monitoring with sample alerts
    const alerts = [
      {
        id: `ALERT_${Date.now()}_1`,
        type: "critical",
        title: "Revenue Deviation Detected",
        message: "Marketing ROI dropped 14% this week. Root cause: LinkedIn Ads underperforming by 28%.",
        metric: "Marketing ROI",
        deviation: "-14%",
        timestamp: new Date().toISOString(),
        actionable: true
      },
      {
        id: `ALERT_${Date.now()}_2`,
        type: "warning",
        title: "Customer Engagement Declining",
        message: "Average response time increased from 2.3h to 4.7h. Customer satisfaction at risk.",
        metric: "Response Time",
        deviation: "+104%",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actionable: true
      },
      {
        id: `ALERT_${Date.now()}_3`,
        type: "info",
        title: "Positive Trend Identified",
        message: "West Coast conversions rising 2.3× faster than expected. Opportunity to reallocate resources.",
        metric: "Conversion Rate",
        deviation: "+230%",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        actionable: false
      }
    ];

    // Randomly return subset of alerts to simulate real-time changes
    const activeAlerts = Math.random() > 0.3 
      ? alerts.slice(0, Math.floor(Math.random() * 3) + 1)
      : [];

    return new Response(JSON.stringify({ 
      success: true,
      alerts: activeAlerts,
      monitoring_status: "active",
      last_check: new Date().toISOString()
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
