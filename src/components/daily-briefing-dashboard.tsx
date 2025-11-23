import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefArchive } from "./daily-briefing/brief-archive";
import { ActionItemsPanel } from "./daily-briefing/action-items-panel";
import { BriefMetricsOverview } from "./daily-briefing/brief-metrics-overview";
import { PreferencesPanel } from "./daily-briefing/preferences-panel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Clock, Settings, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DailyBriefingDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const { data: recentBrief, isLoading: briefLoading } = useQuery({
    queryKey: ['recent-brief'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('daily_briefs')
        .select('*')
        .eq('user_id', user.id)
        .order('brief_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: pendingActions, isLoading: actionsLoading } = useQuery({
    queryKey: ['pending-actions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleGenerateBrief = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      toast.loading('Generating daily brief...', { id: 'generate-brief' });

      const { data, error } = await supabase.functions.invoke('generate-daily-brief', {
        body: { date: new Date().toISOString().split('T')[0] }
      });

      if (error) throw error;

      toast.success('Daily brief generated successfully!', { id: 'generate-brief' });
      
      // Refresh queries
      window.location.reload();
    } catch (error: any) {
      console.error('Error generating brief:', error);
      toast.error('Failed to generate brief: ' + error.message, { id: 'generate-brief' });
    }
  };

  const urgentCount = pendingActions?.filter(a => a.urgency === 'urgent').length || 0;
  const todayCount = pendingActions?.filter(a => a.urgency === 'today').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Daily Briefing
              </h1>
              <p className="text-slate-400 mt-1">Your AI-powered financial intelligence every morning</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleGenerateBrief}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Generate Today's Brief
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-slate-700"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Latest Brief</p>
                    <p className="text-2xl font-bold text-white">
                      {recentBrief ? new Date(recentBrief.brief_date).toLocaleDateString() : 'None'}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Pending Actions</p>
                    <p className="text-2xl font-bold text-white">{pendingActions?.length || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Urgent</p>
                    <p className="text-2xl font-bold text-red-400">{urgentCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Today</p>
                    <p className="text-2xl font-bold text-amber-400">{todayCount}</p>
                  </div>
                  <Clock className="w-8 h-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="actions">Action Items ({pendingActions?.length || 0})</TabsTrigger>
            <TabsTrigger value="archive">Brief Archive</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <BriefMetricsOverview recentBrief={recentBrief} />
          </TabsContent>

          <TabsContent value="actions">
            <ActionItemsPanel />
          </TabsContent>

          <TabsContent value="archive">
            <BriefArchive />
          </TabsContent>

          <TabsContent value="settings">
            <PreferencesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};