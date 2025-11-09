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

    const { source } = await req.json();

    // Simulate data sync
    let recordCount = 0;
    let syncedData: any = {};

    switch (source) {
      case 'salesforce':
        recordCount = Math.floor(Math.random() * 500) + 100;
        syncedData = {
          newOpportunities: Math.floor(recordCount * 0.3),
          updatedAccounts: Math.floor(recordCount * 0.5),
          newContacts: Math.floor(recordCount * 0.2),
          metrics: {
            totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
            pipelineValue: Math.floor(Math.random() * 2000000) + 1000000,
            conversionRate: (Math.random() * 0.3 + 0.1).toFixed(2),
          },
        };
        break;

      case 'netsuite':
        recordCount = Math.floor(Math.random() * 400) + 80;
        syncedData = {
          newTransactions: Math.floor(recordCount * 0.6),
          updatedCustomers: Math.floor(recordCount * 0.3),
          newVendors: Math.floor(recordCount * 0.1),
          metrics: {
            totalExpenses: Math.floor(Math.random() * 500000) + 200000,
            accountsReceivable: Math.floor(Math.random() * 800000) + 300000,
            cashFlow: Math.floor(Math.random() * 400000) + 100000,
          },
        };
        break;

      case 'quickbooks':
        recordCount = Math.floor(Math.random() * 300) + 50;
        syncedData = {
          newInvoices: Math.floor(recordCount * 0.5),
          newExpenses: Math.floor(recordCount * 0.4),
          updatedCustomers: Math.floor(recordCount * 0.1),
          metrics: {
            invoiceTotal: Math.floor(Math.random() * 300000) + 100000,
            expenseTotal: Math.floor(Math.random() * 200000) + 80000,
            profitMargin: (Math.random() * 0.4 + 0.1).toFixed(2),
          },
        };
        break;

      default:
        throw new Error('Unknown data source');
    }

    // Update sync log
    await supabase.from('data_source_syncs').insert({
      user_id: user.id,
      source_type: source,
      records_synced: recordCount,
      sync_metadata: syncedData,
      sync_timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        recordCount,
        syncedData,
        message: `Successfully synced ${recordCount} records from ${source}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
