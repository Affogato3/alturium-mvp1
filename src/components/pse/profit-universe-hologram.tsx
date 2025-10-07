import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle } from "lucide-react";

interface ProfitNode {
  x: number;
  y: number;
  z: number;
  profit: number;
  volatility: number;
  label: string;
  type: "peak" | "valley" | "singularity";
}

export const ProfitUniverseHologram = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<ProfitNode | null>(null);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0 });
  const [zoom, setZoom] = useState(1.5);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Generate profit nodes
    const nodes: ProfitNode[] = [
      { x: 0, y: 0, z: 0, profit: 97.3, volatility: 0.12, label: "Singularity Point", type: "singularity" },
      { x: 100, y: -50, z: 30, profit: 84.2, volatility: 0.25, label: "Marketing Peak", type: "peak" },
      { x: -80, y: 60, z: -20, profit: 78.5, volatility: 0.18, label: "Supply Chain Peak", type: "peak" },
      { x: 60, y: 80, z: 50, profit: 72.1, volatility: 0.31, label: "R&D Peak", type: "peak" },
      { x: -100, y: -60, z: -40, profit: 45.3, volatility: 0.52, label: "Risk Valley", type: "valley" },
      { x: 40, y: -80, z: -30, profit: 38.7, volatility: 0.65, label: "Volatility Valley", type: "valley" },
    ];

    let animationFrame: number;
    let time = 0;

    const project3D = (x: number, y: number, z: number) => {
      // Rotate around Y axis
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const scale = zoom * (200 / (200 + z2));
      return {
        x: centerX + x1 * scale,
        y: centerY + y1 * scale,
        scale,
        z: z2,
      };
    };

    const drawNode = (node: ProfitNode) => {
      const pos = project3D(node.x, node.y, node.z);
      
      let gradient;
      let baseColor;
      let size;

      if (node.type === "singularity") {
        size = 25 * pos.scale;
        gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
        gradient.addColorStop(0, "rgba(255, 215, 0, 1)");
        gradient.addColorStop(0.5, "rgba(255, 215, 0, 0.6)");
        gradient.addColorStop(1, "rgba(255, 215, 0, 0)");
      } else if (node.type === "peak") {
        size = 15 * pos.scale;
        gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
        gradient.addColorStop(0, "rgba(0, 255, 255, 0.9)");
        gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.4)");
        gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
      } else {
        size = 12 * pos.scale;
        gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
        gradient.addColorStop(0, "rgba(255, 100, 100, 0.8)");
        gradient.addColorStop(0.5, "rgba(255, 100, 100, 0.3)");
        gradient.addColorStop(1, "rgba(255, 100, 100, 0)");
      }

      // Draw glow
      ctx.fillStyle = gradient;
      ctx.fillRect(pos.x - size, pos.y - size, size * 2, size * 2);

      // Draw core
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = node.type === "singularity" ? "#FFD700" : 
                      node.type === "peak" ? "#00FFFF" : "#FF6464";
      ctx.fill();

      // Pulsing effect for singularity
      if (node.type === "singularity") {
        const pulse = Math.sin(time * 3) * 0.5 + 0.5;
        ctx.globalAlpha = pulse * 0.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      return pos;
    };

    const drawConnection = (node1: ProfitNode, node2: ProfitNode) => {
      const pos1 = project3D(node1.x, node1.y, node1.z);
      const pos2 = project3D(node2.x, node2.y, node2.z);

      const gradient = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
      gradient.addColorStop(0, "rgba(0, 255, 255, 0.1)");
      gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0.1)");

      ctx.beginPath();
      ctx.moveTo(pos1.x, pos1.y);
      ctx.lineTo(pos2.x, pos2.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Flow particles
      const flowPos = (time * 0.5) % 1;
      const particleX = pos1.x + (pos2.x - pos1.x) * flowPos;
      const particleY = pos1.y + (pos2.y - pos1.y) * flowPos;

      ctx.beginPath();
      ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(11, 12, 16, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      // Draw grid
      ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = -200; i <= 200; i += 40) {
        const p1 = project3D(-200, 0, i);
        const p2 = project3D(200, 0, i);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project3D(i, 0, -200);
        const p4 = project3D(i, 0, 200);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // Draw connections
      const singularity = nodes[0];
      nodes.slice(1).forEach(node => {
        drawConnection(singularity, node);
      });

      // Sort nodes by depth
      const sortedNodes = [...nodes].sort((a, b) => {
        const zA = project3D(a.x, a.y, a.z).z;
        const zB = project3D(b.x, b.y, b.z).z;
        return zB - zA;
      });

      // Draw nodes
      sortedNodes.forEach(node => drawNode(node));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [rotation, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01,
      }));
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(3, prev - e.deltaY * 0.001)));
  };

  return (
    <Card className="relative h-full bg-black/40 backdrop-blur-sm border-primary/20 overflow-hidden">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Badge variant="outline" className="bg-black/50 border-[#FFD700]/50">
          <div className="w-2 h-2 rounded-full bg-[#FFD700] mr-2" />
          Singularity Point
        </Badge>
        <Badge variant="outline" className="bg-black/50 border-[#00FFFF]/50">
          <div className="w-2 h-2 rounded-full bg-[#00FFFF] mr-2" />
          Profit Peak
        </Badge>
        <Badge variant="outline" className="bg-black/50 border-[#FF6464]/50">
          <div className="w-2 h-2 rounded-full bg-[#FF6464] mr-2" />
          Risk Valley
        </Badge>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-primary/40">
        Drag to rotate • Scroll to zoom
      </div>

      {/* Status */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Badge className="bg-primary/20 text-primary border-primary/40">
          <TrendingUp className="w-3 h-3 mr-1" />
          Profit: 97.3%
        </Badge>
        <Badge className="bg-primary/10 text-primary/60 border-primary/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Volatility: 0.12
        </Badge>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </Card>
  );
};
