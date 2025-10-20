import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const TacticalDialogue = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello. I'm your SynapseX AI Copilot. I have full visibility into your enterprise data mesh. Ask me anything about operations, costs, risks, or growth opportunities.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: getSimulatedResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getSimulatedResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("margin") || lowerQuery.includes("apac")) {
      return "Analyzing APAC margin compression... Root cause identified: supplier cost increase (+18%) combined with fixed pricing contracts. Recommendation: Renegotiate contracts with 3 key suppliers or shift 15% volume to alternative vendors. Projected impact: restore 4.2% margin within 60 days. Confidence: 89%.";
    }

    if (lowerQuery.includes("simulate") || lowerQuery.includes("shift")) {
      return "Simulating $3M reallocation from marketing to logistics... Results: Delivery time ↓12%, customer satisfaction ↑8%, but lead generation ↓15%. Net profit impact: +$420K over 6 months. Risk: Medium. Alternative strategy: reallocate only $1.8M for balanced outcome. Would you like detailed breakdown?";
    }

    if (lowerQuery.includes("supplier") || lowerQuery.includes("cost")) {
      return "Cost-optimal supplier network for Europe identified. Top 3 recommendations: (1) Shift 30% to Vendor Delta (cost ↓14%, quality maintained), (2) Consolidate warehouses in Munich + Lyon (logistics cost ↓$240K/year), (3) Hedge EUR/USD exposure (reduce currency risk by 25%). Total savings: $890K annually. Confidence: 92%.";
    }

    return "I've analyzed your query across 247 data nodes. Could you provide more context? Available domains: Finance, Operations, HR, Marketing, Supply Chain, R&D. Or ask me to 'simulate' a strategic decision.";
  };

  return (
    <Card className="h-full bg-black/40 backdrop-blur-sm border-primary/20 flex flex-col">
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Tactical AI Copilot</h3>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 ml-auto">
            Live
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Natural language strategic interface
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-primary/20 text-primary"
                    : "bg-cyan-500/20 text-cyan-400"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`flex-1 ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[85%] ${
                    message.role === "user"
                      ? "bg-primary/20 text-white"
                      : "bg-white/5 text-gray-300"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-primary/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about costs, risks, or simulate strategies..."
            className="bg-white/5 border-primary/20 text-white placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-cyan-500 to-primary text-black hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
