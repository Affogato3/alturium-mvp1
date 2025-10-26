import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link2, RefreshCw, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "disconnected" | "syncing" | "error";
  lastSync: string;
  enabled: boolean;
}

export function SyncBar() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "1", name: "Slack", icon: "💬", status: "connected", lastSync: "2m ago", enabled: true },
    { id: "2", name: "Salesforce", icon: "☁️", status: "connected", lastSync: "5m ago", enabled: true },
    { id: "3", name: "Jira", icon: "📋", status: "syncing", lastSync: "Syncing...", enabled: true },
    { id: "4", name: "SAP", icon: "💼", status: "connected", lastSync: "1h ago", enabled: true },
    { id: "5", name: "Asana", icon: "✓", status: "disconnected", lastSync: "Never", enabled: false },
    { id: "6", name: "Teams", icon: "🎯", status: "connected", lastSync: "10m ago", enabled: true },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id
          ? { ...int, enabled: !int.enabled, status: !int.enabled ? "syncing" : "disconnected" }
          : int
      )
    );
    toast.success("Integration updated");
  };

  const refreshAll = () => {
    setIsRefreshing(true);
    setIntegrations((prev) =>
      prev.map((int) => (int.enabled ? { ...int, status: "syncing" as const } : int))
    );

    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.enabled
            ? { ...int, status: "connected" as const, lastSync: "Just now" }
            : int
        )
      );
      setIsRefreshing(false);
      toast.success("All integrations synced");
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      case "syncing":
        return "bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))] border-[hsl(var(--vanguard-accent))]/30";
      case "error":
        return "bg-[hsl(var(--vanguard-alert))]/20 text-[hsl(var(--vanguard-alert))] border-[hsl(var(--vanguard-alert))]/30";
      default:
        return "bg-[hsl(var(--vanguard-text))]/10 text-[hsl(var(--vanguard-text))]/60 border-[hsl(var(--vanguard-text))]/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Check className="w-3 h-3" />;
      case "syncing":
        return <RefreshCw className="w-3 h-3 animate-spin" />;
      case "error":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--vanguard-accent))]/20">
            <Link2 className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Instant Sync
            </h2>
            <p className="text-xs text-[hsl(var(--vanguard-text))]/60">
              Cross-System Integration Hub
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={refreshAll}
          disabled={isRefreshing}
          className="bg-[hsl(var(--vanguard-accent))]/20 hover:bg-[hsl(var(--vanguard-accent))]/30 text-[hsl(var(--vanguard-accent))]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Sync All
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{integration.icon}</span>
                <span className="font-semibold text-[hsl(var(--vanguard-text))]">
                  {integration.name}
                </span>
              </div>
              <Switch
                checked={integration.enabled}
                onCheckedChange={() => toggleIntegration(integration.id)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(integration.status)}>
                {getStatusIcon(integration.status)}
                <span className="ml-1.5">{integration.status}</span>
              </Badge>
              <span className="text-xs text-[hsl(var(--vanguard-text))]/50">
                {integration.lastSync}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-[hsl(var(--vanguard-accent))]/10 border border-[hsl(var(--vanguard-accent))]/20">
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--vanguard-text))]/80">
          <Check className="w-4 h-4 text-[hsl(var(--vanguard-accent))]" />
          <span>
            All enabled systems synced. Real-time data flow active.
          </span>
        </div>
      </div>
    </Card>
  );
}
