import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyPnLPanel } from "./daily-pnl-panel";
import { MarketCommentaryPanel } from "./market-commentary-panel";
import { RiskAnalysisPanel } from "./risk-analysis-panel";
import { MonthlyReportPanel } from "./monthly-report-panel";
import { ProcessReviewPanel } from "./process-review-panel";
import { FinancialOrbBackground } from "./financial-orb-background";
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  FileText, 
  Settings2,
  Brain,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export const FinalystDashboard = () => {
  const [activeTab, setActiveTab] = useState("pnl");

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden">
      <FinancialOrbBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-black/90 via-[#0A0A12]/60 to-black/90 p-6 border-b border-[#3B82F6]/20 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-br from-[#3B82F6]/30 to-[#8B5CF6]/20 backdrop-blur-sm border border-[#3B82F6]/30"
              animate={{ 
                boxShadow: ["0 0 20px rgba(59,130,246,0.3)", "0 0 40px rgba(139,92,246,0.4)", "0 0 20px rgba(59,130,246,0.3)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className="w-10 h-10 text-[#3B82F6]" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E2E8F0] via-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                Finalyst
              </h1>
              <p className="text-[#94A3B8] text-sm mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                AI Finance Analyst • Trading Operations • Risk Management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Card className="bg-[#0F172A]/60 border-[#3B82F6]/20 px-4 py-2">
              <div className="text-xs text-[#64748B]">Analysis Mode</div>
              <div className="text-sm font-medium text-[#3B82F6]">Real-Time</div>
            </Card>
            <Card className="bg-[#0F172A]/60 border-[#22C55E]/20 px-4 py-2">
              <div className="text-xs text-[#64748B]">System Status</div>
              <div className="text-sm font-medium text-[#22C55E] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                Online
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#0F172A]/60 border border-[#3B82F6]/20 p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="pnl"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3B82F6] data-[state=active]:to-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#3B82F6]/30 text-[#94A3B8] rounded-lg transition-all"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Daily P&L
            </TabsTrigger>
            <TabsTrigger 
              value="market"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#7C3AED] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#8B5CF6]/30 text-[#94A3B8] rounded-lg transition-all"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Market Commentary
            </TabsTrigger>
            <TabsTrigger 
              value="risk"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#EF4444] data-[state=active]:to-[#DC2626] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#EF4444]/30 text-[#94A3B8] rounded-lg transition-all"
            >
              <Shield className="w-4 h-4 mr-2" />
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="monthly"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#22C55E] data-[state=active]:to-[#16A34A] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#22C55E]/30 text-[#94A3B8] rounded-lg transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              Monthly Report
            </TabsTrigger>
            <TabsTrigger 
              value="process"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F59E0B] data-[state=active]:to-[#D97706] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#F59E0B]/30 text-[#94A3B8] rounded-lg transition-all"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Process Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pnl">
            <DailyPnLPanel />
          </TabsContent>

          <TabsContent value="market">
            <MarketCommentaryPanel />
          </TabsContent>

          <TabsContent value="risk">
            <RiskAnalysisPanel />
          </TabsContent>

          <TabsContent value="monthly">
            <MonthlyReportPanel />
          </TabsContent>

          <TabsContent value="process">
            <ProcessReviewPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
