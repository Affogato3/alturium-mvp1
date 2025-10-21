import { useState, useEffect } from "react";
import { Bell, Home, Calendar, Lightbulb, FileText, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const MetricCard = ({ title, value, change, unit = "" }: { title: string; value: number; change: string; unit?: string }) => (
  <div className="bg-alturium-card border border-alturium-border rounded-lg p-6 transition-all duration-300 hover:border-alturium-accent group relative overflow-hidden">
    <div className="absolute bottom-0 left-0 w-full h-1 bg-alturium-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    <p className="text-sm text-alturium-text/60 mb-2">{title}</p>
    <p className="text-4xl font-semibold text-alturium-text mb-1">
      {value.toLocaleString()}{unit}
    </p>
    <p className="text-xs text-alturium-accent">{change}</p>
  </div>
);

const NoteCard = ({ title, date, insights }: { title: string; date: string; insights: string[] }) => (
  <div className="bg-alturium-card border border-alturium-border rounded-lg p-5 mb-3 hover:border-alturium-accent/50 transition-all duration-300">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-semibold text-alturium-text">{title}</h3>
      <span className="text-xs text-alturium-text/50">{date}</span>
    </div>
    <ul className="space-y-2 mb-4">
      {insights.map((insight, i) => (
        <li key={i} className="text-sm text-alturium-text/70 flex items-start">
          <span className="text-alturium-accent mr-2">•</span>
          {insight}
        </li>
      ))}
    </ul>
    <Button variant="ghost" className="text-alturium-accent hover:text-alturium-accent hover:bg-alturium-hover ml-auto">
      View Full Summary →
    </Button>
  </div>
);

export default function AlturiumDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastSync, setLastSync] = useState("3 mins ago");
  const [notifications, setNotifications] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);
  const [shimmer, setShimmer] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { title: "Meetings Synced", value: 127, change: "+12% vs yesterday", unit: "" },
    { title: "Insights Generated", value: 342, change: "+18% vs yesterday", unit: "" },
    { title: "Tasks Assigned", value: 89, change: "+5% vs yesterday", unit: "" },
    { title: "AI Accuracy", value: 98.5, change: "+0.3% vs yesterday", unit: "%" },
  ];

  const notes = [
    {
      title: "Q4 Strategy Review",
      date: "2 hours ago",
      insights: [
        "Revenue target increased by 15% based on market analysis",
        "New product launch scheduled for December",
        "Team expansion approved for engineering department",
      ],
    },
    {
      title: "Product Roadmap Discussion",
      date: "5 hours ago",
      insights: [
        "AI features prioritized for next sprint",
        "User feedback integration planned",
        "Mobile app development timeline finalized",
      ],
    },
  ];

  const trendData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 61 },
    { name: "Thu", value: 58 },
    { name: "Fri", value: 70 },
    { name: "Sat", value: 55 },
    { name: "Sun", value: 48 },
  ];

  const accuracyData = [
    { name: "Accurate", value: 98.5, color: "#00baff" },
    { name: "Uncertain", value: 1.5, color: "#4a4a4a" },
  ];

  const navItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Calendar, label: "Meetings", active: false },
    { icon: Lightbulb, label: "Insights", active: false },
    { icon: FileText, label: "Reports", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="min-h-screen bg-alturium-bg text-alturium-text flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-alturium-card border-r border-alturium-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-alturium-text hover:bg-alturium-hover"
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              } px-3 py-3 rounded-lg transition-all duration-300 ${
                item.active
                  ? "bg-alturium-hover border-l-2 border-alturium-accent"
                  : "hover:bg-alturium-hover/50"
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? "text-alturium-accent" : "text-alturium-text/70"}`} />
              {!sidebarCollapsed && (
                <span className={`ml-3 ${item.active ? "text-alturium-text" : "text-alturium-text/70"}`}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-alturium-border bg-alturium-card relative">
          {shimmer && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-alturium-accent to-transparent animate-shimmer"></div>
          )}
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tight">Alturium</div>
            <div className="text-lg font-medium">{getGreeting()}</div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-alturium-text hover:bg-alturium-hover relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-alturium-accent text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-alturium-card border border-alturium-border rounded-lg shadow-lg p-4 z-50">
                    <h3 className="font-semibold mb-3">Notifications</h3>
                    <div className="space-y-2">
                      <div className="text-sm p-2 bg-alturium-hover rounded">New meeting sync completed</div>
                      <div className="text-sm p-2 bg-alturium-hover rounded">AI analysis ready for Q4 review</div>
                    </div>
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-alturium-hover">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-alturium-accent text-alturium-bg">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-alturium-card border-alturium-border">
                  <DropdownMenuItem className="text-alturium-text hover:bg-alturium-hover">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-alturium-text hover:bg-alturium-hover">Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-alturium-text hover:bg-alturium-hover">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>

          {/* AI Notes Feed */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Meeting Summaries</h2>
            <div className="max-h-96 overflow-y-auto pr-2">
              {notes.map((note, i) => (
                <NoteCard key={i} {...note} />
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-alturium-card border border-alturium-border rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Meeting Insights Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <XAxis dataKey="name" stroke="#f5f5f5" />
                  <YAxis stroke="#f5f5f5" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#00baff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-alturium-card border border-alturium-border rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">AI Accuracy & Confidence</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-alturium-border bg-alturium-card px-8 py-4 flex justify-between items-center text-sm text-alturium-text/60">
          <div>© 2025 Alturium</div>
          <div className="flex items-center gap-4">
            <span>Last updated {lastSync}</span>
            <span>System Secure • All Data Encrypted</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
