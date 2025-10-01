import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, Shield, Clock, DollarSign, Scale } from "lucide-react";

const contracts = [
  {
    id: 1,
    name: 'TechVendor Co - Cloud Services Agreement',
    type: 'Vendor Agreement',
    value: '$2.4M',
    startDate: '2024-01-15',
    endDate: '2026-01-14',
    riskLevel: 'high',
    riskScore: 0.78,
    risks: [
      'Auto-renewal clause with 180-day notice period',
      'Uncapped liability for data breaches',
      'Vendor has 3 similar contract breaches (2023)',
      'Payment terms changed from Net-30 to Net-15'
    ],
    complianceGaps: ['GDPR Article 28 requirements missing', 'SLA penalties not defined'],
    recommendations: [
      'Renegotiate liability cap to $500K',
      'Set calendar reminders 200 days before renewal',
      'Add GDPR DPA addendum',
      'Revert to Net-30 payment terms'
    ]
  },
  {
    id: 2,
    name: 'Enterprise Customer - Software License',
    type: 'Customer Contract',
    value: '$890K',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    riskLevel: 'medium',
    riskScore: 0.52,
    risks: [
      'Customer bankruptcy risk flagged (credit score drop)',
      'Termination clause allows exit with 30 days notice',
      'No upfront payment required'
    ],
    complianceGaps: ['IP ownership clause ambiguous'],
    recommendations: [
      'Request 50% upfront payment',
      'Add late payment penalties (2% monthly)',
      'Clarify IP ownership in Amendment 1'
    ]
  },
  {
    id: 3,
    name: 'Office Lease - Downtown Location',
    type: 'Real Estate',
    value: '$1.2M',
    startDate: '2023-06-01',
    endDate: '2028-05-31',
    riskLevel: 'low',
    riskScore: 0.23,
    risks: [
      'Annual rent increase tied to CPI (currently 3.2%)',
      'Early termination penalty: 6 months rent'
    ],
    complianceGaps: [],
    recommendations: [
      'Budget for 3-4% annual increase',
      'Consider subleasing unused space'
    ]
  },
  {
    id: 4,
    name: 'Marketing Agency - Retainer Agreement',
    type: 'Services Agreement',
    value: '$360K',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    riskLevel: 'high',
    riskScore: 0.81,
    risks: [
      'No performance guarantees or KPIs defined',
      'Agency can reassign team without client approval',
      'Work-for-hire clause missing for creative assets',
      'Agency has lawsuit pending (copyright infringement)'
    ],
    complianceGaps: ['Deliverable ownership unclear', 'Confidentiality terms too broad'],
    recommendations: [
      'Add performance KPIs with penalty clauses',
      'Require approval for team changes',
      'Add explicit work-for-hire clause',
      'Request legal indemnity for IP issues'
    ]
  }
];

const complianceStats = [
  { category: 'Contracts Scanned', value: '247', icon: FileText },
  { category: 'High Risk Found', value: '18', icon: AlertTriangle },
  { category: 'Total Contract Value', value: '$12.3M', icon: DollarSign },
  { category: 'Avg Processing Time', value: '2.3s', icon: Clock },
];

export const ContractValidator = () => {
  const [selectedContract, setSelectedContract] = useState(contracts[0]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-foreground';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceStats.map((stat) => (
          <Card key={stat.category} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.category}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contract List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Contract Risk Analysis</span>
              </CardTitle>
              <CardDescription>AI-powered contract scanning and risk detection</CardDescription>
            </div>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Upload Contract
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div 
                key={contract.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedContract.id === contract.id 
                    ? 'bg-primary/5 border-primary' 
                    : 'bg-card hover:bg-muted/30'
                }`}
                onClick={() => setSelectedContract(contract)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{contract.name}</h3>
                      <Badge variant={getRiskBadge(contract.riskLevel) as any} className="capitalize">
                        {contract.riskLevel} risk
                      </Badge>
                      <Badge variant="outline">{contract.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{contract.value}</span>
                      </span>
                      <span>{contract.startDate} → {contract.endDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className={`text-xl font-bold ${getRiskColor(contract.riskLevel)}`}>
                      {(contract.riskScore * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {selectedContract.id === contract.id && (
                  <>
                    <div className="bg-destructive/5 p-3 rounded-lg mb-3 border-l-4 border-destructive">
                      <p className="text-sm font-semibold mb-2 flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Detected Risks:</span>
                      </p>
                      <ul className="space-y-1 text-sm">
                        {contract.risks.map((risk, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-destructive">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {contract.complianceGaps.length > 0 && (
                      <div className="bg-warning/5 p-3 rounded-lg mb-3 border-l-4 border-warning">
                        <p className="text-sm font-semibold mb-2 flex items-center space-x-2">
                          <Scale className="w-4 h-4" />
                          <span>Compliance Gaps:</span>
                        </p>
                        <ul className="space-y-1 text-sm">
                          {contract.complianceGaps.map((gap, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-warning">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                      <p className="text-sm font-semibold mb-2 text-primary">AI Recommendations:</p>
                      <ul className="space-y-1 text-sm">
                        {contract.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-primary">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-end space-x-2 mt-3">
                      <Button size="sm" variant="outline">View Full Contract</Button>
                      <Button size="sm">Generate Amendment</Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Breach Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Breach History</CardTitle>
          <CardDescription>Cross-referenced against news and public filings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-center justify-between">
                <span className="font-medium">TechVendor Co</span>
                <Badge variant="destructive">3 breaches found</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Similar contract breaches: Jan 2023, Jun 2023, Nov 2023
              </p>
            </div>
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center justify-between">
                <span className="font-medium">Marketing Agency</span>
                <Badge variant="outline">Lawsuit pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Copyright infringement case filed March 2024
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
