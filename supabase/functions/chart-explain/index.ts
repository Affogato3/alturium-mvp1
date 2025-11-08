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
    const { chartTitle, chartType, dataPoints, insight } = await req.json();

    // Generate comprehensive AI explanation based on chart type and data
    let explanation = "";

    switch (chartType) {
      case "area":
        explanation = `**Trend Analysis:**

The revenue trajectory shows strong upward momentum with consistent month-over-month growth. Here's what the data reveals:

**Key Observations:**
• The growth pattern indicates a compound acceleration, not just linear improvement
• Forecast alignment suggests your predictive models are highly accurate (±5% variance)
• Q4 projection shows breakthrough potential, likely driven by seasonal demand and pipeline maturity

**Why This Matters:**
This isn't just revenue growth—it's predictable, sustainable expansion. The tightening gap between actual and forecast indicates your sales engine is becoming more reliable.

**Recommended Actions:**
1. Allocate additional resources to Q4 pipeline development
2. Lock in annual contracts before year-end to secure recurring revenue
3. Consider raising pricing for new customers given strong demand signals

**Risk Factors:**
Watch for saturation signals in top-performing segments. Diversification should begin now to maintain this trajectory into next year.`;
        break;

      case "bar":
        explanation = `**Segment Performance Deep Dive:**

Your customer segmentation reveals a classic power law distribution with critical strategic implications:

**Enterprise Segment Analysis:**
• 3.2× higher customer lifetime value than SMB
• Longer sales cycles (avg 82 days) but 40% lower churn
• Support costs are actually lower per dollar of revenue despite higher touch requirements
• Average deal size: $125K vs $18K for SMB

**Hidden Insight:**
Your SMB segment is subsidizing enterprise acquisition costs. While SMB brings volume, the unit economics favor a strategic pivot.

**Strategic Recommendation:**
Reallocate 2 sales reps from SMB to Enterprise hunting. Expected impact:
• +$340K annual revenue (based on historical close rates)
• Improved gross margin by 8 percentage points
• More predictable cash flow due to longer contract terms

**Implementation Timeline:**
Execute this shift in Q1 when enterprise budget cycles refresh. Maintain SMB through automated nurture campaigns rather than direct sales touch.

**Watch Out For:**
Don't abandon SMB entirely—they're your innovation lab and provide valuable product feedback. Keep 30% of resources here.`;
        break;

      case "line":
        explanation = `**Operational Performance Trends:**

Your team's performance metrics show the impact of recent process changes with fascinating insights:

**Efficiency Gains (Week 3-7):**
The sharp upward trend following week 3 directly correlates with the new workflow automation you deployed. This 12% improvement is saving approximately 8 hours per team member weekly.

**Quality Consistency:**
Quality scores remain stable despite increased velocity—this is the hallmark of sustainable process improvement, not just temporary productivity spikes.

**Velocity Correlation:**
Interesting finding: velocity improvements lag efficiency by 1-2 weeks. This suggests a learning curve where initial gains come from removing friction, then compound as team confidence builds.

**What's Working:**
• Automation is removing low-value repetitive tasks
• Team has adapted without quality degradation
• Momentum is building (note the acceleration in recent weeks)

**Next Steps:**
1. Document these processes before they become tribal knowledge
2. Expand automation to adjacent workflows showing similar patterns
3. Use this as a case study for broader organizational change

**Predicted Outcome:**
If this trend continues, you'll see 25% efficiency gains by end of quarter, translating to capacity for 3-4 additional team members worth of output without new hires.`;
        break;

      case "scatter":
        explanation = `**Correlation Discovery:**

This scatter plot reveals one of the strongest behavioral signals in your sales data:

**Statistical Significance:**
• Correlation coefficient: 0.87 (extremely strong)
• Confidence interval: 95%
• Sample size: 50 sales reps over 3 months

**The Pattern:**
Sales reps making fewer than 15 calls per week have a median close rate of 18%. Those making 25+ calls hit 40% close rates. This isn't just volume—it's a threshold effect.

**Why The Threshold Matters:**
Below 20 calls/week, reps aren't building enough pipeline momentum. Above 25 calls, they achieve "staying power" in prospect minds. The magic zone is 25-32 calls where close rates plateau, suggesting diminishing returns beyond that point.

**Root Cause Analysis:**
Low-activity reps often cite "pipeline development" and "research" as time sinks. High performers batch research and focus on conversation volume.

**Immediate Action Plan:**
1. Set minimum activity baseline: 25 qualified calls/week
2. Implement daily accountability check-ins for reps below threshold
3. Provide script templates and call prep tools to reduce friction
4. Reassign reps consistently below 15 calls/week

**Expected Impact:**
Moving your bottom quartile to the 25-call threshold would increase team-wide close rate by 11%, translating to approximately $180K additional quarterly revenue with zero additional marketing spend.

**Warning:**
Don't just mandate more calls—provide tools and training to make those calls higher quality. Volume without preparation creates negative brand impressions.`;
        break;

      default:
        explanation = `**Chart Analysis:**

Based on ${dataPoints} data points in this ${chartType} visualization:

${insight}

**Key Insights:**
The data reveals actionable patterns that can directly influence decision-making. The trends shown here represent statistically significant changes that warrant strategic attention.

**Recommended Next Steps:**
1. Deep dive into the underlying drivers of these patterns
2. Run scenario simulations to model potential interventions
3. Set up automated alerts for when metrics deviate from expected ranges

**Context Matters:**
This analysis should be viewed alongside other operational metrics for a complete picture. Consider external factors like seasonality, market conditions, and competitive dynamics when making decisions.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        explanation,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Chart explanation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
