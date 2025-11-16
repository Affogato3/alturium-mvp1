import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileText, Mail, X } from "lucide-react";
import { format as formatDate } from "date-fns";

interface ReportConfiguratorProps {
  reportType: string;
  onGenerate: (config: any) => void;
  onCancel: () => void;
}

export const ReportConfigurator = ({ reportType, onGenerate, onCancel }: ReportConfiguratorProps) => {
  const [dateRange, setDateRange] = useState<any>({ from: new Date(), to: new Date() });
  const [format, setFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeProjections, setIncludeProjections] = useState(true);
  const [includeRiskScenarios, setIncludeRiskScenarios] = useState(true);
  const [includeAppendix, setIncludeAppendix] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState("previous");
  const [customMessage, setCustomMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");

  const quickDates = [
    { label: "Last Month", value: "last_month" },
    { label: "Last Quarter", value: "last_quarter" },
    { label: "Last 6 Months", value: "last_6_months" },
    { label: "Year to Date", value: "ytd" },
  ];

  const recipientGroups = [
    { label: "CFO", emails: ["cfo@company.com"] },
    { label: "Board", emails: ["board1@company.com", "board2@company.com"] },
    { label: "Investors", emails: ["investor1@vc.com", "investor2@vc.com"] },
    { label: "Leadership", emails: ["ceo@company.com", "cto@company.com", "cfo@company.com"] },
  ];

  const addRecipient = () => {
    if (recipientInput && !recipients.includes(recipientInput)) {
      setRecipients([...recipients, recipientInput]);
      setRecipientInput("");
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const addRecipientGroup = (emails: string[]) => {
    const newRecipients = [...recipients];
    emails.forEach(email => {
      if (!newRecipients.includes(email)) {
        newRecipients.push(email);
      }
    });
    setRecipients(newRecipients);
  };

  const handleGenerate = () => {
    onGenerate({
      dateRange,
      format,
      includeCharts,
      customizations: {
        includeProjections,
        includeRiskScenarios,
        includeAppendix,
        comparisonPeriod,
        customMessage,
      },
      recipients,
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selection */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Date Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Quick Select</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickDates.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-700"
                  onClick={() => {
                    // Set date range based on preset
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Custom Range</Label>
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

      {/* Customization Options */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Customization Options</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="charts"
              checked={includeCharts}
              onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
            />
            <Label htmlFor="charts" className="text-slate-300 cursor-pointer">
              Include charts and visualizations
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="projections"
              checked={includeProjections}
              onCheckedChange={(checked) => setIncludeProjections(checked as boolean)}
            />
            <Label htmlFor="projections" className="text-slate-300 cursor-pointer">
              Include forward projections
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="scenarios"
              checked={includeRiskScenarios}
              onCheckedChange={(checked) => setIncludeRiskScenarios(checked as boolean)}
            />
            <Label htmlFor="scenarios" className="text-slate-300 cursor-pointer">
              Include risk scenarios
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="appendix"
              checked={includeAppendix}
              onCheckedChange={(checked) => setIncludeAppendix(checked as boolean)}
            />
            <Label htmlFor="appendix" className="text-slate-300 cursor-pointer">
              Include appendix with raw data
            </Label>
          </div>

          <div className="space-y-2 pt-4">
            <Label className="text-slate-300">Comparison Period</Label>
            <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="previous">Previous period</SelectItem>
                <SelectItem value="yoy">Same period last year</SelectItem>
                <SelectItem value="budget">Budget/Forecast</SelectItem>
                <SelectItem value="all">All of the above</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-4">
            <Label className="text-slate-300">Custom Message/Context (Optional)</Label>
            <Textarea
              placeholder="Add any context or notes for this report..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-slate-300 placeholder:text-slate-500"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Format Selection */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Output Format</h3>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={format === "pdf" ? "default" : "outline"}
            className={format === "pdf" ? "bg-indigo-600 hover:bg-indigo-700" : "border-slate-700"}
            onClick={() => setFormat("pdf")}
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button
            variant={format === "pptx" ? "default" : "outline"}
            className={format === "pptx" ? "bg-indigo-600 hover:bg-indigo-700" : "border-slate-700"}
            onClick={() => setFormat("pptx")}
          >
            <FileText className="w-4 h-4 mr-2" />
            PowerPoint
          </Button>
          <Button
            variant={format === "google_slides" ? "default" : "outline"}
            className={format === "google_slides" ? "bg-indigo-600 hover:bg-indigo-700" : "border-slate-700"}
            onClick={() => setFormat("google_slides")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Google Slides
          </Button>
        </div>
      </Card>

      {/* Recipients */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recipients</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300 mb-2 block">Quick Add</Label>
            <div className="flex flex-wrap gap-2">
              {recipientGroups.map((group) => (
                <Badge
                  key={group.label}
                  variant="outline"
                  className="border-indigo-500/50 text-indigo-400 cursor-pointer hover:bg-indigo-500/10"
                  onClick={() => addRecipientGroup(group.emails)}
                >
                  + {group.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Add Email Address</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
              />
              <Button onClick={addRecipient} variant="outline" className="border-slate-700">
                Add
              </Button>
            </div>
          </div>

          {recipients.length > 0 && (
            <div className="space-y-2">
              <Label className="text-slate-300">Recipients ({recipients.length})</Label>
              <div className="flex flex-wrap gap-2">
                {recipients.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="bg-slate-700 text-slate-300"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    {email}
                    <X
                      className="w-3 h-3 ml-2 cursor-pointer"
                      onClick={() => removeRecipient(email)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="save-only" />
            <Label htmlFor="save-only" className="text-slate-300 cursor-pointer text-sm">
              Save to my drive only (don't send)
            </Label>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-slate-400 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};
