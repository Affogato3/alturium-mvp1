import { useState } from "react";
import { DataUpload } from "@/components/data-upload";
import { SampleDataTester } from "@/components/sample-data-tester";
import { Button } from "@/components/ui/button";
import { NavigationHeader } from "@/components/navigation-header";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [auditMode, setAuditMode] = useState(false);

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(prev => [...prev, results]);
    toast({
      title: "Analysis Complete",
      description: `Found ${results.insights?.records || 0} records, ${results.insights?.anomalies || 0} anomalies detected (Risk Score: ${results.insights?.riskScore || 0}%)`,
    });
  };

  const handleFileTest = (fileName: string, fileContent: string) => {
    // Parse CSV content
    const lines = fileContent.trim().split('\n');
    const headers = lines[0].split(',');
    const records = lines.length - 1;
    
    // Simple anomaly detection: look for empty cells or unusual patterns
    let anomalies = 0;
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length !== headers.length || values.some(v => !v.trim())) {
        anomalies++;
      }
    }

    const riskScore = Math.min(100, Math.round((anomalies / records) * 100));
    
    const results = {
      fileName,
      insights: {
        records,
        anomalies,
        riskScore
      }
    };

    handleAnalysisComplete(results);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        userRole="admin"
        userName="User"
        auditMode={auditMode}
        onAuditModeToggle={() => setAuditMode(!auditMode)}
        onSignOut={() => {}}
      />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Data Analysis Platform</h1>
          <p className="text-muted-foreground">Upload your datasets for AI-powered analysis and insights</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DataUpload onAnalysisComplete={handleAnalysisComplete} />
          <SampleDataTester onFileTest={handleFileTest} />
        </div>

        {analysisResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
            <div className="grid gap-4">
              {analysisResults.map((result, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-card">
                  <h3 className="font-semibold mb-2">{result.fileName}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">{result.insights?.records || 0}</div>
                      <div className="text-sm text-muted-foreground">Records</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning">{result.insights?.anomalies || 0}</div>
                      <div className="text-sm text-muted-foreground">Anomalies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">{result.insights?.riskScore || 0}%</div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
