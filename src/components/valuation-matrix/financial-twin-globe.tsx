import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Globe2, TrendingUp, TrendingDown } from "lucide-react";

interface FinancialTwinGlobeProps {
  fullscreen?: boolean;
}

export function FinancialTwinGlobe({ fullscreen = false }: FinancialTwinGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeConnections, setActiveConnections] = useState(1247);
  const [marketPulse, setMarketPulse] = useState(98.4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let rotation = 0;
    const nodes: Array<{ x: number; y: number; size: number; color: string; pulse: number }> = [];
    
    // Generate network nodes
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? "#3b82f6" : "#10b981",
        pulse: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      rotation += 0.001;

      // Draw connections
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        node.pulse += 0.05;
        const pulseSize = Math.sin(node.pulse) * 2;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Move nodes slightly
        node.x += Math.sin(rotation + node.pulse) * 0.2;
        node.y += Math.cos(rotation + node.pulse) * 0.2;

        // Wrap around edges
        if (node.x < 0) node.x = canvas.offsetWidth;
        if (node.x > canvas.offsetWidth) node.x = 0;
        if (node.y < 0) node.y = canvas.offsetHeight;
        if (node.y > canvas.offsetHeight) node.y = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Update stats
    const interval = setInterval(() => {
      setActiveConnections(prev => prev + Math.floor(Math.random() * 10 - 5));
      setMarketPulse(prev => Math.max(90, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">3D Financial Twin</h3>
            <p className="text-sm text-muted-foreground">Global Market Network</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {activeConnections.toLocaleString()} Connections
          </Badge>
        </div>
      </div>

      <div className={`relative ${fullscreen ? 'h-[600px]' : 'h-[300px]'} rounded-lg bg-gradient-to-br from-background to-primary/5 border border-primary/20 overflow-hidden`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)" }}
        />
        
        <div className="absolute top-4 right-4 space-y-2">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground">Market Pulse</p>
            <p className="text-xl font-bold text-primary">{marketPulse.toFixed(1)}%</p>
          </div>
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground">Sync Rate</p>
            <p className="text-xl font-bold text-success">99.7%</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {["Americas", "Europe", "Asia", "Africa"].map((region, i) => (
            <Badge key={i} variant="outline" className="bg-card/90 backdrop-blur-sm">
              {region}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
