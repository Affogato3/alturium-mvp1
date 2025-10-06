import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Database, CheckCircle2, XCircle, Loader2, Video, MessageSquare, Cloud, Mail, BarChart3, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  icon: any;
  status: "connected" | "disconnected" | "syncing";
  lastSync: string;
  dataPoints: number;
  enabled: boolean;
}

export function DataIntegrationHub() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "1", name: "Zoom Meetings", icon: Video, status: "connected", lastSync: "2m ago", dataPoints: 1247, enabled: true },
    { id: "2", name: "Slack", icon: MessageSquare, status: "connected", lastSync: "5m ago", dataPoints: 3421, enabled: true },
    { id: "3", name: "OneDrive", icon: Cloud, status: "syncing", lastSync: "syncing...", dataPoints: 892, enabled: true },
    { id: "4", name: "Google Drive", icon: Cloud, status: "connected", lastSync: "1m ago", dataPoints: 2134, enabled: true },
    { id: "5", name: "Gmail", icon: Mail, status: "connected", lastSync: "3m ago", dataPoints: 5678, enabled: true },
    { id: "6", name: "Outlook", icon: Mail, status: "disconnected", lastSync: "never", dataPoints: 0, enabled: false },
    { id: "7", name: "Dropbox", icon: Cloud, status: "connected", lastSync: "4m ago", dataPoints: 1523, enabled: true },
    { id: "8", name: "Company Stocks", icon: TrendingUp, status: "connected", lastSync: "real-time", dataPoints: 847, enabled: true },
    { id: "9", name: "Financial News", icon: BarChart3, status: "connected", lastSync: "real-time", dataPoints: 12453, enabled: true },
  ]);

  const handleToggle = (id: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === id) {
        const newEnabled = !integration.enabled;
        toast({
          title: newEnabled ? "Integration Enabled" : "Integration Disabled",
          description: `${integration.name} has been ${newEnabled ? "enabled" : "disabled"}.`,
        });
        return {
          ...integration,
          enabled: newEnabled,
          status: newEnabled ? (integration.status === "disconnected" ? "connected" : integration.status) : "disconnected" as const,
        };
      }
      return integration;
    }));
  };

  const handleConnect = (id: string, name: string) => {
    toast({
      title: "Connecting...",
      description: `Setting up ${name} integration...`,
    });
    
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: "connected" as const, enabled: true, lastSync: "just now" }
          : integration
      ));
      toast({
        title: "Connected",
        description: `${name} is now connected and syncing.`,
      });
    }, 2000);
  };

  const totalDataPoints = integrations.reduce((sum, int) => sum + (int.enabled ? int.dataPoints : 0), 0);
  const activeIntegrations = integrations.filter(int => int.enabled).length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Integrations</p>
              <p className="text-2xl font-bold text-primary">{activeIntegrations}/{integrations.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Data Points</p>
              <p className="text-2xl font-bold text-success">{totalDataPoints.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Sync Status</p>
              <p className="text-2xl font-bold text-accent">Real-Time</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">AI Processing</p>
              <p className="text-2xl font-bold text-warning">94.2%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Integration Cards */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card border-primary/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border/50">
            <div className="p-2 rounded-lg bg-primary/20">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-2xl">Data Integration Hub</h3>
              <p className="text-sm text-muted-foreground">Automated Real-Time Data Extraction</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map(integration => {
              const Icon = integration.icon;
              return (
                <Card
                  key={integration.id}
                  className={`p-4 transition-all ${
                    integration.status === "connected"
                      ? "bg-success/5 border-success/30 hover:border-success/50"
                      : integration.status === "syncing"
                      ? "bg-warning/5 border-warning/30"
                      : "bg-muted/20 border-border/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        integration.status === "connected" ? "bg-success/20" :
                        integration.status === "syncing" ? "bg-warning/20" :
                        "bg-muted/50"
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          integration.status === "connected" ? "text-success" :
                          integration.status === "syncing" ? "text-warning" :
                          "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-xs text-muted-foreground">{integration.lastSync}</p>
                      </div>
                    </div>
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => handleToggle(integration.id)}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {integration.status === "connected" && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                    {integration.status === "syncing" && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Syncing
                      </Badge>
                    )}
                    {integration.status === "disconnected" && (
                      <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">
                        <XCircle className="w-3 h-3 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </div>

                  {integration.enabled && integration.status !== "disconnected" && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Data Points</span>
                        <span className="font-semibold">{integration.dataPoints.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-1">
                        <div
                          className="bg-success h-1 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (integration.dataPoints / 100))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {integration.status === "disconnected" && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleConnect(integration.id, integration.name)}
                    >
                      Connect
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </Card>

      {/* AI Processing Info */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-accent/5 to-card border-accent/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="relative p-6">
          <h4 className="font-semibold text-lg mb-4">AI Data Processing</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">Natural Language Processing</p>
              <p className="text-xl font-bold text-primary">Extracting insights from meetings, emails, and documents</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">Financial Data Analysis</p>
              <p className="text-xl font-bold text-success">Real-time stock tracking and investor sentiment analysis</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">Trend Detection</p>
              <p className="text-xl font-bold text-accent">Automated market signals from news and social data</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
