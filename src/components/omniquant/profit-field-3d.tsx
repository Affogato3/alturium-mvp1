import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe2, Play, Pause, RotateCcw, Maximize2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Node {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  pulse: number;
  label: string;
  roi: number;
  volatility: number;
  risk: number;
}

export function ProfitField3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(500);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [globalProfit, setGlobalProfit] = useState(847.3);

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
    const centerX = width / 2;
    const centerY = height / 2;

    // Create 3D network nodes
    const nodes: Node[] = [];
    const sectors = [
      { label: "Tech", color: "#3b82f6", roi: 23.4 },
      { label: "Energy", color: "#10b981", roi: 18.7 },
      { label: "Finance", color: "#f59e0b", roi: 15.2 },
      { label: "Healthcare", color: "#ef4444", roi: 21.1 },
      { label: "Crypto", color: "#8b5cf6", roi: 42.3 },
      { label: "Commodities", color: "#06b6d4", roi: 12.8 },
    ];

    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 150 + Math.random() * 100;
      
      const sector = sectors[i % sectors.length];
      
      nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: Math.random() * 4 + 3,
        color: sector.color,
        pulse: Math.random() * Math.PI * 2,
        label: sector.label,
        roi: sector.roi + (Math.random() - 0.5) * 10,
        volatility: Math.random() * 30,
        risk: Math.random() * 10,
      });
    }

    let animRotation = { x: rotation.x, y: rotation.y };
    let animationId: number;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        animRotation.y += 0.002;
      }

      // Update profit simulation
      setGlobalProfit(prev => prev + (Math.random() - 0.48) * 5);

      // Sort nodes by z-depth for proper rendering
      const sortedNodes = nodes
        .map(node => {
          const rotatedX = node.x * Math.cos(animRotation.y) - node.z * Math.sin(animRotation.y);
          const rotatedZ = node.x * Math.sin(animRotation.y) + node.z * Math.cos(animRotation.y);
          const rotatedY = node.y * Math.cos(animRotation.x) - rotatedZ * Math.sin(animRotation.x);
          const finalZ = node.y * Math.sin(animRotation.x) + rotatedZ * Math.cos(animRotation.x);

          return { ...node, rotatedX, rotatedY, finalZ };
        })
        .sort((a, b) => a.finalZ - b.finalZ);

      // Draw connections
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 0.5;
      sortedNodes.forEach((node, i) => {
        sortedNodes.slice(i + 1, i + 4).forEach(otherNode => {
          const dx = otherNode.rotatedX - node.rotatedX;
          const dy = otherNode.rotatedY - node.rotatedY;
          const dz = otherNode.finalZ - node.finalZ;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 150) {
            const scale1 = zoom / (zoom + node.finalZ);
            const scale2 = zoom / (zoom + otherNode.finalZ);
            const x1 = centerX + node.rotatedX * scale1;
            const y1 = centerY + node.rotatedY * scale1;
            const x2 = centerX + otherNode.rotatedX * scale2;
            const y2 = centerY + otherNode.rotatedY * scale2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      sortedNodes.forEach(node => {
        node.pulse += 0.05;
        const pulseSize = Math.sin(node.pulse) * 2;
        const scale = zoom / (zoom + node.finalZ);
        const x = centerX + node.rotatedX * scale;
        const y = centerY + node.rotatedY * scale;
        const size = (node.size + pulseSize) * scale;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, node.color + "80");
        gradient.addColorStop(1, node.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        animRotation.x += e.movementY * 0.01;
        animRotation.y += e.movementX * 0.01;
        setRotation(animRotation);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPlaying, rotation, zoom]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background border-primary/30 backdrop-blur-sm">
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      <div className="relative p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Globe2 className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">3D Global Profit Field</h3>
              <p className="text-sm text-muted-foreground">Quantum Financial Network</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <span className="font-mono">${globalProfit.toFixed(1)}B</span>
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              60 Nodes
            </Badge>
          </div>
        </div>

        <div className="relative h-[600px] rounded-lg bg-gradient-to-br from-background to-primary/5 border border-primary/20 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            style={{ 
              background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)" 
            }}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-card/90 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRotation({ x: 0, y: 0 })}
              className="bg-card/90 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-card/90 backdrop-blur-sm"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom Control */}
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">Zoom</span>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              min={300}
              max={800}
              step={10}
              className="w-32"
            />
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground">Profit Velocity</p>
              <p className="text-xl font-bold text-success">+23.4%</p>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground">Risk Equilibrium</p>
              <p className="text-xl font-bold text-primary">Stable</p>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground">AI Confidence</p>
              <p className="text-xl font-bold text-accent">94.2%</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          💡 Click and drag to rotate • Scroll to zoom • Each node represents a profit cluster
        </div>
      </div>
    </Card>
  );
}
