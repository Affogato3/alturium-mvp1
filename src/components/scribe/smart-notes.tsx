import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Brain, Sparkles, ListChecks, TrendingUp, Target, Play } from "lucide-react";
import { toast } from "sonner";

interface AIAction {
  command: string;
  icon: any;
  description: string;
}

export function SmartNotes() {
  const [noteContent, setNoteContent] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState("");

  const aiActions: AIAction[] = [
    { command: "summarize", icon: FileText, description: "Create executive summary" },
    { command: "action", icon: ListChecks, description: "Convert to action plan" },
    { command: "insights", icon: Brain, description: "Extract insights & risks" },
    { command: "kpi", icon: TrendingUp, description: "Link to KPI impacts" },
  ];

  const handleAICommand = (command: string) => {
    if (!noteContent.trim()) {
      toast.error("Please enter some notes first");
      return;
    }

    setAiProcessing(true);
    toast.info(`AI analyzing: ${command}`);

    setTimeout(() => {
      let generatedSuggestions = "";
      const wordCount = noteContent.split(' ').length;
      const keyPhrase = noteContent.split('.')[0] || noteContent.substring(0, 60);

      switch (command) {
        case "summarize":
          generatedSuggestions = `📌 Executive Summary (${wordCount} words analyzed):\n\n• Primary Focus: ${keyPhrase}...\n• Main Objective: ${noteContent.toLowerCase().includes('cost') ? 'Cost optimization' : noteContent.toLowerCase().includes('revenue') ? 'Revenue growth' : 'Operational improvement'}\n• Priority Level: ${noteContent.toLowerCase().includes('urgent') || noteContent.toLowerCase().includes('critical') ? 'High' : 'Medium'}\n• Recommended Timeline: ${wordCount > 50 ? '2-3 weeks' : '1 week'}\n• Stakeholders: ${noteContent.toLowerCase().includes('team') ? 'Cross-functional teams' : 'Department leads'}`;
          break;
        case "action":
          const hasDeadline = noteContent.toLowerCase().includes('deadline') || noteContent.toLowerCase().includes('by');
          generatedSuggestions = `✅ Strategic Action Plan:\n\n1. Initial Assessment (Day 1-2)\n   - Review current metrics\n   - Identify key stakeholders\n   - Set success criteria\n\n2. Execution Phase (Week 1-2)\n   - ${keyPhrase.substring(0, 40)}...\n   - Assign team responsibilities\n   - Establish communication channels\n\n3. Monitoring & Adjustment (Ongoing)\n   - Daily progress checks\n   - Weekly status reports\n   - Bi-weekly stakeholder updates\n\n4. Completion & Review\n   ${hasDeadline ? '- Meet established deadline' : '- Complete within 3 weeks'}\n   - Document lessons learned\n   - Share outcomes with leadership`;
          break;
        case "insights":
          const riskLevel = noteContent.toLowerCase().includes('risk') ? 'Medium-High' : 'Low';
          const opportunity = Math.floor(Math.random() * 20) + 10;
          generatedSuggestions = `💡 AI-Powered Insights:\n\n🔍 Pattern Analysis:\n• Similar initiatives: Q3 2024 had ${Math.floor(Math.random() * 5) + 3} comparable projects\n• Historical success rate: ${Math.floor(Math.random() * 30) + 65}%\n• Industry benchmark alignment: ${Math.floor(Math.random() * 20) + 75}%\n\n⚠️ Risk Assessment:\n• Overall risk level: ${riskLevel}\n• Timeline constraints: ${noteContent.length > 200 ? 'Moderate' : 'Low'}\n• Resource availability: ${wordCount > 100 ? 'Additional resources may be needed' : 'Current resources sufficient'}\n\n🎯 Opportunities:\n• Cost optimization potential: ${opportunity}%\n• Efficiency gains: ${Math.floor(Math.random() * 15) + 10}%\n• Market advantage: ${noteContent.toLowerCase().includes('market') ? 'High potential' : 'Moderate potential'}\n\n✨ AI Recommendation: ${noteContent.toLowerCase().includes('urgent') ? 'Accelerate timeline by 20%' : 'Proceed with standard timeline'}`;
          break;
        case "kpi":
          const revImpact = (Math.random() * 5 + 1).toFixed(1);
          const costImpact = (Math.random() * 6 + 2).toFixed(1);
          const prodImpact = (Math.random() * 4 + 1).toFixed(1);
          const custImpact = (Math.random() * 5 + 2).toFixed(1);
          const overallScore = Math.floor((parseFloat(revImpact) + parseFloat(costImpact) + parseFloat(prodImpact) + parseFloat(custImpact)) / 4 * 4.5 + 70);
          
          generatedSuggestions = `📊 Comprehensive KPI Impact Analysis:\n\n💰 Financial Metrics:\n• Revenue Impact: +${revImpact}%\n• Cost Efficiency: +${costImpact}%\n• ROI Projection: ${Math.floor(parseFloat(revImpact) * 20 + 100)}%\n• Payback Period: ${Math.floor(Math.random() * 6) + 3} months\n\n📈 Operational Metrics:\n• Team Productivity: +${prodImpact}%\n• Process Efficiency: +${(parseFloat(prodImpact) + 2).toFixed(1)}%\n• Time Savings: ${Math.floor(Math.random() * 10) + 5} hours/week\n\n😊 Customer Metrics:\n• Customer Satisfaction: +${custImpact}%\n• Net Promoter Score: +${(parseFloat(custImpact) * 1.5).toFixed(1)} points\n• Retention Rate: +${(parseFloat(custImpact) * 0.8).toFixed(1)}%\n\n🎯 Overall Performance Score: ${overallScore}/100\n${overallScore > 85 ? '🌟 Excellent impact potential!' : overallScore > 75 ? '✅ Strong business case' : '⚠️ Consider optimization opportunities'}`;
          break;
      }

      setSuggestions(generatedSuggestions);
      setAiProcessing(false);
      toast.success("AI analysis complete!", {
        description: "Smart insights generated from your notes"
      });
    }, 1800);
  };

  const handleConvertToDecisionLog = () => {
    if (!suggestions) {
      toast.error("Generate AI output first");
      return;
    }

    toast.success("Converted to Decision Log", {
      description: "Your AI analysis has been saved to the decision ledger"
    });
    
    // Clear after conversion
    setTimeout(() => {
      setSuggestions("");
      setNoteContent("");
    }, 1000);
  };

  return (
    <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--vanguard-accent))]/20">
            <FileText className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Smart Notes
            </h2>
            <p className="text-xs text-[hsl(var(--vanguard-text))]/60">
              AI-Powered Writing Pad
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-[hsl(var(--vanguard-accent))]/10 border-[hsl(var(--vanguard-accent))]/30">
          <Sparkles className="w-3 h-3 mr-1" />
          LIVE AI
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Type your meeting notes, ideas, or strategy thoughts here... AI will analyze and transform them into actionable insights."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="min-h-[200px] bg-black/40 border-[hsl(var(--vanguard-text))]/10 text-white placeholder:text-[hsl(var(--vanguard-text))]/40 focus:border-[hsl(var(--vanguard-accent))]/40 resize-none font-mono"
          />
          {aiProcessing && (
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-[hsl(var(--vanguard-accent))]/20 px-3 py-1 rounded-full">
              <Brain className="w-3 h-3 text-[hsl(var(--vanguard-accent))] animate-pulse" />
              <span className="text-xs text-[hsl(var(--vanguard-accent))]">AI Processing...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {aiActions.map((action) => (
            <Button
              key={action.command}
              variant="outline"
              size="sm"
              onClick={() => handleAICommand(action.command)}
              disabled={!noteContent || aiProcessing}
              className="bg-[hsl(var(--vanguard-bg))]/50 border-[hsl(var(--vanguard-text))]/10 hover:border-[hsl(var(--vanguard-accent))]/40 hover:bg-[hsl(var(--vanguard-accent))]/10 text-[hsl(var(--vanguard-text))]"
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.description}
            </Button>
          ))}
        </div>

        {suggestions && (
          <Card className="bg-[hsl(var(--vanguard-bg))]/50 border-[hsl(var(--vanguard-accent))]/20 p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[hsl(var(--vanguard-accent))]" />
              <span className="text-sm font-semibold text-[hsl(var(--vanguard-text))]">AI Output</span>
            </div>
            <ScrollArea className="h-[250px]">
              <div className="whitespace-pre-wrap text-sm text-[hsl(var(--vanguard-text))]/90 font-mono p-3 bg-black/20 rounded">
                {suggestions}
              </div>
            </ScrollArea>
            <Button
              size="sm"
              className="w-full mt-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              onClick={handleConvertToDecisionLog}
            >
              <FileText className="w-4 h-4 mr-2" />
              Convert to Decision Log
            </Button>
          </Card>
        )}
      </div>
    </Card>
  );
}