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
      case "sync": {
        // Fetch all accounts and transactions
        const { data: accounts } = await supabaseClient
          .from("fabric_accounts")
          .select("*")
          .eq("user_id", user.id);

        const { data: transactions } = await supabaseClient
          .from("fabric_transactions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "settled");

        // Simulate reconciliation process
        const discrepancies = [];
        const matched = [];

        for (const account of accounts || []) {
          const accountTransactions = (transactions || []).filter(
            (tx) => tx.account_id === account.id
          );

          const calculatedBalance = accountTransactions.reduce((sum, tx) => {
            return sum + (tx.type === "credit" ? Number(tx.amount) : -Number(tx.amount));
          }, 0);

          if (Math.abs(calculatedBalance - Number(account.balance)) > 0.01) {
            discrepancies.push({
              account_id: account.id,
              account_number: account.account_number,
              expected_balance: calculatedBalance,
              actual_balance: account.balance,
              difference: calculatedBalance - Number(account.balance),
            });
          } else {
            matched.push({
              account_id: account.id,
              account_number: account.account_number,
              balance: account.balance,
            });
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              total_accounts: accounts?.length || 0,
              matched: matched.length,
              discrepancies: discrepancies.length,
              details: {
                matched,
                discrepancies,
              },
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