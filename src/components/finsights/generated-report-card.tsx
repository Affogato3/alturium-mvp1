import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useReportDownload } from "@/hooks/use-report-download";

interface GeneratedReportCardProps {
  report: any;
  onClose: () => void;
}

export const GeneratedReportCard = ({ report, onClose }: GeneratedReportCardProps) => {
  const { downloadPDF, downloadJSON, downloadPowerPoint, isDownloading } = useReportDownload();
  const [expandedSlides, setExpandedSlides] = useState<number[]>([0]);

  const toggleSlide = (index: number) => {
    if (expandedSlides.includes(index)) {
      setExpandedSlides(expandedSlides.filter(i => i !== index));
    } else {
      setExpandedSlides([...expandedSlides, index]);
    }
  };

  const handleDownloadFormat = () => {
    if (report.format === "pdf") {
      downloadPDF(report);
    } else if (report.format === "pptx" || report.format === "google_slides") {
      downloadPowerPoint(report);
    } else {
      downloadJSON(report);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-400" />
              Board Deck Generated
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {report.slide_count} slides • Generated {new Date(report.generated_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => downloadJSON(report)}
              className="border-slate-700"
              disabled={isDownloading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              onClick={() => downloadPDF(report)}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isDownloading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>
            {(report.format === "pptx" || report.format === "google_slides") && (
              <Button
                onClick={() => downloadPowerPoint(report)}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {report.format === "pptx" ? "PowerPoint" : "Google Slides"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Success Message */}
        <Card className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Report Generated Successfully</p>
              <p className="text-emerald-100 text-sm">
                Your comprehensive board deck is ready for download
              </p>
            </div>
          </div>
        </Card>

        {/* Slides Preview */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Slide Preview</h4>
          <ScrollArea className="h-[600px] rounded-lg bg-slate-900/50 p-4">
            <div className="space-y-3">
              {report.slides?.map((slide: any, index: number) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700/50 p-4 cursor-pointer hover:border-indigo-500/50 transition-all"
                  onClick={() => toggleSlide(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="border-indigo-500/50 text-indigo-400">
                          Slide {slide.slide_number}
                        </Badge>
                        <h5 className="text-white font-semibold">{slide.title}</h5>
                      </div>
                      
                      {expandedSlides.includes(index) && (
                        <div className="space-y-3 mt-4">
                          {/* Talking Points */}
                          <div>
                            <p className="text-sm font-semibold text-slate-300 mb-2">Key Points:</p>
                            <ul className="space-y-2">
                              {slide.talking_points?.map((point: string, i: number) => (
                                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="text-indigo-400 mt-1">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Visualization Suggestion */}
                          {slide.visualization_suggestion && (
                            <div>
                              <p className="text-sm font-semibold text-slate-300 mb-1">
                                Suggested Visualization:
                              </p>
                              <p className="text-slate-400 text-sm italic">
                                {slide.visualization_suggestion}
                              </p>
                            </div>
                          )}

                          {/* Commentary */}
                          {slide.commentary && (
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                              <p className="text-sm font-semibold text-slate-300 mb-2">
                                Executive Commentary:
                              </p>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {slide.commentary}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white shrink-0"
                    >
                      {expandedSlides.includes(index) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm">Total Slides</p>
            <p className="text-2xl font-bold text-white mt-1">{report.slide_count}</p>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm">Format</p>
            <p className="text-2xl font-bold text-white mt-1">{report.format.toUpperCase()}</p>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm">Generated</p>
            <p className="text-lg font-bold text-white mt-1">
              {new Date(report.generated_at).toLocaleDateString()}
            </p>
          </Card>
        </div>
      </div>
    </Card>
  );
};
