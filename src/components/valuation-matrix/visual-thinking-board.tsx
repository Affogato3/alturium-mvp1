import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eraser, Trash2, Sparkles, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function VisualThinkingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = "hsl(var(--card))";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPos({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "draw" ? "hsl(var(--primary))" : "hsl(var(--card))";
    ctx.lineWidth = tool === "draw" ? 3 : 20;
    ctx.lineCap = "round";
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "hsl(var(--card))";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setAiAnalysis(null);
  };

  const analyzeDrawing = async () => {
    toast({
      title: "Analyzing Deal Structure",
      description: "AI is interpreting your visual design..."
    });

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analyses = [
      "This merger raises your 3-year NPV by 17%, but triggers 12% regulatory friction. Want to simulate alternatives?",
      "Detected horizontal integration. Estimated synergies: $2.3B. Antitrust risk: Medium. Recommend parallel divestiture strategy.",
      "Cross-border acquisition identified. Tax optimization potential: $890M. Compliance requirements in 3 jurisdictions detected.",
      "Vertical supply chain consolidation. Cost savings: 23%. Supply risk reduction: 18%. Integration timeline: 14 months."
    ];

    setAiAnalysis(analyses[Math.floor(Math.random() * analyses.length)]);

    toast({
      title: "Analysis Complete",
      description: "AI has generated strategic insights"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Pencil className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Visual Thinking Board</h3>
            <p className="text-sm text-muted-foreground">Sketch deals, get instant AI simulations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={tool === "draw" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("draw")}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === "erase" ? "default" : "outline"}
            size="sm"
            onClick={() => setTool("erase")}
          >
            <Eraser className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button onClick={analyzeDrawing} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Analyze
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="rounded-lg border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-[400px] cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Box = Company
            </Badge>
            <Badge variant="outline" className="gap-1">
              <ArrowRight className="w-3 h-3" />
              Arrow = Merge/Acquire
            </Badge>
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              Circle = Market
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <h4 className="font-semibold mb-3 text-sm">Quick Templates</h4>
            <div className="space-y-2">
              {["M&A Structure", "JV Partnership", "Asset Sale", "Spin-off"].map((template, i) => (
                <Button key={i} variant="outline" size="sm" className="w-full justify-start text-xs">
                  {template}
                </Button>
              ))}
            </div>
          </div>

          {aiAnalysis && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">AI Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {aiAnalysis}
              </p>
              <div className="mt-3 pt-3 border-t border-border/50 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Simulate
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Export
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
