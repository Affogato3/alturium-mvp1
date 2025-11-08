import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, TrendingUp, Users, DollarSign, BarChart3, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Pattern {
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  category: string;
}

export const PatternDiscovery = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const { toast } = useToast();

  const discoverPatterns = async () => {
    setIsDiscovering(true);
    try {
      const { data, error } = await supabase.functions.invoke('pattern-discovery');
      
      if (error) throw error;

      setPatterns(data.patterns || []);

      toast({
        title: "Pattern Discovery Complete",
        description: `Found ${data.patterns?.length || 0} meaningful patterns`,
      });
    } catch (error: any) {
      toast({
        title: "Discovery Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  useEffect(() => {
    discoverPatterns();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-[#CFAF6E]/20 text-[#CFAF6E] border-[#CFAF6E]/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Revenue": return <DollarSign className="w-4 h-4" />;
      case "Operations": return <BarChart3 className="w-4 h-4" />;
      case "Customer": return <Users className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#CFAF6E]" />
          <div>
            <h3 className="text-xl font-bold text-[#EDEDED]">Pattern Discovery Engine</h3>
            <p className="text-sm text-[#BFBFBF]">AI-discovered insights & correlations</p>
          </div>
        </div>
        <Button
          onClick={discoverPatterns}
          disabled={isDiscovering}
          className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isDiscovering ? "Discovering..." : "Discover Patterns"}
        </Button>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {patterns.map((pattern, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg hover:border-[#CFAF6E]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-[#CFAF6E]/10 rounded-lg border border-[#CFAF6E]/20">
                    {getCategoryIcon(pattern.category)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#EDEDED] mb-1">{pattern.title}</h4>
                    <p className="text-xs text-[#BFBFBF] leading-relaxed">{pattern.description}</p>
                  </div>
                </div>
                <Badge className={getImpactColor(pattern.impact)}>
                  {pattern.impact} impact
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#BFBFBF]">Confidence:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-24 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#CFAF6E] to-green-400"
                        style={{ width: `${pattern.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#CFAF6E] font-medium">{pattern.confidence}%</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/10 h-7 text-xs"
                  >
                    Investigate
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#CFAF6E]/20 text-[#CFAF6E] hover:bg-[#CFAF6E]/30 h-7 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add to Feed
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
