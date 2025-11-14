import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalSynapseMap } from "./global-synapse-map";
import { ImpactSimulator } from "./impact-simulator";
import { ActionCards } from "./action-cards";
import { OutcomeTracker } from "./outcome-tracker";
import { CausalMesh } from "./causal-mesh";
import { AlertsPanel } from "./alerts-panel";
import { AutoPlaybooks } from "./auto-playbooks";

export function MarketMapDashboard() {
  const [activeView, setActiveView] = useState("synapse");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1A2238] to-[#0a0a0a] overflow-hidden">
      {/* Animated Neural Mesh Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 50%, rgba(207, 175, 110, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 50%, rgba(26, 34, 56, 0.1) 0%, transparent 50%)`,
          backgroundSize: '100% 100%',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Market Map <span className="text-primary">Synapse™</span>
          </h1>
          <p className="text-muted-foreground">
            The world reacts in seconds. Now your company does too.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-primary"
          >
            ⚡ Synapse Online — Monitoring global pulse
          </motion.div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2 bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="synapse" className="data-[state=active]:bg-primary/20">
              🌍 Synapse Map
            </TabsTrigger>
            <TabsTrigger value="impact" className="data-[state=active]:bg-primary/20">
              ⚖ Impact Sim
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-primary/20">
              💡 Actions
            </TabsTrigger>
            <TabsTrigger value="playbooks" className="data-[state=active]:bg-primary/20">
              ⚙ Playbooks
            </TabsTrigger>
            <TabsTrigger value="mesh" className="data-[state=active]:bg-primary/20">
              🧩 Causal Mesh
            </TabsTrigger>
            <TabsTrigger value="outcomes" className="data-[state=active]:bg-primary/20">
              📈 Outcomes
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-primary/20">
              🔔 Alerts
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="synapse" className="space-y-6">
              <GlobalSynapseMap />
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <ImpactSimulator />
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <ActionCards />
            </TabsContent>

            <TabsContent value="playbooks" className="space-y-6">
              <AutoPlaybooks />
            </TabsContent>

            <TabsContent value="mesh" className="space-y-6">
              <CausalMesh />
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-6">
              <OutcomeTracker />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <AlertsPanel />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
