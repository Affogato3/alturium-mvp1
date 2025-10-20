import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlowEvent {
  id: string;
  type: "inflow" | "outflow" | "investment" | "risk";
  amount: number;
  source: string;
  description: string;
  timestamp: Date;
}

export function ProfitTicker() {
  const [events, setEvents] = useState<FlowEvent[]>([]);

  useEffect(() => {
    // Initial events
    const initialEvents: FlowEvent[] = [
      {
        id: "1",
        type: "inflow",
        amount: 2.4,
        source: "APAC Sales",
        description: "Q4 receivables cleared early",
        timestamp: new Date()
      },
      {
        id: "2",
        type: "investment",
        amount: 1.8,
        source: "Treasury Pool A",
        description: "Short-term yield deployment",
        timestamp: new Date(Date.now() - 120000)
      },
      {
        id: "3",
        type: "outflow",
        amount: 0.9,
        source: "EMEA Payroll",
        description: "Monthly salary processing",
        timestamp: new Date(Date.now() - 240000)
      }
    ];
    setEvents(initialEvents);

    // Simulate real-time events
    const interval = setInterval(() => {
      const eventTypes: FlowEvent["type"][] = ["inflow", "outflow", "investment", "risk"];
      const sources = ["APAC Operations", "EMEA Treasury", "Americas Sales", "Subsidiary B", "Corporate HQ"];
      const descriptions = [
        "Payment received ahead of schedule",
        "Strategic capital reallocation",
        "Supplier payment processed",
        "Currency hedge executed",
        "Investment opportunity identified",
        "Volatility spike detected"
      ];

      const newEvent: FlowEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        amount: Math.random() * 5 + 0.5,
        source: sources[Math.floor(Math.random() * sources.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        timestamp: new Date()
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 20));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getEventColor = (type: FlowEvent["type"]) => {
    switch (type) {
      case "inflow": return "hsl(var(--cnl-flow))";
      case "outflow": return "hsl(var(--warning))";
      case "investment": return "hsl(var(--cnl-profit))";
      case "risk": return "hsl(var(--cnl-risk))";
    }
  };

  const getEventIcon = (type: FlowEvent["type"]) => {
    switch (type) {
      case "inflow": return <ArrowUpRight className="w-3 h-3" />;
      case "outflow": return <ArrowDownRight className="w-3 h-3" />;
      case "investment": return <TrendingUp className="w-3 h-3" />;
      case "risk": return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <Card className="h-full p-3 bg-black/95 backdrop-blur-sm border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Profit Current</h3>
        <Badge variant="outline" className="text-xs bg-[hsl(var(--cnl-profit))]/10 border-[hsl(var(--cnl-profit))]/20">
          Live Stream
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-2 rounded border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-2">
                <div 
                  className="mt-0.5 p-1 rounded"
                  style={{ 
                    backgroundColor: `${getEventColor(event.type)}20`,
                    color: getEventColor(event.type)
                  }}
                >
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{event.source}</span>
                    <span 
                      className="text-xs font-bold whitespace-nowrap"
                      style={{ color: getEventColor(event.type) }}
                    >
                      ${event.amount.toFixed(1)}M
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground capitalize">{event.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Hover tooltip */}
              <div className="hidden group-hover:block absolute z-10 mt-1 p-2 bg-card border border-border rounded text-xs shadow-lg">
                Click to view detailed flow analysis and optimization opportunities
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
