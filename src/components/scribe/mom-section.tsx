import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle } from "lucide-react";

interface Decision {
  id: string;
  text: string;
  category: string;
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  deadline: string;
  completed: boolean;
}

interface MoMSectionProps {
  decisions: Decision[];
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export const MoMSection = ({ decisions, tasks, onTaskToggle }: MoMSectionProps) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-[hsl(var(--scribe-card))] border-0 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-[hsl(var(--scribe-text))]">
            Decisions Made
          </h3>
        </div>
        <div className="space-y-3">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer group"
            >
              <p className="text-[hsl(var(--scribe-text))]/80 text-sm group-hover:text-[hsl(var(--scribe-text))] transition-colors">
                {decision.text}
              </p>
              <span className="text-xs text-[hsl(var(--scribe-accent))] mt-1 inline-block">
                {decision.category}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-[hsl(var(--scribe-card))] border-0 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Circle className="w-5 h-5 text-[hsl(var(--scribe-accent))]" />
          <h3 className="text-lg font-semibold text-[hsl(var(--scribe-text))]">
            Tasks Assigned
          </h3>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onTaskToggle(task.id)}
                  className="mt-1 border-[hsl(var(--scribe-text))]/30"
                />
                <div className="flex-1 space-y-1">
                  <p className={`text-sm ${task.completed ? 'line-through text-[hsl(var(--scribe-text))]/40' : 'text-[hsl(var(--scribe-text))]/80'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[hsl(var(--scribe-text))]/50">
                    <span>{task.assignee}</span>
                    <span>•</span>
                    <span>{task.deadline}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
