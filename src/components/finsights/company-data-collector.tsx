import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CompanyDataCollector = () => {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState({
    company_name: "",
    logo_url: "",
    revenue: "",
    burn_rate: "",
    cash_position: "",
    runway: "",
    total_customers: "",
    mrr: "",
    arr: "",
    nrr: "",
    churn_rate: "",
    cac: "",
    ltv: "",
    employee_count: "",
    recent_events: "",
  });

  const handleSave = () => {
    // Save to localStorage for now (in production, save to database)
    localStorage.setItem("finsights_company_data", JSON.stringify(companyData));
    toast({
      title: "Company Data Saved",
      description: "Your company data has been saved successfully.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          setCompanyData({ ...companyData, ...data });
          toast({
            title: "Data Imported",
            description: "Company data has been imported successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Invalid JSON file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Company Data</h2>
          <p className="text-slate-400 mt-1">
            Provide your company's financial and operational metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700" onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" />
            Save Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Company Name</Label>
              <Input
                value={companyData.company_name}
                onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <Label className="text-slate-300">Logo URL</Label>
              <Input
                value={companyData.logo_url}
                onChange={(e) => setCompanyData({ ...companyData, logo_url: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-slate-300">Employee Count</Label>
              <Input
                type="number"
                value={companyData.employee_count}
                onChange={(e) => setCompanyData({ ...companyData, employee_count: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="150"
              />
            </div>
          </div>
        </Card>

        {/* Financial Metrics */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Metrics</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Monthly Revenue ($)</Label>
              <Input
                type="number"
                value={companyData.revenue}
                onChange={(e) => setCompanyData({ ...companyData, revenue: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="1850000"
              />
            </div>
            <div>
              <Label className="text-slate-300">Monthly Burn Rate ($)</Label>
              <Input
                type="number"
                value={companyData.burn_rate}
                onChange={(e) => setCompanyData({ ...companyData, burn_rate: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="450000"
              />
            </div>
            <div>
              <Label className="text-slate-300">Cash Position ($)</Label>
              <Input
                type="number"
                value={companyData.cash_position}
                onChange={(e) => setCompanyData({ ...companyData, cash_position: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="5200000"
              />
            </div>
            <div>
              <Label className="text-slate-300">Runway (months)</Label>
              <Input
                type="number"
                value={companyData.runway}
                onChange={(e) => setCompanyData({ ...companyData, runway: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="11.5"
              />
            </div>
          </div>
        </Card>

        {/* Customer Metrics */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Metrics</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Total Customers</Label>
              <Input
                type="number"
                value={companyData.total_customers}
                onChange={(e) => setCompanyData({ ...companyData, total_customers: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="142"
              />
            </div>
            <div>
              <Label className="text-slate-300">MRR ($)</Label>
              <Input
                type="number"
                value={companyData.mrr}
                onChange={(e) => setCompanyData({ ...companyData, mrr: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="1650000"
              />
            </div>
            <div>
              <Label className="text-slate-300">ARR ($)</Label>
              <Input
                type="number"
                value={companyData.arr}
                onChange={(e) => setCompanyData({ ...companyData, arr: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="19800000"
              />
            </div>
            <div>
              <Label className="text-slate-300">Net Revenue Retention (%)</Label>
              <Input
                type="number"
                value={companyData.nrr}
                onChange={(e) => setCompanyData({ ...companyData, nrr: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="118"
              />
            </div>
            <div>
              <Label className="text-slate-300">Monthly Churn Rate (%)</Label>
              <Input
                type="number"
                value={companyData.churn_rate}
                onChange={(e) => setCompanyData({ ...companyData, churn_rate: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="3"
              />
            </div>
          </div>
        </Card>

        {/* Unit Economics */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Unit Economics</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">CAC ($)</Label>
              <Input
                type="number"
                value={companyData.cac}
                onChange={(e) => setCompanyData({ ...companyData, cac: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="12000"
              />
            </div>
            <div>
              <Label className="text-slate-300">LTV ($)</Label>
              <Input
                type="number"
                value={companyData.ltv}
                onChange={(e) => setCompanyData({ ...companyData, ltv: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="48000"
              />
            </div>
          </div>
        </Card>

        {/* Recent Events */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Events & Context</h3>
          <Textarea
            value={companyData.recent_events}
            onChange={(e) => setCompanyData({ ...companyData, recent_events: e.target.value })}
            className="bg-slate-900/50 border-slate-700 text-slate-300 min-h-[120px]"
            placeholder="Recent product launches, funding rounds, major partnerships, market changes, etc."
          />
        </Card>
      </div>
    </div>
  );
};
