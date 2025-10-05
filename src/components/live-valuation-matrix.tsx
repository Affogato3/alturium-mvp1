import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialTwinGlobe } from "./valuation-matrix/financial-twin-globe";
import { DealSimulationPanel } from "./valuation-matrix/deal-simulation-panel";
import { AgenticBotArena } from "./valuation-matrix/agentic-bot-arena";
import { MetaRiskLayer } from "./valuation-matrix/meta-risk-layer";
import { AutoIPOConstructor } from "./valuation-matrix/auto-ipo-constructor";
import { VisualThinkingBoard } from "./valuation-matrix/visual-thinking-board";
import { Brain, Globe2, GitBranch, Bot, Shield, FileText, Pencil } from "lucide-react";

export function LiveValuationMatrix() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-background p-8 border border-primary/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-sm">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Live Valuation Matrix
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-Powered Parallel Financial Universe Simulator
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Active Simulations", value: "127", trend: "+12%" },
            { label: "Deal Confidence", value: "94.2%", trend: "+3.1%" },
            { label: "Risk Score", value: "2.4/10", trend: "-0.8" },
            { label: "Universes Tracked", value: "8,432", trend: "+234" }
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
              <p className="text-xs text-success mt-1">{stat.trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full bg-card/50 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20">
            <Globe2 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="globe" className="data-[state=active]:bg-primary/20">
            <Globe2 className="w-4 h-4 mr-2" />
            Twin Globe
          </TabsTrigger>
          <TabsTrigger value="simulations" className="data-[state=active]:bg-primary/20">
            <GitBranch className="w-4 h-4 mr-2" />
            Simulations
          </TabsTrigger>
          <TabsTrigger value="bots" className="data-[state=active]:bg-primary/20">
            <Bot className="w-4 h-4 mr-2" />
            Deal Bots
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-primary/20">
            <Shield className="w-4 h-4 mr-2" />
            MetaRisk
          </TabsTrigger>
          <TabsTrigger value="ipo" className="data-[state=active]:bg-primary/20">
            <FileText className="w-4 h-4 mr-2" />
            Auto-IPO
          </TabsTrigger>
          <TabsTrigger value="thinking" className="data-[state=active]:bg-primary/20">
            <Pencil className="w-4 h-4 mr-2" />
            Visual Board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <FinancialTwinGlobe />
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <MetaRiskLayer />
            </Card>
          </div>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <DealSimulationPanel />
          </Card>
        </TabsContent>

        <TabsContent value="globe">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <FinancialTwinGlobe fullscreen />
          </Card>
        </TabsContent>

        <TabsContent value="simulations">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <DealSimulationPanel />
          </Card>
        </TabsContent>

        <TabsContent value="bots">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <AgenticBotArena />
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <MetaRiskLayer fullscreen />
          </Card>
        </TabsContent>

        <TabsContent value="ipo">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <AutoIPOConstructor />
          </Card>
        </TabsContent>

        <TabsContent value="thinking">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <VisualThinkingBoard />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
