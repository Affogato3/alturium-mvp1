import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FieldNode {
  x: number;
  y: number;
  z: number;
  height: number;
  label: string;
  type: "profit" | "cost" | "inefficiency";
  value: number;
}

export const EnterpriseField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0.5, y: 0 });
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

    // Generate field nodes (profit centers and inefficiency valleys)
    const nodes: FieldNode[] = [
      { x: 0, y: 120, z: 0, height: 120, label: "Sales", type: "profit", value: 2.4 },
      { x: -100, y: 80, z: 50, height: 80, label: "Marketing", type: "profit", value: 1.8 },
      { x: 100, y: 90, z: -30, height: 90, label: "Product", type: "profit", value: 2.1 },
      { x: -80, y: -40, z: -50, height: 40, label: "APAC Ops", type: "inefficiency", value: -0.6 },
      { x: 60, y: 70, z: 80, height: 70, label: "R&D", type: "profit", value: 1.5 },
      { x: -40, y: -30, z: 20, height: 30, label: "Legacy IT", type: "inefficiency", value: -0.4 },
    ];

    let animationFrame: number;
    let time = 0;

    const project3D = (x: number, y: number, z: number) => {
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = 300 / (300 + z2);
      return {
        x: centerX + x1 * scale,
        y: centerY - y1 * scale,
        scale,
        z: z2,
      };
    };

    const drawFieldNode = (node: FieldNode) => {
      const basePos = project3D(node.x, 0, node.z);
      const topPos = project3D(node.x, node.height, node.z);

      // Draw pillar
      const gradient = ctx.createLinearGradient(
        basePos.x,
        basePos.y,
        topPos.x,
        topPos.y
      );

      if (node.type === "profit") {
        gradient.addColorStop(0, "rgba(0, 255, 200, 0.1)");
        gradient.addColorStop(1, "rgba(0, 255, 200, 0.8)");
      } else {
        gradient.addColorStop(0, "rgba(255, 100, 100, 0.1)");
        gradient.addColorStop(1, "rgba(255, 100, 100, 0.6)");
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 20 * basePos.scale;
      ctx.beginPath();
      ctx.moveTo(basePos.x, basePos.y);
      ctx.lineTo(topPos.x, topPos.y);
      ctx.stroke();

      // Draw top glow
      const glowSize = 30 * topPos.scale;
      const glowGradient = ctx.createRadialGradient(
        topPos.x,
        topPos.y,
        0,
        topPos.x,
        topPos.y,
        glowSize
      );

      if (node.type === "profit") {
        glowGradient.addColorStop(0, "rgba(0, 255, 200, 0.8)");
        glowGradient.addColorStop(1, "rgba(0, 255, 200, 0)");
      } else {
        glowGradient.addColorStop(0, "rgba(255, 100, 100, 0.8)");
        glowGradient.addColorStop(1, "rgba(255, 100, 100, 0)");
      }

      ctx.fillStyle = glowGradient;
      ctx.fillRect(
        topPos.x - glowSize,
        topPos.y - glowSize,
        glowSize * 2,
        glowSize * 2
      );

      return { basePos, topPos };
    };

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(100, 100, 100, 0.15)";
      ctx.lineWidth = 1;

      for (let i = -200; i <= 200; i += 50) {
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
    };

    const animate = () => {
      ctx.fillStyle = "rgba(11, 12, 16, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      drawGrid();

      // Sort nodes by depth
      const sortedNodes = [...nodes].sort((a, b) => {
        const zA = project3D(a.x, a.y, a.z).z;
        const zB = project3D(b.x, b.y, b.z).z;
        return zB - zA;
      });

      sortedNodes.forEach((node) => drawFieldNode(node));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [rotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      setRotation((prev) => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01,
      }));
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Card className="relative h-full bg-black/40 backdrop-blur-sm border-primary/20 overflow-hidden">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Badge variant="outline" className="bg-black/80 border-cyan-500/50 text-cyan-400">
          <TrendingUp className="w-3 h-3 mr-1" />
          Profit Centers
        </Badge>
        <Badge variant="outline" className="bg-black/80 border-red-500/50 text-red-400">
          <TrendingDown className="w-3 h-3 mr-1" />
          Inefficiencies
        </Badge>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-primary/40">
        Drag to rotate the enterprise field
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </Card>
  );
};
