import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Database, Cloud, DollarSign, RefreshCw, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DataSource {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  lastSync?: string;
  recordCount?: number;
  status: "connected" | "syncing" | "error" | "disconnected";
}

export const DataSourceConnector = () => {
  const [sources, setSources] = useState<DataSource[]>([
    {
      id: "salesforce",
      name: "Salesforce",
      icon: Cloud,
      connected: false,
      status: "disconnected",
    },
    {
      id: "netsuite",
      name: "NetSuite",
      icon: Database,
      connected: false,
      status: "disconnected",
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      icon: DollarSign,
      connected: false,
      status: "disconnected",
    },
  ]);

  const [syncing, setSyncing] = useState<string | null>(null);

  const connectSource = async (sourceId: string) => {
    setSyncing(sourceId);
    
    try {
      const { data, error } = await supabase.functions.invoke("connect-data-source", {
        body: { source: sourceId },
      });

      if (error) throw error;

      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                connected: true,
                status: "connected",
                lastSync: new Date().toISOString(),
                recordCount: data.recordCount || 0,
              }
            : s
        )
      );

      toast.success(`${sourceId} connected successfully`, {
        description: `Synced ${data.recordCount || 0} records`,
      });
    } catch (error: any) {
      toast.error(`Failed to connect ${sourceId}`, {
        description: error.message,
      });
      setSources((prev) =>
        prev.map((s) => (s.id === sourceId ? { ...s, status: "error" } : s))
      );
    } finally {
      setSyncing(null);
    }
  };

  const syncSource = async (sourceId: string) => {
    setSyncing(sourceId);
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, status: "syncing" } : s))
    );

    try {
      const { data, error } = await supabase.functions.invoke("sync-data-source", {
        body: { source: sourceId },
      });

      if (error) throw error;

      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? {
                ...s,
                status: "connected",
                lastSync: new Date().toISOString(),
                recordCount: data.recordCount || 0,
              }
            : s
        )
      );

      toast.success(`${sourceId} synced successfully`, {
        description: `Updated ${data.recordCount || 0} records`,
      });
    } catch (error: any) {
      toast.error(`Sync failed for ${sourceId}`, {
        description: error.message,
      });
      setSources((prev) =>
        prev.map((s) => (s.id === sourceId ? { ...s, status: "error" } : s))
      );
    } finally {
      setSyncing(null);
    }
  };

  const toggleSource = (sourceId: string, enabled: boolean) => {
    if (enabled) {
      connectSource(sourceId);
    } else {
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? { ...s, connected: false, status: "disconnected" }
            : s
        )
      );
      toast.info(`${sourceId} disconnected`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "syncing":
        return "bg-primary/20 text-primary border-primary/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Check className="w-3 h-3" />;
      case "syncing":
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case "error":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-background/60 backdrop-blur-xl border-primary/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Data Source Connectors</h3>
          <p className="text-sm text-muted-foreground">
            Connect to your business platforms for real-time data sync
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sources.map((source) => {
            const Icon = source.icon;
            const isSyncing = syncing === source.id;

            return (
              <motion.div
                key={source.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{source.name}</h4>
                        {source.connected && source.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last sync: {new Date(source.lastSync).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={source.connected}
                      onCheckedChange={(checked) => toggleSource(source.id, checked)}
                      disabled={isSyncing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(source.status)}>
                      {getStatusIcon(source.status)}
                      <span className="ml-1.5 capitalize">{source.status}</span>
                    </Badge>

                    {source.connected && (
                      <div className="flex items-center gap-3">
                        {source.recordCount !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            {source.recordCount.toLocaleString()} records
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => syncSource(source.id)}
                          disabled={isSyncing}
                          className="h-8"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-semibold">Tip:</span> All data is encrypted and
          synced in real-time. Changes in connected platforms update your dashboard automatically.
        </p>
      </div>
    </Card>
  );
};
