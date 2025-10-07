import { useState } from "react";
import { ProfitUniverseHologram } from "@/components/pse/profit-universe-hologram";
import { MacroControlHub } from "@/components/pse/macro-control-hub";
import { OperationalIntelligenceFeed } from "@/components/pse/operational-intelligence-feed";
import { QuantumRiskPanel } from "@/components/pse/quantum-risk-panel";
import { ProfitCurvatureConsole } from "@/components/pse/profit-curvature-console";
import { DepartmentalPortals } from "@/components/pse/departmental-portals";
import { ExecutiveMode } from "@/components/pse/executive-mode";
import { DataSourceConnector } from "@/components/pse/data-source-connector";
import { Button } from "@/components/ui/button";
import { Brain, Minimize2, Maximize2 } from "lucide-react";

export const ProfitSingularityEngine = () => {
  const [executiveMode, setExecutiveMode] = useState(false);
  const [showDataConnector, setShowDataConnector] = useState(false);

  if (executiveMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-white">Profit Singularity Engine™</h1>
            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">EXECUTIVE MODE</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExecutiveMode(false)}
            className="border-primary/20"
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Full Interface
          </Button>
        </div>
        <ExecutiveMode />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-2 overflow-hidden">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary animate-pulse" />
          <div>
            <h1 className="text-xl font-bold text-white">Profit Singularity Engine™</h1>
            <p className="text-xs text-primary/60">Where every decision collapses into its most profitable form</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDataConnector(!showDataConnector)}
            className="border-primary/20"
          >
            {showDataConnector ? "Hide" : "Show"} Data Sources
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExecutiveMode(true)}
            className="border-primary/20"
          >
            <Minimize2 className="w-4 h-4 mr-2" />
            Executive Mode
          </Button>
        </div>
      </div>

      {/* Data Source Connector (conditional) */}
      {showDataConnector && (
        <div className="mb-2">
          <DataSourceConnector />
        </div>
      )}

      {/* Top HUD - Macro Control Hub */}
      <div className="mb-2">
        <MacroControlHub />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-2 h-[calc(100vh-200px)]">
        {/* Left Dock - Operational Intelligence */}
        <div className="col-span-3 overflow-y-auto">
          <OperationalIntelligenceFeed />
        </div>

        {/* Center - Profit Universe Hologram */}
        <div className="col-span-6 relative">
          <ProfitUniverseHologram />
          {/* Floating Departmental Portals */}
          <DepartmentalPortals />
        </div>

        {/* Right Dock - Quantum Risk Panel */}
        <div className="col-span-3 overflow-y-auto">
          <QuantumRiskPanel />
        </div>
      </div>

      {/* Bottom Dock - Profit Curvature Console */}
      <div className="mt-2">
        <ProfitCurvatureConsole />
      </div>
    </div>
  );
};
