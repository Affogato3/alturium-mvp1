import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Node {
  id: string;
  symbol: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  type: 'stock' | 'commodity' | 'index' | 'rate' | 'kpi';
  volatility: number;
  strength: number;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
  type: 'supply_chain' | 'sector' | 'macro' | 'sentiment';
}

export function QuantumCorrelationGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(400);
  const { toast } = useToast();
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[QuantumCorrelationGraph] No active session, skipping fetch');
        return;
      }
      await fetchGraphData();
    };

    initializeGraph();
    checkAuthAndFetch();
    
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchGraphData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeGraph = () => {
    // Initialize with portfolio holdings
    const initialNodes: Node[] = [
      { id: 'AAPL', symbol: 'AAPL', x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, type: 'stock', volatility: 0.25, strength: 1.0 },
      { id: 'MSFT', symbol: 'MSFT', x: 100, y: 50, z: -50, vx: 0, vy: 0, vz: 0, type: 'stock', volatility: 0.22, strength: 0.9 },
      { id: 'GOOGL', symbol: 'GOOGL', x: -80, y: -60, z: 40, vx: 0, vy: 0, vz: 0, type: 'stock', volatility: 0.28, strength: 0.85 },
      { id: 'TSLA', symbol: 'TSLA', x: 120, y: -40, z: 80, vx: 0, vy: 0, vz: 0, type: 'stock', volatility: 0.45, strength: 0.75 },
      { id: 'SPY', symbol: 'SPY', x: 50, y: 100, z: 20, vx: 0, vy: 0, vz: 0, type: 'index', volatility: 0.15, strength: 0.95 },
      { id: 'GOLD', symbol: 'GOLD', x: -100, y: 80, z: -30, vx: 0, vy: 0, vz: 0, type: 'commodity', volatility: 0.18, strength: 0.70 },
      { id: 'USD', symbol: 'USD', x: 0, y: -100, z: -60, vx: 0, vy: 0, vz: 0, type: 'rate', volatility: 0.10, strength: 0.80 },
      { id: 'REVENUE', symbol: 'Revenue KPI', x: -50, y: 60, z: 90, vx: 0, vy: 0, vz: 0, type: 'kpi', volatility: 0.12, strength: 0.65 },
    ];

    const initialEdges: Edge[] = [
      { from: 'AAPL', to: 'MSFT', weight: 0.85, type: 'sector' },
      { from: 'AAPL', to: 'GOOGL', weight: 0.78, type: 'sector' },
      { from: 'TSLA', to: 'SPY', weight: 0.65, type: 'macro' },
      { from: 'GOLD', to: 'USD', weight: -0.72, type: 'macro' },
      { from: 'REVENUE', to: 'AAPL', weight: 0.60, type: 'sentiment' },
      { from: 'MSFT', to: 'GOOGL', weight: 0.82, type: 'sector' },
      { from: 'SPY', to: 'AAPL', weight: 0.90, type: 'macro' },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const fetchGraphData = async () => {
    try {
      const { data: correlationNodes } = await supabase
        .from('correlation_nodes')
        .select('*')
        .limit(20);

      const { data: correlationEdges } = await supabase
        .from('correlation_edges')
        .select('*')
        .limit(50);

      if (correlationNodes && correlationNodes.length > 0) {
        const mappedNodes: Node[] = correlationNodes.map(node => ({
          id: node.symbol,
          symbol: node.symbol,
          x: Number(node.position_x),
          y: Number(node.position_y),
          z: Number(node.position_z),
          vx: 0,
          vy: 0,
          vz: 0,
          type: node.node_type as any,
          volatility: Number(node.volatility) || 0.2,
          strength: Number(node.strength) || 0.8,
        }));
        setNodes(mappedNodes);
      }

      if (correlationEdges) {
        // Map edges using node IDs
        setEdges(correlationEdges.map(edge => ({
          from: edge.from_node_id,
          to: edge.to_node_id,
          weight: Number(edge.correlation_value),
          type: edge.edge_type as any,
        })));
      }
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const project3D = (node: Node) => {
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      // Rotate around Y axis
      let x = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;

      // Rotate around X axis
      const y = node.y * cosX - z1 * sinX;
      const z = node.y * sinX + z1 * cosX;

      // Perspective projection
      const scale = zoom / (zoom + z);
      return {
        x: x * scale + width / 2,
        y: y * scale + height / 2,
        scale: scale,
        z: z,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(0, 230, 246, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath();
        const start = project3D({ ...nodes[0], x: i * 50, y: 0, z: -250 });
        const end = project3D({ ...nodes[0], x: i * 50, y: 0, z: 250 });
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }

      // Sort nodes by Z for proper rendering
      const sortedNodes = [...nodes].sort((a, b) => {
        const posA = project3D(a);
        const posB = project3D(b);
        return posB.z - posA.z;
      });

      // Draw edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const from2D = project3D(fromNode);
        const to2D = project3D(toNode);

        const opacity = Math.abs(edge.weight) * 0.6;
        const color = edge.weight > 0 ? `rgba(67, 255, 107, ${opacity})` : `rgba(255, 51, 102, ${opacity})`;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.abs(edge.weight) * 2;
        ctx.beginPath();
        ctx.moveTo(from2D.x, from2D.y);
        ctx.lineTo(to2D.x, to2D.y);
        ctx.stroke();

        // Animated flow particles
        const t = (Date.now() / 1000) % 1;
        const particleX = from2D.x + (to2D.x - from2D.x) * t;
        const particleY = from2D.y + (to2D.y - from2D.y) * t;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      sortedNodes.forEach(node => {
        const pos = project3D(node);
        const size = 8 * pos.scale;

        // Glow effect for high volatility
        if (node.volatility > 0.3) {
          const glowSize = size * (1 + Math.sin(Date.now() / 300) * 0.3);
          const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowSize * 2);
          gradient.addColorStop(0, 'rgba(255, 51, 102, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 51, 102, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, glowSize * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node color by type
        let nodeColor = '#00E6F6'; // stock
        if (node.type === 'commodity') nodeColor = '#FFA500';
        if (node.type === 'index') nodeColor = '#43FF6B';
        if (node.type === 'rate') nodeColor = '#FF3366';
        if (node.type === 'kpi') nodeColor = '#9333EA';

        // Draw node
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
        gradient.addColorStop(0, nodeColor);
        gradient.addColorStop(1, nodeColor + '80');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = selectedNode === node.id ? '#FFFFFF' : nodeColor;
        ctx.lineWidth = selectedNode === node.id ? 3 : 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#E6E8EB';
        ctx.font = `${10 * pos.scale}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.symbol, pos.x, pos.y - size - 5);
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Auto-rotation
    const rotationInterval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 0.002,
      }));
    }, 16);

    return () => clearInterval(rotationInterval);
  }, [nodes, edges, rotation, zoom, selectedNode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      const deltaX = e.clientX - lastMouse.current.x;
      const deltaY = e.clientY - lastMouse.current.y;
      setRotation(prev => ({
        x: prev.x + deltaY * 0.005,
        y: prev.y + deltaX * 0.005,
      }));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(200, Math.min(800, prev + e.deltaY * 0.5)));
  };

  return (
    <Card className="bg-[#121318]/80 border border-[#00E6F6]/30 backdrop-blur-sm overflow-hidden group hover:border-[#00E6F6]/50 transition-all duration-300">
      <div className="p-4 border-b border-[#00E6F6]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-[#00E6F6]" />
          <h3 className="text-lg font-semibold text-[#E6E8EB]">3D Quantum Correlation Graph</h3>
        </div>
        <Badge variant="outline" className="bg-[#00E6F6]/10 text-[#00E6F6] border-[#00E6F6]/20">
          <Sparkles className="w-3 h-3 mr-1" />
          {nodes.length} Nodes
        </Badge>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[500px] cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
        <div className="absolute bottom-4 left-4 bg-[#0A0B0F]/90 border border-[#00E6F6]/30 rounded-lg p-3 text-xs text-[#E6E8EB]/60 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00E6F6]" />
            <span>Holdings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#43FF6B]" />
            <span>Indices</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFA500]" />
            <span>Commodities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#9333EA]" />
            <span>KPIs</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-[#0A0B0F]/90 border border-[#00E6F6]/30 rounded-lg px-3 py-2 text-xs text-[#E6E8EB]/60">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </Card>
  );
}