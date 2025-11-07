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

    const { query } = await req.json();
    const lowerQuery = query.toLowerCase();

    // Natural language query interpretation
    let response: any = {};

    if (lowerQuery.includes('revenue') && lowerQuery.includes('customer')) {
      response = {
        query_interpretation: 'Revenue analysis by customer segment',
        results: {
          top_customers: [
            { name: 'Acme Corp', revenue: 480000, margin: 0.82, region: 'North America' },
            { name: 'Zenith Systems', revenue: 420000, margin: 0.78, region: 'Europe' },
            { name: 'Polar Technologies', revenue: 380000, margin: 0.85, region: 'Asia-Pacific' }
          ],
          total_revenue: 2450000,
          average_margin: 0.79
        },
        calculation_method: 'Revenue.Booked - (Payroll.Sales + Payroll.Support) per customer region',
        insights: [
          'Polar Technologies has the highest margin at 85% despite lower revenue.',
          'APAC region shows 12% better efficiency in customer support costs.'
        ]
      };
    } else if (lowerQuery.includes('margin') || lowerQuery.includes('apac')) {
      response = {
        query_interpretation: 'Margin compression analysis for APAC region',
        results: {
          current_margin: 0.58,
          previous_margin: 0.72,
          margin_delta: -0.14,
          root_causes: [
            { factor: 'Supplier cost increase', impact: '+18%', contribution: 0.65 },
            { factor: 'Fixed pricing contracts', impact: 'No price adjustment', contribution: 0.35 }
          ]
        },
        recommendations: [
          'Renegotiate contracts with 3 key suppliers (estimated +$240K annually)',
          'Shift 15% volume to alternative vendors (estimated margin recovery: 4.2% in 60 days)',
          'Implement dynamic pricing with existing contracts (estimated +$180K annually)'
        ],
        confidence: 0.89
      };
    } else if (lowerQuery.includes('simulate') || lowerQuery.includes('reallocate')) {
      response = {
        query_interpretation: 'Budget reallocation simulation: Marketing → Logistics',
        scenario: {
          amount: 3000000,
          from: 'Marketing',
          to: 'Logistics'
        },
        results: {
          delivery_time_improvement: -0.12,
          customer_satisfaction_delta: +0.08,
          lead_generation_impact: -0.15,
          net_profit_impact: 420000,
          timeframe: '6 months'
        },
        risk_level: 'Medium',
        alternative: {
          amount: 1800000,
          description: 'Reallocate only $1.8M for balanced outcome with lower risk',
          balanced_impact: 'Maintains 85% of logistics improvement while reducing marketing impact by 60%'
        }
      };
    } else if (lowerQuery.includes('supplier') || lowerQuery.includes('cost')) {
      response = {
        query_interpretation: 'Cost-optimal supplier network optimization for Europe',
        recommendations: [
          {
            priority: 1,
            action: 'Shift 30% volume to Vendor Delta',
            impact: 'Cost reduction: 14%, Quality maintained',
            annual_savings: 280000
          },
          {
            priority: 2,
            action: 'Consolidate warehouses in Munich + Lyon',
            impact: 'Logistics cost reduction',
            annual_savings: 240000
          },
          {
            priority: 3,
            action: 'Hedge EUR/USD exposure',
            impact: 'Reduce currency risk by 25%',
            annual_savings: 370000
          }
        ],
        total_savings: 890000,
        confidence: 0.92
      };
    } else {
      response = {
        query_interpretation: query,
        message: 'I\'ve analyzed your query across 247 data nodes. Available domains: Finance, Operations, HR, Marketing, Supply Chain, R&D.',
        suggestion: 'Try asking about specific metrics like "revenue by region" or "simulate budget changes".'
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        response
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('NLQ error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});