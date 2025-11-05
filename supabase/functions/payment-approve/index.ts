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

    const { approvalId, action, notes } = await req.json();

    console.log(`Processing approval ${approvalId} with action ${action}`);

    // Update approval status
    const { data: approval, error: updateError } = await supabase
      .from('payment_approvals')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        approved_by: user.email,
        approved_at: new Date().toISOString(),
        approval_notes: notes
      })
      .eq('id', approvalId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log audit event
    await supabase.from('audit_events').insert({
      user_id: user.id,
      event_type: `payment_${action}d`,
      entity_type: 'payment_approval',
      entity_id: approvalId,
      description: `Payment ${action}d for ${approval.vendor_name} - $${approval.amount}`
    });

    // If approved and has a scheduled date, trigger execution
    if (action === 'approve') {
      const today = new Date().toISOString().split('T')[0];
      const scheduledDate = approval.scheduled_date || today;
      
      if (scheduledDate <= today) {
        // Immediate execution
        const executeResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-execute`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ approvalId })
        });

        if (!executeResponse.ok) {
          console.error('Payment execution failed');
        }
      }
    }

    return new Response(JSON.stringify({ 
      approval,
      message: `Payment ${action}d successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in payment-approve:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
