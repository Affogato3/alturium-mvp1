import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Send, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { NeuralFabricBackground } from './autobudget/neural-fabric-background';
import { BudgetSummaryBar } from './autobudget/budget-summary-bar';
import { DepartmentCard } from './autobudget/department-card';
import { AIInsightsPanel } from './autobudget/ai-insights-panel';
import { BudgetDriftGraph } from './autobudget/budget-drift-graph';
import { AutoRebalanceModal } from './autobudget/auto-rebalance-modal';
import { CreateRuleDialog } from './autobudget/create-rule-dialog';
import { DrillDownModal } from './autobudget/drill-down-modal';
import { RealtimeAlertDock } from './autobudget/realtime-alert-dock';

export const AutoBudgetDashboard = () => {
  const [isReforecasting, setIsReforecasting] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [insightSummary, setInsightSummary] = useState('');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [rebalanceModalOpen, setRebalanceModalOpen] = useState(false);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [drillDownModalOpen, setDrillDownModalOpen] = useState(false);
  const [selectedDrillDown, setSelectedDrillDown] = useState<any>(null);
  const [rebalanceProposal, setRebalanceProposal] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
    initializeSampleData();
  }, []);

  const initializeSampleData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if budgets exist
      const { data: existingBudgets } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (existingBudgets && existingBudgets.length > 0) return;

      // Create sample budgets for different departments
      const departments = ['Marketing', 'Operations', 'HR', 'IT', 'Finance'];
      const sampleBudgets = departments.map(dept => ({
        user_id: user.id,
        department: dept,
        category: 'General',
        planned_amount: Math.floor(Math.random() * 5000000) + 2000000, // 2-7M
        fiscal_period: 'Q1',
        fiscal_year: 2025,
      }));

      await supabase.from('budgets').insert(sampleBudgets);

      // Create some sample actuals
      const { data: newBudgets } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (newBudgets) {
        const actuals = newBudgets.flatMap(budget => 
          Array.from({ length: 5 }, (_, i) => ({
            budget_id: budget.id,
            user_id: user.id,
            actual_amount: Math.floor(Math.random() * (Number(budget.planned_amount) * 0.3)),
            transaction_date: new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0],
            vendor_name: `Vendor ${i + 1}`,
            description: `Sample transaction ${i + 1}`,
          }))
        );

        await supabase.from('budget_actuals').insert(actuals);
      }

      toast.success('Sample budget data initialized');
      loadDashboardData();
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch budgets
      const { data: budgetsData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetsData) {
        const budgetsWithActuals = await Promise.all(
          budgetsData.map(async (budget) => {
            const { data: actuals } = await supabase
              .from('budget_actuals')
              .select('*')
              .eq('budget_id', budget.id);

            const totalActual = actuals?.reduce((sum, a) => sum + Number(a.actual_amount), 0) || 0;

            // Fetch latest forecast
            const { data: forecasts } = await supabase
              .from('budget_forecasts')
              .select('*')
              .eq('budget_id', budget.id)
              .order('forecast_date', { ascending: false })
              .limit(1);

            const latestForecast = forecasts?.[0];

            return {
              ...budget,
              actual: totalActual,
              forecast: latestForecast?.predicted_amount || totalActual * 1.1,
            };
          })
        );

        setBudgets(budgetsWithActuals);
      }

      // Fetch insights
      await loadInsights();

      // Generate forecast data for chart
      generateForecastChartData(budgetsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('budget-insights');
      
      if (error) throw error;

      if (data) {
        setInsights(data.insights || []);
        setInsightSummary(data.summary || 'No insights available');
      }
    } catch (error) {
      console.error('Error loading insights:', error);
      setInsightSummary('Unable to load AI insights');
    }
  };

  const generateForecastChartData = (budgetsData: any[]) => {
    const totalPlanned = budgetsData.reduce((sum, b) => sum + Number(b.planned_amount), 0);
    const data = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: totalPlanned * (0.7 + (i * 0.01)),
        forecast: totalPlanned * (0.7 + (i * 0.012)),
        planned: totalPlanned,
      });
    }

    setForecastData(data);
  };

  const handleReforecast = async (department?: string) => {
    setIsReforecasting(true);
    setIntensity(2);

    try {
      const { data, error } = await supabase.functions.invoke('budget-forecast', {
        body: { department },
      });

      if (error) throw error;

      toast.success('Forecasts updated successfully');
      await loadDashboardData();
    } catch (error) {
      toast.error('Failed to reforecast');
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsReforecasting(false);
        setIntensity(1);
      }, 3000);
    }
  };

  const handleAutoRebalance = () => {
    // Find overbudget and underbudget departments
    const sorted = [...budgets].sort((a, b) => {
      const varA = ((Number(a.actual) - Number(a.planned_amount)) / Number(a.planned_amount)) * 100;
      const varB = ((Number(b.actual) - Number(b.planned_amount)) / Number(b.planned_amount)) * 100;
      return varA - varB;
    });

    const underbudget = sorted[0];
    const overbudget = sorted[sorted.length - 1];

    if (underbudget && overbudget) {
      const amount = Math.abs(Number(overbudget.actual) - Number(overbudget.planned_amount)) * 0.5;

      setRebalanceProposal({
        fromDepartment: underbudget.department,
        toDepartment: overbudget.department,
        amount: Math.round(amount),
        reason: `Auto-rebalance: ${underbudget.department} underutilized, ${overbudget.department} overspending`,
        aiConfidence: 0.89,
      });
      setRebalanceModalOpen(true);
    }
  };

  const executeRebalance = async () => {
    if (!rebalanceProposal) return;

    try {
      const { error } = await supabase.functions.invoke('budget-rebalance', {
        body: {
          fromDepartment: rebalanceProposal.fromDepartment,
          toDepartment: rebalanceProposal.toDepartment,
          amount: rebalanceProposal.amount,
          autoExecute: true,
        },
      });

      if (error) throw error;

      setIntensity(3);
      setTimeout(() => setIntensity(1), 2000);
      await loadDashboardData();
    } catch (error) {
      throw error;
    }
  };

  const handleDrillDown = (dept: any) => {
    setSelectedDrillDown({
      department: dept.department,
      categories: [
        { name: 'Salaries', budget: Number(dept.planned_amount) * 0.4, spent: Number(dept.actual) * 0.5 },
        { name: 'Operations', budget: Number(dept.planned_amount) * 0.3, spent: Number(dept.actual) * 0.25 },
        { name: 'Marketing', budget: Number(dept.planned_amount) * 0.2, spent: Number(dept.actual) * 0.2 },
        { name: 'Other', budget: Number(dept.planned_amount) * 0.1, spent: Number(dept.actual) * 0.05 },
      ],
      topVendors: [
        { name: 'Vendor A', amount: Number(dept.actual) * 0.3 },
        { name: 'Vendor B', amount: Number(dept.actual) * 0.25 },
        { name: 'Vendor C', amount: Number(dept.actual) * 0.2 },
      ],
      aiRecommendation: `Consider reducing campaign ad budget by 8% to stay within ${dept.department} limits. Focus on high-ROI channels.`,
    });
    setDrillDownModalOpen(true);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.planned_amount), 0);
  const totalActual = budgets.reduce((sum, b) => sum + Number(b.actual), 0);
  const usedPercentage = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NeuralFabricBackground intensity={intensity} />

      <div className="relative z-10 container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent animate-pulse">
              AutoBudget™
            </h1>
            <p className="text-muted-foreground mt-1">
              Budgets that breathe, balance, and self-correct
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleReforecast()}
              disabled={isReforecasting}
              className="border-cyan-500/30 hover:bg-cyan-500/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isReforecasting ? 'animate-spin' : ''}`} />
              {isReforecasting ? 'Reforecasting...' : 'Reforecast'}
            </Button>
            <Button
              variant="outline"
              onClick={handleAutoRebalance}
              className="border-amber-500/30 hover:bg-amber-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Auto-Rebalance
            </Button>
          </div>
        </div>

        {/* Summary Bar */}
        <BudgetSummaryBar
          totalBudget={totalBudget}
          usedPercentage={usedPercentage}
          aiConfidence={87}
          projectedDrift="Expected +7.3% deviation in Ops by mid-month"
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left: Department Cards */}
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept.department}
                  planned={Number(dept.planned_amount)}
                  actual={Number(dept.actual)}
                  forecast={Number(dept.forecast)}
                  onDrillDown={() => handleDrillDown(dept)}
                  onReforecast={() => handleReforecast(dept.department)}
                />
              ))}
            </div>

            {/* Forecast Graph */}
            <BudgetDriftGraph data={forecastData} />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-primary/30 hover:bg-primary/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                <Send className="w-4 h-4 mr-2" />
                Notify Team
              </Button>
            </div>
          </div>

          {/* Center-Right: AI Insights */}
          <div className="xl:col-span-1">
            <AIInsightsPanel
              insights={insights}
              summary={insightSummary}
              onCreateRule={() => setRuleDialogOpen(true)}
              onAskAI={() => toast.info('AI chat feature coming soon')}
            />
          </div>

          {/* Far Right: Real-Time Alerts */}
          <div className="xl:col-span-1">
            <RealtimeAlertDock />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AutoRebalanceModal
        open={rebalanceModalOpen}
        onOpenChange={setRebalanceModalOpen}
        proposal={rebalanceProposal}
        onConfirm={executeRebalance}
      />

      <CreateRuleDialog
        open={ruleDialogOpen}
        onOpenChange={setRuleDialogOpen}
        departments={budgets.map(b => b.department)}
        onRuleCreated={loadDashboardData}
      />

      <DrillDownModal
        open={drillDownModalOpen}
        onOpenChange={setDrillDownModalOpen}
        data={selectedDrillDown}
      />
    </div>
  );
};