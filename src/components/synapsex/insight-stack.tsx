import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingDown, AlertTriangle, DollarSign, ChevronRight } from "lucide-react";

interface Insight {
  id: string;
  title: string;
  department: string;
  severity: "high" | "medium" | "low";
  savings: number;
  confidence: number;
  description: string;
}

const insights: Insight[] = [
  {
    id: "1",
    title: "Redundant Cloud Infrastructure",
    department: "IT",
    severity: "high",
    savings: 240000,
    confidence: 96,
    description: "12% of compute resources unused during off-peak hours",
  },
  {
    id: "2",
    title: "APAC Marketing Underperformance",
    department: "Marketing",
    severity: "high",
    savings: 180000,
    confidence: 89,
    description: "ROI 3x lower than EMEA - suggest channel reallocation",
  },
  {
    id: "3",
    title: "Supply Chain Route Inefficiency",
    department: "Logistics",
    severity: "medium",
    savings: 95000,
    confidence: 87,
    description: "Alternative routes reduce transit time by 18%",
  },
  {
    id: "4",
    title: "Overstaffed Customer Support",
    department: "Operations",
    severity: "medium",
    savings: 120000,
    confidence: 82,
    description: "AI automation can handle 35% of tier-1 tickets",
  },
  {
    id: "5",
    title: "Legacy System Maintenance",
    department: "IT",
    severity: "low",
    savings: 45000,
    confidence: 78,
    description: "Migration to modern stack reduces maintenance by 60%",
  },
];

export const InsightStack = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-500/50 bg-red-500/10 text-red-400";
      case "medium":
        return "border-yellow-500/50 bg-yellow-500/10 text-yellow-400";
      default:
        return "border-blue-500/50 bg-blue-500/10 text-blue-400";
    }
  };

  return (
    <Card className="h-full bg-black/40 backdrop-blur-sm border-primary/20">
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">AI-Detected Inefficiencies</h3>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            <DollarSign className="w-3 h-3 mr-1" />
            $680K Total Savings
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Prioritized by impact × confidence score
        </p>
      </div>

      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-4 space-y-3">
          {insights.map((insight) => (
            <Card
              key={insight.id}
              className={`p-4 border ${getSeverityColor(
                insight.severity
              )} hover:bg-white/5 transition-colors cursor-pointer group`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-semibold text-sm">{insight.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant="outline" className="bg-black/50">
                      {insight.department}
                    </Badge>
                    <span className="text-cyan-400 font-semibold">
                      ${(insight.savings / 1000).toFixed(0)}K savings
                    </span>
                    <span className="text-muted-foreground">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
