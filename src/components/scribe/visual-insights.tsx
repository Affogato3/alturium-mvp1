import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface VisualInsightsProps {
  sentimentTimeline: Array<{ time: string; sentiment: number }>;
  speakerBalance: Array<{ name: string; percentage: number; keywords: string[] }>;
  taskDensity: { completed: number; new: number; pending: number };
}

export const VisualInsights = ({ sentimentTimeline, speakerBalance, taskDensity }: VisualInsightsProps) => {
  const taskData = [
    { name: "Completed", value: taskDensity.completed, color: "#10b981" },
    { name: "New", value: taskDensity.new, color: "#00baff" },
    { name: "Pending", value: taskDensity.pending, color: "#f59e0b" },
  ];

  return (
    <Card className="bg-[hsl(var(--scribe-card))] border-0 shadow-lg p-6">
      <h3 className="text-lg font-semibold text-[hsl(var(--scribe-text))] mb-6">
        Visual Insights
      </h3>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sentiment Over Time */}
        <div className="space-y-2">
          <h4 className="text-sm text-[hsl(var(--scribe-text))]/70">Sentiment Over Time</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTimeline}>
                <XAxis dataKey="time" stroke="hsl(var(--scribe-text) / 0.3)" fontSize={10} />
                <YAxis stroke="hsl(var(--scribe-text) / 0.3)" fontSize={10} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--scribe-bg))",
                    border: "1px solid hsl(var(--scribe-text) / 0.1)",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "hsl(var(--scribe-text))" }}
                />
                <Line
                  type="monotone"
                  dataKey="sentiment"
                  stroke="hsl(var(--scribe-accent))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speaker Balance */}
        <div className="space-y-2">
          <h4 className="text-sm text-[hsl(var(--scribe-text))]/70">Speaker Balance</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speakerBalance} layout="horizontal">
                <XAxis type="number" stroke="hsl(var(--scribe-text) / 0.3)" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--scribe-text) / 0.3)" fontSize={10} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--scribe-bg))",
                    border: "1px solid hsl(var(--scribe-text) / 0.1)",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "hsl(var(--scribe-text))" }}
                />
                <Bar dataKey="percentage" fill="hsl(var(--scribe-accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Density */}
        <div className="space-y-2">
          <h4 className="text-sm text-[hsl(var(--scribe-text))]/70">Task Density</h4>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--scribe-bg))",
                    border: "1px solid hsl(var(--scribe-text) / 0.1)",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};
