import { useState, useEffect } from "react";
import { LiquidityField3D } from "@/components/cnl-grid/liquidity-field-3d";
import { CommandBar } from "@/components/cnl-grid/command-bar";
import { LiquidityNavigator } from "@/components/cnl-grid/liquidity-navigator";
import { ProfitTicker } from "@/components/cnl-grid/profit-ticker";
import { LiquidityConsole } from "@/components/cnl-grid/liquidity-console";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Network } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CNLGridDashboard() {
  const [timelinePosition, setTimelinePosition] = useState(30);
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("Executive");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Fetch user profile
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name.split(' ')[0]);
        }
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header with Greeting */}
      <div className="border-b border-border bg-black/95 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[hsl(var(--cnl-flow))] to-[hsl(var(--cnl-profit))] bg-clip-text text-transparent">
                {greeting}, {userName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Liquidity Tensor Engine | Real-Time Capital Optimization
              </p>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="bg-[hsl(var(--cnl-profit))]/10 text-[hsl(var(--cnl-profit))] border-[hsl(var(--cnl-profit))]/20">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                Live Flow
              </Badge>
              <Badge variant="outline" className="bg-[hsl(var(--cnl-flow))]/10 text-[hsl(var(--cnl-flow))] border-[hsl(var(--cnl-flow))]/20">
                <Zap className="w-3 h-3 mr-1" />
                CDL Active
              </Badge>
              <Badge variant="outline" className="bg-card border-border">
                247 Nodes
              </Badge>
            </div>
          </div>
          
          {/* CNL Grid Title Section */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <div className="p-2 rounded-lg bg-[hsl(var(--cnl-flow))]/20 backdrop-blur-sm">
              <Network className="w-6 h-6 text-[hsl(var(--cnl-flow))]" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">CNL Grid™</h2>
              <p className="text-xs text-muted-foreground">Continuous Network Liquidity · Data Fusion Layer Connected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Command Bar */}
      <div className="h-32">
        <CommandBar />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-220px)]">
        {/* Left: Navigator */}
        <div className="col-span-2">
          <LiquidityNavigator 
            timelinePosition={timelinePosition}
            onTimelineChange={setTimelinePosition}
          />
        </div>

        {/* Center: 3D Field */}
        <div className="col-span-7">
          <div className="h-full rounded-lg border border-border overflow-hidden bg-black">
            <LiquidityField3D timelinePosition={timelinePosition} />
          </div>
        </div>

        {/* Right: Profit Ticker */}
        <div className="col-span-3">
          <ProfitTicker />
        </div>
      </div>

      {/* Bottom: Liquidity Console */}
      <div className="px-4 pb-4">
        <LiquidityConsole />
      </div>
    </div>
  );
}
