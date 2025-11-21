import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Settings, Calendar, History, TrendingUp, FileText, Brain } from "lucide-react";
import { CompanyDataCollector } from "./finsights/company-data-collector";
import { BoardDeckGenerator } from "./finsights/board-deck-generator";
import { BrandingConfigurator } from "./finsights/branding-configurator";
import { ScheduledReportsManager } from "./finsights/scheduled-reports-manager";
import { ReportVersionHistory } from "./finsights/report-version-history";
import { AICommentarySettings } from "./finsights/ai-commentary-settings";
import { AnalyticsDashboard } from "./finsights/analytics-dashboard";
import { FinancialIntelligence } from "./finsights/financial-intelligence";

export const FinSightsDashboard = () => {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-indigo-400" />
              FinSights
            </h1>
            <p className="text-slate-400 mt-2">
              Comprehensive board-ready financial presentations in seconds
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid grid-cols-8 gap-2 bg-slate-900/50 p-1">
              <TabsTrigger value="generate" className="data-[state=active]:bg-indigo-600">
                <FileText className="w-4 h-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-indigo-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Company Data
              </TabsTrigger>
              <TabsTrigger value="branding" className="data-[state=active]:bg-indigo-600">
                <Settings className="w-4 h-4 mr-2" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-indigo-600">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-indigo-600">
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-indigo-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="data-[state=active]:bg-indigo-600">
                <Brain className="w-4 h-4 mr-2" />
                Intelligence
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-6">
              <BoardDeckGenerator />
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <CompanyDataCollector />
            </TabsContent>

            <TabsContent value="branding" className="mt-6">
              <BrandingConfigurator />
            </TabsContent>

            <TabsContent value="schedule" className="mt-6">
              <ScheduledReportsManager />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <ReportVersionHistory />
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <AICommentarySettings />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="intelligence" className="mt-6">
              <FinancialIntelligence />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
