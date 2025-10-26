import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AdaptiveLearningPanel() {
  const learningMetrics = {
    totalDecisions: 1847,
    correctPredictions: 1739,
    accuracy: 94.2,
    improvement: 2.1,
    modelVersion: "v3.8.2",
    lastTraining: "4 hours ago"
  };

  const recentLearnings = [
    {
      id: 1,
      decision: "Marketing budget reallocation Q3",
      prediction: "Engagement would increase by 18%",
      actual: "Engagement increased by 21%",
      outcome: "success",
      learned: "Model underestimated content marketing ROI. Updated weighting +12%",
      timestamp: "2 days ago"
    },
    {
      id: 2,
      decision: "Vendor switch for Component B",
      prediction: "Cost savings of $2.1M annually",
      actual: "Cost savings of $2.4M annually",
      outcome: "success",
      learned: "Supply chain volatility factors refined. Prediction accuracy +3%",
      timestamp: "5 days ago"
    },
    {
      id: 3,
      decision: "Product launch delay recommendation",
      prediction: "Revenue impact -$800K",
      actual: "Revenue impact -$650K",
      outcome: "partial",
      learned: "Customer patience threshold higher than modeled. Adjusted churn predictions",
      timestamp: "1 week ago"
    },
    {
      id: 4,
      decision: "Engineering team expansion",
      prediction: "Delivery acceleration +32%",
      actual: "Delivery acceleration +28%",
      outcome: "partial",
      learned: "Onboarding overhead underestimated. Updated team velocity curves",
      timestamp: "2 weeks ago"
    },
    {
      id: 5,
      decision: "Price increase for Premium tier",
      prediction: "Churn increase +4.2%",
      actual: "Churn increase +6.8%",
      outcome: "error",
      learned: "Price sensitivity model recalibrated. Customer elasticity coefficients revised",
      timestamp: "3 weeks ago"
    }
  ];

  const modelEvolution = [
    { version: "v3.2", accuracy: 87.4, date: "Jan 2024" },
    { version: "v3.4", accuracy: 89.2, date: "Feb 2024" },
    { version: "v3.6", accuracy: 91.8, date: "Mar 2024" },
    { version: "v3.8", accuracy: 94.2, date: "Apr 2024" },
  ];

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "partial":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "partial":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Adaptive Learning System</h2>
          <p className="text-sm text-white/60 mt-1">Continuous model improvement through decision feedback</p>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
          <Brain className="w-3 h-3 mr-1 animate-pulse" />
          Model {learningMetrics.modelVersion}
        </Badge>
      </div>

      {/* Learning Metrics */}
      <Card className="bg-gradient-to-r from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Total Decisions Analyzed</div>
            <div className="text-3xl font-bold text-white">{learningMetrics.totalDecisions.toLocaleString()}</div>
            <div className="text-xs text-emerald-400">
              {learningMetrics.correctPredictions.toLocaleString()} correct predictions
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Current Accuracy</div>
            <div className="text-3xl font-bold text-cyan-400">{learningMetrics.accuracy}%</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">+{learningMetrics.improvement}% this month</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-white/40 uppercase tracking-wider">Last Training Cycle</div>
            <div className="text-xl font-bold text-white">{learningMetrics.lastTraining}</div>
            <div className="text-xs text-white/60">Next cycle in 2 hours</div>
          </div>
        </div>
      </Card>

      {/* Model Evolution */}
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Model Evolution</h3>
        <div className="space-y-4">
          {modelEvolution.map((version, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-24 text-sm text-white/60">{version.version}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white/90">{version.accuracy}% accuracy</span>
                  <span className="text-xs text-white/40">{version.date}</span>
                </div>
                <Progress value={version.accuracy} className="h-2" />
              </div>
              {idx === modelEvolution.length - 1 && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Current
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Learnings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-1 h-6 bg-cyan-500 rounded" />
          Recent Learning Events
        </h3>

        {recentLearnings.map((learning) => (
          <Card key={learning.id} className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                    {getOutcomeIcon(learning.outcome)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{learning.decision}</h4>
                    <div className="text-xs text-white/40 mt-1">{learning.timestamp}</div>
                  </div>
                </div>
                <Badge className={getOutcomeBadge(learning.outcome) + " text-xs capitalize"}>
                  {learning.outcome}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-3 rounded-lg bg-black/40 border border-white/10">
                  <div className="text-xs text-white/40 uppercase tracking-wider">Prediction</div>
                  <div className="text-sm text-cyan-400">{learning.prediction}</div>
                </div>
                <div className="space-y-2 p-3 rounded-lg bg-black/40 border border-white/10">
                  <div className="text-xs text-white/40 uppercase tracking-wider">Actual Outcome</div>
                  <div className="text-sm text-emerald-400">{learning.actual}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
                <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Brain className="w-3 h-3" />
                  What the AI Learned
                </div>
                <div className="text-sm text-white/90">{learning.learned}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Training Controls */}
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Training Controls</h3>
        <div className="flex items-center gap-3">
          <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
            <Zap className="w-4 h-4 mr-2" />
            Trigger Training Cycle
          </Button>
          <Button variant="outline" className="bg-black/40 hover:bg-black/60 text-white border-white/10">
            Export Learning Data
          </Button>
          <Button variant="outline" className="bg-black/40 hover:bg-black/60 text-white border-white/10">
            Model Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
