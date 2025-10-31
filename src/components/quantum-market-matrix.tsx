import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Network, Activity, Shield, Zap, TrendingUp } from "lucide-react";
import { QuantumCorrelationGraph } from "./quantum-matrix/quantum-correlation-graph";
import { PredictiveFlowPanel } from "./quantum-matrix/predictive-flow-panel";
import { ActionConsole } from "./quantum-matrix/action-console";
import { MarketIntelligenceMap } from "./quantum-matrix/market-intelligence-map";
import { InsightNarrator } from "./quantum-matrix/insight-narrator";
import { NeuralSettings } from "./quantum-matrix/neural-settings";
import { StockMatrix } from "./stock-matrix";
import { OmniQuantNexus } from "./omniquant-nexus";
import { ComplianceDashboard } from "./compliance-dashboard";

export function QuantumMarketMatrix() {
  const [activeMode, setActiveMode] = useState<'conservative' | 'balanced' | 'offensive'>('balanced');
  const [autoExecute, setAutoExecute] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      {/* Header - Core-Black Futurism Theme */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0A0B0F] via-[#00E6F6]/10 to-[#0A0B0F] p-6 border-b border-[#00E6F6]/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-lg bg-gradient-to-br from-[#00E6F6]/20 to-primary/20 backdrop-blur-sm">
              <Brain className="w-12 h-12 text-[#00E6F6] animate-pulse" />
              <div className="absolute inset-0 rounded-lg bg-[#00E6F6]/20 blur-xl animate-pulse" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-[#E6E8EB] tracking-tight">
                Quantum Market Matrix™
              </h1>
              <p className="text-[#E6E8EB]/60 text-sm mt-1 font-light">
                Real-Time Predictive Stock Strategist • AI-Powered Correlation Intelligence • Autonomous Execution Layer
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge 
              variant="outline" 
              className="bg-[#00E6F6]/10 text-[#00E6F6] border-[#00E6F6]/30 animate-pulse px-4 py-2 text-sm"
            >
              <Network className="w-4 h-4 mr-2" />
              AI Active • 247 Nodes
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-[#43FF6B]/10 text-[#43FF6B] border-[#43FF6B]/30 px-4 py-2 text-sm"
            >
              <Activity className="w-4 h-4 mr-2" />
              {activeMode.toUpperCase()}
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              Compliance Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="bg-[#121318]/80 border border-[#00E6F6]/20 mb-6">
            <TabsTrigger 
              value="matrix" 
              className="data-[state=active]:bg-[#00E6F6]/20 data-[state=active]:text-[#00E6F6] text-[#E6E8EB]/60 transition-all duration-300"
            >
              <Brain className="w-4 h-4 mr-2" />
              Quantum Matrix
            </TabsTrigger>
            <TabsTrigger 
              value="stock-tracker"
              className="data-[state=active]:bg-[#00E6F6]/20 data-[state=active]:text-[#00E6F6] text-[#E6E8EB]/60 transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Stock Matrix
            </TabsTrigger>
            <TabsTrigger 
              value="omniquant"
              className="data-[state=active]:bg-[#00E6F6]/20 data-[state=active]:text-[#00E6F6] text-[#E6E8EB]/60 transition-all duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              OmniQuant
            </TabsTrigger>
            <TabsTrigger 
              value="compliance"
              className="data-[state=active]:bg-[#00E6F6]/20 data-[state=active]:text-[#00E6F6] text-[#E6E8EB]/60 transition-all duration-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-4">
            {/* Neural Settings Bar */}
            <NeuralSettings 
              activeMode={activeMode}
              onModeChange={setActiveMode}
              autoExecute={autoExecute}
              onAutoExecuteChange={setAutoExecute}
            />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left: 3D Correlation Graph */}
              <div className="lg:col-span-2">
                <QuantumCorrelationGraph />
              </div>

              {/* Right: Insight Narrator */}
              <div>
                <InsightNarrator />
              </div>
            </div>

            {/* Predictive Flow Panel */}
            <PredictiveFlowPanel />

            {/* Bottom Row: Action Console + Market Intelligence Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ActionConsole 
                autoExecute={autoExecute}
                activeMode={activeMode}
              />
              <MarketIntelligenceMap />
            </div>
          </TabsContent>

          <TabsContent value="stock-tracker">
            <StockMatrix />
          </TabsContent>

          <TabsContent value="omniquant">
            <OmniQuantNexus />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}