import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, GitCompare } from "lucide-react";

export const EthicalMemoryTimeline = () => {
  const events = [
    { date: "2025-01", label: "EU AI Act Integrated", type: "update" },
    { date: "2025-03", label: "Privacy Breach Prevented", type: "event" },
    { date: "2025-06", label: "ESG Framework Update", type: "update" },
    { date: "2025-09", label: "Bias Detection Enhanced", type: "fix" },
    { date: "2025-10", label: "Current", type: "current" },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "update": return "bg-cyan-500";
      case "event": return "bg-amber-500";
      case "fix": return "bg-green-500";
      case "current": return "bg-violet-500";
      default: return "bg-slate-500";
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Ethical Memory Timeline
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400">
              <Play className="h-4 w-4 mr-2" />
              Play Evolution
            </Button>
            <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400">
              <GitCompare className="h-4 w-4 mr-2" />
              Compare Epochs
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Bar */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-full" />
          
          {/* Timeline Events */}
          <div className="relative flex justify-between items-start pt-4">
            {events.map((event, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                {/* Marker */}
                <div className="relative z-10">
                  <div className={`w-4 h-4 rounded-full ${getEventColor(event.type)} shadow-lg`} />
                  <div className={`absolute inset-0 w-4 h-4 rounded-full ${getEventColor(event.type)} animate-ping opacity-20`} />
                </div>
                
                {/* Label */}
                <div className="text-center">
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs whitespace-nowrap">
                    {event.date}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-2 max-w-24 group-hover:text-cyan-400 transition-colors">
                    {event.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
