import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Activity,
  X,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { useRealtimeBudgetAlerts, BudgetAlert } from '@/hooks/use-realtime-budget-alerts';
import { cn } from '@/lib/utils';

export const RealtimeAlertDock = () => {
  const { alerts, isConnected, connectionError, checkAlerts, dismissAlert, reconnect } = useRealtimeBudgetAlerts();

  const getAlertIcon = (alert: BudgetAlert) => {
    switch (alert.type) {
      case 'overspend':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'underspend':
        return <TrendingDown className="h-4 w-4 text-warning" />;
      case 'forecast_drift':
        return <Activity className="h-4 w-4 text-accent" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 border-destructive/50 text-destructive';
      case 'high':
        return 'bg-warning/20 border-warning/50 text-warning';
      case 'medium':
        return 'bg-accent/20 border-accent/50 text-accent';
      default:
        return 'bg-muted border-border';
    }
  };

  const getAlertMessage = (alert: BudgetAlert) => {
    if (alert.type === 'overspend') {
      return `${alert.department} over budget by ${alert.variance}% (${alert.rule_name})`;
    } else if (alert.type === 'underspend') {
      return `${alert.department} under budget by ${Math.abs(parseFloat(alert.variance!))}%`;
    } else if (alert.type === 'forecast_drift') {
      return `Forecast drift: ${alert.drift}% predicted for ${new Date(alert.forecast_date!).toLocaleDateString()}`;
    }
    return 'Budget variance detected';
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-primary/20 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-all duration-300",
              isConnected 
                ? "bg-success/20 animate-pulse" 
                : "bg-destructive/20"
            )}>
              {isConnected ? (
                <Wifi className="h-4 w-4 text-success" />
              ) : (
                <WifiOff className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">Real-Time Alerts</h3>
              <p className="text-xs text-muted-foreground">
                {isConnected ? 'Live monitoring active' : connectionError || 'Disconnected'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={checkAlerts}
              disabled={!isConnected}
              className="hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="mt-3 flex gap-2">
          <Badge variant="outline" className="bg-destructive/10 border-destructive/30">
            {alerts.filter(a => a.severity === 'critical').length} Critical
          </Badge>
          <Badge variant="outline" className="bg-warning/10 border-warning/30">
            {alerts.filter(a => a.severity === 'high').length} High
          </Badge>
          <Badge variant="outline" className="bg-accent/10 border-accent/30">
            {alerts.filter(a => a.severity === 'medium').length} Medium
          </Badge>
        </div>
      </div>

      {/* Alerts List */}
      <ScrollArea className="flex-1 p-4">
        {!isConnected && !alerts.length && (
          <div className="text-center py-12">
            <WifiOff className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              {connectionError || 'Connecting to real-time alerts...'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={reconnect}
              className="border-primary/30 hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reconnect
            </Button>
          </div>
        )}

        {alerts.length === 0 && isConnected && (
          <div className="text-center py-12">
            <div className="p-3 rounded-full bg-success/10 w-fit mx-auto mb-3">
              <Activity className="h-8 w-8 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">
              All budgets within threshold
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Monitoring in real-time
            </p>
          </div>
        )}

        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card
              key={alert.timestamp}
              className={cn(
                "p-3 transition-all duration-300 hover:shadow-lg border-l-4",
                getSeverityColor(alert.severity)
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {getAlertIcon(alert)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight mb-1">
                      {getAlertMessage(alert)}
                    </p>
                    
                    {alert.type !== 'forecast_drift' && (
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Actual:</span>
                          <span className="ml-1 font-semibold">${parseFloat(alert.actual!).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Planned:</span>
                          <span className="ml-1 font-semibold">${parseFloat(alert.planned!).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {alert.recommendation && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {alert.recommendation}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.timestamp)}
                  className="hover:bg-destructive/20 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Neural grid background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      </div>
    </Card>
  );
};
