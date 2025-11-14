import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell, Plus, TestTube, Trash2 } from "lucide-react";

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [newAlert, setNewAlert] = useState({
    name: '',
    severity: [7],
    exposure: [1000000]
  });

  const createAlert = async () => {
    if (!newAlert.name) {
      toast.error("Please enter alert name");
      return;
    }

    toast.loading("Creating alert rule...");
    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: {
          action: 'create_alert',
          rule: {
            name: newAlert.name,
            severity_threshold: newAlert.severity[0],
            exposure_threshold: newAlert.exposure[0]
          }
        }
      });

      if (error) throw error;

      setAlerts(prev => [...prev, data.alert]);
      setNewAlert({ name: '', severity: [7], exposure: [1000000] });
      toast.success("Alert rule created");
    } catch (error: any) {
      toast.error(error.message || "Creation failed");
    } finally {
      toast.dismiss();
    }
  };

  const testAlert = async (alertId: string) => {
    toast.loading("Testing alert rule...");
    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'test_alert', alert_id: alertId }
      });

      if (error) throw error;

      toast.success(`Would trigger on ${data.match_count} historical events`);
    } catch (error: any) {
      toast.error(error.message || "Test failed");
    } finally {
      toast.dismiss();
    }
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    toast.success("Alert deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert Rules & Automation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure automated responses to global events
          </p>
        </div>
      </div>

      {/* Create New Alert */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
        <h3 className="text-lg font-semibold mb-4">Create Alert Rule</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Alert Name</label>
            <Input
              value={newAlert.name}
              onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., High Severity Supply Chain Alert"
              className="bg-background/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Severity Threshold: {newAlert.severity[0]}/10
            </label>
            <Slider
              value={newAlert.severity}
              onValueChange={(value) => setNewAlert(prev => ({ ...prev, severity: value }))}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Exposure Threshold: ${(newAlert.exposure[0] / 1000000).toFixed(1)}M
            </label>
            <Slider
              value={newAlert.exposure}
              onValueChange={(value) => setNewAlert(prev => ({ ...prev, exposure: value }))}
              min={100000}
              max={10000000}
              step={100000}
              className="w-full"
            />
          </div>

          <Button onClick={createAlert} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Create Alert Rule
          </Button>
        </div>
      </Card>

      {/* Existing Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
                {/* Edge glow animation */}
                <motion.div
                  className="absolute inset-0 border-2 rounded-lg pointer-events-none"
                  style={{
                    borderColor: alert.active ? 'rgba(207, 175, 110, 0.5)' : 'transparent'
                  }}
                  animate={alert.active ? {
                    opacity: [0.3, 0.7, 0.3],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">{alert.name}</h4>
                    </div>
                    <Badge variant={alert.active ? "default" : "secondary"}>
                      {alert.active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Severity:</span>
                      <span className="font-semibold">&gt; {alert.severity_threshold}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exposure:</span>
                      <span className="font-semibold">
                        &gt; ${(alert.exposure_threshold / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Triggered:</span>
                      <span className="font-semibold text-primary">{alert.trigger_count || 0}x</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testAlert(alert.id)}
                      className="gap-2"
                    >
                      <TestTube className="w-4 h-4" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteAlert(alert.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {alerts.length === 0 && (
        <Card className="p-12 bg-background/50 backdrop-blur-sm border-primary/20">
          <div className="text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No alert rules configured</p>
            <p className="text-sm mt-2">Create your first rule to automate event monitoring</p>
          </div>
        </Card>
      )}
    </div>
  );
}
