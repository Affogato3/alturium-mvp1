import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RiskNode {
  x: number;
  y: number;
  severity: number;
  source: string;
  magnitude: number;
  color: string;
}

interface QuantumRiskMeshProps {
  fullscreen?: boolean;
}

export function QuantumRiskMesh({ fullscreen = false }: QuantumRiskMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [riskNodes, setRiskNodes] = useState<RiskNode[]>([]);
  const [overallRisk, setOverallRisk] = useState(2.4);
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, severity: "low", message: "Liquidity contraction in crypto derivatives, 7.4σ deviation", time: "2m ago" },
    { id: 2, severity: "medium", message: "Regulatory stress detected in EU banking sector", time: "5m ago" },
    { id: 3, severity: "low", message: "Counterparty risk elevation: +0.3% in Asian markets", time: "8m ago" },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Initialize risk nodes
    const nodes: RiskNode[] = [];
    for (let i = 0; i < 30; i++) {
      const severity = Math.random();
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        severity,
        source: ["Market", "Liquidity", "Credit", "Operational", "Regulatory"][Math.floor(Math.random() * 5)],
        magnitude: Math.random() * 10,
        color: severity > 0.7 ? "#ef4444" : severity > 0.4 ? "#f59e0b" : "#3b82f6",
      });
    }
    setRiskNodes(nodes);

    let time = 0;
    let animationId: number;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      time += 0.01;

      // Draw mesh connections
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw risk waves
      nodes.forEach((node, i) => {
        // Update position
        node.x += Math.sin(time + i) * 0.5;
        node.y += Math.cos(time + i * 0.7) * 0.5;

        // Wrap around edges
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Draw ripple effect
        const rippleRadius = 30 + Math.sin(time * 2 + i) * 10;
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, rippleRadius);
        gradient.addColorStop(0, node.color + "40");
        gradient.addColorStop(1, node.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, rippleRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3 + node.severity * 3, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Update overall risk
      setOverallRisk(prev => Math.max(0.5, Math.min(10, prev + (Math.random() - 0.5) * 0.2)));

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card border-primary/20 backdrop-blur-sm ${fullscreen ? 'h-auto' : 'h-full'}`}>
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      <div className="relative p-4 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border/50">
          <div className="p-2 rounded-lg bg-primary/20 animate-pulse">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Quantum Risk Mesh</h3>
            <p className="text-sm text-muted-foreground">Real-Time Stress Topology</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-background/50 border border-border/30">
            <p className="text-xs text-muted-foreground">Overall Risk</p>
            <p className={`text-2xl font-bold ${overallRisk > 7 ? 'text-danger' : overallRisk > 4 ? 'text-warning' : 'text-success'}`}>
              {overallRisk.toFixed(1)}/10
            </p>
          </div>
          <div className="p-3 rounded-lg bg-background/50 border border-border/30">
            <p className="text-xs text-muted-foreground">Active Alerts</p>
            <p className="text-2xl font-bold text-primary">{activeAlerts.length}</p>
          </div>
        </div>

        <div className={`relative rounded-lg bg-gradient-to-br from-background to-primary/5 border border-primary/20 overflow-hidden ${fullscreen ? 'h-[500px]' : 'h-[300px]'}`}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)" }}
          />

          <div className="absolute top-2 right-2 space-y-1">
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-danger"></div>
              <span className="text-muted-foreground">High Risk</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              <span className="text-muted-foreground">Medium Risk</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-muted-foreground">Low Risk</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Active Risk Signals
          </h4>
          <ScrollArea className={fullscreen ? "h-[300px]" : "h-[200px]"}>
            <div className="space-y-2">
              {activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-2 ${
                    alert.severity === "high"
                      ? "bg-danger/5 border-danger/30"
                      : alert.severity === "medium"
                      ? "bg-warning/5 border-warning/30"
                      : "bg-primary/5 border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {alert.severity === "high" && <AlertTriangle className="w-4 h-4 text-danger" />}
                      {alert.severity === "medium" && <Zap className="w-4 h-4 text-warning" />}
                      {alert.severity === "low" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      <Badge
                        variant="outline"
                        className={
                          alert.severity === "high"
                            ? "bg-danger/10 text-danger border-danger/20"
                            : alert.severity === "medium"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}
