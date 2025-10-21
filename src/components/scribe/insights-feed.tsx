import { Card } from "@/components/ui/card";
import { Pin, Archive, TrendingUp, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Insight {
  id: string;
  type: "bottleneck" | "improvement" | "sentiment";
  content: string;
  pinned: boolean;
}

interface InsightsFeedProps {
  insights: Insight[];
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case "bottleneck":
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    case "improvement":
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case "sentiment":
      return <MessageSquare className="w-4 h-4 text-[hsl(var(--scribe-accent))]" />;
    default:
      return null;
  }
};

export const InsightsFeed = ({ insights, onPin, onArchive }: InsightsFeedProps) => {
  return (
    <Card className="bg-[hsl(var(--scribe-card))] border-0 shadow-lg p-6">
      <h3 className="text-lg font-semibold text-[hsl(var(--scribe-text))] mb-4">
        AI Insights
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors group"
          >
            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <p className="flex-1 text-sm text-[hsl(var(--scribe-text))]/80">
                {insight.content}
              </p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onPin(insight.id)}
                >
                  <Pin className={`w-3 h-3 ${insight.pinned ? 'fill-[hsl(var(--scribe-accent))] text-[hsl(var(--scribe-accent))]' : 'text-[hsl(var(--scribe-text))]/50'}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onArchive(insight.id)}
                >
                  <Archive className="w-3 h-3 text-[hsl(var(--scribe-text))]/50" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
