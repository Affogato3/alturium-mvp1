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

    // Fetch all accounts and transactions
    const { data: accounts } = await supabase
      .from('financial_accounts')
      .select('*')
      .eq('user_id', user.id);

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(1000);

    // Simulate AI-powered reconciliation analysis
    const sourcesChecked = accounts?.length || 0;
    let anomaliesFound = 0;
    const details: any = {
      patterns_detected: [],
      mismatches: [],
      suggestions: []
    };

    // Detect anomalies in transactions
    if (transactions) {
      const avgAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length;
      
      for (const tx of transactions) {
        const amount = Number(tx.amount);
        
        // Flag transactions that are significantly different from average
        if (Math.abs(amount) > avgAmount * 3) {
          anomaliesFound++;
          details.patterns_detected.push({
            transaction_id: tx.id,
            type: 'outlier',
            severity: 'medium',
            description: `Transaction amount ${amount.toFixed(2)} is ${((Math.abs(amount) / avgAmount)).toFixed(1)}x the average`
          });
        }
      }

      // Check for duplicate transactions
      const txMap = new Map();
      for (const tx of transactions) {
        const key = `${tx.amount}-${tx.description}-${new Date(tx.transaction_date).toDateString()}`;
        if (txMap.has(key)) {
          anomaliesFound++;
          details.mismatches.push({
            type: 'potential_duplicate',
            transactions: [txMap.get(key), tx.id],
            confidence: 0.87
          });
        } else {
          txMap.set(key, tx.id);
        }
      }
    }

    const confidenceScore = Math.max(75, 98 - (anomaliesFound * 2));

    // Store reconciliation log
    const { error: logError } = await supabase
      .from('reconciliation_logs')
      .insert({
        user_id: user.id,
        status: anomaliesFound > 0 ? 'anomalies_detected' : 'clean',
        sources_checked: sourcesChecked,
        anomalies_found: anomaliesFound,
        confidence_score: confidenceScore,
        details: details
      });

    if (logError) {
      console.error('Error storing reconciliation log:', logError);
    }

    // Store AI insights
    if (anomaliesFound > 0) {
      await supabase
        .from('ai_insights')
        .insert({
          user_id: user.id,
          insight_type: 'reconciliation',
          message: `Cognitive Reconciliation detected ${anomaliesFound} anomalies across ${sourcesChecked} accounts`,
          confidence: confidenceScore,
          priority: anomaliesFound > 5 ? 'high' : 'medium',
          metadata: details
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        sources_checked: sourcesChecked,
        anomalies_found: anomaliesFound,
        confidence_score: confidenceScore,
        status: anomaliesFound > 0 ? 'anomalies_detected' : 'clean',
        details: details
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in reconciliation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});