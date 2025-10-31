import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Target, Users, TrendingUp, AlertCircle, ChevronRight, Zap, Play, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  status: "active" | "planning" | "blocked" | "completed";
  priority: "critical" | "high" | "medium" | "low";
  progress: number;
  kpiImpact: string;
  team: string[];
  lastActivity: string;
  aiInsights: number;
}

export function MissionBoard() {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "1",
      title: "Q4 Revenue Acceleration",
      status: "active",
      priority: "critical",
      progress: 67,
      kpiImpact: "+$2.4M ARR",
      team: ["CFO", "Sales", "Product"],
      lastActivity: "12m ago",
      aiInsights: 3,
    },
    {
      id: "2",
      title: "Cost Optimization Initiative",
      status: "active",
      priority: "high",
      progress: 45,
      kpiImpact: "-18% OpEx",
      team: ["COO", "Finance", "Ops"],
      lastActivity: "1h ago",
      aiInsights: 5,
    },
    {
      id: "3",
      title: "Customer Retention Program",
      status: "planning",
      priority: "high",
      progress: 23,
      kpiImpact: "+12% NRR",
      team: ["CSM", "Product", "Marketing"],
      lastActivity: "3h ago",
      aiInsights: 2,
    },
    {
      id: "4",
      title: "Supply Chain Resilience",
      status: "blocked",
      priority: "medium",
      progress: 34,
      kpiImpact: "-8% Risk",
      team: ["COO", "Procurement"],
      lastActivity: "2d ago",
      aiInsights: 1,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))] border-[hsl(var(--vanguard-accent))]/30";
      case "planning": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "blocked": return "bg-[hsl(var(--vanguard-alert))]/20 text-[hsl(var(--vanguard-alert))] border-[hsl(var(--vanguard-alert))]/30";
      case "completed": return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      default: return "bg-[hsl(var(--vanguard-text))]/10 text-[hsl(var(--vanguard-text))]/60";
    }
  };

  const getPriorityGlow = (priority: string) => {
    switch (priority) {
      case "critical": return "shadow-[0_0_20px_rgba(255,59,59,0.4)]";
      case "high": return "shadow-[0_0_20px_rgba(0,255,255,0.3)]";
      default: return "";
    }
  };

  const handleAccelerateMission = (missionId: string) => {
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId) {
        const newProgress = Math.min(mission.progress + 15, 100);
        const newStatus = newProgress === 100 ? "completed" : mission.status;
        
        toast.success(`Mission "${mission.title}" accelerated! Progress: ${newProgress}%`, {
          description: `Boosted efficiency by 15%. ${newStatus === "completed" ? "Mission completed!" : "Keep going!"}`
        });
        
        return {
          ...mission,
          progress: newProgress,
          status: newStatus,
          lastActivity: "Just now"
        };
      }
      return mission;
    }));
  };

  const handleCompleteMission = (missionId: string) => {
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId) {
        toast.success(`Mission "${mission.title}" marked complete!`, {
          description: `${mission.kpiImpact} achieved successfully`
        });
        
        return {
          ...mission,
          progress: 100,
          status: "completed",
          lastActivity: "Just now"
        };
      }
      return mission;
    }));
  };

  return (
    <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--vanguard-accent))]/20">
            <Target className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Mission Board
            </h2>
            <p className="text-xs text-[hsl(var(--vanguard-text))]/60">
              Collaborative Command Center
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {missions.filter(m => m.status !== "completed").length} ACTIVE
        </Badge>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-1 gap-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`bg-[hsl(var(--vanguard-bg))] p-5 rounded-lg border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/40 transition-all duration-300 group cursor-pointer ${getPriorityGlow(mission.priority)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[hsl(var(--vanguard-text))] group-hover:text-[hsl(var(--vanguard-accent))] transition-colors">
                      {mission.title}
                    </h3>
                    {mission.aiInsights > 0 && (
                      <Badge variant="outline" className="text-xs bg-[hsl(var(--vanguard-accent))]/10 border-[hsl(var(--vanguard-accent))]/30">
                        <Zap className="w-3 h-3 mr-1" />
                        {mission.aiInsights} AI
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={getStatusColor(mission.status)}>
                      {mission.status}
                    </Badge>
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/50">
                      {mission.lastActivity}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[hsl(var(--vanguard-text))]/30 group-hover:text-[hsl(var(--vanguard-accent))] transition-colors" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--vanguard-text))]/60">Progress</span>
                  <span className="font-mono text-[hsl(var(--vanguard-text))]">{mission.progress}%</span>
                </div>
                <Progress value={mission.progress} className="h-1.5" />

                <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--vanguard-text))]/5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[hsl(var(--vanguard-accent))]" />
                    <span className="text-sm font-mono text-[hsl(var(--vanguard-accent))]">
                      {mission.kpiImpact}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[hsl(var(--vanguard-text))]/40" />
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/60">
                      {mission.team.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              {mission.status === "blocked" && (
                <div className="mt-3 p-2 rounded bg-[hsl(var(--vanguard-alert))]/10 border border-[hsl(var(--vanguard-alert))]/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[hsl(var(--vanguard-alert))]" />
                  <span className="text-xs text-[hsl(var(--vanguard-alert))]">
                    Requires executive intervention
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {mission.status !== "completed" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAccelerateMission(mission.id)}
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Accelerate +15%
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteMission(mission.id)}
                      variant="outline"
                      className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Button>
                  </>
                )}
                {mission.status === "completed" && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    ✓ Completed • {mission.kpiImpact} achieved
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}