import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Zap, ChevronRight, Target, ExternalLink, Play, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ReflexCard {
  id: string;
  type: "risk" | "opportunity" | "trend";
  title: string;
  forecast: string;
  impact: string;
  confidence: number;
  timeline: string;
  actions: string[];
  simulatedOutcome: {
    ifFollowed: string;
    ifIgnored: string;
  };
  relatedDashboard?: string;
}

export function ReflexCards() {
  const navigate = useNavigate();
  const [reflexCards, setReflexCards] = useState<ReflexCard[]>([
    {
      id: "1",
      type: "risk",
      title: "Marketing ROI Declining",
      forecast: "Engagement-to-spend ratio declining by 23% over last 14 days",
      impact: "Projected negative ROI curve in 18 days • -$840K potential loss",
      confidence: 94,
      timeline: "Immediate action required (3-5 days)",
      actions: [
        "Reallocate 12% of ad budget to retention campaigns",
        "Pause underperforming channels (Display Ads, Sponsored Posts)",
        "Increase investment in email nurture sequences by 8%"
      ],
      simulatedOutcome: {
        ifFollowed: "Q4 revenue +$1.2M (6.4% lift), Customer LTV +18%",
        ifIgnored: "Q4 revenue -$840K (4.2% loss), Churn rate +7%"
      },
      relatedDashboard: "/audit"
    },
    {
      id: "2",
      type: "opportunity",
      title: "Supply Chain Arbitrage Window",
      forecast: "Alternative vendor pricing 18% lower due to market shift",
      impact: "$2.4M annual savings opportunity • 3-week window",
      confidence: 87,
      timeline: "Action window: 21 days",
      actions: [
        "Initiate vendor switch for Component B manufacturing",
        "Negotiate bulk contract with Vendor C before competitor moves",
        "Adjust Q4 production schedule to maximize savings"
      ],
      simulatedOutcome: {
        ifFollowed: "Margin improvement +1.8%, Supply resilience +24%",
        ifIgnored: "Competitor captures vendor, pricing advantage lost"
      },
      relatedDashboard: "/vanguard"
    },
    {
      id: "3",
      type: "trend",
      title: "Product Development Bottleneck Forming",
      forecast: "Engineering capacity utilization at 94% • Velocity declining",
      impact: "Q1 2025 product launch at risk • 6-week delay projection",
      confidence: 91,
      timeline: "Preventive action: 7-10 days",
      actions: [
        "Reallocate 3 senior engineers from Project Alpha to critical path",
        "Accelerate hiring for 2 positions (Backend + DevOps)",
        "Defer non-critical feature work by 4 weeks"
      ],
      simulatedOutcome: {
        ifFollowed: "On-time launch probability 89%, Team burnout risk -42%",
        ifIgnored: "Launch delay 6-8 weeks, Revenue impact -$3.2M"
      },
      relatedDashboard: "/scribe"
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "risk":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case "trend":
        return <Target className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "risk":
        return "border-red-500/30 bg-gradient-to-br from-[#0A0A0A] to-red-950/20";
      case "opportunity":
        return "border-emerald-500/30 bg-gradient-to-br from-[#0A0A0A] to-emerald-950/20";
      case "trend":
        return "border-cyan-500/30 bg-gradient-to-br from-[#0A0A0A] to-cyan-950/20";
    }
  };

  const handleGenerateNewScan = () => {
    setIsScanning(true);
    toast.info("Deploying PCRE across all data streams...", {
      description: "Scanning ERP, CRM, market feeds, and operational metrics"
    });

    setTimeout(() => {
      const newCard: ReflexCard = {
        id: Date.now().toString(),
        type: Math.random() > 0.6 ? "opportunity" : Math.random() > 0.5 ? "risk" : "trend",
        title: "Customer Retention Pattern Shift Detected",
        forecast: "Churn indicators up 8% in premium tier over 7 days",
        impact: "$450K ARR at risk • Early intervention window available",
        confidence: 88,
        timeline: "Optimal action window: 5-8 days",
        actions: [
          "Launch targeted re-engagement campaign for at-risk accounts",
          "Schedule executive touchpoints with top 10 at-risk customers",
          "Implement usage analytics alerts for early warning"
        ],
        simulatedOutcome: {
          ifFollowed: "Retention rate +6%, Prevent $320K revenue loss",
          ifIgnored: "Churn acceleration to 15%, Total loss $450K+"
        },
        relatedDashboard: "/audit"
      };

      setReflexCards(prev => [newCard, ...prev]);
      setIsScanning(false);
      
      toast.success("New reflex card generated!", {
        description: `${newCard.type.toUpperCase()}: ${newCard.title}`
      });
    }, 2800);
  };

  const handleExecuteRecommendations = (card: ReflexCard) => {
    toast.success(`Executing strategic actions for: ${card.title}`, {
      description: "Creating tasks, allocating resources, and initiating workflows"
    });

    setTimeout(() => {
      toast.success("Execution plan deployed", {
        description: `${card.actions.length} actions initiated • Teams notified`
      });
    }, 1500);
  };

  const handleRunDeepSimulation = (card: ReflexCard) => {
    toast.info(`Running Monte Carlo simulation for: ${card.title}`, {
      description: "1000 iterations • Multi-dimensional impact analysis"
    });

    setTimeout(() => {
      if (card.relatedDashboard) {
        navigate(card.relatedDashboard);
        toast.success("Simulation complete • Detailed analysis ready");
      }
    }, 2500);
  };

  const handleDismiss = (cardId: string) => {
    setReflexCards(prev => prev.filter(card => card.id !== cardId));
    toast.info("Reflex card dismissed", {
      description: "Card archived to historical analysis"
    });
  };

  const handleViewInDashboard = (dashboard: string) => {
    navigate(dashboard);
    toast.success("Navigating to related workspace");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Active Reflex Cards</h2>
          <p className="text-sm text-white/60 mt-1">Real-time strategic predictions and recommendations</p>
        </div>
        <Button 
          onClick={handleGenerateNewScan}
          disabled={isScanning}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-all hover:scale-105"
        >
          <Zap className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? "Scanning..." : "Generate New Scan"}
        </Button>
      </div>

      <div className="grid gap-6">
        {reflexCards.map((card, index) => (
          <Card 
            key={card.id} 
            className={`${getTypeColor(card.type)} border p-6 hover:border-opacity-60 transition-all animate-fade-in hover:shadow-2xl hover:scale-[1.02]`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                    {getTypeIcon(card.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{card.title}</h3>
                    <Badge className="mt-1 bg-white/10 text-white/70 text-xs">
                      {card.timeline}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40 uppercase tracking-wider">Confidence</div>
                  <div className="text-2xl font-bold text-cyan-400">{card.confidence}%</div>
                  <Progress value={card.confidence} className="h-1 mt-1 w-20" />
                </div>
              </div>

              {/* Forecast */}
              <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/10 hover:bg-black/50 transition-colors">
                <div className="text-xs text-white/40 uppercase tracking-wider">📊 Problem Forecast</div>
                <div className="text-sm text-white/90">{card.forecast}</div>
              </div>

              {/* Impact */}
              <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/10 hover:bg-black/50 transition-colors">
                <div className="text-xs text-white/40 uppercase tracking-wider">🧩 Likely Impact</div>
                <div className="text-sm text-white/90 font-semibold">{card.impact}</div>
              </div>

              {/* Strategic Actions */}
              <div className="space-y-3 p-4 rounded-lg bg-black/40 border border-white/10 hover:bg-black/50 transition-colors">
                <div className="text-xs text-white/40 uppercase tracking-wider">🚀 Strategic Actions</div>
                <div className="space-y-2">
                  {card.actions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-white/90 hover:text-white transition-colors group">
                      <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation Outcomes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-950/30 transition-colors">
                  <div className="text-xs text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    If Followed
                  </div>
                  <div className="text-sm text-white/90 font-medium">{card.simulatedOutcome.ifFollowed}</div>
                </div>
                <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30 hover:bg-red-950/30 transition-colors">
                  <div className="text-xs text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <TrendingDown className="w-3 h-3" />
                    If Ignored
                  </div>
                  <div className="text-sm text-white/90 font-medium">{card.simulatedOutcome.ifIgnored}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <Button 
                  onClick={() => handleExecuteRecommendations(card)}
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute Recommendations
                </Button>
                <Button 
                  onClick={() => handleRunDeepSimulation(card)}
                  variant="outline" 
                  className="bg-black/40 hover:bg-black/60 text-white border-white/10 transition-all hover:scale-105"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Deep Simulation
                </Button>
                {card.relatedDashboard && (
                  <Button 
                    onClick={() => handleViewInDashboard(card.relatedDashboard!)}
                    variant="ghost" 
                    className="text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  onClick={() => handleDismiss(card.id)}
                  variant="ghost" 
                  className="text-white/60 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}