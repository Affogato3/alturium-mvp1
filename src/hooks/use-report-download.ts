import { useState } from "react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

export const useReportDownload = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async (report: any) => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title page
      doc.setFontSize(24);
      doc.setTextColor(66, 66, 66);
      doc.text("Board Deck Presentation", 105, yPosition, { align: "center" });
      yPosition += 15;

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date(report.generated_at).toLocaleDateString()}`, 105, yPosition, { align: "center" });
      yPosition += 8;
      doc.text(`${report.slide_count} Slides`, 105, yPosition, { align: "center" });
      yPosition += 20;

      // Add company name if available
      if (report.branding?.company_name) {
        doc.setFontSize(16);
        doc.setTextColor(66, 66, 66);
        doc.text(report.branding.company_name, 105, yPosition, { align: "center" });
      }

      // Add slides
      report.slides?.forEach((slide: any, index: number) => {
        doc.addPage();
        yPosition = 20;

        // Slide number
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Slide ${slide.slide_number} of ${report.slide_count}`, 20, yPosition);
        yPosition += 10;

        // Title
        doc.setFontSize(18);
        doc.setTextColor(66, 66, 66);
        const titleLines = doc.splitTextToSize(slide.title, 170);
        titleLines.forEach((line: string) => {
          doc.text(line, 20, yPosition);
          yPosition += 10;
        });
        yPosition += 5;

        // Talking points
        if (slide.talking_points?.length > 0) {
          doc.setFontSize(11);
          doc.setTextColor(80, 80, 80);
          slide.talking_points.forEach((point: string) => {
            const lines = doc.splitTextToSize(`• ${point}`, 165);
            lines.forEach((line: string) => {
              if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(line, 25, yPosition);
              yPosition += 7;
            });
            yPosition += 3;
          });
        }

        // Visualization suggestion
        if (slide.visualization_suggestion) {
          yPosition += 5;
          doc.setFontSize(10);
          doc.setTextColor(120, 120, 120);
          doc.text("Visualization:", 20, yPosition);
          yPosition += 6;
          const vizLines = doc.splitTextToSize(slide.visualization_suggestion, 165);
          vizLines.forEach((line: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 25, yPosition);
            yPosition += 6;
          });
        }

        // Commentary
        if (slide.commentary) {
          yPosition += 8;
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Executive Commentary:", 20, yPosition);
          yPosition += 6;
          const commentLines = doc.splitTextToSize(slide.commentary, 165);
          commentLines.forEach((line: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 25, yPosition);
            yPosition += 5;
          });
        }
      });

      // Add footer to all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        if (report.branding?.include_watermark) {
          doc.text("CONFIDENTIAL", 105, 290, { align: "center" });
        }
      }

      const fileName = `board-deck-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Downloaded",
        description: `${fileName} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadJSON = (report: any) => {
    try {
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `board-deck-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "JSON Downloaded",
        description: "Report data has been exported as JSON.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export JSON. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadPowerPoint = (report: any) => {
    // For PowerPoint, we'd need pptxgenjs library
    // For now, show a coming soon message
    toast({
      title: "PowerPoint Export",
      description: "PowerPoint export is coming soon! Use PDF export in the meantime.",
    });
  };

  return {
    downloadPDF,
    downloadJSON,
    downloadPowerPoint,
    isDownloading,
  };
};
