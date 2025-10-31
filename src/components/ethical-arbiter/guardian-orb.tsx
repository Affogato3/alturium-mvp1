import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, AlertTriangle, CheckCircle2, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Decision {
  id: string;
  text: string;
  ethicalScore: number;
  status: "safe" | "borderline" | "flagged";
  fairness: number;
  privacy: number;
  environmental: number;
  timestamp: Date;
}

export const GuardianOrb = () => {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Simulate real-time decision stream
    const interval = setInterval(() => {
      const newDecision: Decision = {
        id: Math.random().toString(36).substr(2, 9),
        text: generateRandomDecision(),
        ethicalScore: Math.random(),
        status: Math.random() > 0.7 ? "safe" : Math.random() > 0.5 ? "borderline" : "flagged",
        fairness: Math.random(),
        privacy: Math.random(),
        environmental: Math.random(),
        timestamp: new Date(),
      };
      setDecisions(prev => [newDecision, ...prev].slice(0, 50));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomDecision = () => {
    const decisions = [
      "Automated customer segmentation based on behavioral data",
      "Dynamic pricing adjustment for premium customers",
      "AI-generated marketing content for social media",
      "Predictive employee performance scoring",
      "Automated loan approval recommendation",
      "AI-powered resume screening",
    ];
    return decisions[Math.floor(Math.random() * decisions.length)];
  };

  const getStatusColor = (status: Decision["status"]) => {
    switch (status) {
      case "safe": return "text-green-400 border-green-400/50";
      case "borderline": return "text-amber-400 border-amber-400/50";
      case "flagged": return "text-red-400 border-red-400/50";
    }
  };

  const getStatusIcon = (status: Decision["status"]) => {
    switch (status) {
      case "safe": return <CheckCircle2 className="h-4 w-4" />;
      case "borderline": return <AlertTriangle className="h-4 w-4" />;
      case "flagged": return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const runSimulation = async (decisionId: string) => {
    setIsSimulating(true);
    toast.info("Running ethical impact simulation", {
      description: "Analyzing downstream effects across multiple dimensions"
    });
    
    setTimeout(() => {
      setIsSimulating(false);
      toast.success("Simulation complete", {
        description: "Predicted outcomes: 94% positive impact, 6% risk factors identified"
      });
    }, 2200);
  };

  return (
    <>
      <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Guardian Orb
            </span>
            <Badge variant="outline" className="ml-auto border-cyan-500/50 text-cyan-400">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              LIVE STREAM
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 3D Orb Visualization Area */}
          <div className="relative h-64 bg-gradient-to-br from-cyan-900/20 via-violet-900/20 to-black rounded-xl border border-cyan-500/20 mb-6 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Animated Orb Core */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 animate-pulse shadow-2xl shadow-cyan-500/50" />
                <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 animate-ping opacity-20" />
                
                {/* Orbital Decision Rings */}
                {decisions.slice(0, 5).map((decision, idx) => (
                  <div
                    key={decision.id}
                    className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
                      decision.status === "safe" ? "bg-green-400" :
                      decision.status === "borderline" ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{
                      transform: `rotate(${idx * 72}deg) translateX(80px) translateY(-50%)`,
                      animation: `orbit ${3 + idx}s linear infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Info Overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <div className="text-xs text-cyan-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Safe: {decisions.filter(d => d.status === "safe").length}</span>
                </div>
              </div>
              <div className="text-xs text-amber-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Borderline: {decisions.filter(d => d.status === "borderline").length}</span>
                </div>
              </div>
              <div className="text-xs text-red-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Flagged: {decisions.filter(d => d.status === "flagged").length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Decisions Stream */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {decisions.slice(0, 5).map((decision) => (
              <button
                key={decision.id}
                onClick={() => setSelectedDecision(decision)}
                className={`w-full p-3 rounded-lg border ${getStatusColor(decision.status)} bg-black/20 hover:bg-black/40 transition-all text-left`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{decision.text}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Score: {(decision.ethicalScore * 100).toFixed(1)}%
                    </p>
                  </div>
                  {getStatusIcon(decision.status)}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decision Detail Modal */}
      <Dialog open={!!selectedDecision} onOpenChange={() => setSelectedDecision(null)}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-cyan-400" />
              Decision Insight
            </DialogTitle>
          </DialogHeader>
          
          {selectedDecision && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedDecision.text}</h3>
                <Badge variant="outline" className={getStatusColor(selectedDecision.status)}>
                  {selectedDecision.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Fairness</span>
                    <span className="text-cyan-400">{(selectedDecision.fairness * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={selectedDecision.fairness * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Privacy</span>
                    <span className="text-violet-400">{(selectedDecision.privacy * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={selectedDecision.privacy * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Environmental</span>
                    <span className="text-green-400">{(selectedDecision.environmental * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={selectedDecision.environmental * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400 font-semibold">Overall Ethical Score</span>
                    <span className="text-cyan-400 font-bold">{(selectedDecision.ethicalScore * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={selectedDecision.ethicalScore * 100} className="h-2" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Button
                  onClick={() => runSimulation(selectedDecision.id)}
                  disabled={isSimulating}
                  className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 transition-all hover:scale-105"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isSimulating ? "Running Simulation..." : "Run Impact Simulation"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px); }
          to { transform: rotate(360deg) translateX(80px); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </>
  );
};
