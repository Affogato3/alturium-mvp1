import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface LiquidityField3DProps {
  timelinePosition: number;
}

export function LiquidityField3D({ timelinePosition }: LiquidityField3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [efficiency, setEfficiency] = useState(87.3);
  const [capitalPressure, setCapitalPressure] = useState(142.8);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const gridSize = 40;
    const cellSize = canvas.offsetWidth / gridSize;
    let rotation = 0;
    let heightMap: number[][] = [];

    // Initialize height map
    for (let i = 0; i < gridSize; i++) {
      heightMap[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const distance = Math.sqrt(Math.pow(i - gridSize/2, 2) + Math.pow(j - gridSize/2, 2));
        heightMap[i][j] = Math.sin(distance * 0.2 + timelinePosition * 0.1) * 30 + Math.random() * 10;
      }
    }

    const animate = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      rotation += 0.002;

      // Update height map based on timeline
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const distance = Math.sqrt(Math.pow(i - gridSize/2, 2) + Math.pow(j - gridSize/2, 2));
          heightMap[i][j] = Math.sin(distance * 0.2 + timelinePosition * 0.1 + rotation * 5) * 30 + 
                           Math.cos(i * 0.3 + timelinePosition * 0.05) * 15;
        }
      }

      // Draw 3D grid
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const scale = 8;

      for (let i = 0; i < gridSize - 1; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
          const x1 = (i - gridSize/2) * scale;
          const y1 = (j - gridSize/2) * scale;
          const z1 = heightMap[i][j];

          const x2 = (i + 1 - gridSize/2) * scale;
          const y2 = (j - gridSize/2) * scale;
          const z2 = heightMap[i + 1][j];

          const x3 = (i - gridSize/2) * scale;
          const y3 = (j + 1 - gridSize/2) * scale;
          const z3 = heightMap[i][j + 1];

          // Simple 3D projection
          const rotatedX1 = x1 * Math.cos(rotation) - y1 * Math.sin(rotation);
          const rotatedY1 = x1 * Math.sin(rotation) + y1 * Math.cos(rotation);
          
          const rotatedX2 = x2 * Math.cos(rotation) - y2 * Math.sin(rotation);
          const rotatedY2 = x2 * Math.sin(rotation) + y2 * Math.cos(rotation);
          
          const rotatedX3 = x3 * Math.cos(rotation) - y3 * Math.sin(rotation);
          const rotatedY3 = x3 * Math.sin(rotation) + y3 * Math.cos(rotation);

          const screenX1 = centerX + rotatedX1;
          const screenY1 = centerY + rotatedY1 - z1;
          
          const screenX2 = centerX + rotatedX2;
          const screenY2 = centerY + rotatedY2 - z2;
          
          const screenX3 = centerX + rotatedX3;
          const screenY3 = centerY + rotatedY3 - z3;

          // Color based on height (profit density)
          const normalizedHeight = (z1 + 50) / 100;
          let color;
          if (normalizedHeight > 0.6) {
            color = `rgba(16, 185, 129, ${0.3 + normalizedHeight * 0.4})`; // Emerald green for profit
          } else if (normalizedHeight < 0.3) {
            color = `rgba(239, 68, 68, ${0.3 + (1 - normalizedHeight) * 0.4})`; // Crimson for risk
          } else {
            color = `rgba(34, 211, 238, ${0.2 + normalizedHeight * 0.3})`; // Cyan for neutral
          }

          ctx.beginPath();
          ctx.moveTo(screenX1, screenY1);
          ctx.lineTo(screenX2, screenY2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(screenX1, screenY1);
          ctx.lineTo(screenX3, screenY3);
          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Update metrics
    const metricsInterval = setInterval(() => {
      setEfficiency(prev => Math.max(75, Math.min(95, prev + (Math.random() - 0.5) * 2)));
      setCapitalPressure(prev => Math.max(100, Math.min(200, prev + (Math.random() - 0.5) * 5)));
    }, 3000);

    return () => clearInterval(metricsInterval);
  }, [timelinePosition]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Overlay metrics */}
      <div className="absolute top-4 left-4 space-y-2">
        <Badge variant="outline" className="bg-black/80 backdrop-blur-sm border-[hsl(var(--cnl-profit))]">
          <span className="text-[hsl(var(--cnl-profit))]">Efficiency: {efficiency.toFixed(1)}%</span>
        </Badge>
        <Badge variant="outline" className="bg-black/80 backdrop-blur-sm border-[hsl(var(--cnl-flow))]">
          <span className="text-[hsl(var(--cnl-flow))]">Capital Pressure: ${capitalPressure.toFixed(1)}M</span>
        </Badge>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-3 text-xs">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded border border-border">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--cnl-profit))]" />
          <span className="text-muted-foreground">High Yield</span>
        </div>
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded border border-border">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--cnl-flow))]" />
          <span className="text-muted-foreground">Stable</span>
        </div>
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded border border-border">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--cnl-risk))]" />
          <span className="text-muted-foreground">Trapped Capital</span>
        </div>
      </div>
    </div>
  );
}
