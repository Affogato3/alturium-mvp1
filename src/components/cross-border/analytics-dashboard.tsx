import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Clock, Target, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('payment-analytics-fetch');
      
      if (error) throw error;
      
      setAnalytics(data);
    } catch (error: any) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-[#CFAF6E] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#BFBFBF]">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-[#BFBFBF] mx-auto mb-4 opacity-50" />
        <p className="text-[#BFBFBF]">No analytics data available yet</p>
      </div>
    );
  }

  const metrics = [
    { 
      label: "Total Volume Processed", 
      value: `$${analytics.totalVolume.toLocaleString()}`, 
      icon: DollarSign,
      color: "text-[#CFAF6E]"
    },
    { 
      label: "Total Transactions", 
      value: analytics.totalTransactions.toString(), 
      icon: Target,
      color: "text-[#BFBFBF]"
    },
    { 
      label: "Average Cost Savings", 
      value: `${analytics.avgCostSavings}%`, 
      icon: TrendingUp,
      color: "text-[#CFAF6E]"
    },
    { 
      label: "Average Settlement Time", 
      value: `${analytics.avgSettlementMinutes} min`, 
      icon: Clock,
      color: "text-[#BFBFBF]"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card 
            key={idx} 
            className="p-6 bg-[#050505]/50 backdrop-blur border-[#1A1A1A] hover:border-[#CFAF6E]/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#BFBFBF] mb-1">{metric.label}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <metric.icon className={`h-8 w-8 ${metric.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Corridor Performance */}
      {analytics.corridorPerformance && analytics.corridorPerformance.length > 0 && (
        <Card className="p-6 bg-[#050505]/50 backdrop-blur border-[#1A1A1A]">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-[#CFAF6E]" />
            <h3 className="font-semibold text-[#EDEDED]">Corridor Performance</h3>
          </div>
          <div className="space-y-3">
            {analytics.corridorPerformance.map((corridor: any, idx: number) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a]/50 border border-[#1A1A1A]"
              >
                <div>
                  <p className="font-semibold text-[#EDEDED]">{corridor.corridor}</p>
                  <p className="text-sm text-[#BFBFBF]">{corridor.transactions} transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#BFBFBF]">Volume</p>
                  <p className="font-semibold text-[#CFAF6E]">${corridor.volume.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#BFBFBF]">Avg Savings</p>
                  <p className="font-semibold text-[#CFAF6E]">{corridor.avgSavings.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Rail Performance */}
      {analytics.railPerformance && analytics.railPerformance.length > 0 && (
        <Card className="p-6 bg-[#050505]/50 backdrop-blur border-[#1A1A1A]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#CFAF6E]" />
            <h3 className="font-semibold text-[#EDEDED]">Rail Performance</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.railPerformance.map((rail: any, idx: number) => (
              <div 
                key={idx}
                className="p-4 rounded-lg bg-[#0a0a0a]/50 border border-[#1A1A1A]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#EDEDED]">{rail.railName}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#CFAF6E]/20 text-[#CFAF6E]">
                    {rail.railType}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#BFBFBF]">Transactions</p>
                    <p className="font-medium text-[#EDEDED]">{rail.transactions}</p>
                  </div>
                  <div>
                    <p className="text-[#BFBFBF]">Health Score</p>
                    <p className="font-medium text-[#CFAF6E]">{rail.healthScore.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[#BFBFBF]">Success Rate</p>
                    <p className="font-medium text-[#CFAF6E]">{rail.successRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-[#BFBFBF]">Avg Latency</p>
                    <p className="font-medium text-[#EDEDED]">
                      {Math.round(rail.avgLatency / 60000)} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};