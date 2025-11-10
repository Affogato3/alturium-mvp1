import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntelligenceOrb } from "./intelligence-orb";
import { AnalystConsole } from "./analyst-console";
import { DataQualityMonitor } from "./data-quality-monitor";
import { PatternDiscovery } from "./pattern-discovery";
import { InsightCards } from "./insight-cards";
import { InteractiveDashboard } from "./interactive-dashboard";
import { EmbeddedAnalyticsPanel } from "./embedded-analytics-panel";
import { ProactiveAlerts } from "./proactive-alerts";
import { ROICalculator } from "./roi-calculator";
import { ExecutiveReportGenerator } from "./executive-report-generator";
import { DataSourceConnector } from "./data-source-connector";
import { CollaborationPanel } from "./collaboration-panel";
import { SmartFilters } from "./smart-filters";
import { VersionHistory } from "./version-history";
import { DashboardBuilder } from "./dashboard-builder";
import { ExportPanel } from "./export-panel";
import { PatternRecognition } from "./pattern-recognition";
import { ComparativeAnalysis } from "./comparative-analysis";
import { ValueAssessment } from "./value-assessment";
import { SelfOptimization } from "./self-optimization";
import { MultiModalInput } from "./multi-modal-input";
import { SemanticUnderstanding } from "./semantic-understanding";
import { PerceptionSystems } from "./perception-systems";
import { motion, AnimatePresence } from "framer-motion";

export const AIDataAnalysisDashboard = () => {
  const [showConsole, setShowConsole] = useState(false);
  const [isOrbActive, setIsOrbActive] = useState(true);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0B0C10] to-[#050505] p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#EDEDED] mb-2">AI Data Analysis</h1>
          <p className="text-[#BFBFBF]">
            Your private, continuously learning data analyst agent
          </p>
        </motion.div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Smart Filters & Version History - Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <SmartFilters />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <VersionHistory />
              </motion.div>
            </div>

            {/* Data Source Connector - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DataSourceConnector />
            </motion.div>

            {/* Interactive Dashboard - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <InteractiveDashboard />
            </motion.div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <InsightCards />
                </motion.div>
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <DataQualityMonitor />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <PatternDiscovery />
                </motion.div>
              </div>

              {/* Right Column - Collaboration */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <CollaborationPanel />
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Tabs defaultValue="patterns" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
                  <TabsTrigger value="patterns">Patterns</TabsTrigger>
                  <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
                  <TabsTrigger value="valuation">Valuation</TabsTrigger>
                  <TabsTrigger value="optimize">Self-Optimize</TabsTrigger>
                  <TabsTrigger value="multimodal">Multi-Modal</TabsTrigger>
                  <TabsTrigger value="semantic">Semantic</TabsTrigger>
                  <TabsTrigger value="perception">Perception</TabsTrigger>
                </TabsList>
                
                <TabsContent value="patterns">
                  <PatternRecognition />
                </TabsContent>
                
                <TabsContent value="benchmark">
                  <ComparativeAnalysis />
                </TabsContent>
                
                <TabsContent value="valuation">
                  <ValueAssessment />
                </TabsContent>
                
                <TabsContent value="optimize">
                  <SelfOptimization />
                </TabsContent>
                
                <TabsContent value="multimodal">
                  <MultiModalInput />
                </TabsContent>
                
                <TabsContent value="semantic">
                  <SemanticUnderstanding />
                </TabsContent>
                
                <TabsContent value="perception">
                  <PerceptionSystems />
                </TabsContent>
              </Tabs>
            </motion.div>
          </TabsContent>

          <TabsContent value="workflow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EmbeddedAnalyticsPanel />
            </motion.div>
          </TabsContent>

          <TabsContent value="alerts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProactiveAlerts />
            </motion.div>
          </TabsContent>

          <TabsContent value="roi">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ROICalculator />
            </motion.div>
          </TabsContent>

          <TabsContent value="reports">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ExecutiveReportGenerator />
            </motion.div>
          </TabsContent>

          <TabsContent value="builder">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DashboardBuilder />
            </motion.div>
          </TabsContent>

          <TabsContent value="export">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ExportPanel />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Intelligence Orb */}
      <IntelligenceOrb
        onExpand={() => setShowConsole(true)}
        isActive={isOrbActive}
      />

      {/* Analyst Console Dialog */}
      <Dialog open={showConsole} onOpenChange={setShowConsole}>
        <DialogContent className="max-w-4xl h-[90vh] bg-transparent border-none p-0">
          <AnimatePresence>
            {showConsole && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <AnalystConsole />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};
