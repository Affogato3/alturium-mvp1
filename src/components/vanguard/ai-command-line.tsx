import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal, Brain, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";

interface CommandOutput {
  command: string;
  output: string;
  timestamp: string;
  type: "success" | "error" | "info";
}

export function AICommandLine() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add welcome message
    setHistory([
      {
        command: "system",
        output: "Alturium AI Command Line initialized. Type 'help' for available commands.",
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
      },
    ]);
  }, []);

  const availableCommands = {
    help: "Shows available commands",
    optimize: "Run capital optimization analysis",
    simulate: "Execute profit simulation",
    forecast: "Generate revenue forecast",
    analyze: "Deep analysis of current metrics",
    report: "Generate executive report",
    risk: "Calculate risk assessment",
    allocate: "Optimal resource allocation",
    status: "System status and health check",
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    setIsProcessing(true);

    setTimeout(() => {
      let output = "";
      let type: "success" | "error" | "info" = "success";

      if (trimmedCmd === "help") {
        output = Object.entries(availableCommands)
          .map(([cmd, desc]) => `${cmd.padEnd(15)} - ${desc}`)
          .join("\n");
        type = "info";
      } else if (trimmedCmd === "optimize") {
        output = "🔄 Running capital optimization...\n✅ Identified $2.4M reallocation opportunity\n📊 Projected ROI: +18.5%\n⚡ Execution ready";
        toast.success("Optimization complete");
      } else if (trimmedCmd === "simulate") {
        output = "🎯 Profit simulation executing...\n💰 Base case: +$3.2M\n📈 Best case: +$5.8M\n📉 Worst case: +$1.1M\n🎲 Monte Carlo: 1000 iterations complete";
        toast.success("Simulation complete");
      } else if (trimmedCmd === "forecast") {
        output = "📊 Revenue forecast generated\nQ4 2024: $24.8M (+12.3%)\nQ1 2025: $28.4M (+14.5%)\nQ2 2025: $32.1M (+13.0%)\n🎯 Confidence: 87%";
        toast.success("Forecast generated");
      } else if (trimmedCmd === "analyze") {
        output = "🧠 Deep analysis in progress...\n💡 3 optimization opportunities identified\n⚠️ 2 risk factors detected\n🎯 5 strategic recommendations ready\n📈 Market position: Strong";
        toast.success("Analysis complete");
      } else if (trimmedCmd === "report") {
        output = "📄 Generating executive report...\n✅ Financial metrics compiled\n✅ Risk assessment included\n✅ Strategic recommendations added\n📧 Report ready for distribution";
        toast.success("Report generated");
      } else if (trimmedCmd === "risk") {
        output = "🛡️ Risk assessment executing...\n📊 Overall risk score: 32/100 (Low)\n⚠️ Market volatility: Medium\n✅ Operational risk: Low\n✅ Financial health: Strong";
        toast.success("Risk assessment complete");
      } else if (trimmedCmd === "allocate") {
        output = "⚖️ Computing optimal allocation...\n💼 Capital: 45% Growth, 35% Efficiency, 20% Reserve\n👥 Workforce: Reallocate 8 FTE to high-impact projects\n⏱️ Time: Focus 60% on strategic initiatives\n✅ Allocation plan ready";
        toast.success("Allocation optimized");
      } else if (trimmedCmd === "status") {
        output = "⚡ System Status: OPTIMAL\n🟢 AI Models: Online\n🟢 Data Sync: Active\n🟢 APIs: Connected\n🟢 Security: Verified\n📊 Uptime: 99.98%";
        type = "info";
      } else if (trimmedCmd === "") {
        setIsProcessing(false);
        return;
      } else {
        output = `Command not recognized: '${trimmedCmd}'\nType 'help' for available commands.`;
        type = "error";
        toast.error("Unknown command");
      }

      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output,
          timestamp: new Date().toLocaleTimeString(),
          type,
        },
      ]);
      setIsProcessing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand("");
    }
  };

  return (
    <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--vanguard-accent))]/20">
            <Terminal className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              AI Command Line
            </h2>
            <p className="text-xs text-[hsl(var(--vanguard-text))]/60">
              Capital™ Natural Language Interface
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-[hsl(var(--vanguard-accent))]/10 border-[hsl(var(--vanguard-accent))]/30">
          <Zap className="w-3 h-3 mr-1" />
          READY
        </Badge>
      </div>

      <ScrollArea className="h-[300px] mb-4 bg-black/40 rounded-lg p-4 border border-[hsl(var(--vanguard-text))]/10">
        <div className="space-y-3 font-mono text-sm">
          {history.map((entry, idx) => (
            <div key={idx} className="animate-fade-in">
              {entry.command !== "system" && (
                <div className="flex items-center gap-2 text-[hsl(var(--vanguard-accent))] mb-1">
                  <ChevronRight className="w-4 h-4" />
                  <span>{entry.command}</span>
                  <span className="text-xs text-[hsl(var(--vanguard-text))]/40">{entry.timestamp}</span>
                </div>
              )}
              <div
                className={`whitespace-pre-wrap pl-6 ${
                  entry.type === "error"
                    ? "text-[hsl(var(--vanguard-alert))]"
                    : entry.type === "info"
                    ? "text-[hsl(var(--vanguard-text))]/70"
                    : "text-[hsl(var(--vanguard-text))]/90"
                }`}
              >
                {entry.output}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-[hsl(var(--vanguard-accent))] animate-pulse">
              <Brain className="w-4 h-4" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-[hsl(var(--vanguard-accent))]" />
        </div>
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type command... (try 'help', 'optimize', 'simulate')"
          disabled={isProcessing}
          className="pl-10 bg-black/40 border-[hsl(var(--vanguard-text))]/10 text-[hsl(var(--vanguard-text))] placeholder:text-[hsl(var(--vanguard-text))]/40 focus:border-[hsl(var(--vanguard-accent))]/40 font-mono"
        />
      </form>
    </Card>
  );
}
