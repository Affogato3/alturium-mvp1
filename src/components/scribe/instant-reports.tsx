import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileSpreadsheet, AlertTriangle, Presentation, Download, Send, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { ReportConfigurator } from "./report-configurator";
import { ReportPreview } from "./report-preview";
import { ReportHistory } from "./report-history";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  estimatedTime: string;
  icon: any;
  status: 'idle' | 'generating' | 'completed' | 'error';
}

export const InstantReports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'executive',
      type: 'executive_summary',
      title: 'Executive Summary',
      description: '1-2 pages, high-level overview with key metrics and insights',
      estimatedTime: '~8 seconds',
      icon: FileText,
      status: 'idle'
    },
    {
      id: 'financial',
      type: 'full_financial',
      title: 'Full Financial Review',
      description: '8-12 pages, comprehensive analysis with charts and trends',
      estimatedTime: '~15 seconds',
      icon: FileSpreadsheet,
      status: 'idle'
    },
    {
      id: 'risk',
      type: 'risk_brief',
      title: 'Risk Brief',
      description: '2-3 pages, risk analysis with scenarios and mitigations',
      estimatedTime: '~10 seconds',
      icon: AlertTriangle,
      status: 'idle'
    },
    {
      id: 'board',
      type: 'board_deck',
      title: 'Board Deck',
      description: '15-20 slides, presentation-ready with visualizations',
      estimatedTime: '~20 seconds',
      icon: Presentation,
      status: 'idle'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const handleGenerateReport = async (config: any) => {
    if (!selectedReport) return;

    const reportIndex = reports.findIndex(r => r.id === selectedReport.id);
    const updatedReports = [...reports];
    updatedReports[reportIndex].status = 'generating';
    setReports(updatedReports);

    toast({
      title: "Generating Report",
      description: `AI is analyzing your data and creating a comprehensive ${selectedReport.title}...`,
    });

    try {
      const { data, error } = await supabase.functions.invoke('generate-executive-report', {
        body: {
          type: selectedReport.type,
          format: config.format,
          dateRange: config.dateRange,
          includeCharts: config.includeCharts,
          customizations: config.customizations
        }
      });

      if (error) throw error;

      updatedReports[reportIndex].status = 'completed';
      setReports(updatedReports);
      setGeneratedReport(data);
      setShowConfigurator(false);

      toast({
        title: "Report Generated Successfully",
        description: `Your ${selectedReport.title} is ready for download.`,
      });
    } catch (error: any) {
      console.error('Report generation error:', error);
      updatedReports[reportIndex].status = 'error';
      setReports(updatedReports);

      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = async () => {
    if (!generatedReport) return;

    toast({
      title: "Downloading Report",
      description: "Preparing your report file...",
    });

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your report has been downloaded successfully.",
      });
    }, 1000);
  };

  const handleSendReport = async () => {
    if (!generatedReport) return;

    toast({
      title: "Sending Report",
      description: "Sending report to recipients...",
    });

    // Simulate send
    setTimeout(() => {
      toast({
        title: "Report Sent",
        description: "Your report has been sent to all recipients.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Instant Reports</h2>
            <p className="text-slate-400">Generate professional financial reports in seconds</p>
          </div>
          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
            AI-Powered
          </Badge>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="generate">Generate New</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6">
            {!showConfigurator && !generatedReport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => {
                  const Icon = report.icon;
                  return (
                    <Card
                      key={report.id}
                      className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-indigo-500/50 transition-all cursor-pointer group"
                      onClick={() => {
                        setSelectedReport(report);
                        setShowConfigurator(true);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                          <Icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                            {report.status === 'generating' && (
                              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                            )}
                            {report.status === 'completed' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{report.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{report.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {showConfigurator && selectedReport && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowConfigurator(false);
                      setSelectedReport(null);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    ← Back to Reports
                  </Button>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedReport.title}</h3>
                    <p className="text-sm text-slate-400">{selectedReport.description}</p>
                  </div>
                </div>
                <ReportConfigurator
                  reportType={selectedReport.type}
                  onGenerate={handleGenerateReport}
                  onCancel={() => {
                    setShowConfigurator(false);
                    setSelectedReport(null);
                  }}
                />
              </div>
            )}

            {generatedReport && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Report Generated</h3>
                    <p className="text-sm text-slate-400">Your report is ready</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownloadReport}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={handleSendReport}
                      variant="outline"
                      className="border-slate-700 text-white hover:bg-slate-800"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedReport(null);
                        setSelectedReport(null);
                      }}
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <ReportPreview report={generatedReport} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ReportHistory />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
