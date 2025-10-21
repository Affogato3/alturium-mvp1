import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Clock, Target } from "lucide-react";

interface DecisionImpact {
  id: string;
  decision: string;
  impacts: {
    financial: { value: string; trend: "up" | "down" | "neutral" };
    timeline: { value: string; trend: "up" | "down" | "neutral" };
    metrics: { name: string; value: string; trend: "up" | "down" | "neutral" }[];
  };
  confidence: number;
  risks: string[];
}

interface DecisionImpactAnalyzerProps {
  impacts: DecisionImpact[];
}

export const DecisionImpactAnalyzer = ({ impacts }: DecisionImpactAnalyzerProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Target className="h-4 w-4 text-scribe-text/60" />;
    }
  };

  return (
    <Card className="bg-scribe-card border-scribe-card/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-scribe-text">
          Decision Impact Analysis
        </CardTitle>
        <p className="text-sm text-scribe-text/60 mt-2">
          AI-powered impact assessment based on historical data and current KPIs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {impacts.map((impact) => (
          <div
            key={impact.id}
            className="p-4 rounded-lg bg-scribe-bg/50 border border-scribe-card/30 space-y-3"
          >
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-scribe-text text-sm flex-1">{impact.decision}</h4>
              <div className="flex items-center gap-1 text-xs text-scribe-text/60">
                <span>{impact.confidence}% confidence</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-scribe-bg/80 border border-scribe-card/20">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-scribe-accent" />
                  <span className="text-xs text-scribe-text/70">Financial Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-scribe-text">{impact.impacts.financial.value}</span>
                  {getTrendIcon(impact.impacts.financial.trend)}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-scribe-bg/80 border border-scribe-card/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3.5 w-3.5 text-scribe-accent" />
                  <span className="text-xs text-scribe-text/70">Timeline Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-scribe-text">{impact.impacts.timeline.value}</span>
                  {getTrendIcon(impact.impacts.timeline.trend)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-medium text-scribe-text/70">Key Metrics</h5>
              {impact.impacts.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-scribe-text/60">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-scribe-text font-medium">{metric.value}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              ))}
            </div>

            {impact.risks.length > 0 && (
              <div className="pt-2 border-t border-scribe-card/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-scribe-text/70">Identified Risks</p>
                    {impact.risks.map((risk, idx) => (
                      <p key={idx} className="text-xs text-scribe-text/60">• {risk}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
