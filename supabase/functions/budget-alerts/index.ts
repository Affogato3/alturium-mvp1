import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 426 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = headers.get("authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log(`WebSocket connection established for user: ${user.id}`);

    const { socket, response } = Deno.upgradeWebSocket(req);

    // Send initial connection confirmation
    socket.onopen = () => {
      console.log("WebSocket opened for user:", user.id);
      socket.send(JSON.stringify({
        type: 'connected',
        message: 'Real-time budget alerts connected',
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);

        if (message.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }

        if (message.type === 'check_alerts') {
          // Check for current alerts
          await checkAndSendAlerts(supabase, user.id, socket);
        }
      } catch (error: any) {
        console.error("Error processing message:", error);
        socket.send(JSON.stringify({
          type: 'error',
          message: error.message
        }));
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed for user:", user.id);
    };

    // Set up periodic alert checking (every 30 seconds)
    const alertInterval = setInterval(async () => {
      if (socket.readyState === WebSocket.OPEN) {
        await checkAndSendAlerts(supabase, user.id, socket);
      } else {
        clearInterval(alertInterval);
      }
    }, 30000);

    return response;

  } catch (error: any) {
    console.error("WebSocket setup error:", error);
    return new Response(error.message, { status: 500 });
  }
});

async function checkAndSendAlerts(supabase: any, userId: string, socket: WebSocket) {
  try {
    console.log("Checking alerts for user:", userId);

    // Get all budgets with their actuals
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);

    if (budgetError) throw budgetError;

    // Get budget rules
    const { data: rules, error: rulesError } = await supabase
      .from('budget_rules')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (rulesError) throw rulesError;

    const alerts = [];

    for (const budget of budgets || []) {
      // Get actuals for this budget
      const { data: actuals, error: actualsError } = await supabase
        .from('budget_actuals')
        .select('actual_amount')
        .eq('budget_id', budget.id);

      if (actualsError) continue;

      const totalActual = actuals?.reduce((sum: number, a: any) => 
        sum + parseFloat(a.actual_amount), 0) || 0;
      
      const plannedAmount = parseFloat(budget.planned_amount);
      const variance = plannedAmount > 0 ? ((totalActual - plannedAmount) / plannedAmount) * 100 : 0;

      // Check against rules for this department
      const departmentRules = rules?.filter((r: any) => r.department === budget.department) || [];
      
      for (const rule of departmentRules) {
        const threshold = parseFloat(rule.threshold_percentage);
        
        if (Math.abs(variance) > threshold) {
          alerts.push({
            type: variance > 0 ? 'overspend' : 'underspend',
            department: budget.department,
            category: budget.category,
            variance: variance.toFixed(2),
            threshold: threshold.toFixed(2),
            actual: totalActual.toFixed(2),
            planned: plannedAmount.toFixed(2),
            rule_name: rule.rule_name,
            severity: Math.abs(variance) > threshold * 2 ? 'critical' : 
                     Math.abs(variance) > threshold * 1.5 ? 'high' : 'medium',
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    // Get recent forecasts with high drift
    const { data: forecasts, error: forecastError } = await supabase
      .from('budget_forecasts')
      .select('*')
      .eq('user_id', userId)
      .gte('forecast_date', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false })
      .limit(10);

    if (!forecastError && forecasts) {
      for (const forecast of forecasts) {
        if (forecast.drift_percentage && Math.abs(parseFloat(forecast.drift_percentage)) > 10) {
          alerts.push({
            type: 'forecast_drift',
            department: 'N/A',
            category: 'forecast',
            drift: parseFloat(forecast.drift_percentage).toFixed(2),
            predicted_amount: parseFloat(forecast.predicted_amount).toFixed(2),
            forecast_date: forecast.forecast_date,
            confidence: forecast.confidence_score,
            recommendation: forecast.ai_recommendation,
            severity: Math.abs(parseFloat(forecast.drift_percentage)) > 20 ? 'critical' : 'medium',
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    if (alerts.length > 0 && socket.readyState === WebSocket.OPEN) {
      console.log(`Sending ${alerts.length} alerts to user ${userId}`);
      socket.send(JSON.stringify({
        type: 'budget_alerts',
        alerts,
        count: alerts.length,
        timestamp: new Date().toISOString()
      }));

      // Create AI insights for critical alerts
      const criticalAlerts = alerts.filter((a: any) => a.severity === 'critical');
      for (const alert of criticalAlerts) {
        await supabase.from('ai_insights').insert({
          user_id: userId,
          insight_type: 'budget_alert',
          message: alert.type === 'overspend' 
            ? `Critical: ${alert.department} overspending by ${alert.variance}% (threshold: ${alert.threshold}%)`
            : alert.type === 'underspend'
            ? `${alert.department} underspending by ${Math.abs(parseFloat(alert.variance || '0'))}%`
            : `Critical forecast drift: ${alert.drift}% predicted for ${alert.forecast_date}`,
          priority: 'high',
          confidence: 0.95,
          metadata: alert
        });
      }
    }

  } catch (error: any) {
    console.error("Error checking alerts:", error);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to check alerts',
        error: error.message
      }));
    }
  }
}
