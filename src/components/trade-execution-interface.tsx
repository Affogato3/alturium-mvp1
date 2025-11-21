import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Bell, 
  Settings, 
  Save, 
  PlayCircle,
  Zap,
  Target,
  Shield,
  Download,
  Layout
} from "lucide-react";
import { TradingChart } from "./trade-execution/trading-chart";
import { ExecutionPanel } from "./trade-execution/execution-panel";
import { AlertsPanel } from "./trade-execution/alerts-panel";
import { IndicatorsPanel } from "./trade-execution/indicators-panel";
import { AIInsightsPanel } from "./trade-execution/ai-insights-panel";
import { WorkspaceManager } from "./trade-execution/workspace-manager";
import { MarketDataFeed } from "./trade-execution/market-data-feed";
import { AnalysisResults } from "./trade-execution/analysis-results";

export const TradeExecutionInterface = () => {
  const [activeTab, setActiveTab] = useState("trading");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0D] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#E9E9E9] flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-[#D5B65C]" />
            Trade Execution Interface™
          </h1>
          <p className="text-[#9CA3AF] mt-1">
            Wall-Street-grade trading terminal • Live market data • AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            ● Live Markets
          </Badge>
          <Badge variant="outline" className="bg-[#D5B65C]/10 text-[#D5B65C] border-[#D5B65C]/20">
            AI Active
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#1A1A1A] border border-[#272A40]">
          <TabsTrigger value="trading" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Trading Desk
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <Zap className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="h-4 w-4" />
            Alerts & Monitoring
          </TabsTrigger>
          <TabsTrigger value="workspaces" className="gap-2">
            <Layout className="h-4 w-4" />
            Workspaces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Area */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-[#131316] border-[#272A40] p-6">
                <TradingChart 
                  symbol={selectedSymbol} 
                  onSymbolChange={setSelectedSymbol}
                  onAnalysisUpdate={setAnalysisData}
                />
              </Card>

              <Card className="bg-[#131316] border-[#272A40] p-6">
                <IndicatorsPanel symbol={selectedSymbol} />
              </Card>

              <Card className="bg-[#131316] border-[#272A40] p-6">
                <MarketDataFeed symbol={selectedSymbol} />
              </Card>
            </div>

            {/* Execution & AI Panel */}
            <div className="space-y-4">
              <Card className="bg-[#131316] border-[#272A40] p-6">
                <ExecutionPanel 
                  symbol={selectedSymbol}
                  currentPrice={analysisData?.currentPrice || 0}
                />
              </Card>

              <Card className="bg-[#131316] border-[#272A40] p-6">
                <AIInsightsPanel 
                  symbol={selectedSymbol}
                  analysisData={analysisData}
                />
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <AnalysisResults 
            symbol={selectedSymbol}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
          />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card className="bg-[#131316] border-[#272A40] p-6">
            <AlertsPanel symbol={selectedSymbol} />
          </Card>
        </TabsContent>

        <TabsContent value="workspaces" className="mt-6">
          <Card className="bg-[#131316] border-[#272A40] p-6">
            <WorkspaceManager />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
