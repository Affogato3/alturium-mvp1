import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  department: string;
  status: string;
  progress: number;
  owner_name: string;
  conflict_probability: number;
}

interface StatusHeatMapProps {
  tasks: Task[];
}

export const StatusHeatMap = ({ tasks }: StatusHeatMapProps) => {
  const [selectedCell, setSelectedCell] = useState<{dept: string, week: number} | null>(null);

  const departments = ["Engineering", "Finance", "Marketing", "Operations", "Sales", "HR"];
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const getTasksForCell = (dept: string, weekIndex: number) => {
    // Simulate distributing tasks across weeks
    return tasks.filter(t => t.department === dept).slice(weekIndex * 2, (weekIndex + 1) * 2);
  };

  const getCellIntensity = (dept: string, weekIndex: number) => {
    const cellTasks = getTasksForCell(dept, weekIndex);
    if (cellTasks.length === 0) return 0;

    const avgProgress = cellTasks.reduce((sum, t) => sum + t.progress, 0) / cellTasks.length;
    const avgConflict = cellTasks.reduce((sum, t) => sum + t.conflict_probability, 0) / cellTasks.length;

    // Higher progress = lighter, higher conflict = darker/redder
    return (100 - avgProgress) + (avgConflict * 50);
  };

  const getCellColor = (intensity: number) => {
    if (intensity === 0) return "bg-muted/20";
    if (intensity < 30) return "bg-green-500/20 border-green-500/30";
    if (intensity < 50) return "bg-cyan-500/20 border-cyan-500/30";
    if (intensity < 70) return "bg-amber-500/20 border-amber-500/30";
    return "bg-red-500/30 border-red-500/50";
  };

  const getStatusText = (intensity: number) => {
    if (intensity === 0) return "No Activity";
    if (intensity < 30) return "On Track";
    if (intensity < 50) return "Progressing";
    if (intensity < 70) return "At Risk";
    return "Critical";
  };

  return (
    <>
      <Card className="bg-[#1e1e1e] border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            Department Efficiency Heat-Map
          </h2>
          <Badge variant="outline" className="text-xs">
            4-Week Snapshot
          </Badge>
        </div>

        {/* Heat-Map Grid */}
        <div className="space-y-2">
          {/* Header Row */}
          <div className="grid grid-cols-5 gap-2">
            <div /> {/* Empty corner */}
            {weeks.map((week) => (
              <div key={week} className="text-center text-xs text-muted-foreground font-medium">
                {week}
              </div>
            ))}
          </div>

          {/* Department Rows */}
          {departments.map((dept) => (
            <div key={dept} className="grid grid-cols-5 gap-2">
              {/* Department Label */}
              <div className="flex items-center text-sm font-medium truncate">
                {dept}
              </div>

              {/* Week Cells */}
              {weeks.map((_, weekIndex) => {
                const intensity = getCellIntensity(dept, weekIndex);
                const cellColor = getCellColor(intensity);

                return (
                  <div
                    key={weekIndex}
                    onClick={() => setSelectedCell({ dept, week: weekIndex })}
                    className={`
                      h-16 rounded-lg border cursor-pointer
                      transition-all duration-300 hover:scale-105 hover:shadow-lg
                      ${cellColor}
                      flex items-center justify-center
                    `}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium">
                        {intensity === 0 ? "—" : `${intensity.toFixed(0)}%`}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {getTasksForCell(dept, weekIndex).length} tasks
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500/20 border border-green-500/30" />
            <span className="text-muted-foreground">On Track</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-cyan-500/20 border border-cyan-500/30" />
            <span className="text-muted-foreground">Progressing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-amber-500/20 border border-amber-500/30" />
            <span className="text-muted-foreground">At Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500/30 border border-red-500/50" />
            <span className="text-muted-foreground">Critical</span>
          </div>
        </div>
      </Card>

      {/* Cell Detail Dialog */}
      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="bg-[#1e1e1e] border-border">
          <DialogHeader>
            <DialogTitle>
              {selectedCell?.dept} - Week {(selectedCell?.week || 0) + 1}
            </DialogTitle>
          </DialogHeader>

          {selectedCell && (
            <div className="space-y-3">
              {getTasksForCell(selectedCell.dept, selectedCell.week).map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-[#0a0a0a] border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{task.title}</span>
                    <Badge>{task.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Owner: </span>
                      <span>{task.owner_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Progress: </span>
                      <span>{task.progress}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conflict Risk: </span>
                      <span className="text-amber-400">
                        {(task.conflict_probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {getTasksForCell(selectedCell.dept, selectedCell.week).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks scheduled for this period
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};