import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Save,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sparkles,
  BarChart3,
  Target,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Adjustment {
  id: string;
  department: string;
  type: 'percentage' | 'absolute';
  value: number;
}

interface SimulationResults {
  simulated_budgets: any[];
  department_impacts: any[];
  summary: {
    total_original: number;
    total_simulated: number;
    total_change: number;
    total_change_percent: number;
    departments_affected: number;
    categories_affected: number;
  };
  ai_insights: string;
  timestamp: string;
}

export const ScenarioSimulator = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);

  useEffect(() => {
    loadDepartments();
    loadSavedScenarios();
  }, []);

  const loadDepartments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('budgets')
        .select('department')
        .eq('user_id', user.id);

      if (error) throw error;

      const uniqueDepts = [...new Set(data?.map(b => b.department) || [])];
      setDepartments(uniqueDepts as string[]);
    } catch (error: any) {
      console.error('Error loading departments:', error);
    }
  };

  const loadSavedScenarios = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('budget_scenarios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedScenarios(data || []);
    } catch (error: any) {
      console.error('Error loading scenarios:', error);
    }
  };

  const addAdjustment = () => {
    if (departments.length === 0) {
      toast.error('No departments available');
      return;
    }

    setAdjustments([
      ...adjustments,
      {
        id: Math.random().toString(36).substr(2, 9),
        department: departments[0],
        type: 'percentage',
        value: 0
      }
    ]);
  };

  const updateAdjustment = (id: string, field: string, value: any) => {
    setAdjustments(
      adjustments.map(adj =>
        adj.id === id ? { ...adj, [field]: value } : adj
      )
    );
  };

  const removeAdjustment = (id: string) => {
    setAdjustments(adjustments.filter(adj => adj.id !== id));
  };

  const runSimulation = async () => {
    if (adjustments.length === 0) {
      toast.error('Add at least one budget adjustment');
      return;
    }

    setIsSimulating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('budget-simulate', {
        body: {
          userId: user.id,
          scenarioData: {
            name: scenarioName || 'Unnamed Scenario',
            description: scenarioDescription,
            adjustments
          }
        }
      });

      if (error) throw error;

      setResults(data);
      toast.success('Simulation completed successfully');
    } catch (error: any) {
      toast.error('Simulation failed: ' + error.message);
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const saveScenario = async () => {
    if (!scenarioName) {
      toast.error('Please enter a scenario name');
      return;
    }

    if (!results) {
      toast.error('Run simulation first');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('budget_scenarios').insert([{
        user_id: user.id,
        scenario_name: scenarioName,
        description: scenarioDescription,
        base_year: new Date().getFullYear(),
        base_period: `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
        scenario_data: { adjustments } as any,
        simulation_results: results as any
      }]);

      if (error) throw error;

      toast.success('Scenario saved successfully');
      loadSavedScenarios();
    } catch (error: any) {
      toast.error('Failed to save scenario');
      console.error('Save error:', error);
    }
  };

  const loadScenario = (scenario: any) => {
    setScenarioName(scenario.scenario_name);
    setScenarioDescription(scenario.description || '');
    setAdjustments(scenario.scenario_data?.adjustments || []);
    setResults(scenario.simulation_results);
    toast.success('Scenario loaded');
  };

  const deleteScenario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budget_scenarios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Scenario deleted');
      loadSavedScenarios();
    } catch (error: any) {
      toast.error('Failed to delete scenario');
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="bg-card/50 backdrop-blur-xl">
          <TabsTrigger value="create">Create Scenario</TabsTrigger>
          <TabsTrigger value="saved">Saved Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Scenario Info */}
          <Card className="bg-card/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Scenario Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Scenario Name</Label>
                <Input
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g., Q1 Growth Initiative"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={scenarioDescription}
                  onChange={(e) => setScenarioDescription(e.target.value)}
                  placeholder="Describe this scenario and its purpose..."
                  className="bg-background/50"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget Adjustments */}
          <Card className="bg-card/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Budget Adjustments
                </CardTitle>
                <Button
                  onClick={addAdjustment}
                  size="sm"
                  className="bg-primary/20 hover:bg-primary/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Adjustment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3">
                  {adjustments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No adjustments added yet</p>
                      <p className="text-sm mt-1">Click "Add Adjustment" to begin</p>
                    </div>
                  ) : (
                    adjustments.map((adj) => (
                      <Card key={adj.id} className="p-3 bg-background/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <Label className="text-xs">Department</Label>
                            <Select
                              value={adj.department}
                              onValueChange={(val) => updateAdjustment(adj.id, 'department', val)}
                            >
                              <SelectTrigger className="bg-background/50 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Type</Label>
                            <Select
                              value={adj.type}
                              onValueChange={(val) => updateAdjustment(adj.id, 'type', val)}
                            >
                              <SelectTrigger className="bg-background/50 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="absolute">Dollar Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">
                              Value {adj.type === 'percentage' ? '(%)' : '($)'}
                            </Label>
                            <Input
                              type="number"
                              value={adj.value}
                              onChange={(e) => updateAdjustment(adj.id, 'value', parseFloat(e.target.value) || 0)}
                              className="bg-background/50 h-9"
                              step={adj.type === 'percentage' ? 1 : 100}
                            />
                          </div>

                          <div className="flex items-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAdjustment(adj.id)}
                              className="w-full hover:bg-destructive/20 h-9"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={runSimulation}
              disabled={isSimulating || adjustments.length === 0}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Play className="h-4 w-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
            <Button
              onClick={saveScenario}
              disabled={!results}
              variant="outline"
              className="border-cyan-500/30 hover:bg-cyan-500/10"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Scenario
            </Button>
          </div>

          {/* Results */}
          {results && (
            <Card className="bg-card/50 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  Simulation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Change</p>
                        <p className="text-xl font-bold">
                          ${results.summary.total_change.toLocaleString()}
                        </p>
                        <p className={cn(
                          "text-sm",
                          results.summary.total_change_percent >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {results.summary.total_change_percent >= 0 ? '+' : ''}
                          {results.summary.total_change_percent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-accent/5 border-accent/20">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Original Total</p>
                        <p className="text-xl font-bold">
                          ${results.summary.total_original.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-cyan-500/5 border-cyan-500/20">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-8 w-8 text-cyan-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Simulated Total</p>
                        <p className="text-xl font-bold">
                          ${results.summary.total_simulated.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Department Impacts */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Department Impacts</h3>
                  {results.department_impacts.map((impact: any) => (
                    <Card key={impact.department} className="p-3 bg-background/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{impact.department}</p>
                          <p className="text-xs text-muted-foreground">
                            ${impact.original_total.toLocaleString()} → ${impact.simulated_total.toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={impact.change_percent >= 0 ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {impact.change_percent >= 0 ? '+' : ''}
                          {impact.change_percent.toFixed(1)}%
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* AI Insights */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Insights
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {results.ai_insights}
                  </p>
                </Card>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <Card className="bg-card/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle>Saved Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {savedScenarios.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No saved scenarios yet</p>
                    <p className="text-sm mt-2">Create and save scenarios to see them here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedScenarios.map((scenario) => (
                      <Card key={scenario.id} className="p-4 hover:bg-accent/5 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{scenario.scenario_name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {scenario.description || 'No description'}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Badge variant="outline">
                                {scenario.base_year} {scenario.base_period}
                              </Badge>
                              <Badge variant="outline">
                                {scenario.scenario_data?.adjustments?.length || 0} adjustments
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Created {new Date(scenario.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => loadScenario(scenario)}
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteScenario(scenario.id)}
                              className="hover:bg-destructive/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
