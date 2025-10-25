import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Brain, Lock } from "lucide-react";
import { GuardianOrb } from "./ethical-arbiter/guardian-orb";
import { EthicalPulseGraph } from "./ethical-arbiter/ethical-pulse-graph";
import { DecisionMatrix } from "./ethical-arbiter/decision-matrix";
import { GuardianOverride } from "./ethical-arbiter/guardian-override";
import { EthicalMemoryTimeline } from "./ethical-arbiter/ethical-memory-timeline";
import { EthicalKnowledgeLens } from "./ethical-arbiter/ethical-knowledge-lens";

export const EthicalArbiterDashboard = () => {
  const [overrideActive, setOverrideActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Shield className="h-10 w-10 text-cyan-400" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                ETHICAL AI ARBITER
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Guardian Console • Real-Time Ethical AI Governance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <Activity className="h-3 w-3 mr-1" />
              ACTIVE
            </Badge>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              <Brain className="h-3 w-3 mr-1" />
              AI MONITORING
            </Badge>
            {overrideActive && (
              <Badge variant="outline" className="border-amber-500/50 text-amber-400 animate-pulse">
                <Lock className="h-3 w-3 mr-1" />
                SANDBOX MODE
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Guardian Override */}
        <div className="col-span-12 lg:col-span-2">
          <GuardianOverride 
            overrideActive={overrideActive}
            setOverrideActive={setOverrideActive}
          />
        </div>

        {/* Center Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Guardian Orb - Main Interactive Core */}
          <GuardianOrb />

          {/* Decision Matrix */}
          <DecisionMatrix overrideActive={overrideActive} />
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Ethical Knowledge Lens */}
          <EthicalKnowledgeLens />
          
          {/* Ethical Pulse Graph */}
          <EthicalPulseGraph />
        </div>

        {/* Bottom - Ethical Memory Timeline */}
        <div className="col-span-12">
          <EthicalMemoryTimeline />
        </div>
      </div>
    </div>
  );
};
