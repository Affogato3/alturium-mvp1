import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, CheckCircle, AlertTriangle, Download, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface QualityIssue {
  type: string;
  dataset: string;
  count: number;
  status: string;
  confidence: number;
}

export const DataQualityMonitor = () => {
  const [issues, setIssues] = useState<QualityIssue[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const scanDataQuality = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('data-quality-scan');
      
      if (error) throw error;

      setIssues(data.issues || []);
      setOverallScore(data.overall_score || 0);

      toast({
        title: "Data Quality Scan Complete",
        description: `Overall quality score: ${data.overall_score}%`,
      });
    } catch (error: any) {
      toast({
        title: "Scan Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const approveFixes = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('data-quality-repair', {
        body: { issues }
      });

      if (error) throw error;

      toast({
        title: "Fixes Applied",
        description: `${data.fixed_count} issues resolved successfully`,
      });

      scanDataQuality();
    } catch (error: any) {
      toast({
        title: "Repair Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fixed": return "text-green-400";
      case "Merged": return "text-blue-400";
      case "Awaiting Review": return "text-amber-400";
      default: return "text-[#BFBFBF]";
    }
  };

  return (
    <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#CFAF6E]" />
          <div>
            <h3 className="text-xl font-bold text-[#EDEDED]">Data Quality Guardian</h3>
            <p className="text-sm text-[#BFBFBF]">Real-time data monitoring & auto-repair</p>
          </div>
        </div>
        <Button
          onClick={scanDataQuality}
          disabled={isScanning}
          className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90"
        >
          <Play className="w-4 h-4 mr-2" />
          {isScanning ? "Scanning..." : "Run Scan"}
        </Button>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#BFBFBF]">Data Confidence Score</span>
          <span className="text-2xl font-bold text-[#CFAF6E]">{overallScore}%</span>
        </div>
        <div className="relative w-full h-2 bg-[#1A1A1A]/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#CFAF6E] to-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Issues Table */}
      {issues.length > 0 && (
        <>
          <ScrollArea className="h-[300px] mb-4">
            <div className="space-y-2">
              {issues.map((issue, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-[#EDEDED]">{issue.type}</h4>
                      <p className="text-xs text-[#BFBFBF]">{issue.dataset}</p>
                    </div>
                    <Badge className="bg-[#CFAF6E]/20 text-[#CFAF6E] border-[#CFAF6E]/30">
                      {issue.count} found
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className="text-xs text-[#BFBFBF]">
                      Confidence: {issue.confidence}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-3">
            <Button
              onClick={approveFixes}
              className="flex-1 bg-[#CFAF6E]/20 border border-[#CFAF6E]/30 text-[#CFAF6E] hover:bg-[#CFAF6E]/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Fixes
            </Button>
            <Button
              variant="outline"
              className="border-[#CFAF6E]/30 text-[#EDEDED] hover:bg-[#CFAF6E]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Log
            </Button>
          </div>
        </>
      )}

      {issues.length === 0 && !isScanning && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-[#EDEDED] font-medium">All Data Clean</p>
          <p className="text-sm text-[#BFBFBF]">No issues detected</p>
        </div>
      )}
    </Card>
  );
};
