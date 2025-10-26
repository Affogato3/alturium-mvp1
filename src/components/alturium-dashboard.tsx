import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, BarChart3, Brain, Plug, Users, Shield, 
  Bell, ChevronLeft, ChevronRight, LogOut, User,
  TrendingUp, Activity, Zap, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AlturiumDashboardProps {
  userRole: "admin" | "executive" | "analyst" | "auditor";
  userName: string;
  onSignOut: () => void;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  unit = "", 
  icon: Icon 
}: { 
  title: string; 
  value: number; 
  change: string; 
  unit?: string;
  icon: any;
}) => (
  <div className="bg-alturium-card border border-alturium-border rounded-lg p-6 transition-all duration-300 hover:border-alturium-accent hover:shadow-[0_0_20px_rgba(0,186,255,0.15)] hover:-translate-y-1 group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-alturium-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-alturium-text/60 uppercase tracking-wide">{title}</p>
        <Icon className="h-5 w-5 text-alturium-accent" />
      </div>
      <p className="text-4xl font-semibold text-alturium-text mb-1">
        {value.toLocaleString()}{unit}
      </p>
      <p className="text-xs text-alturium-accent">{change}</p>
    </div>
  </div>
);

const LiveFeedItem = ({ 
  type, 
  message, 
  time 
}: { 
  type: "alert" | "insight" | "update"; 
  message: string; 
  time: string;
}) => {
  const colors = {
    alert: "text-red-400",
    insight: "text-alturium-accent",
    update: "text-green-400"
  };
  
  return (
    <div className="flex items-start gap-3 p-3 rounded border border-alturium-border/50 hover:border-alturium-accent/50 transition-all duration-300 animate-fade-in">
      <div className={`h-2 w-2 rounded-full ${colors[type]} mt-2 animate-pulse`}></div>
      <div className="flex-1">
        <p className="text-sm text-alturium-text/90">{message}</p>
        <p className="text-xs text-alturium-text/40 mt-1">{time}</p>
      </div>
    </div>
  );
};

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-alturium-card border border-alturium-border rounded-lg p-5 hover:border-alturium-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,186,255,0.15)] hover:-translate-y-1 text-left group"
  >
    <Icon className="h-6 w-6 text-alturium-accent mb-3 group-hover:scale-110 transition-transform" />
    <h3 className="text-base font-semibold text-alturium-text mb-1">{title}</h3>
    <p className="text-xs text-alturium-text/60">{description}</p>
  </button>
);

const HeatmapNode = ({ 
  label, 
  value, 
  status 
}: { 
  label: string; 
  value: string; 
  status: "healthy" | "warning" | "critical";
}) => {
  const statusColors = {
    healthy: "border-green-500/50 bg-green-500/10",
    warning: "border-yellow-500/50 bg-yellow-500/10",
    critical: "border-red-500/50 bg-red-500/10"
  };
  
  return (
    <div className={`border-2 ${statusColors[status]} rounded-lg p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,186,255,0.2)]`}>
      <p className="text-xs text-alturium-text/60 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-alturium-text">{value}</p>
    </div>
  );
};

