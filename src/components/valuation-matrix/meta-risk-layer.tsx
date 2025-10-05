import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface RiskItem {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  probability: number;
  mitigation: string;
}

interface MetaRiskLayerProps {
  fullscreen?: boolean;
}

export function MetaRiskLayer({ fullscreen = false }: MetaRiskLayerProps) {
  const [risks, setRisks] = useState<RiskItem[]>([
    { id: "1", category: "Regulatory", severity: "high", description: "EU antitrust review pending", probability: 68, mitigation: "Prepare divestment package" },
    { id: "2", category: "ESG", severity: "medium", description: "Carbon footprint disclosure gap", probability: 42, mitigation: "Enhanced sustainability reporting" },
    { id: "3", category: "Geopolitical", severity: "critical", description: "Trade policy uncertainty in 2 jurisdictions", probability: 81, mitigation: "Multi-jurisdictional hedging" },
    { id: "4", category: "Market", severity: "medium", description: "Interest rate volatility exposure", probability: 55, mitigation: "Duration matching strategy" },
    { id: "5", category: "Operational", severity: "low", description: "Integration complexity score elevated", probability: 31, mitigation: "Phased integration plan" },
    { id: "6", category: "Compliance", severity: "high", description: "3 jurisdictions require additional filings", probability: 72, mitigation: "Legal team expansion" }
  ]);

  const [heatmapData, setHeatmapData] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      category: ["Regulatory", "ESG", "Geo", "Market", "Ops", "Legal"][i],
      impact: Math.random() * 100,
      likelihood: Math.random() * 100
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRisks(prev => prev.map(risk => ({
        ...risk,
        probability: Math.max(0, Math.min(100, risk.probability + (Math.random() - 0.5) * 5))
      })));

      setHeatmapData(prev => prev.map(item => ({
        ...item,
        impact: Math.max(0, Math.min(100, item.impact + (Math.random() - 0.5) * 10)),
        likelihood: Math.max(0, Math.min(100, item.likelihood + (Math.random() - 0.5) * 10))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-danger bg-danger/10 border-danger/20";
      case "high": return "text-warning bg-warning/10 border-warning/20";
      case "medium": return "text-primary bg-primary/10 border-primary/20";
      default: return "text-success bg-success/10 border-success/20";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XCircle className="w-4 h-4" />;
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <Shield className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getHeatColor = (value: number) => {
    if (value > 75) return "bg-danger/60";
    if (value > 50) return "bg-warning/60";
    if (value > 25) return "bg-primary/60";
    return "bg-success/60";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">MetaRisk Layer</h3>
            <p className="text-sm text-muted-foreground">AI-Powered Risk Intelligence</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["Critical: 1", "High: 2", "Medium: 2", "Low: 1"].map((stat, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {stat}
            </Badge>
          ))}
        </div>
      </div>

      {fullscreen && (
        <div className="grid grid-cols-6 gap-2 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
          <div className="col-span-6 mb-2">
            <h4 className="font-semibold text-sm">Risk Heatmap</h4>
            <p className="text-xs text-muted-foreground">Impact vs Likelihood</p>
          </div>
          {heatmapData.map((item, i) => (
            <div key={i} className="aspect-square relative group">
              <div
                className={`w-full h-full rounded-lg ${getHeatColor(item.impact * item.likelihood / 100)} backdrop-blur-sm border border-border/30 transition-all hover:scale-105 cursor-pointer`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">{item.category}</span>
                </div>
              </div>
              <div className="absolute -bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-center">
                <span className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded border border-border/50">
                  {((item.impact * item.likelihood) / 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map(risk => (
          <div
            key={risk.id}
            className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getSeverityIcon(risk.severity)}
                <div>
                  <h4 className="font-semibold text-sm">{risk.category}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                </div>
              </div>
              <Badge variant="outline" className={getSeverityColor(risk.severity)}>
                {risk.severity}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Probability</span>
                <span className="text-sm font-semibold">{risk.probability.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    risk.probability > 75
                      ? "bg-danger"
                      : risk.probability > 50
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                  style={{ width: `${risk.probability}%` }}
                />
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Mitigation:</span> {risk.mitigation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
