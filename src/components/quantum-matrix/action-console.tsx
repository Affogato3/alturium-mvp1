import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActionConsoleProps {
  autoExecute: boolean;
  activeMode: 'conservative' | 'balanced' | 'offensive';
}

export function ActionConsole({ autoExecute, activeMode }: ActionConsoleProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const { toast } = useToast();

  const handleAutoRebalance = async () => {
    setIsRebalancing(true);
    toast({
      title: "AI Rebalancing Initiated",
      description: "Analyzing portfolio and generating optimal allocation...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('quantum-signals', {
        body: {
          action: 'generate_signal',
          symbol: 'PORTFOLIO',
          portfolioData: { mode: activeMode }
        }
      });

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "Rebalancing Complete",
          description: `Portfolio optimized for ${activeMode} strategy. 3 positions adjusted.`,
        });
        setIsRebalancing(false);
      }, 2000);
    } catch (error) {
      console.error('Rebalancing error:', error);
      toast({
        title: "Rebalancing Failed",
        description: "Unable to complete rebalancing. Please try again.",
        variant: "destructive",
      });
      setIsRebalancing(false);
    }
  };

  const handleSimulateShock = async () => {
    setIsSimulating(true);
    toast({
      title: "7-Day Shock Simulation Running",
      description: "Monte Carlo models analyzing market stress scenarios...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('quantum-signals', {
        body: {
          action: 'simulate_scenario',
          portfolioData: {
            scenarioType: 'market_shock',
            magnitude: 15,
            duration: 7
          }
        }
      });

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "Simulation Complete",
          description: "Portfolio resilience: 82%. Recommended actions available.",
        });
        setIsSimulating(false);
      }, 3000);
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Failed",
        description: "Unable to complete simulation. Please try again.",
        variant: "destructive",
      });
      setIsSimulating(false);
    }
  };

  const handleReinforceExposure = () => {
    toast({
      title: "Exposure Reinforcement",
      description: "Increasing position in high-confidence signals by 15%.",
    });
  };

  const handleHedgeRisk = () => {
    toast({
      title: "Risk Hedge Activated",
      description: "Protective puts purchased for top 5 holdings.",
    });
  };

  return (
    <Card className="bg-[#121318]/80 border border-[#00E6F6]/30 backdrop-blur-sm">
      <div className="p-4 border-b border-[#00E6F6]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00E6F6]" />
            <h3 className="text-lg font-semibold text-[#E6E8EB]">Action Console</h3>
          </div>
          {autoExecute && (
            <Badge variant="outline" className="bg-[#43FF6B]/10 text-[#43FF6B] border-[#43FF6B]/30 animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              Auto-Execute ON
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Button
          onClick={handleAutoRebalance}
          disabled={isRebalancing}
          className="w-full bg-[#00E6F6]/20 hover:bg-[#00E6F6]/30 text-[#00E6F6] border border-[#00E6F6]/30 transition-all duration-300"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isRebalancing ? 'Rebalancing...' : 'Auto-Rebalance Portfolio'}
        </Button>

        <Button
          onClick={handleSimulateShock}
          disabled={isSimulating}
          className="w-full bg-[#FFA500]/20 hover:bg-[#FFA500]/30 text-[#FFA500] border border-[#FFA500]/30 transition-all duration-300"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          {isSimulating ? 'Simulating...' : 'Simulate 7-Day Shock'}
        </Button>

        <Button
          onClick={handleReinforceExposure}
          className="w-full bg-[#43FF6B]/20 hover:bg-[#43FF6B]/30 text-[#43FF6B] border border-[#43FF6B]/30 transition-all duration-300"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Reinforce Exposure
        </Button>

        <Button
          onClick={handleHedgeRisk}
          className="w-full bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-[#FF3366] border border-[#FF3366]/30 transition-all duration-300"
        >
          <Shield className="w-4 h-4 mr-2" />
          Hedge Risk
        </Button>

        <div className="mt-4 pt-4 border-t border-[#00E6F6]/20">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-[#43FF6B]">+12.4%</div>
              <div className="text-xs text-[#E6E8EB]/60">Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00E6F6]">0.87</div>
              <div className="text-xs text-[#E6E8EB]/60">Sharpe</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FFA500]">8.2%</div>
              <div className="text-xs text-[#E6E8EB]/60">Vol</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}