import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { FileText, Download, Send, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ReportConfig {
  type: "daily" | "weekly" | "monthly";
  format: "pdf" | "powerpoint" | "notion";
  recipients: string;
  includeCharts: boolean;
}

export const ExecutiveReportGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    type: "weekly",
    format: "pdf",
    recipients: "",
    includeCharts: true,
  });
  const [reportPreview, setReportPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-executive-report', {
        body: config
      });

      if (error) throw error;

      setReportPreview(data.preview);
      toast({
        title: "Report Generated",
        description: "Executive summary ready for review",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('download-report', {
        body: { format: config.format }
      });

      if (error) throw error;

      toast({
        title: "Download Started",
        description: `${config.format.toUpperCase()} report downloading`,
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download report",
        variant: "destructive"
      });
    }
  };

  const sendReport = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-report', {
        body: {
          recipients: config.recipients.split(',').map(e => e.trim()),
          format: config.format
        }
      });

      if (error) throw error;

      toast({
        title: "Report Sent",
        description: "Executive brief delivered successfully",
      });
    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        title: "Send Failed",
        description: "Unable to send report",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Executive Report Generator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select
              value={config.type}
              onValueChange={(value: any) => setConfig({...config, type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select
              value={config.format}
              onValueChange={(value: any) => setConfig({...config, format: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="powerpoint">PowerPoint</SelectItem>
                <SelectItem value="notion">Notion Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Recipients (comma-separated emails)</Label>
            <Textarea
              placeholder="cfo@company.com, board@company.com"
              value={config.recipients}
              onChange={(e) => setConfig({...config, recipients: e.target.value})}
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={generateReport}
            disabled={loading}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>

        {reportPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4 border-t border-border"
          >
            <div className="p-4 bg-accent/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-3">Report Preview</h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {reportPreview}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={downloadReport}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={sendReport}
                variant="outline"
                className="flex-1"
                disabled={!config.recipients}
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Recipients
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};
