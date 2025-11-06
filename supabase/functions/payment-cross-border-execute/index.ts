import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) throw new Error('Unauthorized');

    const { amount, fromCurrency, toCurrency, fromCountry, toCountry, routeId, railId, purpose } = await req.json();

    console.log(`Executing cross-border payment: ${amount} ${fromCurrency} → ${toCurrency}`);

    // Generate transaction reference
    const txRef = `CBP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('cross_border_payments')
      .insert({
        user_id: user.id,
        transaction_ref: txRef,
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency,
        from_country: fromCountry,
        to_country: toCountry,
        corridor: `${fromCountry}-${toCountry}`,
        selected_route_id: routeId,
        selected_rail_id: railId,
        status: 'initiated',
        progress: 10,
        purpose,
        tracking_data: {
          initiated_at: new Date().toISOString(),
          steps: ['Payment initiated', 'Route selected', 'Compliance validation pending']
        }
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Simulate async payment processing
    setTimeout(async () => {
      try {
        // Update to routing
        await supabase
          .from('cross_border_payments')
          .update({
            status: 'routing',
            progress: 30,
            tracking_data: {
              ...payment.tracking_data,
              steps: [...payment.tracking_data.steps, 'Routing through optimal rail', 'FX conversion in progress']
            }
          })
          .eq('id', payment.id);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Update to processing
        await supabase
          .from('cross_border_payments')
          .update({
            status: 'processing',
            progress: 60,
            compliance_validated: true,
            tracking_data: {
              ...payment.tracking_data,
              steps: [...payment.tracking_data.steps, 'Compliance validated', 'Settlement in progress']
            }
          })
          .eq('id', payment.id);

        // Simulate final processing
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Complete payment
        const savingsPct = Math.floor(Math.random() * 20) + 60; // 60-80% savings
        
        await supabase
          .from('cross_border_payments')
          .update({
            status: 'completed',
            progress: 100,
            cost_savings_pct: savingsPct,
            completed_at: new Date().toISOString(),
            tracking_data: {
              ...payment.tracking_data,
              steps: [...payment.tracking_data.steps, 'Settlement completed', 'Funds delivered']
            }
          })
          .eq('id', payment.id);

        console.log(`Payment ${txRef} completed successfully`);
      } catch (err) {
        console.error('Error processing payment:', err);
      }
    }, 1000);

    return new Response(JSON.stringify({
      success: true,
      payment,
      message: 'Payment initiated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in payment-cross-border-execute:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});