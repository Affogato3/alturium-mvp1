import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, TrendingUp, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QueryResult {
  query: string;
  interpretation: string;
  results: any;
  timestamp: Date;
}

export const NaturalLanguageQuery = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);
  const { toast } = useToast();

  const suggestedQueries = [
    "Show me revenue by customer, adjusting for support costs",
    "Why did our margin drop in APAC region?",
    "Simulate reallocating $3M from marketing to logistics",
    "Find cost-optimal supplier network for Europe"
  ];

  const handleQuery = async (queryText: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('synapsex-nlq', {
        body: { query: queryText }
      });

      if (error) throw error;

      const result: QueryResult = {
        query: queryText,
        interpretation: data.response.query_interpretation,
        results: data.response,
        timestamp: new Date()
      };

      setQueryHistory([result, ...queryHistory]);
      setQuery("");

      toast({
        title: "Query Complete",
        description: "AI has analyzed your query successfully",
      });
    } catch (error: any) {
      toast({
        title: "Query Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = (result: QueryResult) => {
    const { results } = result;

    // Handle narrative/text responses
    if (results.type === 'narrative' && results.content) {
      return (
        <div className="prose prose-invert max-w-none">
          <div className="text-[#EDEDED] whitespace-pre-wrap leading-relaxed text-sm">
            {results.content.split('\n').map((line: string, idx: number) => {
              // Handle markdown-style headers
              if (line.startsWith('**') && line.endsWith('**')) {
                const text = line.replace(/\*\*/g, '');
                return (
                  <h4 key={idx} className="text-[#CFAF6E] font-bold text-base mt-3 mb-2">
                    {text}
                  </h4>
                );
              }
              // Handle bullet points and lists
              if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('✅') || line.trim().startsWith('⚠️') || line.trim().startsWith('💡') || line.trim().startsWith('📊')) {
                return (
                  <p key={idx} className="text-[#BFBFBF] ml-4 my-1">
                    {line}
                  </p>
                );
              }
              // Handle numbered lists
              if (/^\d+\./.test(line.trim())) {
                return (
                  <p key={idx} className="text-[#BFBFBF] ml-4 my-1 font-medium">
                    {line}
                  </p>
                );
              }
              // Regular paragraphs
              if (line.trim()) {
                return (
                  <p key={idx} className="text-[#EDEDED] my-1.5">
                    {line}
                  </p>
                );
              }
              return <br key={idx} />;
            })}
          </div>
        </div>
      );
    }

    // Fallback for any legacy structured data
    return (
      <div className="text-[#BFBFBF] text-sm">
        Query processed successfully.
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#CFAF6E]" />
            <h3 className="text-xl font-bold text-[#EDEDED]">Ask Anything</h3>
          </div>

          <div className="flex gap-2 mb-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && query.trim() && handleQuery(query)}
              placeholder="e.g., Show me profit by region or Why did CAC increase?"
              className="bg-[#1A1A1A]/50 border-[#CFAF6E]/30 text-[#EDEDED] placeholder:text-[#BFBFBF]"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleQuery(query)}
              disabled={isLoading || !query.trim()}
              className="bg-gradient-to-r from-[#CFAF6E] to-[#EDEDED] text-black hover:opacity-90 shadow-lg shadow-[#CFAF6E]/20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-6">
            <div className="text-xs text-[#BFBFBF]">Suggested queries:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuery(sq)}
                  disabled={isLoading}
                  className="px-3 py-1 text-xs bg-[#1A1A1A]/50 border border-[#CFAF6E]/30 text-[#EDEDED] rounded-full hover:bg-[#CFAF6E]/20 hover:border-[#CFAF6E]/60 transition-all disabled:opacity-50"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {queryHistory.map((result, idx) => (
                <div key={idx} className="p-4 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-[#EDEDED] font-semibold mb-1">{result.query}</div>
                      <div className="text-xs text-[#BFBFBF] italic">{result.interpretation}</div>
                    </div>
                    <div className="text-xs text-[#BFBFBF]">
                      {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {renderResults(result)}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#CFAF6E]/20 p-6">
          <h3 className="text-lg font-bold text-[#EDEDED] mb-4">Quick Metrics</h3>
          <div className="space-y-3">
            <div className="p-3 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-4 h-4 text-[#CFAF6E]" />
                <span className="text-xs text-[#BFBFBF]">Revenue Growth</span>
              </div>
              <div className="text-2xl font-bold text-[#CFAF6E] mt-2">+23%</div>
            </div>
            <div className="p-3 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
              <div className="flex items-center justify-between">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-[#BFBFBF]">Gross Margin</span>
              </div>
              <div className="text-2xl font-bold text-green-400 mt-2">72%</div>
            </div>
            <div className="p-3 bg-[#1A1A1A]/50 border border-[#CFAF6E]/20 rounded-lg">
              <div className="flex items-center justify-between">
                <Users className="w-4 h-4 text-[#EDEDED]" />
                <span className="text-xs text-[#BFBFBF]">CAC</span>
              </div>
              <div className="text-2xl font-bold text-[#EDEDED] mt-2">$8.5K</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};