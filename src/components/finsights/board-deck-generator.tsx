import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, Download } from "lucide-react";
import { format as formatDate } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BoardDeckGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState<any>({ from: new Date(), to: new Date() });
  const [format, setFormat] = useState("pdf");
  const [config, setConfig] = useState({
    includeFinancialSnapshot: true,
    includeRevenueAnalysis: true,
    includeExpenseBreakdown: true,
    includeCashFlow: true,
    includeUnitEconomics: true,
    includeCustomerMetrics: true,
    includeRiskOverview: true,
    includeForwardOutlook: true,
    includeAICommentary: true,
    includeAppendix: true,
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Load company data from localStorage
      const companyDataStr = localStorage.getItem("finsights_company_data");
      const companyData = companyDataStr ? JSON.parse(companyDataStr) : {};

      // Load branding config
      const brandingStr = localStorage.getItem("finsights_branding");
      const branding = brandingStr ? JSON.parse(brandingStr) : {};

      const { data, error } = await supabase.functions.invoke("generate-board-deck", {
        body: {
          dateRange,
          format,
          config,
          companyData,
          branding,
        },
      });

      if (error) throw error;

      toast({
        title: "Board Deck Generated!",
        description: `Your comprehensive ${data.slide_count}-slide board deck is ready.`,
      });

      // In a real implementation, this would download the file
      console.log("Generated deck:", data);
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "An error occurred while generating the board deck.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Generate Board Deck</h2>
        <p className="text-slate-400 mt-1">
          Create a comprehensive, board-ready presentation in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Range */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Time Period</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-slate-700 text-slate-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {formatDate(dateRange.from, "LLL dd, y")} -{" "}
                          {formatDate(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        formatDate(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        {/* Format Selection */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Output Format</h3>
          <div className="space-y-4">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="pdf">PDF (Best for distribution)</SelectItem>
                <SelectItem value="pptx">PowerPoint (Editable)</SelectItem>
                <SelectItem value="google_slides">Google Slides (Collaborative)</SelectItem>
                <SelectItem value="html">Interactive HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Content Configuration */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Slide Content</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="financial-snapshot"
                checked={config.includeFinancialSnapshot}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeFinancialSnapshot: checked as boolean })
                }
              />
              <Label htmlFor="financial-snapshot" className="text-slate-300 cursor-pointer">
                Financial Snapshot
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="revenue-analysis"
                checked={config.includeRevenueAnalysis}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeRevenueAnalysis: checked as boolean })
                }
              />
              <Label htmlFor="revenue-analysis" className="text-slate-300 cursor-pointer">
                Revenue Analysis
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="expense-breakdown"
                checked={config.includeExpenseBreakdown}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeExpenseBreakdown: checked as boolean })
                }
              />
              <Label htmlFor="expense-breakdown" className="text-slate-300 cursor-pointer">
                Expense Breakdown
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="cash-flow"
                checked={config.includeCashFlow}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeCashFlow: checked as boolean })
                }
              />
              <Label htmlFor="cash-flow" className="text-slate-300 cursor-pointer">
                Cash Flow & Runway
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="unit-economics"
                checked={config.includeUnitEconomics}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeUnitEconomics: checked as boolean })
                }
              />
              <Label htmlFor="unit-economics" className="text-slate-300 cursor-pointer">
                Unit Economics
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customer-metrics"
                checked={config.includeCustomerMetrics}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeCustomerMetrics: checked as boolean })
                }
              />
              <Label htmlFor="customer-metrics" className="text-slate-300 cursor-pointer">
                Customer Metrics
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="risk-overview"
                checked={config.includeRiskOverview}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeRiskOverview: checked as boolean })
                }
              />
              <Label htmlFor="risk-overview" className="text-slate-300 cursor-pointer">
                Risk Overview
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="forward-outlook"
                checked={config.includeForwardOutlook}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeForwardOutlook: checked as boolean })
                }
              />
              <Label htmlFor="forward-outlook" className="text-slate-300 cursor-pointer">
                Forward Outlook
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai-commentary"
                checked={config.includeAICommentary}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeAICommentary: checked as boolean })
                }
              />
              <Label htmlFor="ai-commentary" className="text-slate-300 cursor-pointer">
                AI Commentary
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="appendix"
                checked={config.includeAppendix}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, includeAppendix: checked as boolean })
                }
              />
              <Label htmlFor="appendix" className="text-slate-300 cursor-pointer">
                Data Appendix
              </Label>
            </div>
          </div>
        </Card>
      </div>

      {/* Generation Button */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Ready to Generate
            </h3>
            <p className="text-indigo-100 mt-1">
              Your board deck will include ~15-20 professional slides
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Generate Board Deck
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
