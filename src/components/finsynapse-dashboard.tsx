import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Brain, Zap, Activity, TrendingUp, AlertTriangle, 
  ChevronLeft, Shield, Command, Eye, EyeOff, RefreshCcw,
  BarChart3, Lock, FileText, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function FinSynapseDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [optimizeMode, setOptimizeMode] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [commandActive, setCommandActive] = useState(false);
  const [cognitiveStatus, setCognitiveStatus] = useState<"optimal" | "active" | "critical">("optimal");
  const [liveInsights, setLiveInsights] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Magnetic cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Neural flow background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(11, 11, 11, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(0, 230, 246, 0.1)";
      ctx.fillStyle = "rgba(0, 230, 246, 0.3)";

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 230, 246, ${0.15 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        // Load accounts
        const { data: accountsData } = await supabase
          .from("financial_accounts")
          .select("*")
          .eq("user_id", user.id);

        setAccounts(accountsData || []);

        // Load recent insights
        const { data: insightsData } = await supabase
          .from("ai_insights")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        setLiveInsights(insightsData || []);

        // Show onboarding if no accounts
        if (!accountsData || accountsData.length === 0) {
          setShowOnboarding(true);
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [navigate, toast]);

  // Command bar handler
  const handleCommand = async () => {
    const cmd = commandInput.toLowerCase().trim();
    setCommandInput("");
    setCommandActive(false);

    try {
      if (cmd.includes("reconcile")) {
        await handleReconcile();
      } else if (cmd.includes("forecast") || cmd.includes("liquidity")) {
        await handleForecast();
      } else if (cmd.includes("rebalance")) {
        await handleRebalance();
      } else if (cmd.includes("anomaly") || cmd.includes("scan")) {
        await handleAnomalyScan();
      } else {
        toast({
          title: "Command not recognized",
          description: "Try: reconcile, forecast, rebalance, or scan for anomalies"
        });
      }
    } catch (error: any) {
      toast({
        title: "Command failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReconcile = async () => {
    setCognitiveStatus("active");
    toast({ title: "Reconciling ledgers...", description: "Cognitive Reconciliation Engine active" });

    try {
      const { data, error } = await supabase.functions.invoke("finsynapse-reconcile");
      if (error) throw error;

      toast({
        title: data.anomalies_found > 0 ? "Anomalies Detected" : "All Synced ✅",
        description: `${data.sources_checked} sources checked | ${data.anomalies_found} anomalies | ${data.confidence_score}% confidence`
      });

      setCognitiveStatus(data.anomalies_found > 0 ? "critical" : "optimal");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Reconciliation failed", description: err.message, variant: "destructive" });
      setCognitiveStatus("critical");
    }
  };

  const handleForecast = async () => {
    setCognitiveStatus("active");
    toast({ title: "Generating liquidity forecast...", description: "Time-series ML active" });

    try {
      const { data, error } = await supabase.functions.invoke("finsynapse-forecast", {
        body: { days: 7 }
      });
      if (error) throw error;

      toast({
        title: "Forecast Complete",
        description: `${data.summary.critical_days} critical days predicted in next 7 days`
      });

      setCognitiveStatus(data.summary.critical_days > 0 ? "critical" : "optimal");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Forecast failed", description: err.message, variant: "destructive" });
      setCognitiveStatus("critical");
    }
  };

  const handleRebalance = async () => {
    setCognitiveStatus("active");
    toast({ title: "Analyzing liquidity distribution...", description: "Autonomous Rebalancer engaged" });

    try {
      const { data, error } = await supabase.functions.invoke("finsynapse-rebalance", {
        body: { auto_execute: optimizeMode }
      });
      if (error) throw error;

      toast({
        title: optimizeMode ? "Liquidity Normalized" : "Rebalance Plan Ready",
        description: `${data.rebalance_actions.length} actions | +${data.efficiency_gain}% efficiency`
      });

      setCognitiveStatus("optimal");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Rebalance failed", description: err.message, variant: "destructive" });
      setCognitiveStatus("critical");
    }
  };

  const handleCreateSampleData = async () => {
    try {
      setCognitiveStatus('active');
      toast({ title: "Generating sample data...", description: "Creating financial accounts and transactions" });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create sample accounts
      const sampleAccounts = [
        { account_name: 'Chase Checking', account_type: 'checking', balance: 15000, currency: 'USD', user_id: user.id },
        { account_name: 'Savings Account', account_type: 'savings', balance: 45000, currency: 'USD', user_id: user.id },
        { account_name: 'Investment Portfolio', account_type: 'investment', balance: 125000, currency: 'USD', user_id: user.id },
      ];

      const { error: accountsError } = await supabase
        .from('financial_accounts')
        .insert(sampleAccounts);

      if (accountsError) throw accountsError;

      // Create sample transactions
      const now = new Date();
      const sampleTransactions = [];
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const category = ['income', 'expense', 'transfer'][Math.floor(Math.random() * 3)];
        sampleTransactions.push({
          user_id: user.id,
          amount: Math.random() > 0.5 ? Math.random() * 500 : -Math.random() * 300,
          description: ['Salary', 'Groceries', 'Utilities', 'Investment', 'Shopping'][Math.floor(Math.random() * 5)],
          transaction_date: date.toISOString(),
          category,
          transaction_type: category === 'income' ? 'credit' : (category === 'expense' ? 'debit' : 'transfer'),
          status: 'completed'
        });
      }

      const { error: transactionsError } = await supabase
        .from('transactions')
        .insert(sampleTransactions);

      if (transactionsError) throw transactionsError;

      toast({ 
        title: "Sample data created!", 
        description: "3 accounts and 30 transactions added successfully" 
      });
      setCognitiveStatus('optimal');
      setShowOnboarding(false);
      
      // Refresh data
      const { data: accountsData } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('user_id', user.id);
      setAccounts(accountsData || []);

    } catch (error: any) {
      toast({ 
        title: "Failed to create sample data", 
        description: error.message,
        variant: "destructive"
      });
      setCognitiveStatus('optimal');
      console.error(error);
    }
  };

  const handleAnomalyScan = async () => {
    setCognitiveStatus("active");
    toast({ title: "Scanning for anomalies...", description: "Neural network analyzing patterns" });

    try {
      const { data, error } = await supabase.functions.invoke("finsynapse-anomaly");
      if (error) throw error;

      toast({
        title: data.anomalies_detected > 0 ? `${data.anomalies_detected} Anomalies Found` : "No Anomalies Detected",
        description: `Analyzed ${data.total_transactions_analyzed} transactions`
      });

      setCognitiveStatus(data.anomalies_detected > 3 ? "critical" : "optimal");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Anomaly scan failed", description: err.message, variant: "destructive" });
      setCognitiveStatus("critical");
    }
  };

  const handleQuantumSwitch = () => {
    setOptimizeMode(!optimizeMode);
    
    // Create ripple effect
    const ripple = document.createElement("div");
    ripple.className = "fixed inset-0 pointer-events-none";
    ripple.style.background = `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(0, 230, 246, 0.3) 0%, transparent 70%)`;
    ripple.style.animation = "ripple-expand 1s ease-out";
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#00E6F6] border-r-transparent mb-4"></div>
          <p className="text-[#00E6F6] text-lg uppercase tracking-wider animate-pulse">
            Initializing Financial Neural Core...
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    optimal: "#00E6F6",
    active: "#FFA500",
    critical: "#FF0080"
  };

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden transition-all duration-500 ${stealthMode ? "opacity-40" : ""}`}>
      {/* Neural flow background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50" />

      {/* Header with Cognitive Status Halo */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-sm">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-white/60 hover:text-[#00E6F6] transition-colors"
            >
              <Home className="h-5 w-5" />
            </Button>
            
            {/* Cognitive Status Halo */}
            <div className="relative">
              <div 
                className="h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                style={{ 
                  borderColor: statusColors[cognitiveStatus],
                  boxShadow: `0 0 20px ${statusColors[cognitiveStatus]}40`
                }}
              >
                <Brain className="h-6 w-6" style={{ color: statusColors[cognitiveStatus] }} />
              </div>
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{ 
                  border: `2px solid ${statusColors[cognitiveStatus]}`,
                  animation: cognitiveStatus === "active" ? "pulse 2s infinite" : "none"
                }}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-widest">FIN<span className="text-[#00E6F6]">SYNAPSE</span>™</h1>
              <p className="text-xs text-white/40 uppercase tracking-wide">The Self-Learning Financial Core</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Optimize Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 uppercase">Optimize Mode</span>
              <button
                onClick={handleQuantumSwitch}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${optimizeMode ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-white/20"}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${optimizeMode ? "translate-x-7 shadow-[0_0_20px_rgba(255,200,0,0.8)]" : ""}`} />
              </button>
            </div>

            {/* Stealth Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setStealthMode(!stealthMode)}
              className="text-white/60 hover:text-white"
            >
              {stealthMode ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Command Bar */}
        <div className="px-8 pb-4">
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-2 bg-black/40 border border-[#00E6F6]/30 rounded-lg px-4 py-2 backdrop-blur-sm">
              <Command className="h-4 w-4 text-[#00E6F6]" />
              <Input
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onFocus={() => setCommandActive(true)}
                onBlur={() => setTimeout(() => setCommandActive(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                placeholder="Type command or speak to FinSynapse..."
                className={`border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 transition-all duration-300 ${commandActive ? "text-[#00E6F6]" : ""}`}
              />
            </div>
            {commandActive && (
              <div className="absolute top-full mt-2 w-full bg-black/90 border border-[#00E6F6]/30 rounded-lg p-4 backdrop-blur-sm animate-fade-in">
                <div className="text-xs text-white/60 space-y-1">
                  <p>• <span className="text-[#00E6F6]">reconcile</span> - Run cognitive reconciliation</p>
                  <p>• <span className="text-[#00E6F6]">forecast liquidity</span> - Generate 7-day forecast</p>
                  <p>• <span className="text-[#00E6F6]">rebalance</span> - Optimize fund distribution</p>
                  <p>• <span className="text-[#00E6F6]">scan for anomalies</span> - Detect suspicious patterns</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-8 pb-20">
        {/* Onboarding Banner */}
        {showOnboarding && (
          <div className="mb-8 bg-gradient-to-br from-[#00E6F6]/10 via-black/40 to-[#FF0080]/10 border border-[#00E6F6]/30 rounded-lg p-8 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <Brain className="h-16 w-16 mx-auto text-[#00E6F6] animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00E6F6] to-[#FF0080] bg-clip-text text-transparent">
                Welcome to FinSynapse™
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Your self-learning financial intelligence system is ready. Generate sample data to explore 
                AI-powered reconciliation, liquidity forecasting, and anomaly detection.
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <Button 
                  onClick={handleCreateSampleData}
                  className="bg-gradient-to-r from-[#00E6F6] to-[#00B8D4] hover:opacity-90 text-black font-semibold"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Sample Data
                </Button>
                <Button 
                  onClick={() => setShowOnboarding(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ActionButton
            icon={RefreshCcw}
            title="Reconcile Now"
            description="Sync all sources"
            onClick={handleReconcile}
            glowColor="#00E6F6"
          />
          <ActionButton
            icon={TrendingUp}
            title="Forecast Liquidity"
            description="7-day prediction"
            onClick={handleForecast}
            glowColor="#00E6F6"
          />
          <ActionButton
            icon={Activity}
            title="Auto-Rebalance"
            description="Optimize distribution"
            onClick={handleRebalance}
            glowColor="#00E6F6"
            badge={optimizeMode ? "AUTO" : undefined}
          />
          <ActionButton
            icon={AlertTriangle}
            title="Scan Anomalies"
            description="Neural detection"
            onClick={handleAnomalyScan}
            glowColor="#FF0080"
          />
        </div>

        {/* Cognitive Map Placeholder */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="h-5 w-5 text-[#00E6F6]" />
            <h2 className="text-lg font-semibold uppercase tracking-wide">Cognitive Financial Map</h2>
          </div>
          <div className="h-96 flex items-center justify-center border border-dashed border-white/10 rounded">
            <p className="text-white/40 text-center">
              <Brain className="h-12 w-12 mx-auto mb-2 opacity-40" />
              Interactive neural map visualization<br/>
              <span className="text-xs">Real-time account health & flow dynamics</span>
            </p>
          </div>
        </div>

        {/* Live AI Insights Feed */}
        <div className="bg-black/20 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-[#00E6F6]" />
            <h2 className="text-lg font-semibold uppercase tracking-wide">AI Insight Stream</h2>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {liveInsights.length > 0 ? (
              liveInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className="flex items-start gap-3 p-3 rounded border border-white/10 hover:border-[#00E6F6]/50 transition-all animate-fade-in bg-black/20"
                >
                  <div className={`h-2 w-2 rounded-full mt-2 animate-pulse ${
                    insight.priority === "high" ? "bg-[#FF0080]" : 
                    insight.priority === "medium" ? "bg-[#FFA500]" : 
                    "bg-[#00E6F6]"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white/90">{insight.message}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(insight.created_at).toLocaleTimeString()} • {insight.confidence}% confidence
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-8">
                No insights yet. Run analysis to generate AI insights.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Live AI Narrator Strip */}
      {optimizeMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black via-black/95 to-black border-t border-[#00E6F6]/30 backdrop-blur-sm z-30">
          <div className="px-8 py-2 flex items-center gap-3 overflow-hidden">
            <div className="h-2 w-2 rounded-full bg-[#00E6F6] animate-pulse" />
            <p className="text-xs text-[#00E6F6] animate-pulse whitespace-nowrap">
              FinSynapse autonomously managing flows since {new Date().toLocaleTimeString()} • Optimize Mode Active
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ripple-expand {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ActionButton({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  glowColor,
  badge
}: { 
  icon: any; 
  title: string; 
  description: string; 
  onClick: () => void; 
  glowColor: string;
  badge?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-black/40 border border-white/10 rounded-lg p-6 hover:border-[#00E6F6]/50 transition-all duration-300 hover:-translate-y-1 group text-left hover-scale animate-fade-in"
      style={{
        boxShadow: isHovered ? `0 10px 40px ${glowColor}20` : "none"
      }}
    >
      {badge && (
        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] border-0">
          {badge}
        </Badge>
      )}
      <Icon 
        className="h-8 w-8 mb-3 transition-all duration-300"
        style={{ 
          color: isHovered ? glowColor : "#ffffff60",
          filter: isHovered ? `drop-shadow(0 0 8px ${glowColor})` : "none"
        }}
      />
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-white/60">{description}</p>
    </button>
  );
}