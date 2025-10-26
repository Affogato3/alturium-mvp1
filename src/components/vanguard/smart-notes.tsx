import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Brain, Sparkles, ListChecks, TrendingUp, Play } from "lucide-react";
import { toast } from "sonner";

interface AIAction {
  command: string;
  icon: any;
  description: string;
}

export function SmartNotes() {
  const [noteContent, setNoteContent] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const aiActions: AIAction[] = [
    { command: "/summarize", icon: FileText, description: "Create executive summary" },
    { command: "/plan", icon: ListChecks, description: "Convert to action plan" },
    { command: "/analyze", icon: Brain, description: "Extract insights & risks" },
    { command: "/kpi", icon: TrendingUp, description: "Link to KPI impacts" },
  ];

  const handleAICommand = (command: string) => {
    setAiProcessing(true);
    
    setTimeout(() => {
      switch (command) {
        case "/summarize":
          setSuggestions([
            "Key Decision: Accelerate product launch by 2 weeks",
            "Budget Impact: +15% marketing allocation approved",
            "Risk: Resource constraint in QA identified",
            "Next Steps: Schedule engineering capacity review"
          ]);
          toast.success("Summary generated");
          break;
        case "/plan":
          setSuggestions([
            "Task 1: Conduct QA capacity assessment (Owner: CTO, Due: 2d)",
            "Task 2: Approve marketing budget increase (Owner: CFO, Due: 1d)",
            "Task 3: Update product roadmap timeline (Owner: CPO, Due: 3d)",
            "Task 4: Communicate changes to stakeholders (Owner: CEO, Due: 5d)"
          ]);
          toast.success("Action plan created");
          break;
        case "/analyze":
          setSuggestions([
            "💡 Opportunity: Early launch could capture market window",
            "⚠️ Risk: QA capacity at 92% - potential quality issues",
            "📊 Financial: Est. revenue lift +$2.4M if successful",
            "🎯 Strategic: Aligns with Q4 revenue acceleration goals"
          ]);
          toast.success("Analysis complete");
          break;
        case "/kpi":
          setSuggestions([
            "Revenue Impact: +12% to Q4 targets",
            "Customer Satisfaction: -3% risk from accelerated timeline",
            "Team Velocity: -8% due to compressed schedule",
            "Market Share: +2.5% if launch succeeds"
          ]);
          toast.success("KPI impacts calculated");
          break;
      }
      setAiProcessing(false);
    }, 1500);
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
            placeholder="Type your notes here... Use AI commands like /summarize, /plan, /analyze, or /kpi"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="min-h-[200px] bg-black/40 border-[hsl(var(--vanguard-text))]/10 text-white placeholder:text-[hsl(var(--vanguard-text))]/40 focus:border-[hsl(var(--vanguard-accent))]/40 resize-none font-mono"
          />
          {aiProcessing && (
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-[hsl(var(--vanguard-accent))]/20 px-3 py-1 rounded-full">
              <Brain className="w-3 h-3 text-[hsl(var(--vanguard-accent))] animate-pulse" />
              <span className="text-xs text-[hsl(var(--vanguard-accent))]">Processing...</span>
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
              {action.command}
            </Button>
          ))}
        </div>

        {suggestions.length > 0 && (
          <Card className="bg-[hsl(var(--vanguard-bg))]/50 border-[hsl(var(--vanguard-accent))]/20 p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[hsl(var(--vanguard-accent))]" />
              <span className="text-sm font-semibold text-[hsl(var(--vanguard-text))]">AI Output</span>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-[hsl(var(--vanguard-card))]/30 border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/30 transition-all cursor-pointer group"
                  >
                    <p className="text-sm text-[hsl(var(--vanguard-text))]/90 group-hover:text-[hsl(var(--vanguard-text))]">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button
              size="sm"
              className="w-full mt-3 bg-[hsl(var(--vanguard-accent))]/20 hover:bg-[hsl(var(--vanguard-accent))]/30 text-[hsl(var(--vanguard-accent))]"
              onClick={() => {
                toast.success("Converted to Decision Log");
                setSuggestions([]);
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Convert to Decision Log
            </Button>
          </Card>
        )}
      </div>
    </Card>
  );
}
