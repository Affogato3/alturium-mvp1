import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  RotateCcw, 
  BarChart3, 
  Settings, 
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { TimelineMesh } from "./predictive-interlock/timeline-mesh";
import { TaskConflictRadar } from "./predictive-interlock/task-conflict-radar";
import { SmartNotificationsDock } from "./predictive-interlock/smart-notifications-dock";
import { StatusHeatMap } from "./predictive-interlock/status-heat-map";

interface Task {
  id: string;
  title: string;
  department: string;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  progress: number;
  owner_name: string;
  conflict_probability: number;
  predicted_delay_hours: number;
}

interface Conflict {
  id: string;
  task_id: string;
  conflict_type: string;
  severity: string;
  description: string;
  affected_departments: string[];
  predicted_impact_hours: number;
  resolution_status: string;
  auto_resolution_suggested: any;
}

export const PredictiveInterlockDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeConflicts: 0,
    resolvedConflicts: 0,
    efficiencyScore: 0,
    predictedDelay: 0,
    syncScore: 95
  });

  useEffect(() => {
    loadData();
    
    // Realtime subscriptions
    const tasksChannel = supabase
      .channel('interlock-tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interlock_tasks' }, () => {
        loadData();
      })
      .subscribe();

    const conflictsChannel = supabase
      .channel('interlock-conflicts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interlock_conflicts' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(conflictsChannel);
    };
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: tasksData } = await supabase
      .from("interlock_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date");

    const { data: conflictsData } = await supabase
      .from("interlock_conflicts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (tasksData) setTasks(tasksData);
    if (conflictsData) setConflicts(conflictsData);

    // Calculate stats
    const activeConflicts = conflictsData?.filter(c => c.resolution_status === "detected").length || 0;
    const resolvedConflicts = conflictsData?.filter(c => c.resolution_status === "resolved").length || 0;
    const totalDelay = conflictsData?.reduce((sum, c) => sum + (c.predicted_impact_hours || 0), 0) || 0;
    const avgProgress = tasksData?.reduce((sum, t) => sum + t.progress, 0) / (tasksData?.length || 1) || 0;

    setStats({
      totalTasks: tasksData?.length || 0,
      activeConflicts,
      resolvedConflicts,
      efficiencyScore: Math.round(100 - (activeConflicts * 5)),
      predictedDelay: totalDelay,
      syncScore: Math.round(avgProgress)
    });
  };

  const handlePredictNow = async () => {
    setIsPredicting(true);
    try {
      const { data, error } = await supabase.functions.invoke("predict-conflicts", {
        body: { action: "predict" }
      });

      if (error) throw error;

      toast.success("Conflict Prediction Complete", {
        description: `Found ${data.totalConflicts} potential conflicts (${data.criticalConflicts} critical)`
      });

      loadData();
    } catch (error: any) {
      toast.error("Prediction Failed", {
        description: error.message || "Unable to analyze conflicts"
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleRescheduleAll = async () => {
    setIsRescheduling(true);
    try {
      const activeConflicts = conflicts.filter(c => 
        c.resolution_status === "detected" && c.auto_resolution_suggested
      );

      let rescheduled = 0;
      for (const conflict of activeConflicts) {
        const { error } = await supabase.functions.invoke("predict-conflicts", {
          body: { 
            action: "reschedule",
            conflictId: conflict.id,
            resolution: conflict.auto_resolution_suggested
          }
        });
        if (!error) rescheduled++;
      }

      toast.success("Auto-Rescheduling Complete", {
        description: `Successfully rescheduled ${rescheduled} tasks to optimize timeline`
      });

      loadData();
    } catch (error: any) {
      toast.error("Rescheduling Failed", {
        description: error.message
      });
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleInsightsMode = () => {
    navigate("/analytics");
    toast.info("Opening Analytics Dashboard");
  };

  const handleAdminConfig = () => {
    navigate("/settings");
    toast.info("Opening System Configuration");
  };

  const handleAuditTrail = () => {
    navigate("/audit");
    toast.info("Opening Audit Trail");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Zap className="h-8 w-8 text-cyan-400" />
            Predictive Interlock™
          </h1>
          <p className="text-muted-foreground mt-1">AI-Powered Team Synchronization Engine</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            Live Analysis
          </Badge>
          <Badge variant={stats.activeConflicts > 0 ? "destructive" : "default"} className="px-4 py-2">
            {stats.activeConflicts} Active Conflicts
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-[#1e1e1e] border-border p-4">
          <div className="text-sm text-muted-foreground">Total Tasks</div>
          <div className="text-2xl font-bold mt-1">{stats.totalTasks}</div>
        </Card>
        <Card className="bg-[#1e1e1e] border-border p-4">
          <div className="text-sm text-muted-foreground">Efficiency %</div>
          <div className="text-2xl font-bold mt-1 text-cyan-400">{stats.efficiencyScore}%</div>
        </Card>
        <Card className="bg-[#1e1e1e] border-border p-4">
          <div className="text-sm text-muted-foreground">Predicted Delay</div>
          <div className="text-2xl font-bold mt-1 text-amber-400">{stats.predictedDelay}h</div>
        </Card>
        <Card className="bg-[#1e1e1e] border-border p-4">
          <div className="text-sm text-muted-foreground">Team Sync Score</div>
          <div className="text-2xl font-bold mt-1 text-green-400">{stats.syncScore}%</div>
        </Card>
        <Card className="bg-[#1e1e1e] border-border p-4">
          <div className="text-sm text-muted-foreground">Resolved Today</div>
          <div className="text-2xl font-bold mt-1 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            {stats.resolvedConflicts}
          </div>
        </Card>
        <Card className="bg-[#1e1e1e] border-border p-4">
          <div className="text-sm text-muted-foreground">Resource Balance</div>
          <div className="text-2xl font-bold mt-1 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            92%
          </div>
        </Card>
      </div>

      {/* Timeline Mesh */}
      <TimelineMesh tasks={tasks} conflicts={conflicts} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Conflict Radar */}
        <div className="lg:col-span-2">
          <TaskConflictRadar tasks={tasks} conflicts={conflicts} />
        </div>

        {/* Smart Notifications Dock */}
        <div>
          <SmartNotificationsDock conflicts={conflicts} onResolve={loadData} />
        </div>
      </div>

      {/* Status Heat-Map */}
      <StatusHeatMap tasks={tasks} />

      {/* Control Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Card className="bg-[#1e1e1e]/95 backdrop-blur-lg border-border shadow-2xl">
          <div className="flex items-center gap-3 p-4">
            <Button 
              onClick={handlePredictNow} 
              disabled={isPredicting}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold gap-2"
            >
              <Zap className="h-4 w-4" />
              {isPredicting ? "Analyzing..." : "⚡ Predict Now"}
            </Button>

            <Button 
              onClick={handleRescheduleAll} 
              disabled={isRescheduling || stats.activeConflicts === 0}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {isRescheduling ? "Rescheduling..." : "🔁 Reschedule All"}
            </Button>

            <Button 
              onClick={handleInsightsMode} 
              variant="outline"
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              📊 Insights Mode
            </Button>

            <Button 
              onClick={handleAdminConfig} 
              variant="outline"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              🛠 Admin Config
            </Button>

            <Button 
              onClick={handleAuditTrail} 
              variant="outline"
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              🔒 Audit Trail
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};