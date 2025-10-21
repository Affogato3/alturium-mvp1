import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Users, Edit3 } from "lucide-react";

interface AgendaItem {
  id: string;
  topic: string;
  duration: number;
  participants: string[];
  priority: "high" | "medium" | "low";
}

interface AgendaBuilderProps {
  agendaItems: AgendaItem[];
  onApprove: () => void;
  onEdit: (id: string) => void;
}

export const AgendaBuilder = ({ agendaItems, onApprove, onEdit }: AgendaBuilderProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-scribe-accent";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-scribe-text/60";
      default:
        return "text-scribe-text";
    }
  };

  const totalDuration = agendaItems.reduce((acc, item) => acc + item.duration, 0);

  return (
    <Card className="bg-scribe-card border-scribe-card/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-scribe-text">
            Next Meeting Agenda
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-scribe-text/70">
            <Clock className="h-4 w-4" />
            <span>{totalDuration} min total</span>
          </div>
        </div>
        <p className="text-sm text-scribe-text/60 mt-2">
          AI-generated agenda based on follow-up items and priorities
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {agendaItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-scribe-bg/50 border border-scribe-card/30 hover:border-scribe-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-scribe-text">{item.topic}</h4>
                  <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-scribe-text/60">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{item.participants.join(", ")}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item.id)}
                className="h-8 w-8 p-0 text-scribe-text/60 hover:text-scribe-accent"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          onClick={onApprove}
          className="w-full mt-4 bg-scribe-accent hover:bg-scribe-accent/90 text-white"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Approve & Schedule Agenda
        </Button>
      </CardContent>
    </Card>
  );
};
