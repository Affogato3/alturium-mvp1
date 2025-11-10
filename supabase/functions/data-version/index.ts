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

    const { action, dataset, versionA, versionB } = await req.json();

    let result: any = {};

    switch (action) {
      case 'list':
        // Return version history
        result = {
          versions: [
            {
              id: "v15",
              created: "2025-11-05 10:30 AM",
              creator: "AI System",
              impact: "+4.2% ARR",
              description: "Data quality improvements & entity resolution",
              changes: 847
            },
            {
              id: "v14",
              created: "2025-11-04 3:15 PM",
              creator: "John Smith",
              impact: "-1.8% Margin",
              description: "Updated pricing model for APAC region",
              changes: 234
            },
            {
              id: "v13",
              created: "2025-11-03 9:20 AM",
              creator: "AI System",
              impact: "+2.1% Revenue",
              description: "Integrated new data sources (Salesforce sync)",
              changes: 1203
            },
            {
              id: "v12",
              created: "2025-11-02 2:45 PM",
              creator: "Sarah Johnson",
              impact: "No Change",
              description: "Corrected Q3 forecast assumptions",
              changes: 89
            },
            {
              id: "v11",
              created: "2025-11-01 11:00 AM",
              creator: "AI System",
              impact: "+3.5% Efficiency",
              description: "Automated duplicate removal & normalization",
              changes: 567
            }
          ]
        };
        break;

      case 'compare':
        // Compare two versions
        const changes = [
          { metric: "Revenue", versionA: "$2.4M", versionB: "$2.5M", delta: "+4.2%", impact: "positive" },
          { metric: "Margin", versionA: "68%", versionB: "66%", delta: "-2.0%", impact: "negative" },
          { metric: "Customer Count", versionA: "1,234", versionB: "1,298", delta: "+5.2%", impact: "positive" },
          { metric: "Churn Rate", versionA: "4.2%", versionB: "3.8%", delta: "-0.4pp", impact: "positive" }
        ];

        result = {
          versionA: versionA,
          versionB: versionB,
          changes,
          summary: `Version ${versionB} shows overall improvement with +4.2% revenue increase, though margin decreased by 2.0% due to higher acquisition costs. Net impact is positive with improved customer metrics.`,
          aiInsight: "The trade-off between margin and growth appears strategic. The increased acquisition costs are generating higher lifetime value customers with 14% better retention rates."
        };
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Version management error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
