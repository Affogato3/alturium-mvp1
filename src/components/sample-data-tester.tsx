import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SampleDataTesterProps {
  onFileTest: (fileName: string, fileContent: string) => void;
}

export function SampleDataTester({ onFileTest }: SampleDataTesterProps) {
  const { toast } = useToast();

  const sampleFiles = [
    {
      name: "tech-startup-metrics.csv",
      description: "10 months of SaaS KPIs: MRR, ARR, churn, CAC, LTV, burn rate",
      category: "Tech Startup",
      records: 10,
      metrics: "Revenue, Growth, Customer"
    },
    {
      name: "retail-operations.csv",
      description: "Multi-store retail data: sales, inventory, margins, foot traffic",
      category: "Retail",
      records: 12,
      metrics: "Sales, Conversion, Inventory"
    },
    {
      name: "manufacturing-production.csv",
      description: "Production line metrics: units, defects, efficiency, costs",
      category: "Manufacturing",
      records: 12,
      metrics: "Production, Quality, Cost"
    },
    {
      name: "saas-customer-health.csv",
      description: "Customer health scores: usage, NPS, risk, engagement",
      category: "SaaS B2B",
      records: 12,
      metrics: "Churn Risk, Adoption, Health"
    },
    {
      name: "ecommerce-performance.csv",
      description: "Multi-channel e-commerce: conversion, AOV, CAC, ROAS",
      category: "E-commerce",
      records: 12,
      metrics: "Revenue, Marketing, Conversion"
    },
    {
      name: "financial-transactions.csv",
      description: "20 financial transactions with risk flags",
      category: "Financial Data",
      records: 20,
      metrics: "Compliance, Risk"
    },
    {
      name: "audit-findings.csv", 
      description: "15 audit findings across departments",
      category: "Audit Reports",
      records: 15,
      metrics: "Compliance, Risk"
    },
    {
      name: "governance-metrics.csv",
      description: "Quarterly governance metrics over 2+ years",
      category: "Governance Data", 
      records: 10,
      metrics: "Compliance, Performance"
    }
  ];

  const handleTestFile = async (fileName: string) => {
    try {
      const response = await fetch(`/sample-data/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName}`);
      }
      const content = await response.text();
      
      toast({
        title: "Sample File Loaded",
        description: `Testing analysis with ${fileName}`,
      });
      
      onFileTest(fileName, content);
    } catch (error) {
      toast({
        title: "Error Loading Sample",
        description: `Could not load ${fileName}. File may not exist.`,
        variant: "destructive"
      });
    }
  };

  const handleDownloadSample = async (fileName: string) => {
    try {
      const response = await fetch(`/sample-data/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to download ${fileName}`);
      }
      const content = await response.text();
      
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Sample Downloaded",
        description: `${fileName} has been downloaded to your computer.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: `Could not download ${fileName}.`,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Test with Sample Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use these realistic sample datasets to test the upload and analysis functionality:
          </p>
          
          {sampleFiles.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{file.name}</h4>
                  <Badge variant="outline">{file.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{file.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{file.records} records</span>
                  <span>{file.metrics}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadSample(file.name)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleTestFile(file.name)}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Test Upload
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}