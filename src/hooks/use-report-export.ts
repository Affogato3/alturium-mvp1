import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generatePDF, generateWord, ReportData } from "@/lib/report-generator";
import { useToast } from "@/hooks/use-toast";

export function useReportExport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const exportReport = async (
    reportType: string,
    data: any,
    context: string,
    format: "pdf" | "word",
    charts?: Array<{ title: string; dataUrl: string }>
  ) => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "Generating Report",
        description: "AI is analyzing your data and creating a comprehensive report...",
      });

      // Call edge function to generate AI report
      const { data: reportData, error } = await supabase.functions.invoke(
        "generate-report",
        {
          body: {
            reportType,
            data,
            context,
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!reportData.success) {
        throw new Error("Failed to generate report");
      }

      toast({
        title: "Report Generated",
        description: `Creating ${format.toUpperCase()} document...`,
      });

      // Prepare report data for export
      const exportData: ReportData = {
        title: `${reportType} Analysis Report`,
        content: reportData.report,
        charts,
        metadata: reportData.metadata,
      };

      // Export based on format
      if (format === "pdf") {
        await generatePDF(exportData);
      } else {
        await generateWord(exportData);
      }

      toast({
        title: "Export Complete",
        description: `Your ${format.toUpperCase()} report has been downloaded successfully.`,
      });
    } catch (error: any) {
      console.error("Report export error:", error);
      
      let errorMessage = "Failed to generate report. Please try again.";
      
      if (error.message?.includes("Rate limit")) {
        errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (error.message?.includes("credits")) {
        errorMessage = "AI credits depleted. Please add credits to continue.";
      }
      
      toast({
        title: "Export Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { exportReport, isGenerating };
}
