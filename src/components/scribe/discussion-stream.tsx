import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageSquare, Brain, TrendingUp, Shield, AlertCircle, Send, User } from "lucide-react";

interface Discussion {
  id: string;
  mission: string;
  category: "strategy" | "risk" | "financial" | "operational";
  priority: number;
  messages: Message[];
  aiSummary: string;
  participants: string[];
}

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isAI?: boolean;
}

export function DiscussionStream() {
  const [discussions] = useState<Discussion[]>([
    {
      id: "1",
      mission: "Q4 Revenue Acceleration",
      category: "financial",
      priority: 95,
      aiSummary: "Team consensus on accelerating product launch. Marketing budget approved for +15% increase.",
      participants: ["CFO", "CMO", "CPO"],
      messages: [
        { id: "1", author: "CFO", content: "We need to accelerate Q4 revenue targets by 12%", timestamp: "2h ago" },
        { id: "2", author: "AI Assistant", content: "Analysis: Increasing marketing spend by 15% could yield 18% revenue lift based on historical data.", timestamp: "2h ago", isAI: true },
        { id: "3", author: "CMO", content: "I can reallocate budget from Q1. Let's execute.", timestamp: "1h ago" },
      ],
    },
    {
      id: "2",
      mission: "Cost Optimization Initiative",
      category: "operational",
      priority: 82,
      aiSummary: "Cloud infrastructure costs can be reduced by 23% through reserved instances and auto-scaling.",
      participants: ["CTO", "COO", "Finance"],
      messages: [
        { id: "1", author: "CTO", content: "Current cloud spend is $240K/month. We need optimization.", timestamp: "4h ago" },
        { id: "2", author: "AI Assistant", content: "Recommendation: Switch to reserved instances + implement auto-scaling. Est. savings: $55K/month", timestamp: "4h ago", isAI: true },
      ],
    },
    {
      id: "3",
      mission: "Customer Retention Program",
      category: "strategy",
      priority: 78,
      aiSummary: "Churn risk detected in enterprise segment. Proposed account health scoring system.",
      participants: ["CSM Lead", "Product", "Data"],
      messages: [
        { id: "1", author: "CSM Lead", content: "Enterprise churn increased 4% last quarter", timestamp: "1d ago" },
        { id: "2", author: "AI Assistant", content: "Pattern detected: Customers with <60% feature adoption churning at 3x rate. Suggest proactive engagement.", timestamp: "1d ago", isAI: true },
      ],
    },
  ]);

  const [activeDiscussion, setActiveDiscussion] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strategy": return <TrendingUp className="w-4 h-4" />;
      case "risk": return <Shield className="w-4 h-4" />;
      case "financial": return <TrendingUp className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strategy": return "bg-[hsl(var(--vanguard-accent))]/20 text-[hsl(var(--vanguard-accent))] border-[hsl(var(--vanguard-accent))]/30";
      case "risk": return "bg-[hsl(var(--vanguard-alert))]/20 text-[hsl(var(--vanguard-alert))] border-[hsl(var(--vanguard-alert))]/30";
      case "financial": return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      default: return "bg-blue-500/20 text-blue-500 border-blue-500/30";
    }
  };

  return (
    <Card className="bg-[hsl(var(--vanguard-card))] border-[hsl(var(--vanguard-text))]/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--vanguard-accent))]/20">
            <MessageSquare className="w-5 h-5 text-[hsl(var(--vanguard-accent))]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--vanguard-text))] uppercase tracking-wide">
              Discussion Stream
            </h2>
            <p className="text-xs text-[hsl(var(--vanguard-text))]/60">
              AI-Organized by Priority
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs bg-[hsl(var(--vanguard-accent))]/10 border-[hsl(var(--vanguard-accent))]/30">
          <Brain className="w-3 h-3 mr-1" />
          LIVE
        </Badge>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {discussions.sort((a, b) => b.priority - a.priority).map((discussion) => (
            <div
              key={discussion.id}
              className="bg-[hsl(var(--vanguard-bg))] p-4 rounded-lg border border-[hsl(var(--vanguard-text))]/5 hover:border-[hsl(var(--vanguard-accent))]/40 transition-all duration-300 cursor-pointer"
              onClick={() => setActiveDiscussion(activeDiscussion === discussion.id ? null : discussion.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(discussion.category)}>
                      {getCategoryIcon(discussion.category)}
                      <span className="ml-1.5">{discussion.category}</span>
                    </Badge>
                    <span className="text-xs font-mono text-[hsl(var(--vanguard-accent))]">
                      P{discussion.priority}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[hsl(var(--vanguard-text))] mb-1">
                    {discussion.mission}
                  </h3>
                  <p className="text-sm text-[hsl(var(--vanguard-text))]/70 mb-2">
                    <Brain className="w-3 h-3 inline mr-1 text-[hsl(var(--vanguard-accent))]" />
                    {discussion.aiSummary}
                  </p>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-[hsl(var(--vanguard-text))]/40" />
                    <span className="text-xs text-[hsl(var(--vanguard-text))]/50">
                      {discussion.participants.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              {activeDiscussion === discussion.id && (
                <div className="mt-4 pt-4 border-t border-[hsl(var(--vanguard-text))]/10 space-y-3 animate-fade-in">
                  {discussion.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.isAI
                          ? "bg-[hsl(var(--vanguard-accent))]/10 border border-[hsl(var(--vanguard-accent))]/20"
                          : "bg-[hsl(var(--vanguard-card))]/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.isAI && <Brain className="w-3 h-3 text-[hsl(var(--vanguard-accent))]" />}
                        <span className="text-xs font-semibold text-[hsl(var(--vanguard-text))]">
                          {msg.author}
                        </span>
                        <span className="text-xs text-[hsl(var(--vanguard-text))]/40">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-[hsl(var(--vanguard-text))]/80">{msg.content}</p>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      placeholder="Add to discussion..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-[hsl(var(--vanguard-bg))] border-[hsl(var(--vanguard-text))]/10 text-[hsl(var(--vanguard-text))]"
                    />
                    <Button
                      size="sm"
                      className="bg-[hsl(var(--vanguard-accent))]/20 hover:bg-[hsl(var(--vanguard-accent))]/30 text-[hsl(var(--vanguard-accent))]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
