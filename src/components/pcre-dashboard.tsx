import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, AlertTriangle, Zap, Activity } from "lucide-react";
import { ReflexCards } from "./pcre/reflex-cards";
import { CorporateReflexGraph } from "./pcre/corporate-reflex-graph";
import { DataStreamMonitor } from "./pcre/data-stream-monitor";
import { DecisionSimulator } from "./pcre/decision-simulator";
import { AdaptiveLearningPanel } from "./pcre/adaptive-learning-panel";

export function PCREDashboard() {
  const [activeTab, setActiveTab] = useState("reflexes");

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Predictive Corporate Reflex Engine
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Real-time adaptive intelligence • Continuous strategic optimization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            LEARNING ACTIVE
          </Badge>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            <Zap className="w-3 h-3 mr-1" />
            98.7% CONFIDENCE
          </Badge>
        </div>
      </div>

      {/* Status Bar */}
      <Card className="bg-gradient-to-r from-[#0A0A0A] to-[#111111] border-cyan-500/20 p-4">
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-xs text-white/40 uppercase tracking-wider">Active Predictions</div>
            <div className="text-2xl font-bold text-cyan-400">23</div>
            <div className="text-xs text-emerald-400">+5 from last hour</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-white/40 uppercase tracking-wider">Risk Alerts</div>
            <div className="text-2xl font-bold text-red-400">3</div>
            <div className="text-xs text-red-400">2 critical, 1 medium</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-white/40 uppercase tracking-wider">Opportunities</div>
            <div className="text-2xl font-bold text-emerald-400">12</div>
            <div className="text-xs text-emerald-400">$4.2M potential value</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-white/40 uppercase tracking-wider">Model Accuracy</div>
            <div className="text-2xl font-bold text-cyan-400">94.2%</div>
            <div className="text-xs text-cyan-400">+2.1% this week</div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#0A0A0A] border border-cyan-500/20">
          <TabsTrigger value="reflexes" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <TrendingUp className="w-4 h-4 mr-2" />
            Reflex Cards
          </TabsTrigger>
          <TabsTrigger value="graph" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Activity className="w-4 h-4 mr-2" />
            Reflex Graph
          </TabsTrigger>
          <TabsTrigger value="streams" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Zap className="w-4 h-4 mr-2" />
            Data Streams
          </TabsTrigger>
          <TabsTrigger value="simulator" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Brain className="w-4 h-4 mr-2" />
            Decision Simulator
          </TabsTrigger>
          <TabsTrigger value="learning" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Adaptive Learning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reflexes" className="space-y-6">
          <ReflexCards />
        </TabsContent>

        <TabsContent value="graph" className="space-y-6">
          <CorporateReflexGraph />
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <DataStreamMonitor />
        </TabsContent>

        <TabsContent value="simulator" className="space-y-6">
          <DecisionSimulator />
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <AdaptiveLearningPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
