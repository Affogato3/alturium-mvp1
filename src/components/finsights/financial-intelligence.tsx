import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Brain, TrendingUp, AlertTriangle, LineChart, Target, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResult {
  healthScore: string;
  dataQuality: string;
  confidence: string;
  executiveSummary: string;
  keyMetrics: any;
  topInsights: any[];
  detailedAnalysis: any;
  redFlags: string[];
  recommendations: any[];
  questions: string[];
  timestamp: string;
}

export function FinancialIntelligence() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>("overview");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} ready for analysis`,
      });
    }
  };

  const runFullAnalysis = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload financial data first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Read file content
      const fileContent = await uploadedFile.text();
      
      // Call comprehensive analysis edge function
      const { data, error } = await supabase.functions.invoke('financial-intelligence-analysis', {
        body: { 
          fileData: fileContent,
          fileName: uploadedFile.name,
          analysisType: 'full'
        }
      });

      if (error) throw error;

      setAnalysisResult(data.analysis);
      
      toast({
        title: "Analysis complete",
        description: "Institutional-grade financial intelligence generated",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runLayerAnalysis = async (layer: number) => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload financial data first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const fileContent = await uploadedFile.text();
      
      const { data, error } = await supabase.functions.invoke('financial-intelligence-analysis', {
        body: { 
          fileData: fileContent,
          fileName: uploadedFile.name,
          analysisType: 'layer',
          layer
        }
      });

      if (error) throw error;

      // Update specific layer in results
      setAnalysisResult(prev => prev ? { ...prev, ...data.analysis } : data.analysis);
      
      toast({
        title: `Layer ${layer} complete`,
        description: `Analysis layer ${layer} finished successfully`,
      });
    } catch (error) {
      console.error('Layer analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;

    const reportContent = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([reportContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-intelligence-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report downloaded",
      description: "Financial intelligence report saved",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Upload Financial Data</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="financial-data"
              accept=".csv,.xlsx,.xls,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="financial-data" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                CSV, Excel, JSON, or TXT files accepted
              </p>
            </label>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={runFullAnalysis} 
              disabled={!uploadedFile || isAnalyzing}
              className="flex-1"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Run Full Analysis"}
            </Button>
            
            {analysisResult && (
              <Button 
                onClick={downloadReport}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Analysis Layers */}
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Analysis Layers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            onClick={() => runLayerAnalysis(1)} 
            disabled={!uploadedFile || isAnalyzing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center"
          >
            <FileText className="w-6 h-6 mb-2" />
            <span className="text-xs">Layer 1</span>
            <span className="text-xs text-muted-foreground">Validation</span>
          </Button>
          
          <Button 
            onClick={() => runLayerAnalysis(2)} 
            disabled={!uploadedFile || isAnalyzing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center"
          >
            <TrendingUp className="w-6 h-6 mb-2" />
            <span className="text-xs">Layer 2</span>
            <span className="text-xs text-muted-foreground">Statistical</span>
          </Button>
          
          <Button 
            onClick={() => runLayerAnalysis(3)} 
            disabled={!uploadedFile || isAnalyzing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center"
          >
            <LineChart className="w-6 h-6 mb-2" />
            <span className="text-xs">Layer 3</span>
            <span className="text-xs text-muted-foreground">Ratios</span>
          </Button>
          
          <Button 
            onClick={() => runLayerAnalysis(4)} 
            disabled={!uploadedFile || isAnalyzing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center"
          >
            <AlertTriangle className="w-6 h-6 mb-2" />
            <span className="text-xs">Layer 4</span>
            <span className="text-xs text-muted-foreground">Risk</span>
          </Button>
          
          <Button 
            onClick={() => runLayerAnalysis(5)} 
            disabled={!uploadedFile || isAnalyzing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center"
          >
            <Target className="w-6 h-6 mb-2" />
            <span className="text-xs">Layer 5</span>
            <span className="text-xs text-muted-foreground">Predictive</span>
          </Button>
          
          <Button 
            onClick={() => runLayerAnalysis(6)} 
            disabled={!uploadedFile || isAnalyzing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center"
          >
            <Brain className="w-6 h-6 mb-2" />
            <span className="text-xs">Layer 6</span>
            <span className="text-xs text-muted-foreground">Scenarios</span>
          </Button>
          
          <Button 
            onClick={() => runLayerAnalysis(7)} 
            disabled={!uploadedFile || isAnalyzing}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center col-span-2"
          >
            <FileText className="w-6 h-6 mb-2" />
            <span className="text-xs">Layer 7</span>
            <span className="text-xs text-muted-foreground">Strategic Synthesis</span>
          </Button>
        </div>
      </Card>

      {/* Results Display */}
      {analysisResult && (
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2 text-foreground">Financial Intelligence Analysis</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Health Score:</span>
                <span className="font-bold text-lg">{analysisResult.healthScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Data Quality:</span>
                <span className="font-semibold">{analysisResult.dataQuality}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-semibold">{analysisResult.confidence}</span>
              </div>
            </div>
          </div>

          <Tabs value={activeLayer} onValueChange={setActiveLayer}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="p-4 bg-background/50">
                <h4 className="font-semibold mb-2 text-foreground">Executive Summary</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {analysisResult.executiveSummary}
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              {analysisResult.keyMetrics && Object.entries(analysisResult.keyMetrics).map(([key, value]: any) => (
                <Card key={key} className="p-4 bg-background/50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{key}</span>
                    <span className="text-lg font-bold">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {analysisResult.topInsights?.map((insight: any, idx: number) => (
                <Card key={idx} className="p-4 bg-background/50">
                  <h4 className="font-semibold mb-2 text-foreground">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{insight.finding}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Implication:</span> {insight.implication}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Action:</span> {insight.action}
                  </p>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              <Card className="p-4 bg-background/50">
                <pre className="text-xs text-muted-foreground overflow-auto max-h-96">
                  {JSON.stringify(analysisResult.detailedAnalysis, null, 2)}
                </pre>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              {analysisResult.redFlags?.map((flag: string, idx: number) => (
                <Card key={idx} className="p-4 bg-destructive/10 border-destructive/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <p className="text-sm text-foreground">{flag}</p>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {analysisResult.recommendations?.map((rec: any, idx: number) => (
                <Card key={idx} className="p-4 bg-background/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{rec.title}</h4>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                        {rec.impact}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-secondary/20 text-secondary-foreground">
                        {rec.urgency}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.action}</p>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              {analysisResult.questions?.map((question: string, idx: number) => (
                <Card key={idx} className="p-4 bg-background/50">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{idx + 1}.</span> {question}
                  </p>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
