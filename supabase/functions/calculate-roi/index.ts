import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { implementation_cost, annual_revenue, employee_count, current_reporting_hours } = await req.json();

    // ROI Calculation Formula Implementation
    // Based on industry benchmarks: 8% revenue increase, 10% cost reduction
    
    const revenue_increase_pct = 8; // 8% benchmark
    const cost_reduction_pct = 10; // 10% benchmark
    
    const annual_revenue_increase = annual_revenue * (revenue_increase_pct / 100);
    const annual_cost_savings = (employee_count * 75000 * 0.15) * (cost_reduction_pct / 100); // 15% of salary for analytics
    
    // Time savings from automated reporting
    const hourly_rate = 75; // Average analyst hourly rate
    const weekly_time_saved = current_reporting_hours * 0.9; // 90% reduction
    const annual_time_savings = weekly_time_saved * 52 * hourly_rate;
    
    // Infrastructure savings (62% benchmark)
    const infrastructure_savings = implementation_cost * 0.62;
    
    // Total benefits
    const total_benefits = annual_revenue_increase + annual_cost_savings + annual_time_savings + infrastructure_savings;
    const net_benefits = total_benefits - implementation_cost;
    
    // ROI calculation
    const roi_percentage = (net_benefits / implementation_cost) * 100;
    
    // Payback period in months
    const monthly_benefits = total_benefits / 12;
    const payback_period_months = Math.ceil(implementation_cost / monthly_benefits);
    
    // Efficiency gains
    const efficiency_gain = 84; // 84% of users spend more time in apps with embedded analytics
    
    const recommendations = [];
    
    if (roi_percentage > 100) {
      recommendations.push("Excellent ROI - prioritize immediate implementation");
    }
    if (payback_period_months < 12) {
      recommendations.push("Quick payback period - strong financial case");
    }
    if (current_reporting_hours > 10) {
      recommendations.push("High time savings potential - automate reporting workflows");
    }
    if (employee_count > 50) {
      recommendations.push("Scale benefits across organization for maximum impact");
    }
    
    recommendations.push("Track adoption metrics weekly to optimize ROI");
    recommendations.push("Focus on high-value use cases first");

    return new Response(JSON.stringify({ 
      success: true,
      roi: {
        roi_percentage,
        payback_period_months,
        net_benefits,
        revenue_increase: revenue_increase_pct,
        cost_reduction: cost_reduction_pct,
        efficiency_gain,
        recommendations
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
