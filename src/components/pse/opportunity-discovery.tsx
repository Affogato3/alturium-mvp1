import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, TrendingUp, MapPin, Package, Users, Zap } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  type: "segment" | "geography" | "product" | "partnership";
  revenue: number;
  probability: number;
  timeframe: string;
  status: "scanning" | "validated" | "ready";
  steps: string[];
  intensity: number;
}

export const OpportunityDiscovery = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: "1",
      title: "Enterprise SaaS Expansion",
      type: "segment",
      revenue: 12.4,
      probability: 0.78,
      timeframe: "6-9 months",
      status: "validated",
      steps: ["Hire enterprise sales team", "Build admin dashboard", "SOC2 compliance"],
      intensity: 0.9,
    },
    {
      id: "2",
      title: "Southeast Asia Market Entry",
      type: "geography",
      revenue: 8.7,
      probability: 0.65,
      timeframe: "9-12 months",
      status: "ready",
      steps: ["Local partnerships", "Payment integration", "Localization"],
      intensity: 0.75,
    },
    {
      id: "3",
      title: "AI-Powered Analytics Add-on",
      type: "product",
      revenue: 15.2,
      probability: 0.82,
      timeframe: "3-6 months",
      status: "ready",
      steps: ["MVP development", "Beta testing", "Marketing campaign"],
      intensity: 0.95,
    },
    {
      id: "4",
      title: "Healthcare Vertical Integration",
      type: "segment",
      revenue: 22.1,
      probability: 0.71,
      timeframe: "12-18 months",
      status: "scanning",
      steps: ["HIPAA compliance", "Industry partnerships", "Specialized features"],
      intensity: 0.85,
    },
    {
      id: "5",
      title: "Strategic Partnership: Fortune 500",
      type: "partnership",
      revenue: 31.5,
      probability: 0.58,
      timeframe: "6-12 months",
      status: "validated",
      steps: ["C-level outreach", "Pilot program", "Contract negotiation"],
      intensity: 0.88,
    },
  ]);

  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpportunities(prev => prev.map(opp => ({
        ...opp,
        intensity: Math.min(1, Math.max(0.5, opp.intensity + (Math.random() - 0.5) * 0.1))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "segment": return <Users className="w-4 h-4" />;
      case "geography": return <MapPin className="w-4 h-4" />;
      case "product": return <Package className="w-4 h-4" />;
      case "partnership": return <Target className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scanning": return "text-yellow-400 border-yellow-400/40";
      case "validated": return "text-cyan-400 border-cyan-400/40";
      case "ready": return "text-green-400 border-green-400/40";
      default: return "text-primary/60 border-primary/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-primary/60">Opportunities</span>
          </div>
          <div className="text-2xl font-bold text-white">{opportunities.length}</div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs text-primary/60">Potential Revenue</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${opportunities.reduce((sum, o) => sum + o.revenue, 0).toFixed(1)}M
          </div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-primary/60">Avg Probability</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {((opportunities.reduce((sum, o) => sum + o.probability, 0) / opportunities.length) * 100).toFixed(0)}%
          </div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-xs text-primary/60">Status</span>
          </div>
          <Badge className="bg-green-400/20 text-green-400 border-green-400/40 animate-pulse">
            Scanning Live
          </Badge>
        </Card>
      </div>

      {/* Opportunity Heatmap */}
      <Card className="bg-black/60 border-primary/20 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Opportunity Heatmap</h3>
        <div className="relative h-64 bg-black/40 rounded-lg overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4">
            {opportunities.map((opp, idx) => {
              const col = idx % 8;
              const row = Math.floor(idx / 8);
              return (
                <div
                  key={opp.id}
                  className="rounded-lg transition-all duration-500 cursor-pointer hover:scale-110 group relative"
                  style={{
                    gridColumn: col + 1,
                    gridRow: row + 1,
                    backgroundColor: `rgba(34, 197, 94, ${opp.intensity * 0.8})`,
                    boxShadow: `0 0 ${opp.intensity * 20}px rgba(34, 197, 94, ${opp.intensity * 0.5})`,
                  }}
                >
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-black/95 border border-primary/20 rounded-lg p-2 text-xs whitespace-nowrap">
                      <div className="font-bold text-white">{opp.title}</div>
                      <div className="text-primary/60">${opp.revenue}M • {(opp.probability * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-primary/60">
          <span>Low Potential</span>
          <span>High Potential</span>
        </div>
      </Card>

      {/* Opportunity Cards */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-4 pr-4">
          {opportunities.map((opp) => (
            <Card
              key={opp.id}
              className="bg-black/60 border-primary/20 p-6 hover:border-primary/40 transition-all group relative overflow-hidden"
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, rgb(34, 197, 94), transparent)`,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-400/20 border border-green-400/40">
                      {getTypeIcon(opp.type)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{opp.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getStatusColor(opp.status)}>
                          {opp.status}
                        </Badge>
                        <span className="text-xs text-primary/60">{opp.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">${opp.revenue}M</div>
                    <div className="text-xs text-primary/60">potential revenue</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-primary/60 mb-1">Success Probability</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-1000"
                          style={{ width: `${opp.probability * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white">{(opp.probability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-primary/60 mb-1">Timeframe</div>
                    <div className="text-sm text-white">{opp.timeframe}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-white mb-2">Execution Steps</div>
                  <div className="space-y-2">
                    {opp.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-primary/80">
                        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                          {idx + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-green-400/20 hover:bg-green-400/30 border border-green-400/40"
                >
                  View Full Analysis
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
