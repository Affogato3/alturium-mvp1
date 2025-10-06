import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfitField3D } from "./omniquant/profit-field-3d";
import { AgentFeedDock } from "./omniquant/agent-feed-dock";
import { QuantumRiskMesh } from "./omniquant/quantum-risk-mesh";
import { MarketConsole } from "./omniquant/market-console";
import { MacroSimulator } from "./omniquant/macro-simulator";
import { ReportGenerator } from "./omniquant/report-generator";
import { DataIntegrationHub } from "./omniquant/data-integration-hub";
import { InvestorGodMode } from "./omniquant/investor-god-mode";
import { Brain, Database, Activity, Shield, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OmniQuantNexus() {
  const [activeTab, setActiveTab] = useState("nexus");
  const [godModeUnlocked, setGodModeUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 space-y-4">
      {/* Top HUD - Macroeconomic Simulator */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-6 border border-primary/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20 backdrop-blur-sm animate-pulse">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                OmniQuant Nexus™
              </h1>
              <p className="text-muted-foreground mt-1">
                Autonomous AI Macro-Brain • Quantum Financial Field Engine • Self-Optimizing Intelligence
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
          </div>
        </div>
        <MacroSimulator />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full bg-card/50 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="nexus" className="data-[state=active]:bg-primary/20">
            <Brain className="w-4 h-4 mr-2" />
            Nexus Core
          </TabsTrigger>
          <TabsTrigger value="integration" className="data-[state=active]:bg-primary/20">
            <Database className="w-4 h-4 mr-2" />
            Data Hub
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-primary/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-primary/20">
            <Shield className="w-4 h-4 mr-2" />
            Risk Mesh
          </TabsTrigger>
          <TabsTrigger value="agents" className="data-[state=active]:bg-primary/20">
            <Activity className="w-4 h-4 mr-2" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger 
            value="godmode" 
            className="data-[state=active]:bg-primary/20"
            onClick={() => setGodModeUnlocked(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            God Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nexus" className="space-y-4">
          <div className="grid grid-cols-12 gap-4 min-h-[800px]">
            {/* Left Dock - Agent Feed */}
            <div className="col-span-3 space-y-4">
              <AgentFeedDock />
            </div>

            {/* Center - 3D Profit Field */}
            <div className="col-span-6">
              <ProfitField3D />
            </div>

            {/* Right Dock - Quantum Risk Mesh */}
            <div className="col-span-3 space-y-4">
              <QuantumRiskMesh />
            </div>
          </div>

          {/* Bottom Console - Market Console */}
          <div className="w-full">
            <MarketConsole />
          </div>
        </TabsContent>

        <TabsContent value="integration">
          <DataIntegrationHub />
        </TabsContent>

        <TabsContent value="reports">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 gap-6">
            <QuantumRiskMesh fullscreen />
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <AgentFeedDock fullscreen />
        </TabsContent>

        <TabsContent value="godmode">
          <InvestorGodMode unlocked={godModeUnlocked} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
