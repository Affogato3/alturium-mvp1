import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, AlertTriangle, CheckCircle, TrendingUp, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  message: string;
  priority: 'low' | 'medium' | 'high';
  insightType: string;
}

interface AIInsightsPanelProps {
  insights: Insight[];
  summary: string;
  onCreateRule: () => void;
  onAskAI: () => void;
}

export const AIInsightsPanel = ({
  insights,
  summary,
  onCreateRule,
  onAskAI,
}: AIInsightsPanelProps) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-amber-500';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-primary/20 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary animate-pulse" />
          <h2 className="text-lg font-semibold">AI Insights</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAskAI}
            className="border-primary/30 hover:bg-primary/10"
          >
            <Search className="w-4 h-4 mr-2" />
            Ask AI
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateRule}
            className="border-cyan-500/30 hover:bg-cyan-500/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Insights list */}
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                "bg-card/80 border-l-4 rounded-r-lg p-3 hover:bg-card transition-all group",
                getPriorityBorder(insight.priority)
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getPriorityIcon(insight.priority)}
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">
                    {insight.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.insightType.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Neural grid background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>
    </Card>
  );
};