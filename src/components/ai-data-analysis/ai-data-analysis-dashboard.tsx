import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IntelligenceOrb } from "./intelligence-orb";
import { AnalystConsole } from "./analyst-console";
import { DataQualityMonitor } from "./data-quality-monitor";
import { PatternDiscovery } from "./pattern-discovery";
import { InsightCards } from "./insight-cards";
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <InsightCards />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DataQualityMonitor />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PatternDiscovery />
            </motion.div>
          </div>
        </div>
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
