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
          className="relative h-96 rounded-lg bg-gradient-to-b from-background via-background/95 to-background/90 border border-border/40 overflow-hidden"
        >
          {/* World Map SVG Background - Detailed */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* North America */}
            <path d="M 150,200 L 180,180 L 220,170 L 250,160 L 280,155 L 310,160 L 340,170 L 370,165 L 400,175 L 420,190 L 440,200 L 450,220 L 460,240 L 465,260 L 460,280 L 450,300 L 440,320 L 420,330 L 400,340 L 380,350 L 360,360 L 340,365 L 320,370 L 300,375 L 280,370 L 260,360 L 240,350 L 220,340 L 200,330 L 180,320 L 160,310 L 145,290 L 140,270 L 135,250 L 140,230 L 145,210 Z" 
              fill="url(#mapGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.6"/>
            
            {/* South America */}
            <path d="M 380,450 L 400,440 L 420,445 L 435,460 L 445,480 L 450,500 L 448,520 L 442,540 L 435,560 L 425,580 L 415,600 L 405,615 L 395,625 L 385,630 L 375,628 L 365,620 L 355,610 L 348,595 L 343,580 L 340,565 L 338,550 L 340,535 L 345,520 L 352,505 L 360,490 L 370,475 L 378,460 Z"
              fill="url(#mapGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Europe */}
            <path d="M 900,180 L 920,175 L 940,180 L 955,190 L 965,205 L 970,220 L 968,235 L 960,245 L 945,250 L 930,248 L 915,243 L 905,235 L 898,225 L 895,210 L 897,195 Z"
              fill="url(#mapGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Africa */}
            <path d="M 920,280 L 940,275 L 960,280 L 980,290 L 995,305 L 1005,325 L 1010,345 L 1012,365 L 1010,385 L 1005,405 L 998,425 L 988,442 L 975,455 L 960,465 L 945,470 L 930,468 L 915,460 L 903,448 L 893,433 L 886,415 L 882,397 L 880,380 L 882,363 L 887,346 L 895,330 L 905,315 L 913,300 L 918,287 Z"
              fill="url(#mapGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Asia */}
            <path d="M 1050,160 L 1100,155 L 1150,160 L 1200,170 L 1250,180 L 1290,195 L 1320,210 L 1345,230 L 1365,250 L 1380,270 L 1390,290 L 1395,310 L 1393,330 L 1385,345 L 1370,355 L 1350,360 L 1330,358 L 1310,350 L 1290,340 L 1270,330 L 1250,320 L 1230,310 L 1210,300 L 1190,290 L 1170,280 L 1150,270 L 1130,260 L 1110,250 L 1090,240 L 1070,225 L 1055,210 L 1045,190 L 1042,175 Z"
              fill="url(#mapGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Australia */}
            <path d="M 1450,580 L 1480,575 L 1510,580 L 1535,595 L 1552,615 L 1560,635 L 1558,655 L 1548,670 L 1532,680 L 1512,683 L 1492,680 L 1472,672 L 1455,660 L 1443,645 L 1438,628 L 1440,610 L 1445,595 Z"
              fill="url(#mapGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Latitude/Longitude grid lines */}
            {[...Array(10)].map((_, i) => (
              <line key={`lat-${i}`} x1="0" y1={i * 100} x2="2000" y2={i * 100} 
                stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />
            ))}
            {[...Array(20)].map((_, i) => (
              <line key={`lon-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" 
                stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />
            ))}
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
