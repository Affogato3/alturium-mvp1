import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Activity, 
  Shield, 
  GitBranch, 
  Lock, 
  Zap,
  DollarSign,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FabricResultModal } from "./finance-fabric/fabric-result-modal";

export const FinanceFabricDashboard = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleAction = async (
    actionLabel: string,
    endpoint: string,
    title: string,
    actionType: string,
    data?: any
  ) => {
    setIsLoading(actionLabel);
    try {
      const { data: result, error } = await supabase.functions.invoke(endpoint, {
        body: { action: actionType, data },
      });

      if (error) throw error;

      setModalTitle(title);
      setModalData(result);
      setModalOpen(true);
      toast.success(`${title} completed successfully`);
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  const modules = [
    {
      id: "accounts",
      title: "Virtual Accounts",
      description: "Multi-currency account management",
      icon: Wallet,
      color: "from-cyan-500 to-blue-500",
      actions: [
        {
          label: "Create Account",
          action: () => handleAction("Create Account", "fabric-accounts", "Account Created", "create", {
            currency: "USD",
            account_type: "virtual",
          }),
        },
        {
          label: "List Accounts",
          action: () => handleAction("List Accounts", "fabric-accounts", "Account List", "list"),
        },
      ],
    },
    {
      id: "transactions",
      title: "Transactions",
      description: "Real-time payment processing",
      icon: Activity,
      color: "from-violet-500 to-purple-500",
      actions: [
        {
          label: "View Feed",
          action: () => handleAction("View Feed", "fabric-transactions", "Transaction Feed", "list"),
        },
      ],
    },
    {
      id: "reconciliation",
      title: "Reconciliation",
      description: "Auto-match ledger entries",
      icon: GitBranch,
      color: "from-emerald-500 to-teal-500",
      actions: [
        {
          label: "Sync Now",
          action: () => handleAction("Sync Now", "fabric-reconciliation", "Reconciliation Report", "sync"),
        },
      ],
    },
    {
      id: "compliance",
      title: "Compliance Engine",
      description: "AI-powered risk detection",
      icon: Shield,
      color: "from-amber-500 to-orange-500",
      actions: [
        {
          label: "Run Scan",
          action: () => handleAction("Run Scan", "fabric-compliance", "Compliance Scan", "scan"),
        },
      ],
    },
    {
      id: "api",
      title: "API Gateway",
      description: "Generate integration keys",
      icon: Lock,
      color: "from-rose-500 to-pink-500",
      actions: [
        {
          label: "Generate Key",
          action: () => handleAction("Generate Key", "fabric-api-keys", "API Key Generated", "generate", {
            name: "Production Key",
            scopes: ["read", "write", "reconcile"],
          }),
        },
        {
          label: "List Keys",
          action: () => handleAction("List Keys", "fabric-api-keys", "API Keys", "list"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">
                Finance Fabric Nexus
              </h1>
              <p className="text-gray-400 text-lg">
                Enterprise-grade financial infrastructure APIs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#141414] border-cyan-500/50 text-cyan-400 px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                LIVE
              </Badge>
              <Badge className="bg-[#141414] border-emerald-500/50 text-emerald-400 px-4 py-2">
                <Activity className="h-4 w-4 mr-2" />
                OPERATIONAL
              </Badge>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Volume", value: "$12.4M", icon: DollarSign, color: "cyan" },
              { label: "Transactions", value: "1,247", icon: Activity, color: "violet" },
              { label: "Success Rate", value: "99.8%", icon: TrendingUp, color: "emerald" },
              { label: "Alerts", value: "3", icon: AlertCircle, color: "amber" },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="bg-[#141414] border-[#2a2a2a] p-4 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 text-${stat.color}-400`} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="bg-[#141414] border-[#2a2a2a] p-6 hover:border-cyan-500/50 transition-all group relative overflow-hidden"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${module.color} bg-opacity-20`}
                  >
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{module.description}</p>

                <div className="space-y-2">
                  {module.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      onClick={action.action}
                      disabled={isLoading !== null}
                      className="w-full bg-[#0A0A0A] border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500 transition-all text-white"
                    >
                      {isLoading === action.label ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        action.label
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Feed */}
        <Card className="bg-[#141414] border-[#2a2a2a] p-6 mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            System Activity Feed
          </h3>
          <div className="space-y-2">
            {[
              { event: "Transaction settled", time: "2s ago", status: "success" },
              { event: "Compliance scan completed", time: "15s ago", status: "success" },
              { event: "New account created", time: "1m ago", status: "info" },
              { event: "API key generated", time: "3m ago", status: "info" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-[#2a2a2a]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      item.status === "success" ? "bg-emerald-400" : "bg-cyan-400"
                    } animate-pulse`}
                  />
                  <span>{item.event}</span>
                </div>
                <span className="text-gray-500 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Result Modal */}
      <FabricResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
        data={modalData}
      />
    </div>
  );
};