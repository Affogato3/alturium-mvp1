import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { auto_execute = false } = await req.json();

    // Fetch all accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('financial_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (accountsError || !accounts || accounts.length < 2) {
      throw new Error('Insufficient accounts for rebalancing');
    }

    // Calculate total balance and ideal distribution
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    const idealBalance = totalBalance / accounts.length;
    
    // Identify accounts that need rebalancing
    const rebalanceActions = [];
    const sourceAccounts = accounts.filter(acc => Number(acc.balance) > idealBalance * 1.2);
    const targetAccounts = accounts.filter(acc => Number(acc.balance) < idealBalance * 0.8);

    for (const source of sourceAccounts) {
      for (const target of targetAccounts) {
        const excessAmount = Number(source.balance) - idealBalance;
        const deficitAmount = idealBalance - Number(target.balance);
        const transferAmount = Math.min(excessAmount, deficitAmount) * 0.8; // Conservative 80% transfer

        if (transferAmount > 100) { // Only transfer if significant
          rebalanceActions.push({
            from: source.account_name,
            from_id: source.id,
            to: target.account_name,
            to_id: target.id,
            amount: transferAmount,
            reason: `Optimizing liquidity distribution`,
            confidence: 0.92
          });
        }
      }
    }

    // Calculate efficiency gain
    const currentVariance = accounts.reduce((sum, acc) => 
      sum + Math.pow(Number(acc.balance) - idealBalance, 2), 0) / accounts.length;
    
    const projectedBalances = new Map(accounts.map(acc => [acc.id, Number(acc.balance)]));
    rebalanceActions.forEach(action => {
      projectedBalances.set(action.from_id, projectedBalances.get(action.from_id)! - action.amount);
      projectedBalances.set(action.to_id, projectedBalances.get(action.to_id)! + action.amount);
    });
    
    const projectedVariance = accounts.reduce((sum, acc) => 
      sum + Math.pow(projectedBalances.get(acc.id)! - idealBalance, 2), 0) / accounts.length;
    
    const efficiencyGain = ((currentVariance - projectedVariance) / currentVariance) * 100;

    // Execute transfers if auto_execute is true
    if (auto_execute && rebalanceActions.length > 0) {
      for (const action of rebalanceActions) {
        // Create transaction records
        await supabase.from('transactions').insert([
          {
            user_id: user.id,
            account_id: action.from_id,
            transaction_type: 'transfer_out',
            amount: -action.amount,
            description: `Auto-rebalance to ${action.to}`,
            category: 'rebalancing',
            status: 'completed'
          },
          {
            user_id: user.id,
            account_id: action.to_id,
            transaction_type: 'transfer_in',
            amount: action.amount,
            description: `Auto-rebalance from ${action.from}`,
            category: 'rebalancing',
            status: 'completed'
          }
        ]);

        // Update account balances
        await supabase
          .from('financial_accounts')
          .update({ balance: projectedBalances.get(action.from_id) })
          .eq('id', action.from_id);

        await supabase
          .from('financial_accounts')
          .update({ balance: projectedBalances.get(action.to_id) })
          .eq('id', action.to_id);

        // Log to audit trail
        await supabase.from('audit_trail').insert({
          user_id: user.id,
          action_type: 'auto_rebalance',
          entity_type: 'financial_account',
          entity_id: action.from_id,
          details: action
        });
      }

      // Create AI insight
      await supabase
        .from('ai_insights')
        .insert({
          user_id: user.id,
          insight_type: 'rebalancing',
          message: `Autonomous Rebalancer executed ${rebalanceActions.length} transfers | +${efficiencyGain.toFixed(1)}% efficiency gain`,
          confidence: 92,
          priority: 'medium',
          metadata: {
            actions: rebalanceActions,
            efficiency_gain: efficiencyGain
          }
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        executed: auto_execute,
        total_balance: totalBalance,
        ideal_balance: idealBalance,
        rebalance_actions: rebalanceActions,
        efficiency_gain: efficiencyGain.toFixed(1),
        message: auto_execute 
          ? `Liquidity normalized across ${accounts.length} accounts` 
          : `${rebalanceActions.length} rebalancing opportunities identified`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in rebalancing:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});