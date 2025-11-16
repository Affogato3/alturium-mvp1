import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, FileText, FileSpreadsheet, AlertTriangle, Presentation, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const historicalReports = [
  {
    id: '1',
    type: 'Executive Summary',
    icon: FileText,
    generatedAt: '2025-01-10T14:30:00',
    format: 'PDF',
    status: 'completed',
    recipients: 2,
  },
  {
    id: '2',
    type: 'Full Financial Review',
    icon: FileSpreadsheet,
    generatedAt: '2025-01-08T09:15:00',
    format: 'PowerPoint',
    status: 'completed',
    recipients: 5,
  },
  {
    id: '3',
    type: 'Risk Brief',
    icon: AlertTriangle,
    generatedAt: '2025-01-05T16:45:00',
    format: 'PDF',
    status: 'completed',
    recipients: 3,
  },
  {
    id: '4',
    type: 'Board Deck',
    icon: Presentation,
    generatedAt: '2025-01-03T11:00:00',
    format: 'Google Slides',
    status: 'completed',
    recipients: 8,
  },
  {
    id: '5',
    type: 'Executive Summary',
    icon: FileText,
    generatedAt: '2024-12-28T13:20:00',
    format: 'PDF',
    status: 'completed',
    recipients: 2,
  },
];

export const ReportHistory = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Report History</h3>
          <p className="text-sm text-slate-400">View and download previously generated reports</p>
        </div>
        <Badge variant="outline" className="border-slate-700 text-slate-400">
          {historicalReports.length} Reports
        </Badge>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {historicalReports.map((report) => {
            const Icon = report.icon;
            const generatedDate = new Date(report.generatedAt);
            
            return (
              <Card
                key={report.id}
                className="bg-slate-800/50 border-slate-700/50 p-4 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{report.type}</h4>
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {report.format}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{generatedDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{report.recipients} recipients</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Resend
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
