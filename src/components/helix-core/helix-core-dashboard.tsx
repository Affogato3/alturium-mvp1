import { useState } from "react";
import { QuantumFlowBackground } from "./quantum-flow-background";
import { NeuralGridBackground } from "./neural-grid-background";
import { HelixOverview } from "./helix-overview";
import { CognitiveCommandBar } from "./command-bar";
import { AIAvatarOrb } from "./ai-avatar-orb";
import { ModuleTiles } from "./module-tiles";
import { useToast } from "@/hooks/use-toast";
import { Dna } from "lucide-react";

export const HelixCoreDashboard = () => {
  const { toast } = useToast();
  const [aiState, setAiState] = useState<'idle' | 'analyzing' | 'active'>('idle');

  const handleCommand = (command: string) => {
    setAiState('analyzing');
    
    toast({
      title: "Command Received",
      description: `Processing: "${command}"`,
    });

    setTimeout(() => {
      setAiState('active');
      
      if (command.includes('liquidity')) {
        toast({
          title: "Liquidity Analysis Complete",
          description: "AI detected optimal reallocation opportunity: $2.4M",
        });
      } else if (command.includes('risk')) {
        toast({
          title: "Risk Simulation Complete",
          description: "Portfolio stress test completed. VaR: 4.2%",
        });
      } else if (command.includes('reconcile')) {
        toast({
          title: "Reconciliation Complete",
          description: "32 transactions matched automatically",
        });
      } else {
        toast({
          title: "Command Executed",
          description: "Financial intelligence engine responded successfully",
        });
      }

      setTimeout(() => setAiState('idle'), 2000);
    }, 2000);
  };

  const handleModuleClick = (moduleId: string) => {
    setAiState('analyzing');
    
    toast({
      title: "Module Loading",
      description: `Opening ${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} module...`,
    });

    setTimeout(() => {
      setAiState('idle');
      toast({
        title: "Module Active",
        description: `${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} ready for interaction`,
      });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] text-foreground overflow-hidden">
      {/* Animated Backgrounds */}
      <QuantumFlowBackground />
      <NeuralGridBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-primary/20 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30">
                  <Dna className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    HELIXCORE™
                  </h1>
                  <p className="text-xs text-muted-foreground">The Intelligence Layer for Institutional Finance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Neural Grid Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Command Bar */}
        <div className="container mx-auto px-6 py-6">
          <CognitiveCommandBar onCommand={handleCommand} />
        </div>

        {/* Overview Metrics */}
        <div className="container mx-auto px-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-muted-foreground">Helix Overview</h2>
            <p className="text-sm text-muted-foreground/70">Real-time financial intelligence dashboard</p>
          </div>
          <HelixOverview />
        </div>

        {/* Module Grid */}
        <div className="container mx-auto px-6 pb-24">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-muted-foreground">Intelligence Modules</h2>
            <p className="text-sm text-muted-foreground/70">Click to activate financial command centers</p>
          </div>
          <ModuleTiles onModuleClick={handleModuleClick} />
        </div>

        {/* Feature Highlights */}
        <div className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-primary/20 bg-card/30 backdrop-blur">
              <h3 className="font-bold mb-2 text-primary">Position Matrix</h3>
              <p className="text-sm text-muted-foreground">
                Unified view of all assets and liabilities across portfolios, tracked in real-time with ML-powered categorization.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-success/20 bg-card/30 backdrop-blur">
              <h3 className="font-bold mb-2 text-success">Liquidity Matrix</h3>
              <p className="text-sm text-muted-foreground">
                Advanced cash positioning with LSTM forecasting. Predicts liquidity gaps 14 days in advance with 94% accuracy.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-warning/20 bg-card/30 backdrop-blur">
              <h3 className="font-bold mb-2 text-warning">Risk Lattice™</h3>
              <p className="text-sm text-muted-foreground">
                Institution-grade risk modeling with Monte Carlo simulation. VaR, CVaR, and correlation analysis at BlackRock level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Avatar */}
      <AIAvatarOrb state={aiState} />
    </div>
  );
};
