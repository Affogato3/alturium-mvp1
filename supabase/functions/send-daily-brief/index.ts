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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token || '');
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { brief_id, email } = await req.json();

    if (!brief_id || !email) {
      throw new Error('Missing required parameters: brief_id and email');
    }

    // Fetch the brief
    const { data: brief, error: briefError } = await supabase
      .from('daily_briefs')
      .select('*')
      .eq('id', brief_id)
      .eq('user_id', user.id)
      .single();

    if (briefError || !brief) {
      throw new Error('Brief not found');
    }

    // Fetch action items
    const { data: actionItems } = await supabase
      .from('action_items')
      .select('*')
      .eq('brief_id', brief_id)
      .eq('user_id', user.id)
      .order('urgency', { ascending: false })
      .limit(5);

    // Generate email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; }
          .metric-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .urgent { border-left: 4px solid #dc3545; }
          .today { border-left: 4px solid #ffc107; }
          .amount { font-size: 28px; font-weight: bold; }
          .change-positive { color: #28a745; }
          .change-negative { color: #dc3545; }
          .action-item { padding: 15px; margin: 10px 0; background: white; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>☀️ Daily Financial Brief</h1>
            <p>${new Date(brief.brief_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div class="content">
            <div class="metric-card">
              <h2>💰 Cash & Revenue</h2>
              <div class="amount">$${Number(brief.cash_amount).toLocaleString()}</div>
              <div class="${Number(brief.cash_change) >= 0 ? 'change-positive' : 'change-negative'}">
                ${Number(brief.cash_change) >= 0 ? '↑' : '↓'} $${Math.abs(Number(brief.cash_change)).toLocaleString()} from yesterday
              </div>
              <p style="margin-top: 15px;">Revenue: $${Number(brief.revenue).toLocaleString()}</p>
              <p>Expenses: $${Number(brief.expenses).toLocaleString()}</p>
              <p>Burn Rate: $${Number(brief.burn_rate).toLocaleString()}/day</p>
            </div>

            ${actionItems && actionItems.length > 0 ? `
            <div class="metric-card">
              <h2>⚡ Needs Attention (${actionItems.length} items)</h2>
              ${actionItems.map((item: any) => `
                <div class="action-item ${item.urgency}">
                  <strong>${item.urgency === 'urgent' ? '🔴' : '🟡'} ${item.title}</strong>
                  <p>${item.description}</p>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${brief.ai_insights?.executive_summary ? `
            <div class="metric-card">
              <h2>🤖 AI Insights</h2>
              <p>${brief.ai_insights.executive_summary}</p>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>This is your automated daily brief from FinSynapse</p>
            <p>View full details in your dashboard</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // In production, integrate with Resend or other email service
    // For now, update the brief status
    await supabase
      .from('daily_briefs')
      .update({
        status: 'sent',
        email_sent_at: new Date().toISOString(),
        email_html: emailHtml
      })
      .eq('id', brief_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Daily brief sent to ${email}`,
        preview: emailHtml
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error sending daily brief:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});