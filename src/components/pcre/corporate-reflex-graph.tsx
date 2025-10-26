import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Zap, AlertCircle } from "lucide-react";

export function CorporateReflexGraph() {
  const nodes = [
    { id: 1, name: "Marketing", x: 200, y: 100, status: "warning", impact: "high" },
    { id: 2, name: "Sales", x: 400, y: 100, status: "healthy", impact: "medium" },
    { id: 3, name: "Product", x: 300, y: 250, status: "critical", impact: "high" },
    { id: 4, name: "Engineering", x: 500, y: 250, status: "warning", impact: "high" },
    { id: 5, name: "Finance", x: 350, y: 400, status: "healthy", impact: "low" },
    { id: 6, name: "Operations", x: 100, y: 250, status: "healthy", impact: "medium" },
  ];

  const connections = [
    { from: 1, to: 2, strength: "strong" },
    { from: 1, to: 3, strength: "medium" },
    { from: 2, to: 3, strength: "strong" },
    { from: 3, to: 4, strength: "critical" },
    { from: 3, to: 5, strength: "medium" },
    { from: 4, to: 5, strength: "medium" },
    { from: 1, to: 6, strength: "weak" },
    { from: 6, to: 5, strength: "medium" },
  ];

  const getNodeColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
      case "warning":
        return "bg-yellow-500/30 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]";
      case "healthy":
        return "bg-emerald-500/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]";
      default:
        return "bg-cyan-500/30 border-cyan-500";
    }
  };

  const getConnectionColor = (strength: string) => {
    switch (strength) {
      case "critical":
        return "stroke-red-500 stroke-[3]";
      case "strong":
        return "stroke-cyan-400 stroke-[2]";
      case "medium":
        return "stroke-cyan-400/60 stroke-[1.5]";
      case "weak":
        return "stroke-cyan-400/30 stroke-[1]";
      default:
        return "stroke-cyan-400/40 stroke-[1]";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Corporate Reflex Graph</h2>
          <p className="text-sm text-white/60 mt-1">Real-time interdependency analysis across all departments</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            1 Critical Path
          </Badge>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            2 Warnings
          </Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Zap className="w-3 h-3 mr-1" />
            Live Updating
          </Badge>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-8">
        <div className="relative w-full h-[500px]">
          <svg className="absolute inset-0 w-full h-full">
            {/* Draw connections */}
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  className={`${getConnectionColor(conn.strength)} animate-pulse`}
                  style={{
                    filter: "drop-shadow(0 0 8px currentColor)"
                  }}
                />
              );
            })}
          </svg>

          {/* Draw nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: node.x, top: node.y }}
            >
              <div className={`w-24 h-24 rounded-full border-2 ${getNodeColor(node.status)} flex items-center justify-center backdrop-blur-sm transition-all group-hover:scale-110`}>
                <Network className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                <div className="text-sm font-semibold text-white whitespace-nowrap">{node.name}</div>
                <div className="text-xs text-white/60 capitalize">{node.status}</div>
              </div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Card className="bg-black/90 border-cyan-500/30 p-3 min-w-[200px]">
                  <div className="text-xs space-y-1">
                    <div className="text-white font-semibold">{node.name} Department</div>
                    <div className="text-white/60">Status: <span className="capitalize text-white">{node.status}</span></div>
                    <div className="text-white/60">Impact: <span className="capitalize text-white">{node.impact}</span></div>
                    <div className="text-cyan-400 mt-2">Click for detailed analysis →</div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Connection Strength</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-12 h-[3px] bg-red-500" />
              <span className="text-white/70">Critical Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-[2px] bg-cyan-400" />
              <span className="text-white/70">Strong Dependency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-[1.5px] bg-cyan-400/60" />
              <span className="text-white/70">Medium Dependency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-[1px] bg-cyan-400/30" />
              <span className="text-white/70">Weak Dependency</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Node Status</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500" />
              <span className="text-white/70">Critical - Immediate attention required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500/30 border border-yellow-500" />
              <span className="text-white/70">Warning - Monitor closely</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500" />
              <span className="text-white/70">Healthy - Operating normally</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Current Insights</h3>
          <div className="space-y-2 text-xs text-white/70">
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>Product → Engineering shows critical bottleneck</span>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span>Marketing efficiency affecting Sales pipeline</span>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Operations and Finance showing strong alignment</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
