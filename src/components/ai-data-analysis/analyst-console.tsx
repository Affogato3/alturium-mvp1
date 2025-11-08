import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const AnalystConsole = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const suggestedQueries = [
    "Why did payroll expenses spike last quarter?",
    "Show me revenue by customer adjusted for support costs",
    "What's driving the CAC increase?",
    "Forecast next quarter's revenue",
  ];

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyst-query', {
        body: { query: text, conversation: messages }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: "Query Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-[#1A1A1A]/95 backdrop-blur-md border-[#CFAF6E]/20 p-6 h-[700px] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#CFAF6E]/10 rounded-lg border border-[#CFAF6E]/30">
          <Brain className="w-6 h-6 text-[#CFAF6E]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#EDEDED]">Ask My Analyst</h3>
          <p className="text-sm text-[#BFBFBF]">Your private AI data analyst</p>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#CFAF6E]/20 to-[#EDEDED]/10 flex items-center justify-center border-2 border-[#CFAF6E]/30">
              <Brain className="w-10 h-10 text-[#CFAF6E]" />
            </div>
            <h4 className="text-lg font-semibold text-[#EDEDED] mb-2">Good morning</h4>
            <p className="text-sm text-[#BFBFBF]">Would you like today's financial pulse?</p>
          </motion.div>

          <div className="w-full max-w-md space-y-2">
            <p className="text-xs text-[#BFBFBF] text-center mb-3">Suggested queries:</p>
            {suggestedQueries.map((query, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => sendMessage(query)}
                className="w-full text-left px-4 py-3 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg hover:border-[#CFAF6E]/40 hover:bg-[#1A1A1A]/70 transition-all text-sm text-[#EDEDED]"
              >
                {query}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-[#CFAF6E]/10 flex items-center justify-center border border-[#CFAF6E]/30 flex-shrink-0">
                    <Brain className="w-4 h-4 text-[#CFAF6E]" />
                  </div>
                )}

                <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                  <div className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-[#CFAF6E]/20 border border-[#CFAF6E]/30"
                      : "bg-[#1A1A1A]/70 border border-[#CFAF6E]/10"
                  }`}>
                    <p className="text-sm text-[#EDEDED] whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-[#BFBFBF] mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-[#EDEDED]/10 flex items-center justify-center border border-[#EDEDED]/30 flex-shrink-0">
                    <User className="w-4 h-4 text-[#EDEDED]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#CFAF6E]/10 flex items-center justify-center border border-[#CFAF6E]/30">
                <Brain className="w-4 h-4 text-[#CFAF6E]" />
              </div>
              <div className="p-4 bg-[#1A1A1A]/70 border border-[#CFAF6E]/10 rounded-lg">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-[#CFAF6E] rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isProcessing && input.trim() && sendMessage(input)}
          placeholder="Ask anything about your business..."
          className="bg-[#1A1A1A]/50 border-[#CFAF6E]/30 text-[#EDEDED] placeholder:text-[#BFBFBF]"
          disabled={isProcessing}
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={isProcessing || !input.trim()}
          className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
