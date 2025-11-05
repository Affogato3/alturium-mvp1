import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulate banking API call
async function executeBankingTransaction(payment: any) {
  console.log("Simulating banking API transaction...");
  
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      bankRef: `BNK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      completedAt: new Date().toISOString()
    };
  } else {
    return {
      success: false,
      failureReason: 'Insufficient funds or bank API error',
    };
  }
}

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

    const { approvalId } = await req.json();

    console.log("Executing payment for approval:", approvalId);

    // Get approval details
    const { data: approval, error: approvalError } = await supabase
      .from('payment_approvals')
      .select('*')
      .eq('id', approvalId)
      .single();

    if (approvalError) throw approvalError;

    if (approval.status !== 'approved') {
      throw new Error('Payment not approved');
    }

    // Generate transaction reference
    const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        approval_id: approvalId,
        document_id: approval.document_id,
        transaction_ref: transactionRef,
        amount: approval.amount,
        vendor_name: approval.vendor_name,
        payment_method: approval.payment_method,
        status: 'processing'
      })
      .select()
      .single();

    if (txError) throw txError;

    // Execute banking transaction (simulated)
    const bankingResult = await executeBankingTransaction({
      amount: approval.amount,
      vendor: approval.vendor_name,
      method: approval.payment_method
    });

    // Update transaction status
    const { data: updatedTx, error: updateTxError } = await supabase
      .from('payment_transactions')
      .update({
        status: bankingResult.success ? 'completed' : 'failed',
        bank_ref: bankingResult.bankRef,
        failure_reason: bankingResult.failureReason,
        completed_at: bankingResult.completedAt
      })
      .eq('id', transaction.id)
      .select()
      .single();

    if (updateTxError) throw updateTxError;

    // Update approval status
    await supabase
      .from('payment_approvals')
      .update({
        status: bankingResult.success ? 'executed' : 'failed',
        executed_at: bankingResult.completedAt
      })
      .eq('id', approvalId);

    // Update document status to paid if successful
    if (bankingResult.success && approval.document_id) {
      await supabase
        .from('financial_documents')
        .update({ status: 'paid' })
        .eq('id', approval.document_id);
    }

    // Log audit event
    await supabase.from('audit_events').insert({
      user_id: user.id,
      event_type: bankingResult.success ? 'payment_completed' : 'payment_failed',
      entity_type: 'payment_transaction',
      entity_id: transaction.id,
      description: `Payment ${bankingResult.success ? 'completed' : 'failed'} for ${approval.vendor_name} - $${approval.amount}`
    });

    return new Response(JSON.stringify({ 
      transaction: updatedTx,
      message: bankingResult.success ? 'Payment executed successfully' : 'Payment failed',
      success: bankingResult.success
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in payment-execute:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
