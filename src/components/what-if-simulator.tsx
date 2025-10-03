import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Clock, Download } from "lucide-react";
import { ExportDialog } from "./export-dialog";
import { useReportExport } from "@/hooks/use-report-export";

interface ScenarioImpact {
  id: string;
  title: string;
  probability: number;
  financialImpact: number;
  timeframe: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

interface WhatIfSimulatorProps {
  alertId?: string;
  alertTitle?: string;
}

const mockScenarios: ScenarioImpact[] = [
  {
    id: "ignore",
    title: "If Ignored",
    probability: 78,
    financialImpact: 1200000,
    timeframe: "6 months",
    severity: "critical",
    description: "Unauthorized vendor payments could escalate to systematic fraud, affecting SOX compliance and triggering regulatory investigation."
  },
  {
    id: "partial",
    title: "If Partially Addressed",
    probability: 45,
    financialImpact: 150000,
    timeframe: "3 months",
    severity: "medium",
    description: "Quick fixes without process changes may reduce immediate risk but leave systemic vulnerabilities exposed."
  },
  {
    id: "full",
    title: "If Fully Mitigated",
    probability: 8,
    financialImpact: 5000,
    timeframe: "1 month",
    severity: "low",
    description: "Comprehensive control implementation with process review and staff training significantly reduces future risk exposure."
  }
];

export function WhatIfSimulator({ alertId, alertTitle = "Unauthorized Vendor Payment" }: WhatIfSimulatorProps) {
  const [timeHorizon, setTimeHorizon] = useState([6]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { exportReport, isGenerating } = useReportExport();

  const handleExport = async (format: "pdf" | "word") => {
    await exportReport(
      "What-If Risk Simulation",
      {
        alert: alertTitle,
        timeHorizon: timeHorizon[0],
        scenarios: mockScenarios,
        selectedScenario: selectedScenario ? mockScenarios.find(s => s.id === selectedScenario) : null,
      },
      `Risk simulation analysis for ${alertTitle} over ${timeHorizon[0]} month timeframe`,
      format
    );
    setShowExportDialog(false);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high": return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "medium": return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case "low": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-50 border-red-200 text-red-800";
      case "high": return "bg-orange-50 border-orange-200 text-orange-800";
      case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low": return "bg-green-50 border-green-200 text-green-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-5 w-5 text-accent" />
          AI-Powered Risk Simulator
        </CardTitle>
        <p className="text-muted-foreground">
          Analyze potential outcomes for: <span className="font-medium text-foreground">{alertTitle}</span>
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Time Horizon Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Time Horizon</label>
            <Badge variant="outline" className="font-mono">
              {timeHorizon[0]} months
            </Badge>
          </div>
          <Slider
            value={timeHorizon}
            onValueChange={setTimeHorizon}
            max={24}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Scenario Cards */}
        <div className="grid gap-4">
          {mockScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
              onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(scenario.severity)}
                  <h3 className="font-semibold">{scenario.title}</h3>
                </div>
                <Badge className={getSeverityColor(scenario.severity)}>
                  {scenario.probability}% probability
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-semibold">{formatCurrency(scenario.financialImpact)}</span>
                    <span className="text-muted-foreground ml-1">potential loss</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-semibold">{scenario.timeframe}</span>
                    <span className="text-muted-foreground ml-1">to impact</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{scenario.description}</p>

              {selectedScenario === scenario.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Risk-Adjusted ROI Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Expected Loss:</span>
                        <div className="font-mono font-semibold">
                          {formatCurrency(scenario.financialImpact * (scenario.probability / 100))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Action Priority:</span>
                        <div className="font-semibold">
                          {scenario.severity === "critical" ? "Immediate" : 
                           scenario.severity === "high" ? "This Week" :
                           scenario.severity === "medium" ? "This Month" : "Scheduled"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button className="flex-1">
            Generate Mitigation Plan
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowExportDialog(true)}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </CardContent>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
        isGenerating={isGenerating}
      />
    </Card>
  );
}