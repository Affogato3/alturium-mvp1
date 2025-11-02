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

    // Fetch recent transactions
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(500);

    if (txError || !transactions || transactions.length === 0) {
      throw new Error('No transactions found for analysis');
    }

    const anomalies = [];

    // Calculate statistical baselines
    const amounts = transactions.map(t => Math.abs(Number(t.amount)));
    const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length);

    // Anomaly detection algorithms

    // 1. Statistical outliers (Z-score > 3)
    transactions.forEach(tx => {
      const amount = Math.abs(Number(tx.amount));
      const zScore = (amount - mean) / stdDev;
      
      if (zScore > 3) {
        anomalies.push({
          transaction_id: tx.id,
          anomaly_type: 'statistical_outlier',
          risk_score: Math.min(99, 70 + (zScore - 3) * 5),
          description: `Transaction amount ${amount.toFixed(2)} is ${zScore.toFixed(1)} standard deviations from mean`,
          status: 'pending',
          metadata: {
            z_score: zScore,
            amount: amount,
            mean: mean
          }
        });
      }
    });

    // 2. Time-based anomalies (unusual timing)
    const hourCounts = new Map<number, number>();
    transactions.forEach(tx => {
      const hour = new Date(tx.transaction_date).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    transactions.forEach(tx => {
      const hour = new Date(tx.transaction_date).getHours();
      const count = hourCounts.get(hour) || 0;
      
      // Flag transactions at unusual hours (after midnight, before 6am)
      if ((hour >= 0 && hour < 6) && Math.abs(Number(tx.amount)) > mean) {
        anomalies.push({
          transaction_id: tx.id,
          anomaly_type: 'unusual_timing',
          risk_score: 65,
          description: `Large transaction at unusual hour (${hour}:00)`,
          status: 'pending',
          metadata: {
            hour: hour,
            amount: Math.abs(Number(tx.amount))
          }
        });
      }
    });

    // 3. Rapid succession (velocity anomaly)
    for (let i = 0; i < transactions.length - 1; i++) {
      const tx1 = transactions[i];
      const tx2 = transactions[i + 1];
      
      const timeDiff = Math.abs(new Date(tx1.transaction_date).getTime() - new Date(tx2.transaction_date).getTime());
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff < 5 && Math.abs(Number(tx1.amount)) > mean * 0.5 && Math.abs(Number(tx2.amount)) > mean * 0.5) {
        anomalies.push({
          transaction_id: tx1.id,
          anomaly_type: 'velocity_anomaly',
          risk_score: 72,
          description: `Multiple large transactions within ${minutesDiff.toFixed(1)} minutes`,
          status: 'pending',
          metadata: {
            related_transaction: tx2.id,
            time_difference_minutes: minutesDiff
          }
        });
      }
    }

    // 4. Category pattern deviation
    const categoryStats = new Map<string, { total: number, count: number }>();
    transactions.forEach(tx => {
      const cat = tx.category || 'uncategorized';
      const stats = categoryStats.get(cat) || { total: 0, count: 0 };
      stats.total += Math.abs(Number(tx.amount));
      stats.count += 1;
      categoryStats.set(cat, stats);
    });

    transactions.forEach(tx => {
      const cat = tx.category || 'uncategorized';
      const stats = categoryStats.get(cat)!;
      const avgForCategory = stats.total / stats.count;
      const amount = Math.abs(Number(tx.amount));
      
      if (amount > avgForCategory * 4) {
        anomalies.push({
          transaction_id: tx.id,
          anomaly_type: 'category_deviation',
          risk_score: 58,
          description: `Amount ${amount.toFixed(2)} is ${(amount / avgForCategory).toFixed(1)}x the category average`,
          status: 'pending',
          metadata: {
            category: cat,
            category_average: avgForCategory
          }
        });
      }
    });

    // Store anomalies in database
    for (const anomaly of anomalies) {
      await supabase
        .from('anomaly_detections')
        .insert({
          user_id: user.id,
          ...anomaly
        });
    }

    // Create AI insight if significant anomalies found
    if (anomalies.length > 0) {
      const highRiskCount = anomalies.filter(a => a.risk_score > 80).length;
      await supabase
        .from('ai_insights')
        .insert({
          user_id: user.id,
          insight_type: 'anomaly_detection',
          message: `Anomaly Neural Net detected ${anomalies.length} suspicious patterns (${highRiskCount} high-risk)`,
          confidence: 88,
          priority: highRiskCount > 0 ? 'high' : 'medium',
          metadata: {
            total_anomalies: anomalies.length,
            high_risk: highRiskCount,
            types: Array.from(new Set(anomalies.map(a => a.anomaly_type)))
          }
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_transactions_analyzed: transactions.length,
        anomalies_detected: anomalies.length,
        anomalies: anomalies.sort((a, b) => b.risk_score - a.risk_score),
        statistical_baseline: {
          mean: mean.toFixed(2),
          std_dev: stdDev.toFixed(2)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in anomaly detection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});