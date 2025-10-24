import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Sparkles, Network, Play, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function LiquidityConsole() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runOptimization = async () => {
    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('cnl-optimize', {
        body: { 
          action: "optimize",
          data: {
            idleCapital: 12.4,
            accounts: 47,
            currentAllocation: {
              cash: 8.2,
              treasury: 2.1,
              investments: 2.1
            }
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Optimization Complete",
        description: "Capital reallocation recommendations generated. Review results below.",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to run optimization",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const simulateRisk = async () => {
    setIsSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke('cnl-optimize', {
        body: { 
          action: "simulate_risk",
          data: {
            scenario: "Inflation shock +3%, FX volatility spike EUR/USD",
            portfolio: {
              cash: 45.2,
              debt: 12.8,
              investments: 22.4,
              fxExposure: { EUR: 23, GBP: 12, JPY: 8 }
            }
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Risk Simulation Complete",
        description: "Countermeasures and hedge recommendations ready.",
      });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: error instanceof Error ? error.message : "Failed to simulate risk",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const analyzeOpportunities = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('cnl-optimize', {
        body: { 
          action: "predict_liquidity",
          data: {
            currentLiquidity: 80.4,
            cashFlowTrend: "positive",
            upcomingObligations: 23.6,
            marketConditions: "stable"
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Opportunity Analysis Complete",
        description: "Growth opportunities identified with ROI projections.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze opportunities",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-4 bg-black/95 backdrop-blur-sm border-border">
      <Tabs defaultValue="optimize" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50">
          <TabsTrigger value="optimize" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="stabilize" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Stabilize
          </TabsTrigger>
          <TabsTrigger value="grow" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Grow
          </TabsTrigger>
          <TabsTrigger value="integrate" className="text-xs">
            <Network className="w-3 h-3 mr-1" />
            Integrate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimize" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Capital Optimization</h4>
            <Badge variant="outline" className="bg-[hsl(var(--cnl-profit))]/10 border-[hsl(var(--cnl-profit))]/20">
              AI Ready
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-card/30 border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Idle Capital Detected</div>
              <div className="text-xl font-bold text-[hsl(var(--cnl-profit))]">$12.4M</div>
              <div className="text-xs text-muted-foreground mt-1">Across 47 accounts</div>
            </Card>
            <Card className="p-3 bg-card/30 border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Potential Gain</div>
              <div className="text-xl font-bold text-[hsl(var(--cnl-profit))]">+3.8%</div>
              <div className="text-xs text-muted-foreground mt-1">90-day projection</div>
            </Card>
          </div>
          <Button 
            onClick={runOptimization}
            disabled={isOptimizing}
            className="w-full bg-[hsl(var(--cnl-profit))] hover:bg-[hsl(var(--cnl-profit))]/80 disabled:opacity-50"
          >
            {isOptimizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {isOptimizing ? "Optimizing..." : "Run Optimization"}
          </Button>
        </TabsContent>

        <TabsContent value="stabilize" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Crisis Simulation</h4>
            <Badge variant="outline" className="bg-[hsl(var(--cnl-flow))]/10 border-[hsl(var(--cnl-flow))]/20">
              RL Agent Active
            </Badge>
          </div>
          <div className="space-y-2">
            <Card className="p-3 bg-card/30 border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Inflation Shock +3%</span>
                <span className="text-xs font-semibold text-[hsl(var(--cnl-risk))]">-$8.2M</span>
              </div>
              <div className="w-full bg-border/30 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[hsl(var(--cnl-risk))] w-[65%]" />
              </div>
            </Card>
            <Card className="p-3 bg-card/30 border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">FX Volatility Spike</span>
                <span className="text-xs font-semibold text-[hsl(var(--cnl-risk))]">-$4.1M</span>
              </div>
              <div className="w-full bg-border/30 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[hsl(var(--cnl-risk))] w-[35%]" />
              </div>
            </Card>
          </div>
          <Button 
            onClick={simulateRisk}
            disabled={isSimulating}
            className="w-full" 
            variant="outline"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
            {isSimulating ? "Simulating..." : "Deploy Countermeasures"}
          </Button>
        </TabsContent>

        <TabsContent value="grow" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Growth Opportunities</h4>
            <Badge variant="outline" className="bg-[hsl(var(--cnl-profit))]/10 border-[hsl(var(--cnl-profit))]/20">
              12 Detected
            </Badge>
          </div>
          <div className="space-y-2">
            {[
              { title: "Supplier Financing", roi: "+4.2%", risk: "Low" },
              { title: "M&A Arbitrage", roi: "+7.8%", risk: "Med" },
              { title: "Credit Extension", roi: "+2.9%", risk: "Low" }
            ].map((opp, idx) => (
              <Card key={idx} className="p-3 bg-card/30 border-border/50 hover:bg-card/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{opp.title}</div>
                    <div className="text-xs text-muted-foreground">Risk: {opp.risk}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[hsl(var(--cnl-profit))]">{opp.roi}</div>
                    <div className="text-xs text-muted-foreground">ROI</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button 
            onClick={analyzeOpportunities}
            disabled={isAnalyzing}
            className="w-full bg-[hsl(var(--cnl-profit))] hover:bg-[hsl(var(--cnl-profit))]/80 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {isAnalyzing ? "Analyzing..." : "Analyze All Opportunities"}
          </Button>
        </TabsContent>

        <TabsContent value="integrate" className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Data Integration</h4>
            <Badge variant="outline" className="bg-[hsl(var(--cnl-flow))]/10 border-[hsl(var(--cnl-flow))]/20">
              8 Connected
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["ERP Systems", "Bank APIs", "Market Data", "Credit Ratings", "Logistics", "FX Feeds", "Compliance", "Treasury"].map((source, idx) => (
              <Card key={idx} className="p-2 bg-card/30 border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs">{source}</span>
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--cnl-profit))] animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
          <Button 
            onClick={() => toast({
              title: "Integration Panel",
              description: "Data Fusion Layer: 8 systems connected. ERP, Banking APIs, Market Data streaming live.",
            })}
            className="w-full" 
            variant="outline"
          >
            <Network className="w-4 h-4 mr-2" />
            Configure Integrations
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
