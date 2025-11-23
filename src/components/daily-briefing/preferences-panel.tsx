import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export const PreferencesPanel = () => {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState({
    delivery_time: '07:00:00',
    timezone: 'America/New_York',
    verbosity: 'standard',
    email_enabled: true
  });

  const { data: existingPrefs, isLoading } = useQuery({
    queryKey: ['brief-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('brief_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPreferences({
          delivery_time: data.delivery_time || '07:00:00',
          timezone: data.timezone || 'America/New_York',
          verbosity: data.verbosity || 'standard',
          email_enabled: data.email_enabled ?? true
        });
      }
      return data;
    }
  });

  const savePreferencesMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('brief_preferences')
        .upsert({
          user_id: user.id,
          ...preferences
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brief-preferences'] });
      toast.success('Preferences saved successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to save preferences: ' + error.message);
    }
  });

  if (isLoading) {
    return <div className="text-center text-slate-400">Loading preferences...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Delivery Settings</CardTitle>
          <CardDescription>Configure when and how you receive your daily briefs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="delivery-time" className="text-slate-300">Delivery Time</Label>
            <Input
              id="delivery-time"
              type="time"
              value={preferences.delivery_time}
              onChange={(e) => setPreferences({ ...preferences, delivery_time: e.target.value })}
              className="bg-slate-900 border-slate-700"
            />
            <p className="text-sm text-slate-400">Default: 7:00 AM your local time</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
            <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-enabled" className="text-slate-300">Email Delivery</Label>
              <p className="text-sm text-slate-400">Receive briefs via email</p>
            </div>
            <Switch
              id="email-enabled"
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, email_enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Content Preferences</CardTitle>
          <CardDescription>Customize what information you see in your briefs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="verbosity" className="text-slate-300">Detail Level</Label>
            <Select value={preferences.verbosity} onValueChange={(value) => setPreferences({ ...preferences, verbosity: value })}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise (5 min read)</SelectItem>
                <SelectItem value="standard">Standard (10 min read)</SelectItem>
                <SelectItem value="detailed">Detailed (15 min read)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => savePreferencesMutation.mutate()}
          disabled={savePreferencesMutation.isPending}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {savePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};