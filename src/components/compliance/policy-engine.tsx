import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCode, CheckCircle, AlertCircle } from "lucide-react";

export const PolicyEngine = () => {
  const policies = [
    {
      id: 1,
      name: "AML Transaction Monitoring",
      category: "Anti-Money Laundering",
      status: "active",
      coverage: 98,
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "PCI-DSS Data Protection",
      category: "Payment Security",
      status: "active",
      coverage: 100,
      lastUpdated: "1 day ago"
    },
    {
      id: 3,
      name: "GDPR Consent Management",
      category: "Data Privacy",
      status: "active",
      coverage: 96,
      lastUpdated: "3 hours ago"
    },
    {
      id: 4,
      name: "KYC Verification Rules",
      category: "Identity",
      status: "warning",
      coverage: 89,
      lastUpdated: "5 hours ago"
    },
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Policy Engine</h3>
        </div>
        <Button variant="outline" size="sm" className="border-primary/20">
          Deploy New Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="p-4 bg-card/30 backdrop-blur border-primary/10 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{policy.name}</h4>
                  {policy.status === 'active' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{policy.category}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Coverage</span>
                <span className="font-semibold">{policy.coverage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${policy.coverage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Updated {policy.lastUpdated}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};