export default function AlturiumDashboard({ userRole, userName, onSignOut }: AlturiumDashboardProps) {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 18) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const navItems = [
    { icon: Home, label: "Dashboard", route: "/", active: true },
    { icon: BarChart3, label: "Analytics", route: "/audit", active: false },
    { icon: Brain, label: "AI Tools", route: "/scribe", active: false },
    { icon: Plug, label: "Integrations", route: "/cnl-grid", active: false },
    { icon: Users, label: "Team", route: "/team", active: false },
    { icon: Shield, label: "Security", route: "/security", active: false },
  ];

  const metrics = [
    { title: "Revenue", value: 2847000, change: "+23.5% vs last month", unit: "", icon: TrendingUp },
    { title: "Efficiency", value: 94.2, change: "+5.8% improvement", unit: "%", icon: Activity },
    { title: "AI Health", value: 99.1, change: "All systems optimal", unit: "%", icon: Zap },
    { title: "Active Sessions", value: 1247, change: "+189 since yesterday", unit: "", icon: CheckCircle2 },
  ];

  const liveFeed = [
    { type: "insight" as const, message: "Revenue optimization opportunity detected in Q4 pipeline", time: "2 mins ago" },
    { type: "alert" as const, message: "System utilization approaching 85% - scaling recommended", time: "5 mins ago" },
    { type: "update" as const, message: "AI model accuracy improved by 3.2% after latest training", time: "12 mins ago" },
    { type: "insight" as const, message: "Customer churn prediction suggests proactive engagement needed", time: "18 mins ago" },
  ];

  const heatmapData = [
    { label: "Engineering", value: "92%", status: "healthy" as const },
    { label: "Sales", value: "87%", status: "healthy" as const },
    { label: "Marketing", value: "76%", status: "warning" as const },
    { label: "Operations", value: "95%", status: "healthy" as const },
    { label: "Support", value: "68%", status: "critical" as const },
    { label: "Product", value: "91%", status: "healthy" as const },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-alturium-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-alturium-accent border-r-transparent mb-4"></div>
          <p className="text-alturium-accent text-lg uppercase tracking-wider animate-pulse">
            Calibrating Intelligence Fabric...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alturium-bg text-alturium-text flex">
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-alturium-card border-r border-alturium-border transition-all duration-300 flex flex-col relative z-20`}
      >
        <div className="p-4 flex items-center justify-between border-b border-alturium-border">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold tracking-widest text-alturium-text">ALTURIUM</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-alturium-text hover:bg-alturium-hover hover:text-alturium-accent"
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              } px-3 py-3 rounded-lg transition-all duration-300 ${
                item.active
                  ? "bg-alturium-hover border-l-2 border-alturium-accent text-alturium-accent"
                  : "hover:bg-alturium-hover/50 text-alturium-text/70 hover:text-alturium-text"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {!sidebarCollapsed && (
                <span className="ml-3 uppercase text-xs tracking-wide font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className={`px-3 py-4 border-t border-alturium-border ${sidebarCollapsed ? "text-center" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-alturium-accent animate-pulse"></div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-xs text-alturium-text/60 uppercase tracking-wide">Secure Channel</p>
                <p className="text-[10px] text-alturium-accent">AES-512 Active</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-alturium-border bg-alturium-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="text-sm text-alturium-text/60 uppercase tracking-wider">{getGreeting()}</div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-alturium-text hover:bg-alturium-hover hover:text-alturium-accent relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-alturium-accent text-alturium-bg text-xs border-0">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-alturium-card border border-alturium-border rounded-lg shadow-lg p-4 z-50 animate-fade-in">
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Notifications</h3>
                    <div className="space-y-2">
                      <div className="text-sm p-3 bg-alturium-hover rounded border border-alturium-border/50">
                        System optimization completed
                      </div>
                      <div className="text-sm p-3 bg-alturium-hover rounded border border-alturium-border/50">
                        New AI insights available
                      </div>
                      <div className="text-sm p-3 bg-alturium-hover rounded border border-alturium-border/50">
                        Security scan passed
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-alturium-hover gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-alturium-accent text-alturium-bg text-sm font-bold">
                        {userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-alturium-text/80">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-alturium-card border-alturium-border">
                  <DropdownMenuItem className="text-alturium-text hover:bg-alturium-hover">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onSignOut}
                    className="text-alturium-text hover:bg-alturium-hover"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-alturium-accent to-transparent"></div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 bg-alturium-card border border-alturium-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-alturium-accent" />
                <h2 className="text-lg font-semibold uppercase tracking-wide">Live AI Feed</h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {liveFeed.map((item, i) => (
                  <LiveFeedItem key={i} {...item} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-alturium-card border border-alturium-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-alturium-accent" />
                <h2 className="text-lg font-semibold uppercase tracking-wide">Organization Heatmap</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {heatmapData.map((node, i) => (
                  <HeatmapNode key={i} {...node} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-alturium-card border border-alturium-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-alturium-accent" />
                <h2 className="text-lg font-semibold uppercase tracking-wide">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard
                  icon={Brain}
                  title="AI Analysis"
                  description="Run predictive models"
                  onClick={() => navigate("/scribe")}
                />
                <QuickActionCard
                  icon={BarChart3}
                  title="Analytics"
                  description="View detailed reports"
                  onClick={() => navigate("/audit")}
                />
                <QuickActionCard
                  icon={Shield}
                  title="RegTech"
                  description="Global compliance core"
                  onClick={() => navigate("/compliance")}
                />
                <QuickActionCard
                  icon={Shield}
                  title="Ethical Arbiter"
                  description="AI governance guardian"
                  onClick={() => navigate("/ethical-arbiter")}
                />
                <QuickActionCard
                  icon={Brain}
                  title="Corporate Reflex Engine"
                  description="Predictive AI • Real-time strategy"
                  onClick={() => navigate("/pcre")}
                />
                <QuickActionCard
                  icon={Plug}
                  title="Integrations"
                  description="Manage connections"
                  onClick={() => navigate("/cnl-grid")}
                />
              </div>
            </div>

            <div className="bg-alturium-card border border-alturium-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-alturium-accent" />
                <h2 className="text-lg font-semibold uppercase tracking-wide">Alerts</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                  <p className="text-xs text-green-400 font-semibold mb-1">SYSTEM HEALTH</p>
                  <p className="text-sm text-alturium-text/90">All systems operational</p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <p className="text-xs text-yellow-400 font-semibold mb-1">ATTENTION</p>
                  <p className="text-sm text-alturium-text/90">Marketing team at 76% capacity</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <p className="text-xs text-red-400 font-semibold mb-1">ACTION REQUIRED</p>
                  <p className="text-sm text-alturium-text/90">Support queue exceeds threshold</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-alturium-border bg-alturium-card/50 backdrop-blur-sm px-8 py-3 flex justify-between items-center text-xs text-alturium-text/40">
          <div>© 2025 ALTURIUM</div>
          <div className="flex items-center gap-6">
            <span>SYSTEM SECURE • ALL DATA ENCRYPTED</span>
            <span className="text-alturium-accent">Behavioral Pattern Check Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
