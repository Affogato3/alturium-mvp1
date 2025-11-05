import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Brain } from 'lucide-react';

interface BudgetSummaryBarProps {
  totalBudget: number;
  usedPercentage: number;
  aiConfidence: number;
  projectedDrift: string;
}

export const BudgetSummaryBar = ({
  totalBudget,
  usedPercentage,
  aiConfidence,
  projectedDrift,
}: BudgetSummaryBarProps) => {
  const remainingPercentage = 100 - usedPercentage;

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-primary/20 p-6 mb-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Activity className="w-4 h-4" />
            Total Budget
          </div>
          <div className="text-2xl font-bold text-primary">
            ₹{totalBudget.toLocaleString()}
          </div>
        </div>

        <div className="space-y-2 group relative">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingUp className="w-4 h-4" />
            Used
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {usedPercentage.toFixed(1)}%
          </div>
          <div className="absolute top-full left-0 mt-2 p-3 bg-card border border-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64">
            <p className="text-sm text-muted-foreground">{projectedDrift}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingDown className="w-4 h-4" />
            Remaining
          </div>
          <div className="text-2xl font-bold text-green-400">
            {remainingPercentage.toFixed(1)}%
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Brain className="w-4 h-4" />
            AI Confidence
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {aiConfidence.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-primary transition-all duration-500"
          style={{ width: `${usedPercentage}%` }}
        />
      </div>
    </Card>
  );
};