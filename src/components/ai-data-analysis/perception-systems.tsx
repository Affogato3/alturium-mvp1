import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Sparkles, Table2, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export function PerceptionSystems() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [structuredData, setStructuredData] = useState<any>(null);
  const [dataQuality, setDataQuality] = useState<any>(null);
  const { toast } = useToast();

  const ingestRawData = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing stages
    const stages = [
      { progress: 25, message: "Reading raw data..." },
      { progress: 50, message: "Detecting schema..." },
      { progress: 75, message: "Normalizing formats..." },
      { progress: 100, message: "Structuring complete!" }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingProgress(stage.progress);
      
      if (stage.progress === 100) {
        try {
          const { data, error } = await supabase.functions.invoke("perception-process", {
            body: { action: "ingest" }
          });

          if (error) throw error;

          setDataQuality(data.quality);
          toast({
            title: stage.message,
            description: `Processed ${data.rows_processed || 0} rows`,
          });
        } catch (error: any) {
          toast({
            title: "Processing Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    }

    setIsProcessing(false);
  };

  const cleanAndStructure = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("perception-process", {
        body: { action: "structure" }
      });

      if (error) throw error;

      setStructuredData(data);
      toast({
        title: "Data Structured",
        description: "Schema detection and formatting complete",
      });
    } catch (error: any) {
      toast({
        title: "Structuring Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const syncToWarehouse = async () => {
    toast({
      title: "Sync Initiated",
      description: "Exporting to data warehouse...",
    });
    
    // Simulate sync
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Data successfully exported",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={ingestRawData} disabled={isProcessing} className="gap-2">
          <Settings className="w-4 h-4" />
          {isProcessing ? "Processing..." : "Ingest Raw Data"}
        </Button>
        <Button onClick={cleanAndStructure} variant="outline" className="gap-2" disabled={isProcessing}>
          <Sparkles className="w-4 h-4" />
          Clean & Structure
        </Button>
        <Button onClick={syncToWarehouse} variant="secondary" className="gap-2" disabled={!structuredData}>
          <Database className="w-4 h-4" />
          Sync to Warehouse
        </Button>
      </div>

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing Pipeline</span>
                  <span className="text-sm text-muted-foreground">{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span>
                    {processingProgress < 25 && "Reading raw data streams..."}
                    {processingProgress >= 25 && processingProgress < 50 && "Detecting data schema..."}
                    {processingProgress >= 50 && processingProgress < 75 && "Normalizing formats..."}
                    {processingProgress >= 75 && "Finalizing structure..."}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {dataQuality && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Data Quality Assessment</CardTitle>
              <CardDescription>Automated quality checks on ingested data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Rows Processed</div>
                  <div className="text-3xl font-bold text-primary">
                    {dataQuality.rows_processed?.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Data Integrity</div>
                  <div className="text-3xl font-bold">{dataQuality.integrity}%</div>
                  <Badge variant={dataQuality.integrity > 95 ? "default" : "secondary"}>
                    {dataQuality.integrity > 95 ? "Excellent" : "Good"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Fields Detected</div>
                  <div className="text-3xl font-bold">{dataQuality.fields_detected}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {structuredData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="w-5 h-5" />
                Structured Dataset Preview
              </CardTitle>
              <CardDescription>AI-generated clean schema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">Schema Version: {structuredData.schema_version}</Badge>
                  <Badge variant="outline">{structuredData.fields?.length} Fields</Badge>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Field Name</th>
                        <th className="text-left p-3 font-medium">Type</th>
                        <th className="text-left p-3 font-medium">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {structuredData.fields?.map((field: any, idx: number) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-t border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3 font-mono">{field.name}</td>
                          <td className="p-3">
                            <Badge variant="secondary">{field.type}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[100px]">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${field.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(field.confidence * 100)}%
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
