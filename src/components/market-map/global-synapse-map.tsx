import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Globe, Scan, Activity, TrendingUp, AlertCircle } from "lucide-react";

export function GlobalSynapseMap() {
  const [scanning, setScanning] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleScanNow = async () => {
    setScanning(true);
    toast.loading("Scanning global events...");
    
    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'scan', sources: ['gdelt', 'news', 'economic'] }
      });

      if (error) throw error;

      setEvents(data.events || []);
      toast.success(`Detected ${data.events?.length || 0} global events`);
    } catch (error: any) {
      toast.error(error.message || "Scan failed");
    } finally {
      setScanning(false);
      toast.dismiss();
    }
  };

  const handleEventAnalysis = async (event: any) => {
    setSelectedEvent(event);
    toast.loading("Analyzing impact...");

    try {
      const { data, error } = await supabase.functions.invoke('market-synapse', {
        body: { action: 'analyze_impact', event }
      });

      if (error) throw error;

      setSelectedEvent({ ...event, analysis: data });
      toast.success("Impact analysis complete");
    } catch (error: any) {
      toast.error(error.message || "Analysis failed");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Global Map View */}
      <Card className="lg:col-span-2 p-6 bg-background/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '20s' }} />
            <h2 className="text-2xl font-bold">Global Event Radar</h2>
          </div>
          
          <Button onClick={handleScanNow} disabled={scanning} className="gap-2">
            <Scan className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning...' : 'Scan Now'}
          </Button>
        </div>

        {/* Interactive World Map with Events */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-96 rounded-lg bg-background/80 border border-border/40 overflow-hidden"
        >
          {/* World Map SVG Background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            {/* Continents outline - simplified world map */}
            <path
              d="M 150 100 L 200 80 L 250 90 L 280 70 L 320 85 L 350 75 L 380 90 L 400 100 L 420 90 L 450 100 L 470 110 L 490 100 L 510 120 L 520 110 L 540 130 L 550 120 L 570 140 L 580 130 L 600 150 L 620 140 L 640 160 L 650 170 L 640 180 L 630 190 L 620 200 L 600 210 L 580 200 L 560 210 L 540 220 L 520 210 L 500 220 L 480 230 L 460 220 L 440 230 L 420 240 L 400 230 L 380 240 L 360 250 L 340 240 L 320 250 L 300 240 L 280 230 L 260 240 L 240 230 L 220 220 L 200 210 L 180 200 L 170 180 L 160 160 L 155 140 L 150 120 Z"
              fill="hsl(var(--muted))"
              fillOpacity="0.3"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            <path
              d="M 100 250 L 120 240 L 140 250 L 160 240 L 180 250 L 200 260 L 220 250 L 240 260 L 260 270 L 240 280 L 220 290 L 200 280 L 180 290 L 160 300 L 140 290 L 120 300 L 100 290 L 90 270 Z"
              fill="hsl(var(--muted))"
              fillOpacity="0.3"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
            <path
              d="M 700 150 L 720 140 L 740 150 L 760 140 L 780 150 L 800 160 L 820 150 L 840 160 L 860 170 L 880 180 L 900 190 L 910 210 L 900 230 L 880 240 L 860 230 L 840 240 L 820 250 L 800 240 L 780 250 L 760 260 L 740 250 L 720 240 L 700 230 L 690 210 L 695 190 L 700 170 Z"
              fill="hsl(var(--muted))"
              fillOpacity="0.3"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          </svg>

          {/* Event Dots */}
          <div className="absolute inset-0">
            {events.map((event, idx) => {
              // Determine color based on severity
              let dotColor = 'hsl(var(--primary))'; // default gold
              let glowColor = 'rgba(207, 175, 110, 0.7)';
              
              if (event.severity >= 9) {
                dotColor = 'hsl(0, 84%, 60%)'; // red for critical
                glowColor = 'rgba(239, 68, 68, 0.7)';
              } else if (event.severity >= 7) {
                dotColor = 'hsl(262, 83%, 58%)'; // indigo for high importance
                glowColor = 'rgba(99, 102, 241, 0.7)';
              } else if (event.severity >= 5) {
                dotColor = 'hsl(25, 95%, 53%)'; // orange for medium
                glowColor = 'rgba(249, 115, 22, 0.7)';
              } else {
                dotColor = 'hsl(142, 76%, 36%)'; // green for normal
                glowColor = 'rgba(34, 197, 94, 0.7)';
              }

              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${event.x || Math.random() * 80 + 10}%`,
                    top: `${event.y || Math.random() * 80 + 10}%`
                  }}
                  onClick={() => handleEventAnalysis(event)}
                >
                  <div className="relative">
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dotColor }}
                      animate={{
                        boxShadow: [
                          `0 0 0 0 ${glowColor}`,
                          `0 0 0 12px ${glowColor.replace('0.7', '0')}`,
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute left-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                        {event.title || 'Event'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center Text */}
          {events.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Click "Scan Now" to detect global events</p>
            </div>
          )}
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Activity className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-sm text-muted-foreground">Active Events</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{events.filter(e => e.severity > 7).length}</p>
            <p className="text-sm text-muted-foreground">High Impact</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <AlertCircle className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{events.filter(e => e.severity > 8).length}</p>
            <p className="text-sm text-muted-foreground">Critical</p>
          </div>
        </div>
      </Card>

      {/* Right: Event Details */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
        <h3 className="text-xl font-bold mb-4">Event Analysis</h3>
        
        {selectedEvent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Badge variant={selectedEvent.severity > 7 ? "destructive" : "default"}>
                Severity: {selectedEvent.severity || 5}/10
              </Badge>
              <h4 className="font-semibold mt-2">{selectedEvent.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedEvent.description}
              </p>
            </div>

            {selectedEvent.analysis && (
              <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-semibold">Impact Assessment:</p>
                <p className="text-sm">{selectedEvent.analysis.summary}</p>
                <p className="text-sm text-primary font-semibold">
                  Confidence: {selectedEvent.analysis.confidence}%
                </p>
              </div>
            )}

            <Button className="w-full gap-2">
              <Activity className="w-4 h-4" />
              Generate Action Plan
            </Button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Select an event to view details</p>
          </div>
        )}
      </Card>
    </div>
  );
}
