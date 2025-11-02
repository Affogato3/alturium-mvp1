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
      case "create": {
        const accountNumber = `FAB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const { data, error } = await supabaseClient
          .from("fabric_accounts")
          .insert({
            user_id: user.id,
            client_id: requestData.client_id || user.id,
            account_number: accountNumber,
            currency: requestData.currency || "USD",
            balance: 0,
            account_type: requestData.account_type || "virtual",
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list": {
        const { data, error } = await supabaseClient
          .from("fabric_accounts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "freeze": {
        const { data, error } = await supabaseClient
          .from("fabric_accounts")
          .update({ status: "frozen" })
          .eq("id", requestData.account_id)
          .eq("user_id", user.id)
          .select()
          .single();

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