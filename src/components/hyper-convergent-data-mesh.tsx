import { useState } from "react";
import { NodeWebVisualizer } from "@/components/data-mesh/node-web-visualizer";
import { ContextualSidebar } from "@/components/data-mesh/contextual-sidebar";
import { SmartFilters } from "@/components/data-mesh/smart-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Brain, Activity, Zap, Filter } from "lucide-react";

export function HyperConvergentDataMesh() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header HUD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-primary/5 to-black p-4 border-b border-primary/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20 backdrop-blur-sm animate-pulse">
              <Network className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Hyper-Convergent Data Mesh™
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Real-time Intelligence • Predictive Correlations • Autonomous Decision Engine
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live Mesh
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Brain className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Zap className="w-3 h-3 mr-1" />
              247 Nodes
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-100px)]">
        {/* Left Sidebar - Filters */}
        {showFilters && (
          <div className="absolute left-4 top-4 w-80 z-40">
            <SmartFilters onFilterChange={() => {}} />
          </div>
        )}

        {/* Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute left-4 bottom-4 z-40 bg-black/80 backdrop-blur-sm border-primary/20"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </Button>

        {/* Center - Node Web Visualization */}
        <div className="w-full h-full">
          <NodeWebVisualizer 
            onNodeClick={setSelectedNode}
            selectedNode={selectedNode}
          />
        </div>

        {/* Right Sidebar - Contextual AI */}
        {selectedNode && (
          <ContextualSidebar 
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}

        {/* Top Status Bar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          <Badge variant="outline" className="bg-black/80 backdrop-blur-sm border-blue-500/30 text-blue-400">
            12 Opportunities
          </Badge>
          <Badge variant="outline" className="bg-black/80 backdrop-blur-sm border-red-500/30 text-red-400">
            3 Risks
          </Badge>
          <Badge variant="outline" className="bg-black/80 backdrop-blur-sm border-yellow-500/30 text-yellow-400">
            5 Volatile
          </Badge>
        </div>

        {/* AI Insights Ticker */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-primary/20 rounded-lg px-6 py-3 z-30">
          <div className="flex items-center gap-3">
            <Brain className="w-4 h-4 text-primary animate-pulse" />
            <p className="text-xs text-white">
              <span className="text-primary font-semibold">AI Insight:</span> Finance ERP shows strong correlation with Market Feed (0.87) - 
              <span className="text-blue-400 ml-1">+$2.3M revenue opportunity detected</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
