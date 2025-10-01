import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, DollarSign, TrendingDown, Zap } from "lucide-react";

const expenseLeaks = [
  {
    id: 1,
    category: 'Unused SaaS Licenses',
    description: 'Slack Premium licenses unused for 90+ days',
    monthlyWaste: 840,
    annualWaste: 10080,
    affectedItems: ['12 inactive user licenses', '3 guest accounts converted to paid'],
    detection: 'Zero activity detected across billing cycles',
    recommendation: 'Downgrade to free tier or cancel licenses',
    priority: 'high',
    savings: 10080
  },
  {
    id: 2,
    category: 'Duplicate Vendor Contracts',
    description: 'Two cloud storage providers with overlapping usage',
    monthlyWaste: 450,
    annualWaste: 5400,
    affectedItems: ['Dropbox Business + Google Workspace Storage', 'Only 34% combined utilization'],
    detection: 'Similar file structures detected on both platforms',
    recommendation: 'Consolidate to single provider; migrate old files',
    priority: 'high',
    savings: 5400
  },
  {
    id: 3,
    category: 'Shadow IT Spending',
    description: 'Unapproved team subscriptions across departments',
    monthlyWaste: 1240,
    annualWaste: 14880,
    affectedItems: ['Canva Pro (4 teams)', 'Grammarly Business (duplicates)', 'Monday.com (unused)'],
    detection: 'Credit card spend analysis flagged recurring charges',
    recommendation: 'Centralize procurement; add approval workflow',
    priority: 'critical',
    savings: 14880
  },
  {
    id: 4,
    category: 'Over-Provisioned Cloud Resources',
    description: 'AWS instances running at <15% utilization',
    monthlyWaste: 2100,
    annualWaste: 25200,
    affectedItems: ['8 EC2 instances oversized', '2 RDS databases idle', '340GB unused storage'],
    detection: 'CloudWatch metrics + cost optimization analysis',
    recommendation: 'Right-size instances; migrate to reserved capacity',
    priority: 'critical',
    savings: 25200
  },
  {
    id: 5,
    category: 'Inefficient Vendor Terms',
    description: 'Paying for annual upfront when monthly is cheaper',
    monthlyWaste: 320,
    annualWaste: 3840,
    affectedItems: ['Marketing automation platform', 'Analytics suite'],
    detection: 'Pricing model comparison vs industry benchmarks',
    recommendation: 'Renegotiate to monthly billing at lower rate',
    priority: 'medium',
    savings: 3840
  }
];

const categoryBreakdown = [
  { category: 'SaaS Waste', amount: 23400, percentage: 39 },
  { category: 'Cloud Over-Provisioning', amount: 25200, percentage: 42 },
  { category: 'Duplicate Services', amount: 8600, percentage: 14 },
  { category: 'Vendor Inefficiency', amount: 3040, percentage: 5 },
];

export const ExpenseLeakDetector = () => {
  const totalAnnualWaste = expenseLeaks.reduce((sum, leak) => sum + leak.annualWaste, 0);
  const totalMonthlySavings = expenseLeaks.reduce((sum, leak) => sum + leak.monthlyWaste, 0);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Annual Waste</p>
                <p className="text-2xl font-bold">${(totalAnnualWaste / 1000).toFixed(1)}K</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Savings</p>
                <p className="text-2xl font-bold">${(totalMonthlySavings / 1000).toFixed(1)}K</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leaks Detected</p>
                <p className="text-2xl font-bold">{expenseLeaks.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto-Detection</p>
                <p className="text-2xl font-bold">24/7</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detected Leaks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <span>Detected Expense Leaks</span>
              </CardTitle>
              <CardDescription>Hidden recurring costs and inefficiencies</CardDescription>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              ${(totalAnnualWaste / 1000).toFixed(1)}K Annual Waste
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseLeaks.map((leak) => (
              <div key={leak.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{leak.category}</h3>
                      <Badge variant={getPriorityBadge(leak.priority) as any} className="capitalize">
                        {leak.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{leak.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Annual Waste</p>
                    <p className="text-xl font-bold text-destructive">${leak.annualWaste.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">${leak.monthlyWaste}/month</p>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium mb-2">Affected Items:</p>
                  <ul className="space-y-1 text-sm">
                    {leak.affectedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary/5 p-3 rounded-lg mb-3 border-l-4 border-primary">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">Detection Method:</span> {leak.detection}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="bg-success/10 px-3 py-1 rounded-lg border border-success/20">
                    <p className="text-sm">
                      <span className="font-semibold text-success">Potential Savings:</span> ${leak.savings.toLocaleString()}/year
                    </p>
                  </div>
                  <Button size="sm">
                    Apply Fix
                  </Button>
                </div>

                <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Recommendation:</span> {leak.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Waste by Category</CardTitle>
          <CardDescription>Where your money is leaking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryBreakdown.map((category, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.category}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                    <span className="font-bold text-destructive">${category.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-destructive h-3 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Automated expense optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto py-4 flex-col space-y-2">
              <Zap className="w-5 h-5" />
              <span>Auto-Fix All Low Priority</span>
              <span className="text-xs opacity-80">Save $3.8K/year</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
              <DollarSign className="w-5 h-5" />
              <span>Generate Cost Report</span>
              <span className="text-xs opacity-80">PDF for leadership</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
              <AlertCircle className="w-5 h-5" />
              <span>Set Alerts</span>
              <span className="text-xs opacity-80">Notify on new leaks</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
