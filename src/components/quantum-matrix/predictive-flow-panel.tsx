import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FlowData {
  symbol: string;
  sector: string;
  predicted_inflow: number;
  predicted_outflow: number;
  net_flow: number;
  confidence: number;
}

export function PredictiveFlowPanel() {
  const [flows, setFlows] = useState<FlowData[]>([]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[PredictiveFlowPanel] No active session, skipping fetch');
        return;
      }
      await fetchFlows();
    };

    checkAuthAndFetch();
    
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchFlows();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchFlows = async () => {
    const { data } = await supabase
      .from('predictive_flows')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8);

    if (data) {
      setFlows(data.map(d => ({
        symbol: d.symbol,
        sector: d.sector || 'Unknown',
        predicted_inflow: Number(d.predicted_inflow),
        predicted_outflow: Number(d.predicted_outflow),
        net_flow: Number(d.net_flow),
        confidence: Number(d.confidence),
      })));
    }
  };

  return (
    <Card className="bg-[#121318]/80 border border-[#00E6F6]/30 backdrop-blur-sm">
      <div className="p-4 border-b border-[#00E6F6]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00E6F6]" />
            <h3 className="text-lg font-semibold text-[#E6E8EB]">Predictive Flow Engine</h3>
          </div>
          <Badge variant="outline" className="bg-[#00E6F6]/10 text-[#00E6F6] border-[#00E6F6]/20">
            Real-Time Predictions
          </Badge>
        </div>
        <p className="text-xs text-[#E6E8EB]/60 mt-1">
          Temporal Transformer • Forecasting capital movements before price action
        </p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {flows.map((flow, idx) => {
            const isPositive = flow.net_flow > 0;
            const flowColor = isPositive ? '#43FF6B' : '#FF3366';
            const flowBg = isPositive ? 'bg-[#43FF6B]/10' : 'bg-[#FF3366]/10';
            const flowBorder = isPositive ? 'border-[#43FF6B]/30' : 'border-[#FF3366]/30';

            return (
              <div
                key={idx}
                className={`${flowBg} ${flowBorder} border rounded-lg p-3 transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#E6E8EB]">{flow.symbol}</span>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" style={{ color: flowColor }} />
                  ) : (
                    <TrendingDown className="w-4 h-4" style={{ color: flowColor }} />
                  )}
                </div>
                <div className="text-xs text-[#E6E8EB]/60 mb-2">{flow.sector}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold" style={{ color: flowColor }}>
                    {isPositive ? '+' : ''}{(flow.net_flow / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-[#E6E8EB]/60">
                    {(flow.confidence * 100).toFixed(0)}% confidence
                  </span>
                  <div className="flex gap-1">
                    <div 
                      className="w-16 h-1 rounded-full bg-[#00E6F6]/20"
                      style={{
                        background: `linear-gradient(to right, ${flowColor} ${flow.confidence * 100}%, rgba(0,230,246,0.2) ${flow.confidence * 100}%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}