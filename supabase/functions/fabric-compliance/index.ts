import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const { action } = await req.json();

    switch (action) {
      case "scan": {
        // Fetch recent transactions
        const { data: transactions } = await supabaseClient
          .from("fabric_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100);

        // Simulate compliance scanning
        const alerts = [];
        const passed = [];

        for (const tx of transactions || []) {
          const riskScore = Math.random();
          
          if (riskScore > 0.85) {
            alerts.push({
              transaction_id: tx.id,
              tx_number: tx.tx_number,
              amount: tx.amount,
              currency: tx.currency,
              rule: "AML_HIGH_VALUE_TRANSACTION",
              severity: "high",
              risk_score: riskScore,
              recommendation: "Manual review required",
            });

            // Log to compliance events
            await supabaseClient.from("fabric_compliance_events").insert({
              user_id: user.id,
              transaction_id: tx.id,
              rule_triggered: "AML_HIGH_VALUE_TRANSACTION",
              severity: "high",
              status: "under_review",
              details: { risk_score: riskScore },
            });
          } else if (riskScore > 0.7) {
            alerts.push({
              transaction_id: tx.id,
              tx_number: tx.tx_number,
              amount: tx.amount,
              currency: tx.currency,
              rule: "SUSPICIOUS_PATTERN",
              severity: "medium",
              risk_score: riskScore,
              recommendation: "Automated monitoring",
            });
          } else {
            passed.push({
              transaction_id: tx.id,
              tx_number: tx.tx_number,
              amount: tx.amount,
              currency: tx.currency,
              risk_score: riskScore,
            });
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              total_scanned: transactions?.length || 0,
              alerts: alerts.length,
              passed: passed.length,
              compliance_rate: ((passed.length / (transactions?.length || 1)) * 100).toFixed(1),
              details: { alerts, passed: passed.slice(0, 10) },
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      default:
        throw new Error("Invalid action");
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});