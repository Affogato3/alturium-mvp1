import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Zap, AlertTriangle, TrendingUp } from "lucide-react";

interface DataNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'financial' | 'operational' | 'iot' | 'market' | 'crm' | 'erp';
  impactScore: number;
  status: 'opportunity' | 'risk' | 'volatile' | 'normal';
  connections: string[];
  metadata: {
    size: string;
    lastUpdated: string;
    reliability: number;
  };
}

interface NodeWebVisualizerProps {
  onNodeClick: (node: DataNode) => void;
  selectedNode: DataNode | null;
}

export function NodeWebVisualizer({ onNodeClick, selectedNode }: NodeWebVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<DataNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate mock nodes
    const mockNodes: DataNode[] = [
      { id: '1', x: 300, y: 200, label: 'Finance ERP', type: 'erp', impactScore: 95, status: 'opportunity', connections: ['2', '3'], metadata: { size: '2.4GB', lastUpdated: '2min ago', reliability: 98 } },
      { id: '2', x: 500, y: 150, label: 'CRM Data', type: 'crm', impactScore: 88, status: 'normal', connections: ['1', '4'], metadata: { size: '1.8GB', lastUpdated: '5min ago', reliability: 96 } },
      { id: '3', x: 400, y: 350, label: 'Production IoT', type: 'iot', impactScore: 72, status: 'risk', connections: ['1', '5'], metadata: { size: '5.2GB', lastUpdated: 'live', reliability: 94 } },
      { id: '4', x: 700, y: 200, label: 'Market Feed', type: 'market', impactScore: 91, status: 'volatile', connections: ['2', '6'], metadata: { size: '800MB', lastUpdated: 'live', reliability: 99 } },
      { id: '5', x: 600, y: 400, label: 'Supply Chain', type: 'operational', impactScore: 85, status: 'normal', connections: ['3', '6'], metadata: { size: '1.2GB', lastUpdated: '10min ago', reliability: 95 } },
      { id: '6', x: 800, y: 350, label: 'Customer Analytics', type: 'financial', impactScore: 79, status: 'opportunity', connections: ['4', '5'], metadata: { size: '3.1GB', lastUpdated: '3min ago', reliability: 97 } },
      { id: '7', x: 200, y: 300, label: 'HR Systems', type: 'operational', impactScore: 65, status: 'normal', connections: ['1'], metadata: { size: '450MB', lastUpdated: '1h ago', reliability: 93 } },
      { id: '8', x: 550, y: 250, label: 'Inventory Sensors', type: 'iot', impactScore: 82, status: 'risk', connections: ['3', '5'], metadata: { size: '2.7GB', lastUpdated: 'live', reliability: 91 } },
    ];
    setNodes(mockNodes);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw connections first
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const targetNode = nodes.find(n => n.id === connId);
          if (targetNode) {
            const gradient = ctx.createLinearGradient(node.x, node.y, targetNode.x, targetNode.y);
            
            // Impact-based gradient
            const alpha = (node.impactScore + targetNode.impactScore) / 200;
            gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha * 0.3})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${alpha * 0.1})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        
        // Status-based colors
        let nodeColor = 'rgba(100, 100, 100, 0.8)';
        let glowColor = 'rgba(100, 100, 100, 0.3)';
        
        if (node.status === 'opportunity') {
          nodeColor = 'rgba(59, 130, 246, 0.9)';
          glowColor = 'rgba(59, 130, 246, 0.5)';
        } else if (node.status === 'risk') {
          nodeColor = 'rgba(239, 68, 68, 0.9)';
          glowColor = 'rgba(239, 68, 68, 0.5)';
        } else if (node.status === 'volatile') {
          nodeColor = 'rgba(251, 191, 36, 0.9)';
          glowColor = 'rgba(251, 191, 36, 0.5)';
        }

        // Draw glow effect
        if (isSelected || isHovered) {
          ctx.shadowBlur = 30;
          ctx.shadowColor = glowColor;
        }

        // Node size based on impact
        const baseSize = 8 + (node.impactScore / 100) * 12;
        const size = isSelected ? baseSize * 1.5 : isHovered ? baseSize * 1.2 : baseSize;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Pulse effect for live streams
        if (node.metadata.lastUpdated === 'live') {
          const pulseSize = size + Math.sin(Date.now() / 300) * 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.shadowBlur = 0;

        // Draw label on hover or select
        if (isSelected || isHovered) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y - size - 10);
        }
      });

      ctx.restore();
    };

    draw();
    const interval = setInterval(draw, 100);

    return () => clearInterval(interval);
  }, [nodes, hoveredNode, selectedNode, zoom, pan]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance < 20;
    });

    if (clickedNode) {
      onNodeClick(clickedNode);
    }
  };

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const hovered = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance < 20;
    });

    setHoveredNode(hovered || null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasHover}
        onWheel={handleWheel}
        className="w-full h-full cursor-pointer"
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-primary/20 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-white">Opportunity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-white">Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-white">Volatile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-xs text-white">Normal</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Badge 
          variant="outline" 
          className="bg-black/80 backdrop-blur-sm border-primary/20 cursor-pointer"
          onClick={() => setZoom(1)}
        >
          Reset Zoom
        </Badge>
        <Badge variant="outline" className="bg-black/80 backdrop-blur-sm border-primary/20">
          Zoom: {(zoom * 100).toFixed(0)}%
        </Badge>
      </div>
    </div>
  );
}
