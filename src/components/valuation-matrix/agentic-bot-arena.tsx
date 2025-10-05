import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface BotAgent {
  id: string;
  name: string;
  entity: string;
  stance: "bullish" | "bearish" | "neutral";
  confidence: number;
  lastAction: string;
  avatar: string;
}

export function AgenticBotArena() {
  const [bots, setBots] = useState<BotAgent[]>([
    { id: "1", name: "BlackRock Alpha", entity: "Institutional Investor", stance: "bullish", confidence: 87, lastAction: "Increased position by 15%", avatar: "BR" },
    { id: "2", name: "Goldman Strategist", entity: "Investment Bank", stance: "neutral", confidence: 72, lastAction: "Hedging exposure", avatar: "GS" },
    { id: "3", name: "SEC Compliance Bot", entity: "Regulator", stance: "bearish", confidence: 91, lastAction: "Flagged 3 risk items", avatar: "SEC" },
    { id: "4", name: "Sovereign Wealth AI", entity: "Sovereign Fund", stance: "bullish", confidence: 94, lastAction: "Committed $2.3B", avatar: "SW" },
    { id: "5", name: "Activist Investor", entity: "Hedge Fund", stance: "bullish", confidence: 68, lastAction: "Proposing board changes", avatar: "AI" },
    { id: "6", name: "Credit Rating Agent", entity: "Rating Agency", stance: "neutral", confidence: 79, lastAction: "Maintained AA rating", avatar: "CRA" }
  ]);

  const [negotiations, setNegotiations] = useState<Array<{ from: string; to: string; message: string; time: string }>>([
    { from: "BlackRock Alpha", to: "Goldman Strategist", message: "Proposing co-investment structure", time: "2m ago" },
    { from: "SEC Compliance Bot", to: "All", message: "Request additional ESG disclosures", time: "5m ago" },
    { from: "Sovereign Wealth AI", to: "Activist Investor", message: "Aligned on governance terms", time: "8m ago" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBots(prev => prev.map(bot => ({
        ...bot,
        confidence: Math.max(50, Math.min(99, bot.confidence + (Math.random() - 0.5) * 5))
      })));

      if (Math.random() > 0.7) {
        const messages = [
          "Analyzing market sentiment",
          "Adjusting risk parameters",
          "Evaluating counterparty terms",
          "Running stress test scenarios"
        ];
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        setNegotiations(prev => [
          { from: randomBot.name, to: "System", message: messages[Math.floor(Math.random() * messages.length)], time: "just now" },
          ...prev.slice(0, 9)
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bots]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Agentic Deal Bot Arena</h3>
          <p className="text-sm text-muted-foreground">AI Entities Negotiating in Real-Time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bots.map(bot => (
          <div key={bot.id} className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-primary/20 text-primary font-semibold flex items-center justify-center">
                  {bot.avatar}
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm">{bot.name}</h4>
                  <p className="text-xs text-muted-foreground">{bot.entity}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  bot.stance === "bullish"
                    ? "bg-success/10 text-success border-success/20"
                    : bot.stance === "bearish"
                    ? "bg-danger/10 text-danger border-danger/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }
              >
                {bot.stance === "bullish" && <TrendingUp className="w-3 h-3 mr-1" />}
                {bot.stance === "bearish" && <TrendingDown className="w-3 h-3 mr-1" />}
                {bot.stance}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-sm font-semibold text-primary">{bot.confidence}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${bot.confidence}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {bot.lastAction}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Live Negotiations
        </h4>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {negotiations.map((neg, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
              <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{neg.from}</span>
                  <span className="text-xs text-muted-foreground">→ {neg.to}</span>
                </div>
                <p className="text-sm text-muted-foreground">{neg.message}</p>
                <span className="text-xs text-muted-foreground mt-1 inline-block">{neg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
