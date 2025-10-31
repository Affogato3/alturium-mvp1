import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Task {
  id: string;
  title: string;
  department: string;
  start_date: string;
  end_date: string;
  status: string;
  conflict_probability: number;
}

interface Conflict {
  id: string;
  task_id: string;
  severity: string;
  description: string;
}

interface TimelineMeshProps {
  tasks: Task[];
  conflicts: Conflict[];
}

export const TimelineMesh = ({ tasks, conflicts }: TimelineMeshProps) => {
  const getDepartmentColor = (dept: string) => {
    const colors: any = {
      Engineering: "bg-blue-500",
      Finance: "bg-green-500",
      Marketing: "bg-purple-500",
      Operations: "bg-orange-500",
      Sales: "bg-pink-500",
      HR: "bg-cyan-500"
    };
    return colors[dept] || "bg-gray-500";
  };

  const getConflictsForTask = (taskId: string) => {
    return conflicts.filter(c => c.task_id === taskId);
  };

  return (
    <Card className="bg-[#1e1e1e] border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          Predictive Timeline Mesh
        </h2>
        <Badge variant="outline" className="text-xs">
          {tasks.length} Active Projects
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline Grid */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {tasks.map((task) => {
            const taskConflicts = getConflictsForTask(task.id);
            const hasConflict = taskConflicts.length > 0;
            const duration = differenceInDays(new Date(task.end_date), new Date(task.start_date));

            return (
              <div
                key={task.id}
                className="relative group cursor-pointer"
              >
                {/* Timeline Bar */}
                <div 
                  className={`
                    h-12 rounded-lg border transition-all duration-300
                    ${hasConflict 
                      ? 'bg-red-500/10 border-red-500/30 hover:border-red-500' 
                      : 'bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50'
                    }
                  `}
                >
                  <div className="flex items-center h-full px-4 justify-between">
                    <div className="flex items-center gap-3">
                      {/* Conflict Pulse */}
                      {hasConflict && (
                        <div className="relative">
                          <div className="absolute h-3 w-3 bg-red-500 rounded-full animate-ping opacity-75" />
                          <AlertTriangle className="h-4 w-4 text-red-500 relative z-10" />
                        </div>
                      )}

                      {/* Department Badge */}
                      <Badge 
                        className={`${getDepartmentColor(task.department)} text-white text-xs`}
                      >
                        {task.department}
                      </Badge>

                      {/* Task Title */}
                      <span className="font-medium text-sm">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{format(new Date(task.start_date), 'MMM dd')}</span>
                      <div className="h-px w-8 bg-muted-foreground/30" />
                      <span>{format(new Date(task.end_date), 'MMM dd')}</span>
                      <Badge variant="outline" className="text-xs">
                        {duration}d
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20 rounded-b-lg overflow-hidden">
                    <div 
                      className={`h-full transition-all ${hasConflict ? 'bg-red-500' : 'bg-cyan-400'}`}
                      style={{ width: `${(task as any).progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Hover Tooltip */}
                {hasConflict && (
                  <div className="absolute left-0 top-full mt-2 w-80 p-4 bg-[#0a0a0a] border border-red-500/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="text-sm font-medium text-red-400 mb-2">
                      ⚠️ Predicted Conflicts
                    </div>
                    <div className="space-y-2">
                      {taskConflicts.map((conflict) => (
                        <div key={conflict.id} className="text-xs">
                          <Badge variant="destructive" className="text-xs mb-1">
                            {conflict.severity}
                          </Badge>
                          <p className="text-muted-foreground">{conflict.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ambient Light Sweep Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-[sweep_3s_ease-in-out_infinite]" />
        </div>
      </div>
    </Card>
  );
};