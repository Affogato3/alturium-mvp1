import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Trash2, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  day_of_period: number;
  time: string;
  format: string;
  active: boolean;
  last_run: string | null;
  next_run: string;
}

export const ScheduledReportsManager = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Monthly Board Deck",
      frequency: "monthly",
      day_of_period: 1,
      time: "09:00",
      format: "pdf",
      active: true,
      last_run: "2025-01-01T09:00:00Z",
      next_run: "2025-02-01T09:00:00Z",
    },
  ]);
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    frequency: "monthly",
    day_of_period: "1",
    time: "09:00",
    format: "pdf",
    recipients: "",
  });

  const handleCreateSchedule = () => {
    const schedule: ScheduledReport = {
      id: Date.now().toString(),
      name: newSchedule.name,
      frequency: newSchedule.frequency,
      day_of_period: parseInt(newSchedule.day_of_period),
      time: newSchedule.time,
      format: newSchedule.format,
      active: true,
      last_run: null,
      next_run: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setSchedules([...schedules, schedule]);
    setShowNewSchedule(false);
    setNewSchedule({
      name: "",
      frequency: "monthly",
      day_of_period: "1",
      time: "09:00",
      format: "pdf",
      recipients: "",
    });

    toast({
      title: "Schedule Created",
      description: "Your report will be generated automatically.",
    });
  };

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
    toast({
      title: "Schedule Deleted",
      description: "The scheduled report has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Scheduled Reports</h2>
          <p className="text-slate-400 mt-1">
            Automate report generation and delivery
          </p>
        </div>
        <Button
          onClick={() => setShowNewSchedule(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Schedule
        </Button>
      </div>

      {showNewSchedule && (
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Schedule Name</Label>
              <Input
                value={newSchedule.name}
                onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="Monthly Board Deck"
              />
            </div>

            <div>
              <Label className="text-slate-300">Frequency</Label>
              <Select
                value={newSchedule.frequency}
                onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Day of Period</Label>
              <Input
                type="number"
                value={newSchedule.day_of_period}
                onChange={(e) => setNewSchedule({ ...newSchedule, day_of_period: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="1"
              />
            </div>

            <div>
              <Label className="text-slate-300">Time (UTC)</Label>
              <Input
                type="time"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
              />
            </div>

            <div>
              <Label className="text-slate-300">Format</Label>
              <Select
                value={newSchedule.format}
                onValueChange={(value) => setNewSchedule({ ...newSchedule, format: value })}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="pptx">PowerPoint</SelectItem>
                  <SelectItem value="google_slides">Google Slides</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Recipients (comma-separated)</Label>
              <Input
                value={newSchedule.recipients}
                onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                className="bg-slate-900/50 border-slate-700 text-slate-300"
                placeholder="email1@company.com, email2@company.com"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => setShowNewSchedule(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSchedule} className="bg-indigo-600 hover:bg-indigo-700">
              Create Schedule
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{schedule.name}</h3>
                  <p className="text-sm text-slate-400">
                    Runs {schedule.frequency} on day {schedule.day_of_period} at {schedule.time} UTC
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant={schedule.active ? "default" : "secondary"}
                      className={schedule.active ? "bg-green-600" : "bg-slate-600"}
                    >
                      {schedule.active ? "Active" : "Paused"}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600">
                      {schedule.format.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Next run: {new Date(schedule.next_run).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleSchedule(schedule.id)}
                  className="border-slate-700"
                >
                  {schedule.active ? (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteSchedule(schedule.id)}
                  className="border-red-700 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {schedules.length === 0 && !showNewSchedule && (
          <Card className="bg-slate-800/50 border-slate-700/50 p-12">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Scheduled Reports</h3>
              <p className="text-slate-400 mb-4">
                Create your first scheduled report to automate generation and delivery
              </p>
              <Button
                onClick={() => setShowNewSchedule(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Schedule
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
