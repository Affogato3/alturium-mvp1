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

        {/* Interactive World Map Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-96 rounded-lg bg-gradient-to-br from-background/30 to-primary/10 border border-primary/20 overflow-hidden"
        >
          {/* Animated Network Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.line
                key={i}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="rgba(207, 175, 110, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </svg>

          {/* Event Nodes */}
          <div className="absolute inset-0 p-4">
            {events.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="absolute cursor-pointer"
                style={{
                  left: `${event.x || Math.random() * 80 + 10}%`,
                  top: `${event.y || Math.random() * 80 + 10}%`
                }}
                onClick={() => handleEventAnalysis(event)}
              >
                <div className="relative">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-primary"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(207, 175, 110, 0.7)',
                        '0 0 0 10px rgba(207, 175, 110, 0)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
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
