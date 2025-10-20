import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Network, LayoutGrid, Layers } from "lucide-react";
import { StrategicRibbon } from "@/components/synapsex/strategic-ribbon";
import { EnterpriseField } from "@/components/synapsex/enterprise-field";
import { InsightStack } from "@/components/synapsex/insight-stack";
import { TacticalDialogue } from "@/components/synapsex/tactical-dialogue";
import { SimulationRail } from "@/components/synapsex/simulation-rail";
import { StrategicConstellation } from "@/components/synapsex/strategic-constellation";

type ViewMode = "field" | "constellation";

export function SynapseXCore() {
  const [viewMode, setViewMode] = useState<ViewMode>("field");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-cyan-500/10 to-black p-6 border-b border-cyan-500/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-primary/20 backdrop-blur-sm animate-pulse">
              <Brain className="w-10 h-10 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-primary to-cyan-400 bg-clip-text text-transparent">
                SynapseX™
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                AI-Powered Enterprise Coordination Core • Real-Time Profit Optimization • Strategic Intelligence
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse">
              <Network className="w-3 h-3 mr-1" />
              247 Nodes Live
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Brain className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Strategic Ribbon */}
      <StrategicRibbon />

      {/* View Mode Toggle */}
      <div className="p-4 border-b border-primary/20 bg-black/20">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "field" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("field")}
            className={viewMode === "field" ? "bg-cyan-500 text-black" : "bg-black/50 border-primary/20"}
          >
            <Layers className="w-4 h-4 mr-2" />
            Enterprise Field
          </Button>
          <Button
            variant={viewMode === "constellation" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("constellation")}
            className={viewMode === "constellation" ? "bg-cyan-500 text-black" : "bg-black/50 border-primary/20"}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Strategic Constellation
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="h-[calc(100vh-280px)] flex gap-4 p-4">
        {/* Left: Insight Stack */}
        <div className="w-80 flex-shrink-0">
          <InsightStack />
        </div>

        {/* Center: Visualization */}
        <div className="flex-1">
          {viewMode === "field" ? <EnterpriseField /> : <StrategicConstellation />}
        </div>

        {/* Right: Tactical Dialogue */}
        <div className="w-96 flex-shrink-0">
          <TacticalDialogue />
        </div>
      </div>

      {/* Bottom: Simulation Rail */}
      <div className="p-4 pt-0">
        <SimulationRail />
      </div>
    </div>
  );
}
