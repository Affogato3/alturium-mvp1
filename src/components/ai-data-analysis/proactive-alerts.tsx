import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, AlertTriangle, TrendingDown, DollarSign, Users, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  metric: string;
  deviation: string;
  timestamp: string;
  actionable: boolean;
}

export const ProactiveAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [monitoring, setMonitoring] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (monitoring) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [monitoring]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('monitor-alerts');
      
      if (error) throw error;

      if (data?.alerts && data.alerts.length > 0) {
        setAlerts(data.alerts);
        
        // Show toast for new critical alerts
        const criticalAlerts = data.alerts.filter((a: Alert) => a.type === "critical");
        if (criticalAlerts.length > 0) {
          toast({
            title: "Critical Alert",
            description: criticalAlerts[0].title,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleAction = async (alert: Alert) => {
    try {
      const { error } = await supabase.functions.invoke('execute-action', {
        body: {
          alert_id: alert.id,
          action: "investigate"
        }
      });

      if (error) throw error;

      toast({
        title: "Action Initiated",
        description: "Investigation workflow started",
      });
    } catch (error) {
      console.error('Error executing action:', error);
      toast({
        title: "Action Failed",
        description: "Unable to execute action",
        variant: "destructive"
      });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <TrendingDown className="h-5 w-5 text-yellow-500" />;
      default:
        return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Proactive Alerts</h3>
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {alerts.length}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonitoring(!monitoring)}
          >
            {monitoring ? "Pause" : "Resume"}
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence>
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>All systems operating normally</p>
                <p className="text-sm mt-1">No alerts detected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-4 rounded-lg border ${
                      alert.type === "critical" 
                        ? "bg-destructive/10 border-destructive/50" 
                        : alert.type === "warning"
                        ? "bg-yellow-500/10 border-yellow-500/50"
                        : "bg-blue-500/10 border-blue-500/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {alert.metric}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.deviation}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>

                    {alert.actionable && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleAction(alert)}
                          className="text-xs"
                        >
                          Investigate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissAlert(alert.id)}
                          className="text-xs"
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </Card>
  );
};
