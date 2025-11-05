import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, ZoomIn, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentCardProps {
  department: string;
  planned: number;
  actual: number;
  forecast: number;
  onDrillDown: () => void;
  onReforecast: () => void;
}

export const DepartmentCard = ({
  department,
  planned,
  actual,
  forecast,
  onDrillDown,
  onReforecast,
}: DepartmentCardProps) => {
  const variance = planned > 0 ? ((actual - planned) / planned) * 100 : 0;
  const forecastVariance = planned > 0 ? ((forecast - planned) / planned) * 100 : 0;
  const usagePercentage = planned > 0 ? (actual / planned) * 100 : 0;

  const getStatusColor = () => {
    if (variance > 10) return 'border-red-500/50';
    if (variance < -10) return 'border-amber-500/50';
    return 'border-green-500/50';
  };

  const getSentiment = () => {
    if (variance > 10) return 'Overspend';
    if (variance < -10) return 'Underspend';
    return 'Stable';
  };

  const getSentimentColor = () => {
    if (variance > 10) return 'text-red-400';
    if (variance < -10) return 'text-amber-400';
    return 'text-green-400';
  };

  return (
    <Card className={cn(
      "bg-card/50 backdrop-blur-xl border-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 p-6 group",
      getStatusColor()
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{department}</h3>
            <p className={cn("text-sm font-medium", getSentimentColor())}>
              {getSentiment()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Variance</p>
            <p className={cn("text-xl font-bold", variance > 0 ? 'text-red-400' : 'text-green-400')}>
              {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Budget bars */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Planned</span>
            <span className="font-medium">₹{planned.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Actual</span>
            <span className="font-medium text-cyan-400">₹{actual.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Forecast</span>
            <span className="font-medium text-amber-400">₹{forecast.toLocaleString()}</span>
          </div>
        </div>

        {/* Usage ring */}
        <div className="relative">
          <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{usagePercentage.toFixed(0)}% used</span>
            <span>{Math.max(0, 100 - usagePercentage).toFixed(0)}% remaining</span>
          </div>
        </div>

        {/* Forecast drift */}
        <div className="flex items-center gap-2 text-sm">
          {forecastVariance > 0 ? (
            <TrendingUp className="w-4 h-4 text-amber-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-green-400" />
          )}
          <span className="text-muted-foreground">
            Forecast drift: <span className={forecastVariance > 0 ? 'text-amber-400' : 'text-green-400'}>
              {forecastVariance > 0 ? '+' : ''}{forecastVariance.toFixed(1)}%
            </span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDrillDown}
            className="border-primary/30 hover:bg-primary/10 group-hover:border-primary/50 transition-all"
          >
            <ZoomIn className="w-4 h-4 mr-2" />
            Drill Down
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReforecast}
            className="border-cyan-500/30 hover:bg-cyan-500/10 group-hover:border-cyan-500/50 transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reforecast
          </Button>
        </div>
      </div>
    </Card>
  );
};