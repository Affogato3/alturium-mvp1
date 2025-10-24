import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Send, Zap, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  type: "user" | "system";
  content: string;
  timestamp: Date;
}

export function CommandBar() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "system",
      content: "CNL Grid™ Cognitive Decision Layer initialized. Connected to Liquidity Tensor Engine. Ready for capital optimization directives.",
      timestamp: new Date()
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setInput("");

    try {
      const { data, error } = await supabase.functions.invoke('cnl-optimize', {
        body: { 
          action: "generate_insight",
          data: { command: input }
        }
      });

      if (error) throw error;

      const systemMessage: Message = {
        type: "system",
        content: data.recommendation || "Analysis complete. Processing recommendation...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error("Command processing error:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process command",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        type: "system",
        content: "Error processing command. Please try again or rephrase your request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-black/50">
        <Terminal className="w-4 h-4 text-[hsl(var(--cnl-flow))]" />
        <h2 className="text-sm font-semibold">Command Line for Capital™</h2>
        <Badge variant="outline" className="ml-auto bg-[hsl(var(--cnl-profit))]/10 text-[hsl(var(--cnl-profit))] border-[hsl(var(--cnl-profit))]/20">
          <Zap className="w-3 h-3 mr-1" />
          AI Active
        </Badge>
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.type === "user" 
                  ? "bg-[hsl(var(--cnl-flow))]/20 border border-[hsl(var(--cnl-flow))]/30 text-foreground" 
                  : "bg-card border border-border text-muted-foreground"
              }`}>
                {msg.content}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border bg-black/50">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command or query..."
          className="flex-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={isProcessing}
          className="bg-[hsl(var(--cnl-flow))] hover:bg-[hsl(var(--cnl-flow))]/80 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  );
}
