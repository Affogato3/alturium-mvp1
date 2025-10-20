import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConstellationNode {
  x: number;
  y: number;
  label: string;
  value: number;
  category: "finance" | "operations" | "marketing" | "hr" | "supply";
}

export const StrategicConstellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: ConstellationNode[] = [
      { x: 400, y: 300, label: "Finance", value: 92, category: "finance" },
      { x: 250, y: 200, label: "Marketing", value: 78, category: "marketing" },
      { x: 550, y: 200, label: "Operations", value: 85, category: "operations" },
      { x: 200, y: 400, label: "HR", value: 71, category: "hr" },
      { x: 600, y: 400, label: "Supply Chain", value: 88, category: "supply" },
      { x: 400, y: 150, label: "Sales", value: 94, category: "finance" },
      { x: 350, y: 450, label: "R&D", value: 82, category: "operations" },
    ];

    let animationFrame: number;
    let time = 0;

    const getCategoryColor = (category: string) => {
      switch (category) {
        case "finance":
          return { base: "rgba(0, 255, 200, ", accent: "#00ffc8" };
        case "operations":
          return { base: "rgba(100, 150, 255, ", accent: "#6496ff" };
        case "marketing":
          return { base: "rgba(255, 100, 200, ", accent: "#ff64c8" };
        case "hr":
          return { base: "rgba(255, 200, 100, ", accent: "#ffc864" };
        case "supply":
          return { base: "rgba(150, 100, 255, ", accent: "#9664ff" };
        default:
          return { base: "rgba(200, 200, 200, ", accent: "#c8c8c8" };
      }
    };

    const drawConnection = (n1: ConstellationNode, n2: ConstellationNode) => {
      const correlation = Math.random() * 0.5 + 0.3;
      const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
      gradient.addColorStop(0, `rgba(0, 255, 200, ${correlation * 0.3})`);
      gradient.addColorStop(0.5, `rgba(0, 255, 200, ${correlation * 0.5})`);
      gradient.addColorStop(1, `rgba(0, 255, 200, ${correlation * 0.3})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = correlation * 3;
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();

      // Flow particle
      const flowPos = (time * 0.3 + Math.random()) % 1;
      const particleX = n1.x + (n2.x - n1.x) * flowPos;
      const particleY = n1.y + (n2.y - n1.y) * flowPos;

      ctx.beginPath();
      ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 255, 200, 0.8)";
      ctx.fill();
    };

    const drawNode = (node: ConstellationNode) => {
      const colors = getCategoryColor(node.category);
      const pulse = Math.sin(time * 2) * 0.2 + 0.8;
      const size = (node.value / 100) * 30 * pulse;

      // Glow
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size);
      gradient.addColorStop(0, colors.base + "0.8)");
      gradient.addColorStop(0.5, colors.base + "0.4)");
      gradient.addColorStop(1, colors.base + "0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(node.x - size, node.y - size, size * 2, size * 2);

      // Core
      ctx.beginPath();
      ctx.arc(node.x, node.y, size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = colors.accent;
      ctx.fill();

      // Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y - size - 10);

      // Value
      ctx.fillStyle = colors.accent;
      ctx.font = "10px sans-serif";
      ctx.fillText(`${node.value}%`, node.x, node.y + size + 15);
    };

    const animate = () => {
      ctx.fillStyle = "rgba(11, 12, 16, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 300) {
            drawConnection(nodes[i], nodes[j]);
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => drawNode(node));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <Card className="relative h-full bg-black/40 backdrop-blur-sm border-primary/20 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-semibold text-white mb-2">
          Strategic Constellation
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Real-time department correlation map
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
            Finance
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            Operations
          </Badge>
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">
            Marketing
          </Badge>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
            HR
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            Supply
          </Badge>
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />
    </Card>
  );
};
