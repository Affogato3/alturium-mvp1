import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreateRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: string[];
  onRuleCreated: () => void;
}

export const CreateRuleDialog = ({
  open,
  onOpenChange,
  departments,
  onRuleCreated,
}: CreateRuleDialogProps) => {
  const [ruleName, setRuleName] = useState('');
  const [department, setDepartment] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [notificationType, setNotificationType] = useState('email');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!ruleName || !department || !threshold) {
      toast.error('Please fill all fields');
      return;
    }

    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('budget_rules').insert({
        user_id: user.id,
        rule_name: ruleName,
        department,
        threshold_percentage: parseFloat(threshold),
        notification_type: notificationType,
        is_active: true,
      });

      if (error) throw error;

      toast.success('Budget rule created successfully');
      onRuleCreated();
      onOpenChange(false);
      setRuleName('');
      setDepartment('');
      setThreshold('5');
      setNotificationType('email');
    } catch (error) {
      toast.error('Failed to create rule');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle>Create Budget Rule</DialogTitle>
          <DialogDescription>
            Define thresholds and alert policies for budget monitoring
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ruleName">Rule Name</Label>
            <Input
              id="ruleName"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g., Marketing Overspend Alert"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Variance Threshold (%)</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="5"
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              Alert when variance exceeds this percentage
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification">Notification Type</Label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="dashboard">Dashboard Only</SelectItem>
                <SelectItem value="all">All Channels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {isCreating ? 'Creating...' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};