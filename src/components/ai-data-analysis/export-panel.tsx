import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, FileText, FileSpreadsheet, FileImage, Sparkles, Loader2 } from "lucide-react";
import { useReportExport } from "@/hooks/use-report-export";
import { useToast } from "@/hooks/use-toast";

export const ExportPanel = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel" | "csv">("excel");
  const [includeAISummary, setIncludeAISummary] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const { exportReport, isGenerating } = useReportExport();
  const { toast } = useToast();

  const formats = [
    { value: "pdf", label: "PDF Report", icon: FileText, description: "Professional document format" },
    { value: "excel", label: "Excel Workbook", icon: FileSpreadsheet, description: "Interactive spreadsheet" },
    { value: "csv", label: "CSV Data", icon: FileImage, description: "Raw data export" },
  ];

  const handleExport = async () => {
    try {
      await exportReport(
        "AI Data Analysis",
        { dataset: "all", filters: [], metrics: [] },
        "Comprehensive analytics export with AI-generated insights and recommendations",
        selectedFormat === "csv" ? "word" : selectedFormat,
        includeCharts ? [] : undefined
      );
      
      setShowDialog(false);
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-[#0B0B0D] border-[#272A40]/40 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#D5B65C]" />
            <h3 className="text-lg font-semibold text-[#E9E9E9]">Data Export</h3>
          </div>
          <Button
            onClick={() => setShowDialog(true)}
            variant="outline"
            className="bg-[#272A40]/40 border-[#D5B65C]/30 text-[#D5B65C] hover:bg-[#D5B65C]/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#0B0B0D] border-[#272A40]">
          <DialogHeader>
            <DialogTitle className="text-[#E9E9E9] flex items-center gap-2">
              <Download className="w-5 h-5 text-[#D5B65C]" />
              Export Your Data
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="text-[#E9E9E9]">Select Format</Label>
              <div className="grid gap-3">
                {formats.map((format) => (
                  <motion.div
                    key={format.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        selectedFormat === format.value
                          ? 'bg-[#272A40]/60 border-[#D5B65C] shadow-lg shadow-[#D5B65C]/20'
                          : 'bg-[#272A40]/40 border-[#272A40] hover:border-[#D5B65C]/40'
                      }`}
                      onClick={() => setSelectedFormat(format.value as any)}
                    >
                      <div className="flex items-center gap-3">
                        <format.icon className={`w-5 h-5 ${
                          selectedFormat === format.value ? 'text-[#D5B65C]' : 'text-[#BFBFBF]'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#E9E9E9]">{format.label}</p>
                          <p className="text-xs text-[#BFBFBF]">{format.description}</p>
                        </div>
                        {selectedFormat === format.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-[#D5B65C]"
                          />
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4 p-4 bg-[#272A40]/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D5B65C]" />
                  <Label htmlFor="ai-summary" className="text-[#E9E9E9] cursor-pointer">
                    Include AI Summary
                  </Label>
                </div>
                <Switch
                  id="ai-summary"
                  checked={includeAISummary}
                  onCheckedChange={setIncludeAISummary}
                />
              </div>

              {includeAISummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pl-6 text-xs text-[#BFBFBF]"
                >
                  AI will generate insights, trends, and recommendations based on your data
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="charts" className="text-[#E9E9E9] cursor-pointer">
                  Include Charts & Visualizations
                </Label>
                <Switch
                  id="charts"
                  checked={includeCharts}
                  onCheckedChange={setIncludeCharts}
                />
              </div>
            </div>

            {/* Preview Badge */}
            {includeAISummary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#D5B65C]/10 border border-[#D5B65C]/30 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#D5B65C] mt-0.5" />
                  <div className="text-xs text-[#E9E9E9]">
                    <span className="font-semibold">AI Summary Preview:</span>
                    <p className="mt-1 text-[#BFBFBF]">
                      "Revenue grew 8.7% MoM with strongest performance in North America (+12.4%).
                      Marketing efficiency improved 15% while customer acquisition costs decreased..."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isGenerating}
              className="w-full bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Export
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
