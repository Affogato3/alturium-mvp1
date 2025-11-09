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

    // Simulate connection to external data source
    let recordCount = 0;
    let connectionData: any = {};

    switch (source) {
      case 'salesforce':
        // Simulate Salesforce connection
        recordCount = Math.floor(Math.random() * 5000) + 1000;
        connectionData = {
          opportunities: Math.floor(recordCount * 0.3),
          accounts: Math.floor(recordCount * 0.4),
          contacts: Math.floor(recordCount * 0.3),
        };
        break;

      case 'netsuite':
        // Simulate NetSuite connection
        recordCount = Math.floor(Math.random() * 3000) + 500;
        connectionData = {
          transactions: Math.floor(recordCount * 0.5),
          customers: Math.floor(recordCount * 0.3),
          vendors: Math.floor(recordCount * 0.2),
        };
        break;

      case 'quickbooks':
        // Simulate QuickBooks connection
        recordCount = Math.floor(Math.random() * 2000) + 300;
        connectionData = {
          invoices: Math.floor(recordCount * 0.4),
          expenses: Math.floor(recordCount * 0.4),
          customers: Math.floor(recordCount * 0.2),
        };
        break;

      default:
        throw new Error('Unknown data source');
    }

    // Log the connection
    await supabase.from('data_source_connections').insert({
      user_id: user.id,
      source_type: source,
      connection_status: 'connected',
      record_count: recordCount,
      connection_metadata: connectionData,
      last_sync: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        recordCount,
        connectionData,
        message: `Successfully connected to ${source}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Connection error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
