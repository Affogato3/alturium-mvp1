import { useState } from "react";
import { Shield, Globe, AlertTriangle, FileCheck, Activity, TrendingUp, Bot, Rss } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiquidGraphiteBackground } from "./liquid-graphite-background";
import { ComplianceAgent } from "./compliance-agent";
import { RegulationFeed } from "./regulation-feed";
import { RiskMonitor } from "./risk-monitor";
import { AuditVault } from "./audit-vault";
import { PolicyEngine } from "./policy-engine";
import { PartnerMonitor } from "./partner-monitor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EmbeddedComplianceDashboard = () => {
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [dialogData, setDialogData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      toast({
        title: "Processing",
        description: `Running ${action}...`,
      });

      const { data, error } = await supabase.functions.invoke('compliance-engine', {
        body: { action, data: { user_id: user.id } }
      });

      if (error) throw error;

      setDialogData(data);
      setActiveDialog(action);
      
      toast({
        title: "Complete",
        description: `${action} executed successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: "Partners Monitored", value: "24", icon: Globe, color: "text-primary" },
    { label: "Active Rules", value: "156", icon: Shield, color: "text-success" },
    { label: "Violations Prevented", value: "89", icon: AlertTriangle, color: "text-warning" },
    { label: "Compliance Score", value: "98.4%", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <LiquidGraphiteBackground />
      
      {/* Header */}
      <div className="relative z-10 border-b border-primary/20 bg-card/30 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Embedded Compliance Autopilot™
                </h1>
                <p className="text-xs text-muted-foreground">Real-time regulatory compliance monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Compliance Grid Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color} opacity-50`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Control Plane Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-primary">Compliance Control Plane</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleAction('validate_transaction')}
              disabled={loading}
              className="h-24 flex-col gap-2 bg-card/50 backdrop-blur border border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <Shield className="h-6 w-6" />
              <span>Validate Transaction</span>
            </Button>
            
            <Button
              onClick={() => handleAction('audit_compliance')}
              disabled={loading}
              className="h-24 flex-col gap-2 bg-card/50 backdrop-blur border border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <FileCheck className="h-6 w-6" />
              <span>Run Compliance Audit</span>
            </Button>
            
            <Button
              onClick={() => handleAction('assess_risk')}
              disabled={loading}
              className="h-24 flex-col gap-2 bg-card/50 backdrop-blur border border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <AlertTriangle className="h-6 w-6" />
              <span>Assess Risk</span>
            </Button>
            
            <Button
              onClick={() => handleAction('parse_regulation')}
              disabled={loading}
              className="h-24 flex-col gap-2 bg-card/50 backdrop-blur border border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <Activity className="h-6 w-6" />
              <span>Parse Regulation</span>
            </Button>
            
            <Button
              onClick={() => handleAction('generate_evidence')}
              disabled={loading}
              className="h-24 flex-col gap-2 bg-card/50 backdrop-blur border border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <FileCheck className="h-6 w-6" />
              <span>Generate Evidence</span>
            </Button>
            
            <Button
              onClick={() => handleAction('simulate_scenario')}
              disabled={loading}
              className="h-24 flex-col gap-2 bg-card/50 backdrop-blur border border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <TrendingUp className="h-6 w-6" />
              <span>Simulate Scenario</span>
            </Button>
          </div>
        </div>

        {/* Live Monitoring Tabs */}
        <Tabs defaultValue="partners" className="mb-8">
          <TabsList className="bg-card/50 backdrop-blur">
            <TabsTrigger value="partners"><Globe className="h-4 w-4 mr-2" />Partners</TabsTrigger>
            <TabsTrigger value="risks"><AlertTriangle className="h-4 w-4 mr-2" />Risks</TabsTrigger>
            <TabsTrigger value="regulations"><Rss className="h-4 w-4 mr-2" />Regulations</TabsTrigger>
            <TabsTrigger value="agent"><Bot className="h-4 w-4 mr-2" />AI Agent</TabsTrigger>
            <TabsTrigger value="audit"><FileCheck className="h-4 w-4 mr-2" />Audit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="partners" className="mt-4">
            <PartnerMonitor />
          </TabsContent>
          
          <TabsContent value="risks" className="mt-4">
            <RiskMonitor onUpdate={() => {}} />
          </TabsContent>
          
          <TabsContent value="regulations" className="mt-4">
            <RegulationFeed />
          </TabsContent>
          
          <TabsContent value="agent" className="mt-4">
            <ComplianceAgent />
          </TabsContent>
          
          <TabsContent value="audit" className="mt-4">
            <AuditVault />
          </TabsContent>
        </Tabs>

        {/* Policy Engine */}
        <PolicyEngine />
      </div>

      {/* Result Dialog */}
      <Dialog open={!!activeDialog} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {activeDialog && activeDialog.replace(/_/g, ' ').toUpperCase()} Results
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {dialogData && (
              <div className="p-4 rounded-lg bg-muted/50">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(dialogData, null, 2)}
                </pre>
              </div>
            )}
            
            {dialogData?.recommendation && (
              <Card className="p-6 bg-card/50 backdrop-blur">
                <h3 className="font-semibold mb-2 text-primary">AI Recommendation</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {dialogData.recommendation}
                </p>
              </Card>
            )}
            
            {dialogData?.tx_hash && (
              <Card className="p-4 bg-success/10 border-success/20">
                <p className="text-xs font-mono">Transaction Hash: {dialogData.tx_hash}</p>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};