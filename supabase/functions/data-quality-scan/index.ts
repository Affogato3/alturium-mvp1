import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simulate data quality scan
    const issues = [
      {
        type: "Duplicates",
        dataset: "CRM_Customers",
        count: 3,
        status: "Merged",
        confidence: 99
      },
      {
        type: "Currency Mismatch",
        dataset: "Finance_Revenue",
        count: 48,
        status: "Fixed",
        confidence: 97
      },
      {
        type: "Missing Email",
        dataset: "HR_Employees",
        count: 12,
        status: "Awaiting Review",
        confidence: 89
      },
      {
        type: "Date Format Error",
        dataset: "Sales_Transactions",
        count: 7,
        status: "Fixed",
        confidence: 95
      }
    ];

    const overall_score = 94;

    return new Response(
      JSON.stringify({
        success: true,
        issues,
        overall_score,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Data quality scan error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
