import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, Clock, Users, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Conflict {
  id: string;
  task_id: string;
  conflict_type: string;
  severity: string;
  description: string;
  affected_departments: string[];
  predicted_impact_hours: number;
  auto_resolution_suggested: any;
  resolution_status: string;
}

interface SmartNotificationsDockProps {
  conflicts: Conflict[];
  onResolve: () => void;
}

export const SmartNotificationsDock = ({ conflicts, onResolve }: SmartNotificationsDockProps) => {
  const activeConflicts = conflicts.filter(c => c.resolution_status === "detected");

  const handleApplyResolution = async (conflict: Conflict) => {
    if (!conflict.auto_resolution_suggested) {
      toast.error("No auto-resolution available");
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("predict-conflicts", {
        body: {
          action: "reschedule",
          conflictId: conflict.id,
          resolution: conflict.auto_resolution_suggested
        }
      });

      if (error) throw error;

      toast.success("Resolution Applied", {
        description: `Task rescheduled successfully with ${(conflict.auto_resolution_suggested.confidence * 100).toFixed(0)}% confidence`
      });

      onResolve();
    } catch (error: any) {
      toast.error("Failed to apply resolution", {
        description: error.message
      });
    }
  };

  const handleDismiss = async (conflictId: string) => {
    try {
      await supabase
        .from("interlock_conflicts")
        .update({ resolution_status: "dismissed" })
        .eq("id", conflictId);

      toast.info("Conflict Dismissed");
      onResolve();
    } catch (error: any) {
      toast.error("Failed to dismiss", {
        description: error.message
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: any = {
      low: "border-blue-500/30 bg-blue-500/5",
      medium: "border-amber-500/30 bg-amber-500/5",
      high: "border-orange-500/30 bg-orange-500/5",
      critical: "border-red-500/30 bg-red-500/5"
    };
    return colors[severity] || colors.medium;
  };

  return (
    <Card className="bg-[#1e1e1e] border-border p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-cyan-400" />
          Smart Notifications
        </h2>
        <Badge variant="destructive">
          {activeConflicts.length} Active
        </Badge>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {activeConflicts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle2 className="h-12 w-12 text-green-400 mb-4" />
            <p className="text-lg font-medium">All Clear!</p>
            <p className="text-sm text-muted-foreground">No conflicts detected</p>
          </div>
        ) : (
          activeConflicts.map((conflict) => (
            <div
              key={conflict.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-lg ${getSeverityColor(conflict.severity)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Badge
                    variant={conflict.severity === "critical" ? "destructive" : "default"}
                    className="mb-2"
                  >
                    {conflict.severity}
                  </Badge>
                  <div className="text-sm font-medium mb-1">{conflict.conflict_type}</div>
                  <p className="text-xs text-muted-foreground">{conflict.description}</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDismiss(conflict.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Impact Info */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Impact: {conflict.predicted_impact_hours}h
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {conflict.affected_departments.length} Depts
                </div>
              </div>

              {/* Auto-Resolution Suggestion */}
              {conflict.auto_resolution_suggested && (
                <div className="mt-3 p-3 bg-[#0a0a0a] rounded-lg border border-cyan-500/20">
                  <div className="text-xs font-medium text-cyan-400 mb-2">
                    ✨ AI Suggestion
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {conflict.auto_resolution_suggested.reason}
                  </p>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">New Timeline</div>
                      <div className="font-medium">
                        {format(new Date(conflict.auto_resolution_suggested.new_start_date), "MMM dd")} → {" "}
                        {format(new Date(conflict.auto_resolution_suggested.new_end_date), "MMM dd")}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {(conflict.auto_resolution_suggested.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleApplyResolution(conflict)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black text-xs h-8"
                    >
                      Apply Auto-Fix
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast.info("Notify Stakeholders", {
                          description: `${conflict.auto_resolution_suggested.stakeholders?.join(", ")}`
                        });
                      }}
                      className="text-xs h-8"
                    >
                      Notify Team
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};