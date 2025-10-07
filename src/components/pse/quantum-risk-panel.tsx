import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Shield, AlertTriangle, TrendingUp } from "lucide-react";

interface RiskZone {
  id: string;
  sector: string;
  exposure: number;
  hedged: boolean;
  correlation: number;
  volatility: number;
  type: "market" | "operational" | "geopolitical" | "liquidity";
}

export const QuantumRiskPanel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [autoHedge, setAutoHedge] = useState(true);
  const [globalStability, setGlobalStability] = useState(72.4);
  const [riskZones] = useState<RiskZone[]>([
    { id: "MKT-01", sector: "Energy", exposure: 8.4, hedged: true, correlation: -0.63, volatility: 0.42, type: "market" },
    { id: "OPS-03", sector: "Supply Chain", exposure: 12.1, hedged: true, correlation: 0.28, volatility: 0.31, type: "operational" },
    { id: "GEO-07", sector: "Asia-Pacific", exposure: 5.7, hedged: false, correlation: 0.45, volatility: 0.67, type: "geopolitical" },
    { id: "LIQ-02", sector: "Credit Markets", exposure: 15.3, hedged: true, correlation: -0.12, volatility: 0.28, type: "liquidity" },
    { id: "MKT-05", sector: "Technology", exposure: 9.8, hedged: false, correlation: 0.72, volatility: 0.53, type: "market" },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    let nodes: { x: number; y: number; vx: number; vy: number; risk: number }[] = [];
    
    // Initialize mesh nodes
    for (let i = 0; i < 30; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        risk: Math.random(),
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.fillStyle = "rgba(11, 12, 16, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Draw connections to nearby nodes
        nodes.forEach((other, j) => {
          if (i >= j) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.3;
            const riskLevel = (node.risk + other.risk) / 2;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = riskLevel > 0.6 
              ? `rgba(255, 100, 100, ${alpha})` 
              : `rgba(0, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Draw node
        const nodeSize = 3 + node.risk * 3;
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize * 2);
        
        if (node.risk > 0.6) {
          gradient.addColorStop(0, "rgba(255, 100, 100, 0.8)");
          gradient.addColorStop(1, "rgba(255, 100, 100, 0)");
        } else {
          gradient.addColorStop(0, "rgba(0, 255, 255, 0.6)");
          gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing effect for high-risk nodes
        if (node.risk > 0.7) {
          const pulse = Math.sin(time * 4) * 0.5 + 0.5;
          ctx.globalAlpha = pulse * 0.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize * 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 100, 100, 0.8)";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalStability((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(50, Math.min(95, prev + delta));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: RiskZone["type"]) => {
    switch (type) {
      case "market": return "text-cyan-400 border-cyan-400/40";
      case "operational": return "text-yellow-400 border-yellow-400/40";
      case "geopolitical": return "text-red-400 border-red-400/40";
      case "liquidity": return "text-purple-400 border-purple-400/40";
    }
  };

  return (
    <Card className="h-full bg-black/40 backdrop-blur-sm border-primary/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-white">Quantum Risk Mesh</h3>
      </div>

      {/* Stability Gauge */}
      <div className="mb-3 p-3 bg-black/60 rounded-lg border border-primary/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-primary/60">Global Stability Index</span>
          <Badge className={globalStability > 70 ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"}>
            {globalStability.toFixed(1)}%
          </Badge>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              globalStability > 70 ? "bg-green-400" : "bg-red-400"
            }`}
            style={{ width: `${globalStability}%` }}
          />
        </div>
      </div>

      {/* Volatility Mesh Visualization */}
      <div className="mb-3 bg-black/60 rounded-lg border border-primary/10 overflow-hidden">
        <canvas ref={canvasRef} className="w-full" />
      </div>

      {/* Auto-Hedge Toggle */}
      <div className="flex items-center justify-between mb-3 p-3 bg-black/60 rounded-lg border border-primary/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs text-white">Risk Reflex Protocol</span>
        </div>
        <Switch checked={autoHedge} onCheckedChange={setAutoHedge} />
      </div>

      {/* Risk Zones */}
      <ScrollArea className="h-[calc(100%-350px)]">
        <div className="space-y-2">
          {riskZones.map((zone) => (
            <Card
              key={zone.id}
              className="bg-black/60 border border-primary/10 p-2 hover:bg-black/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-xs font-bold text-white">{zone.sector}</div>
                  <div className="text-xs text-primary/40">{zone.id}</div>
                </div>
                <Badge variant="outline" className={`text-xs ${getTypeColor(zone.type)}`}>
                  {zone.type.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-primary/40">Exposure:</span>
                  <span className="text-primary">{zone.exposure}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/40">Hedged:</span>
                  <span className={zone.hedged ? "text-green-400" : "text-red-400"}>
                    {zone.hedged ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/40">Correlation:</span>
                  <span className="text-primary">{zone.correlation.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary/40">Volatility:</span>
                  <Badge variant="outline" className={zone.volatility > 0.5 ? "text-red-400 border-red-400/40" : "text-green-400 border-green-400/40"}>
                    {zone.volatility.toFixed(2)}
                  </Badge>
                </div>
              </div>

              {zone.volatility > 0.5 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-primary/20 text-xs"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Mitigate Risk
                </Button>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
