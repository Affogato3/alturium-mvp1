import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Mic, Image, FileText, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export function MultiModalInput() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke("multi-modal-process", {
          body: { 
            action: "process_file",
            fileType: file.type,
            content: content.substring(0, 5000) // First 5000 chars
          }
        });

        if (error) throw error;

        setExtractedData(data);
        toast({
          title: "File Processed",
          description: "Data extraction complete",
        });
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeImage = async () => {
    toast({
      title: "Coming Soon",
      description: "Image analysis will be available in the next update",
    });
  };

  const transcribeMeeting = async () => {
    toast({
      title: "Coming Soon",
      description: "Audio transcription will be available in the next update",
    });
  };

  const summarizeContent = async () => {
    if (!extractedData) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("multi-modal-process", {
        body: { 
          action: "summarize",
          content: extractedData
        }
      });

      if (error) throw error;

      setSummary(data.summary || "");
      toast({
        title: "Summary Generated",
        description: "AI analysis complete",
      });
    } catch (error: any) {
      toast({
        title: "Summarization Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label>
          <input
            type="file"
            accept=".txt,.csv,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing}
          />
          <Button variant="outline" className="w-full gap-2" asChild>
            <span>
              <Upload className="w-4 h-4" />
              Upload File
            </span>
          </Button>
        </label>
        
        <Button variant="outline" className="gap-2" onClick={transcribeMeeting}>
          <Mic className="w-4 h-4" />
          Transcribe Audio
        </Button>
        
        <Button variant="outline" className="gap-2" onClick={analyzeImage}>
          <Image className="w-4 h-4" />
          Analyze Image
        </Button>
        
        <Button 
          variant="secondary" 
          className="gap-2" 
          onClick={summarizeContent}
          disabled={!extractedData || isProcessing}
        >
          <MessageSquare className="w-4 h-4" />
          Summarize
        </Button>
      </div>

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FileText className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="text-sm font-medium">Processing multi-modal input...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {extractedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Extracted Data
              </CardTitle>
              <CardDescription>Structured information from your input</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {extractedData.fields?.map((field: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-card border border-border/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{field.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(field.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
