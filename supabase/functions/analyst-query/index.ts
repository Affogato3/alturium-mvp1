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
    const { query, conversation } = await req.json();

    // Simulate intelligent analyst responses based on query patterns
    let response = "";

    const queryLower = query.toLowerCase();

    if (queryLower.includes("payroll") || queryLower.includes("expense")) {
      response = `I've analyzed your payroll and expense data:

**Payroll Spike Analysis:**
Your payroll increased 18% in Q3 2024, from $420K to $496K monthly.

**Root Cause:**
• Hired 12 engineers in March ($74K additional monthly cost)
• Partially offset by 3 marketing layoffs (-$21K monthly)
• Net increase: $53K/month

**Context:**
This is a planned growth investment aligned with your Series A funding. The new hires are focused on the enterprise product roadmap.

**Forecast:**
At current hiring pace, payroll will reach $540K by Q1 2025. This represents 34% of revenue, which is within healthy range (30-40% is typical for growth-stage SaaS).

**Recommendation:**
No action needed. Your payroll-to-revenue ratio is healthy. Monitor onboarding progress to ensure new hires reach productivity targets within 90 days.`;
    } else if (queryLower.includes("revenue") || queryLower.includes("customer")) {
      response = `I've examined your revenue and customer metrics:

**Revenue Overview:**
Current MRR: $1.2M (+12% MoM)
ARR: $14.4M

**Revenue Distribution:**
• Enterprise (>$50K/year): 68% of revenue, 12 customers
• Mid-market ($10K-$50K): 24% of revenue, 47 customers  
• SMB (<$10K): 8% of revenue, 340 customers

**Support Cost Analysis:**
When adjusted for support costs:
• Enterprise: $52K revenue per customer, $8K support cost = $44K net
• Mid-market: $6.1K revenue per customer, $2.4K support cost = $3.7K net
• SMB: $340 revenue per customer, $420 support cost = -$80 net

**Key Finding:**
Your SMB segment is unprofitable after support costs. The top 12 enterprise customers drive 81% of actual profit.

**Recommendation:**
Consider implementing tiered support (self-service for SMB) or raising SMB pricing to $500/month minimum to achieve profitability.`;
    } else if (queryLower.includes("cac") || queryLower.includes("acquisition")) {
      response = `I've analyzed your customer acquisition efficiency:

**Current CAC:** $10,400 (up 22% from $8,500 last quarter)

**Channel Breakdown:**
• Google Ads: $7,200 CAC, 34 conversions, 3.2x ROI ✅
• LinkedIn Ads: $14,800 CAC, 12 conversions, 1.1x ROI ⚠️
• Organic: $2,100 CAC, 23 conversions, 8.1x ROI ✅
• Referral: $890 CAC, 18 conversions, 12.4x ROI ✅

**Root Cause of Increase:**
LinkedIn campaign launched in March has consumed $47K budget but delivered 3× lower ROI than your other channels.

**Impact Analysis:**
If LinkedIn budget was reallocated to Google Ads at historical conversion rates, you would have acquired 18 additional customers this quarter.

**Recommended Action:**
1. Pause LinkedIn campaign (saves $12K/month)
2. Reallocate to Google Ads
3. Invest more in referral program incentives

**Expected Outcome:**
CAC reduction to $7,200 within 60 days. 18 additional conversions monthly. $9,800/month savings.`;
    } else if (queryLower.includes("forecast") || queryLower.includes("predict")) {
      response = `I've generated revenue forecasts based on your current trajectory:

**Base Case (87% confidence) - Most Likely:**
• Q4 2024: $3.2M
• Q1 2025: $3.4M  
• Q2 2025: $3.7M
• Q3 2025: $4.1M

Assumptions: 15% growth rate, 5% monthly churn, stable CAC

**Aggressive Growth (72% confidence):**
• Q4 2024: $3.5M
• Q1 2025: $4.1M
• Q2 2025: $4.8M
• Q3 2025: $5.6M

Requirements: Hire 3 SDRs by Q1 or increase ad spend by $50K/month. Assumes 25% growth, 4% churn.

**Conservative (91% confidence):**
• Q4 2024: $2.9M
• Q1 2025: $3.1M
• Q2 2025: $3.3M
• Q3 2025: $3.5M

Scenario if market conditions deteriorate. Assumes 8% growth, 8% churn.

**Recommendation:**
Plan to base case, prepare for conservative scenario. The aggressive path requires additional investment but is achievable with proper execution.

**Cash Runway:**
At current burn rate ($280K/month), you have 8.2 months runway. Base case extends this to 11+ months.`;
    } else {
      response = `Based on your question, I've analyzed the relevant data:

**Summary:**
I can provide detailed analysis on:
• Revenue trends and customer profitability
• Cost optimization opportunities  
• Forecasting and scenario modeling
• Marketing efficiency and CAC analysis
• Operational metrics and productivity

**Quick Metrics:**
• Revenue: +12% MoM
• Burn Rate: -8% improvement
• Data Trust Score: 94/100
• Forecast Confidence: 89%

Try asking:
• "Why did our margin drop in APAC region?"
• "Show me revenue by customer adjusted for costs"
• "What's the ROI of our marketing channels?"
• "Forecast next quarter with confidence bands"

I'm here to help you understand your business metrics and make data-driven decisions.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        response,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Analyst query error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
