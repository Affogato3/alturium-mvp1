import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";

interface BriefDetailModalProps {
  brief: any;
  open: boolean;
  onClose: () => void;
}

export const BriefDetailModal = ({ brief, open, onClose }: BriefDetailModalProps) => {
  const cashChange = Number(brief.cash_change);
  const isPositive = cashChange >= 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            Daily Brief - {new Date(brief.brief_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Header Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-400 mb-2">Cash Position</p>
                <p className="text-2xl font-bold text-white">
                  ${Number(brief.cash_amount).toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isPositive ? '+' : ''}${Math.abs(cashChange).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-400 mb-2">Revenue</p>
                <p className="text-2xl font-bold text-green-400">
                  ${Number(brief.revenue).toLocaleString()}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Expenses: ${Number(brief.expenses).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-400 mb-2">Burn Rate</p>
                <p className="text-2xl font-bold text-amber-400">
                  ${Math.abs(Number(brief.burn_rate)).toLocaleString()}
                </p>
                <p className="text-sm text-slate-400 mt-2">per day</p>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-slate-700" />

          {/* AI Insights */}
          {brief.ai_insights?.executive_summary && (
            <>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">AI Executive Summary</h3>
                <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/50">
                  <CardContent className="pt-6">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {brief.ai_insights.executive_summary}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Separator className="bg-slate-700" />
            </>
          )}

          {/* Raw Metrics */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Detailed Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Runway</span>
                      <span className="text-white font-semibold">
                        {Number(brief.runway_months).toFixed(1)} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Action Items</span>
                      <span className="text-amber-400 font-semibold">
                        {brief.action_items_count || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <span className="text-white font-semibold capitalize">
                        {brief.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {brief.raw_metrics?.transactions !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transactions</span>
                        <span className="text-white font-semibold">
                          {brief.raw_metrics.transactions}
                        </span>
                      </div>
                    )}
                    {brief.raw_metrics?.anomalies !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Anomalies</span>
                        <span className="text-red-400 font-semibold">
                          {brief.raw_metrics.anomalies}
                        </span>
                      </div>
                    )}
                    {brief.email_sent_at && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email Sent</span>
                        <span className="text-green-400 font-semibold">Yes</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};