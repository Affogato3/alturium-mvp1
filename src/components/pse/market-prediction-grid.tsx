import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, TrendingUp, AlertTriangle, Zap, Target } from "lucide-react";

interface Prediction {
  id: string;
  category: "competitor" | "technology" | "consumer" | "market";
  title: string;
  probability: number;
  impact: "low" | "medium" | "high" | "critical";
  timeframe: string;
  signal: string;
  urgency: number;
  details: string;
}

export const MarketPredictionGrid = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: "1",
      category: "competitor",
      title: "Competitor A launching AI feature",
      probability: 0.87,
      impact: "high",
      timeframe: "2-3 months",
      signal: "Patent filings + job postings",
      urgency: 0.9,
      details: "Detected 14 ML engineer hires and 3 relevant patents filed.",
    },
    {
      id: "2",
      category: "technology",
      title: "Quantum computing breakthrough",
      probability: 0.42,
      impact: "critical",
      timeframe: "12-18 months",
      signal: "Research publications spike",
      urgency: 0.65,
      details: "MIT and Google DeepMind publications suggest acceleration.",
    },
    {
      id: "3",
      category: "consumer",
      title: "Shift to privacy-first tools",
      probability: 0.78,
      impact: "medium",
      timeframe: "6-9 months",
      signal: "Social sentiment analysis",
      urgency: 0.72,
      details: "235% increase in privacy-related discussions on social media.",
    },
    {
      id: "4",
      category: "market",
      title: "Emerging market consolidation",
      probability: 0.91,
      impact: "high",
      timeframe: "3-6 months",
      signal: "M&A activity surge",
      urgency: 0.88,
      details: "12 acquisitions announced in sector over past 8 weeks.",
    },
    {
      id: "5",
      category: "competitor",
      title: "Competitor B pricing war",
      probability: 0.68,
      impact: "medium",
      timeframe: "1-2 months",
      signal: "Financial strain indicators",
      urgency: 0.75,
      details: "Q3 earnings miss + aggressive hiring freeze.",
    },
    {
      id: "6",
      category: "technology",
      title: "Open-source alternative emerging",
      probability: 0.55,
      impact: "medium",
      timeframe: "9-12 months",
      signal: "GitHub activity patterns",
      urgency: 0.58,
      details: "New repo with 12K stars in 3 months, corporate sponsors joining.",
    },
    {
      id: "7",
      category: "consumer",
      title: "Gen Z buying behavior shift",
      probability: 0.82,
      impact: "high",
      timeframe: "6-12 months",
      signal: "TikTok trend analysis",
      urgency: 0.79,
      details: "Viral content pattern suggests preference for subscription models.",
    },
    {
      id: "8",
      category: "market",
      title: "Regulatory crackdown on data",
      probability: 0.73,
      impact: "critical",
      timeframe: "6-9 months",
      signal: "Policy discussions + lobbying",
      urgency: 0.85,
      details: "EU, US, and APAC regions showing alignment on data governance.",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictions(prev => prev.map(pred => ({
        ...pred,
        probability: Math.min(0.99, Math.max(0.3, pred.probability + (Math.random() - 0.5) * 0.02))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "competitor": return "⚔️";
      case "technology": return "🚀";
      case "consumer": return "👥";
      case "market": return "📊";
      default: return "🔮";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical": return "text-red-400 border-red-400/40";
      case "high": return "text-orange-400 border-orange-400/40";
      case "medium": return "text-yellow-400 border-yellow-400/40";
      case "low": return "text-green-400 border-green-400/40";
      default: return "text-primary/60 border-primary/20";
    }
  };

  const getUrgencyGradient = (urgency: number) => {
    if (urgency > 0.8) return "from-red-500/40 to-orange-500/40";
    if (urgency > 0.6) return "from-orange-500/40 to-yellow-500/40";
    return "from-yellow-500/40 to-green-500/40";
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-xs text-primary/60">Active Predictions</span>
          </div>
          <div className="text-2xl font-bold text-white">{predictions.length}</div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-primary/60">Critical Threats</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {predictions.filter(p => p.impact === "critical").length}
          </div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs text-primary/60">Opportunities</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {predictions.filter(p => p.category === "technology" || p.category === "consumer").length}
          </div>
        </Card>

        <Card className="bg-black/60 border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-primary/60">Avg Confidence</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {((predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length) * 100).toFixed(0)}%
          </div>
        </Card>
      </div>

      {/* Prediction Matrix */}
      <Card className="bg-black/60 border-primary/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Neural Market Prediction Grid</h3>
            <p className="text-xs text-primary/60 mt-1">AI-powered early warning system</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/40 animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            Live Analysis
          </Badge>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-2 gap-4 pr-4">
            {predictions.map((pred) => (
              <Card
                key={pred.id}
                className="bg-black/40 border-primary/20 p-4 hover:border-primary/40 transition-all group relative overflow-hidden"
              >
                {/* Urgency glow effect */}
                <div
                  className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${getUrgencyGradient(pred.urgency)}`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(pred.category)}</span>
                      <div>
                        <div className="text-xs text-primary/60 uppercase">{pred.category}</div>
                        <div className="text-sm font-bold text-white mt-1">{pred.title}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={getImpactColor(pred.impact)}>
                      {pred.impact}
                    </Badge>
                  </div>

                  {/* Probability bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-primary/60">Probability</span>
                      <span className="text-xs font-bold text-white">{(pred.probability * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 bg-gradient-to-r ${getUrgencyGradient(pred.urgency)}`}
                        style={{ width: `${pred.probability * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-primary/60">Timeframe:</span>
                      <span className="text-white">{pred.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary/60">Signal Source:</span>
                      <span className="text-white">{pred.signal}</span>
                    </div>
                  </div>

                  {/* Hover details */}
                  <div className="mt-3 p-2 bg-black/60 border border-primary/10 rounded text-xs text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    {pred.details}
                  </div>

                  {/* Urgency indicator */}
                  <div className="absolute top-2 right-2">
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{
                        backgroundColor: pred.urgency > 0.8 ? "rgb(239, 68, 68)" : pred.urgency > 0.6 ? "rgb(251, 146, 60)" : "rgb(234, 179, 8)",
                        boxShadow: `0 0 ${pred.urgency * 10}px currentColor`,
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Insights Summary */}
      <Card className="bg-black/60 border-primary/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Strategic Recommendations</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <div className="text-sm text-primary/80">
              <span className="font-bold text-white">Immediate Action Required:</span> Prepare defensive strategy for Competitor A's AI launch. Accelerate roadmap items Q3-47 and Q3-51.
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
            <div className="text-sm text-primary/80">
              <span className="font-bold text-white">Strategic Watch:</span> Monitor quantum computing developments. Consider R&D hedge investment of $2-4M.
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
            <div className="text-sm text-primary/80">
              <span className="font-bold text-white">Opportunity:</span> Gen Z behavior shift aligns with our subscription model. Increase marketing budget 15% targeting this segment.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
