import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Brain, BookOpen, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function SemanticUnderstanding() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contextMap, setContextMap] = useState<any>(null);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [glossary, setGlossary] = useState<any[]>([]);
  const { toast } = useToast();

  const runContextAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("semantic-analysis", {
        body: { action: "analyze_context" }
      });

      if (error) throw error;

      setContextMap(data);
      toast({
        title: "Context Analysis Complete",
        description: `Mapped ${data.terms?.length || 0} business terms`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const explainRelationships = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("semantic-analysis", {
        body: { action: "relationships" }
      });

      if (error) throw error;

      setRelationships(data.relationships || []);
      toast({
        title: "Relationships Mapped",
        description: "Business logic connections identified",
      });
    } catch (error: any) {
      toast({
        title: "Mapping Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const buildGlossary = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("semantic-analysis", {
        body: { action: "glossary" }
      });

      if (error) throw error;

      setGlossary(data.glossary || []);
      toast({
        title: "Glossary Created",
        description: `Defined ${data.glossary?.length || 0} key terms`,
      });
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={runContextAnalysis} disabled={isAnalyzing} className="gap-2">
          <Search className="w-4 h-4" />
          {isAnalyzing ? "Analyzing..." : "Run Context Analysis"}
        </Button>
        <Button onClick={explainRelationships} variant="outline" className="gap-2">
          <Brain className="w-4 h-4" />
          Explain Relationships
        </Button>
        <Button onClick={buildGlossary} variant="secondary" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Build Glossary
        </Button>
      </div>

      {contextMap && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Business Context Map</CardTitle>
              <CardDescription>AI-understood business terminology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contextMap.terms?.map((term: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg bg-card border border-border/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm font-semibold">{term.field}</span>
                          <Badge variant="outline">{term.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{term.meaning}</p>
                      </div>
                      <Badge variant="secondary">
                        {Math.round(term.confidence * 100)}%
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {relationships.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Business Logic Relationships
              </CardTitle>
              <CardDescription>How data points connect in your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationships.map((rel, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-sm font-medium">{rel.from}</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-px w-12 bg-border" />
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {rel.relationship}
                        </Badge>
                        <div className="h-px w-12 bg-border" />
                      </div>
                      
                      <div className="flex-1 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <span className="text-sm font-medium">{rel.to}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 ml-4">{rel.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {glossary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Business Glossary
              </CardTitle>
              <CardDescription>Key terms and their meanings in your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {glossary.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg bg-card border border-border/50 space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{entry.term}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{entry.definition}</p>
                        {entry.example && (
                          <p className="text-xs text-primary/80 mt-2 italic">
                            Example: {entry.example}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
