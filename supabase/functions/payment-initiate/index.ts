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
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { documentId, amount, vendorName, paymentMethod, scheduledDate, requestedBy } = await req.json();

    console.log("Initiating payment for document:", documentId);

    // Create payment approval request
    const { data: approval, error: approvalError } = await supabase
      .from('payment_approvals')
      .insert({
        user_id: user.id,
        document_id: documentId,
        amount: amount,
        vendor_name: vendorName,
        payment_method: paymentMethod || 'ach',
        scheduled_date: scheduledDate,
        requested_by: requestedBy || user.email,
        status: 'pending'
      })
      .select()
      .single();

    if (approvalError) throw approvalError;

    // Log audit event
    await supabase.from('audit_events').insert({
      user_id: user.id,
      event_type: 'payment_initiated',
      entity_type: 'payment_approval',
      entity_id: approval.id,
      description: `Payment initiated for ${vendorName} - $${amount}`
    });

    return new Response(JSON.stringify({ 
      approval,
      message: 'Payment approval request created'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in payment-initiate:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
