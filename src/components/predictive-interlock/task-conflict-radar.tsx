import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  department: string;
  conflict_probability: number;
  status: string;
}

interface Conflict {
  id: string;
  task_id: string;
  severity: string;
  description: string;
  affected_departments: string[];
}

interface TaskConflictRadarProps {
  tasks: Task[];
  conflicts: Conflict[];
}

export const TaskConflictRadar = ({ tasks, conflicts }: TaskConflictRadarProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const departments = ["Engineering", "Finance", "Marketing", "Operations", "Sales", "HR"];
  
  const getTasksForDepartment = (dept: string) => {
    return tasks.filter(t => t.department === dept);
  };

  const getDepartmentPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = 40; // percentage
    return {
      x: 50 + radius * Math.cos(angle - Math.PI / 2),
      y: 50 + radius * Math.sin(angle - Math.PI / 2)
    };
  };

  const getTaskConflicts = (taskId: string) => {
    return conflicts.filter(c => c.task_id === taskId);
  };

  return (
    <>
      <Card className="bg-[#1e1e1e] border-border p-6 h-[600px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-400" />
            Task Conflict Radar
          </h2>
          <Badge variant="outline" className="text-xs">
            Circular Dependency View
          </Badge>
        </div>

        {/* Radar Visualization */}
        <div className="relative w-full h-full">
          {/* Background Rings */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Concentric Rings */}
            {[15, 30, 45, 60].map((r) => (
              <circle
                key={r}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="rgba(34, 211, 238, 0.1)"
                strokeWidth="0.2"
              />
            ))}

            {/* Department Sectors */}
            {departments.map((dept, idx) => {
              const pos = getDepartmentPosition(idx, departments.length);
              return (
                <g key={dept}>
                  {/* Sector Line */}
                  <line
                    x1="50"
                    y1="50"
                    x2={pos.x}
                    y2={pos.y}
                    stroke="rgba(34, 211, 238, 0.2)"
                    strokeWidth="0.2"
                  />

                  {/* Department Label */}
                  <text
                    x={pos.x + (pos.x - 50) * 0.3}
                    y={pos.y + (pos.y - 50) * 0.3}
                    textAnchor="middle"
                    className="text-[3px] fill-muted-foreground font-medium"
                  >
                    {dept}
                  </text>
                </g>
              );
            })}

            {/* Tasks as Dots */}
            {tasks.map((task) => {
              const deptIndex = departments.indexOf(task.department);
              if (deptIndex === -1) return null;

              const basePos = getDepartmentPosition(deptIndex, departments.length);
              const taskConflicts = getTaskConflicts(task.id);
              const hasConflict = taskConflicts.length > 0;
              
              // Position based on conflict probability
              const distance = 15 + (task.conflict_probability * 30);
              const angle = (deptIndex * 2 * Math.PI) / departments.length - Math.PI / 2;
              const x = 50 + distance * Math.cos(angle);
              const y = 50 + distance * Math.sin(angle);

              return (
                <g key={task.id}>
                  {/* Conflict Pulse Animation */}
                  {hasConflict && (
                    <circle
                      cx={x}
                      cy={y}
                      r="2"
                      fill="none"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="0.5"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        from="2"
                        to="5"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Task Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill={hasConflict ? "rgb(239, 68, 68)" : "rgb(34, 211, 238)"}
                    className="cursor-pointer hover:r-2 transition-all"
                    onClick={() => setSelectedTask(task)}
                  >
                    <animate
                      attributeName="r"
                      values="1.5;2;1.5"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Center Glow */}
            <circle cx="50" cy="50" r="5" fill="url(#radarGlow)" />
            <circle cx="50" cy="50" r="2" fill="rgb(34, 211, 238)" opacity="0.8" />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-muted-foreground">On Track</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-muted-foreground">Conflict Detected</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="bg-[#1e1e1e] border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-cyan-400" />
              {selectedTask?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Department</div>
                  <div className="font-medium">{selectedTask.department}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Badge>{selectedTask.status}</Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Conflict Probability</div>
                  <div className="font-medium text-red-400">
                    {(selectedTask.conflict_probability * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Conflicts List */}
              <div>
                <div className="text-sm font-medium mb-2">Detected Conflicts</div>
                <div className="space-y-2">
                  {getTaskConflicts(selectedTask.id).map((conflict) => (
                    <div
                      key={conflict.id}
                      className="p-3 bg-[#0a0a0a] border border-red-500/20 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="destructive">{conflict.severity}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Affects: {conflict.affected_departments.join(", ")}
                        </span>
                      </div>
                      <p className="text-sm">{conflict.description}</p>
                    </div>
                  ))}
                  {getTaskConflicts(selectedTask.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">No conflicts detected</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};