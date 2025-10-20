import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Send, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  type: "user" | "system";
  content: string;
  timestamp: Date;
}

export function CommandBar() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "system",
      content: "CNL Grid™ Command Line initialized. Ready for capital optimization directives.",
      timestamp: new Date()
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const systemMessage: Message = {
        type: "system",
        content: generateResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMessage]);
    }, 1000);

    setInput("");
  };

  const generateResponse = (query: string) => {
    const lower = query.toLowerCase();
    if (lower.includes("optimize") || lower.includes("efficiency")) {
      return "Analysis complete. Identified $12.4M in idle capital across 47 accounts. Recommend reallocation to high-yield treasury pools (projected +3.8% ROI over 90 days). Execute optimization? [Confirm/Details]";
    } else if (lower.includes("risk") || lower.includes("volatility")) {
      return "Current portfolio volatility: 8.7%. FX exposure concentrated in EUR/USD (23% of liquidity). Recommend hedging via forward contracts to reduce risk by 42%. Deploy hedge? [Confirm/Simulate]";
    } else if (lower.includes("simulate") || lower.includes("scenario")) {
      return "Scenario simulation initialized. Running 10,000 Monte Carlo iterations for Q3 liquidity stress testing. Results in 3 seconds...";
    } else {
      return "Command acknowledged. Processing request through liquidity optimization engine. Stand by for recommendations.";
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-black/50">
        <Terminal className="w-4 h-4 text-[hsl(var(--cnl-flow))]" />
        <h2 className="text-sm font-semibold">Command Line for Capital™</h2>
        <Badge variant="outline" className="ml-auto bg-[hsl(var(--cnl-profit))]/10 text-[hsl(var(--cnl-profit))] border-[hsl(var(--cnl-profit))]/20">
          <Zap className="w-3 h-3 mr-1" />
          AI Active
        </Badge>
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.type === "user" 
                  ? "bg-[hsl(var(--cnl-flow))]/20 border border-[hsl(var(--cnl-flow))]/30 text-foreground" 
                  : "bg-card border border-border text-muted-foreground"
              }`}>
                {msg.content}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border bg-black/50">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command or query..."
          className="flex-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button type="submit" size="sm" className="bg-[hsl(var(--cnl-flow))] hover:bg-[hsl(var(--cnl-flow))]/80">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
