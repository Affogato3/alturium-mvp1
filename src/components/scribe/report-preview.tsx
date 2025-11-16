import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

interface ReportPreviewProps {
  report: any;
}

export const ReportPreview = ({ report }: ReportPreviewProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{report.title || 'Financial Report'}</h3>
            <p className="text-sm text-slate-400 mt-1">
              Generated on {new Date(report.generated_at).toLocaleDateString()}
            </p>
          </div>
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
            {report.format?.toUpperCase() || 'PDF'}
          </Badge>
        </div>

        {/* Preview Content */}
        <ScrollArea className="h-[600px] rounded-lg bg-slate-900/50 p-6">
          <div className="space-y-8 text-slate-300">
            {/* Executive Summary Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h4 className="text-xl font-semibold text-white">Executive Summary</h4>
              </div>
              <div className="space-y-4">
                <p className="leading-relaxed whitespace-pre-line">
                  {report.preview || `I've analyzed your financial data and identified key opportunities worth $175K annually:

**Revenue Optimization - High Priority**
Revenue per employee decreased 15% due to 8 new hires in March who haven't fully ramped yet. This is a natural growth pattern. Expected recovery: Q3 2025 as new team members reach full productivity. No immediate action needed beyond standard onboarding support.

**Marketing Efficiency - Medium Priority**
Marketing spend on LinkedIn increased 60% but delivered 3× lower conversion rate than Google Ads. This represents significant waste. Recommendation: Reallocate $15K monthly budget from LinkedIn to Google Ads where we're seeing better performance. Expected impact: $18K additional revenue monthly with 87% confidence.

**Operational Cost Reduction - Medium Priority**
Customer support costs in APAC region are 40% higher than EU despite similar ticket volumes. Root cause: longer average handle time, likely due to language barriers or process inefficiencies. Recommendation: Invest in localized support resources or improved documentation. Potential savings: $32K annually with 89% confidence.

Total opportunity: $175K annually across these three initiatives.`}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Key Financial Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Revenue</p>
                      <p className="text-2xl font-bold text-white mt-1">$2.8M</p>
                      <p className="text-sm text-emerald-400 mt-1">+12% MoM</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Burn Rate</p>
                      <p className="text-2xl font-bold text-white mt-1">$450K/mo</p>
                      <p className="text-sm text-amber-400 mt-1">+8% MoM</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-amber-400" />
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Cash Position</p>
                      <p className="text-2xl font-bold text-white mt-1">$5.2M</p>
                      <p className="text-sm text-slate-400 mt-1">Stable</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-indigo-400" />
                  </div>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Runway</p>
                      <p className="text-2xl font-bold text-white mt-1">11.5 months</p>
                      <p className="text-sm text-emerald-400 mt-1">+0.3 months</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-emerald-400" />
                  </div>
                </Card>
              </div>
            </div>

            {/* Top Risks */}
            {report.includes_charts && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h4 className="text-xl font-semibold text-white">Top 3 Risks</h4>
                </div>
                <div className="space-y-3">
                  <Card className="bg-slate-800/50 border-red-900/50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">High Priority</Badge>
                          <p className="font-semibold text-white">Customer Concentration Risk</p>
                        </div>
                        <p className="text-sm text-slate-400">
                          Top customer represents 18% of revenue ($340K). Medium probability of churn in next 90 days.
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-red-400">$340K</span>
                    </div>
                  </Card>

                  <Card className="bg-slate-800/50 border-amber-900/50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                            Medium Priority
                          </Badge>
                          <p className="font-semibold text-white">FX Exposure</p>
                        </div>
                        <p className="text-sm text-slate-400">
                          EUR revenue exposure of $230K with high probability of impact. Consider hedging strategy.
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-amber-400">$230K</span>
                    </div>
                  </Card>

                  <Card className="bg-slate-800/50 border-amber-900/50 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                            Medium Priority
                          </Badge>
                          <p className="font-semibold text-white">APAC Support Costs</p>
                        </div>
                        <p className="text-sm text-slate-400">
                          40% higher costs than EU region. Optimization opportunity through localization.
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-amber-400">$32K</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Strategic Recommendations */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Strategic Recommendations</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white">Reallocate Marketing Budget</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Move $15K/month from LinkedIn to Google Ads. Expected ROI: $18K additional monthly revenue.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white">Diversify Customer Base</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Reduce concentration risk by targeting 2-3 additional enterprise customers in Q3.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white">Optimize APAC Support</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Invest in localized resources or documentation. Potential annual savings: $32K.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
