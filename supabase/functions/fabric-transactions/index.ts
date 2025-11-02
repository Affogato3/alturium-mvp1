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

    const { action, data: requestData } = await req.json();

    switch (action) {
      case "initiate": {
        const txNumber = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Simulate compliance check
        const complianceRisk = Math.random();
        const status = complianceRisk > 0.9 ? "blocked" : "pending";

        const { data: transaction, error } = await supabaseClient
          .from("fabric_transactions")
          .insert({
            user_id: user.id,
            account_id: requestData.account_id,
            tx_number: txNumber,
            type: requestData.type,
            amount: requestData.amount,
            currency: requestData.currency || "USD",
            category: requestData.category,
            status,
            initiated_by: user.email,
            description: requestData.description,
          })
          .select()
          .single();

        if (error) throw error;

        // Log compliance event if flagged
        if (status === "blocked") {
          await supabaseClient.from("fabric_compliance_events").insert({
            user_id: user.id,
            transaction_id: transaction.id,
            rule_triggered: "AML_RISK_HIGH",
            severity: "critical",
            status: "detected",
            details: { risk_score: complianceRisk },
          });
        }

        return new Response(JSON.stringify({ success: true, data: transaction }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list": {
        const { data, error } = await supabaseClient
          .from("fabric_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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