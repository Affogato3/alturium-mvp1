import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuantumFieldBackground } from "./quantum-field-background";
import { AIControlPanel } from "./ai-control-panel";
import { NaturalLanguageQuery } from "./natural-language-query";
import { ScenarioModeler } from "./scenario-modeler";
import { ConnectorHealthDashboard } from "./connector-health-dashboard";
import { Brain, MessageSquare, BarChart3, Network } from "lucide-react";

export const SmartFinanceAssistant = () => {
  const [activeTab, setActiveTab] = useState("ai-command");

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      <QuantumFieldBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-black/80 via-[#1A1A1A]/40 to-black/80 p-6 border-b border-[#CFAF6E]/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#CFAF6E]/20 to-[#EDEDED]/10 backdrop-blur-sm animate-pulse">
              <Brain className="w-10 h-10 text-[#CFAF6E]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#EDEDED] via-[#CFAF6E] to-[#EDEDED] bg-clip-text text-transparent">
                Smart Finance Assistant
              </h1>
              <p className="text-[#BFBFBF] text-sm mt-1">
                AI-Powered Financial Intelligence • Natural Language Queries • Predictive Modeling
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20">
            <TabsTrigger 
              value="ai-command"
              className="data-[state=active]:bg-[#CFAF6E] data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#CFAF6E]/20 text-[#EDEDED]"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Command
            </TabsTrigger>
            <TabsTrigger 
              value="nlq"
              className="data-[state=active]:bg-[#CFAF6E] data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#CFAF6E]/20 text-[#EDEDED]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask AI
            </TabsTrigger>
            <TabsTrigger 
              value="scenarios"
              className="data-[state=active]:bg-[#CFAF6E] data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#CFAF6E]/20 text-[#EDEDED]"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger 
              value="connectors"
              className="data-[state=active]:bg-[#CFAF6E] data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#CFAF6E]/20 text-[#EDEDED]"
            >
              <Network className="w-4 h-4 mr-2" />
              Connectors
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="ai-command">
              <AIControlPanel />
            </TabsContent>

            <TabsContent value="nlq">
              <NaturalLanguageQuery />
            </TabsContent>

            <TabsContent value="scenarios">
              <ScenarioModeler />
            </TabsContent>

            <TabsContent value="connectors">
              <ConnectorHealthDashboard />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};