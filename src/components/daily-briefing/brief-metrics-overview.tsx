import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BriefMetricsOverviewProps {
  recentBrief: any;
}

export const BriefMetricsOverview = ({ recentBrief }: BriefMetricsOverviewProps) => {
  if (!recentBrief) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6 text-center text-slate-400">
          <p>No briefs available. Generate your first daily brief to see metrics!</p>
        </CardContent>
      </Card>
    );
  }

  const cashChange = Number(recentBrief.cash_change);
  const isPositive = cashChange >= 0;
  const runwayMonths = Number(recentBrief.runway_months);
  const runwayHealth = runwayMonths > 12 ? 'healthy' : runwayMonths > 6 ? 'warning' : 'critical';

  return (
    <div className="grid gap-6">
      {/* AI Insights Card */}
      {recentBrief.ai_insights?.executive_summary && (
        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-indigo-400" />
              AI Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">{recentBrief.ai_insights.executive_summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cash Position */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Cash Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  ${Number(recentBrief.cash_amount).toLocaleString()}
                </span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isPositive ? '+' : ''}${Math.abs(cashChange).toLocaleString()} from yesterday
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Yesterday's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <span className="text-3xl font-bold text-white">
                  ${Number(recentBrief.revenue).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Expenses: ${Number(recentBrief.expenses).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Burn Rate */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Daily Burn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-400">
                  ${Math.abs(Number(recentBrief.burn_rate)).toLocaleString()}
                </span>
                <span className="text-slate-400">/day</span>
              </div>
              <p className="text-sm text-slate-400">
                Net: ${(Number(recentBrief.revenue) - Number(recentBrief.expenses)).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Runway */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${
                  runwayHealth === 'healthy' ? 'text-green-400' :
                  runwayHealth === 'warning' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {runwayMonths.toFixed(1)}
                </span>
                <span className="text-slate-400">months</span>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={Math.min((runwayMonths / 18) * 100, 100)}
                  className="h-2"
                />
                <p className="text-xs text-slate-400">
                  {runwayHealth === 'healthy' ? 'Healthy runway' :
                   runwayHealth === 'warning' ? 'Monitor closely' :
                   'Critical - take action'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Items Summary */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <AlertCircle className="w-6 h-6 text-amber-400" />
                <span className="text-3xl font-bold text-white">
                  {recentBrief.action_items_count || 0}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {recentBrief.action_items_count > 0 
                  ? 'Items requiring attention' 
                  : 'All clear!'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Brief Date */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Brief Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">
                {new Date(recentBrief.brief_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-slate-400">
                Status: {recentBrief.status}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};