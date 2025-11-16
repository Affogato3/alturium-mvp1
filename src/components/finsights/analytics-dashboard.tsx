import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Clock, FileText, Download } from "lucide-react";

const reportGenerationData = [
  { month: "Aug", count: 12 },
  { month: "Sep", count: 15 },
  { month: "Oct", count: 18 },
  { month: "Nov", count: 22 },
  { month: "Dec", count: 25 },
  { month: "Jan", count: 28 },
];

const generationTimeData = [
  { type: "Executive Summary", time: 8 },
  { type: "Board Deck", time: 15 },
  { type: "Risk Brief", time: 10 },
  { type: "Full Report", time: 18 },
];

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Usage Analytics</h2>
        <p className="text-slate-400 mt-1">
          Insights into your report generation patterns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-500/50 p-6">
          <FileText className="w-8 h-8 text-white mb-2" />
          <p className="text-indigo-100 text-sm">Total Reports</p>
          <p className="text-3xl font-bold text-white mt-1">142</p>
          <p className="text-indigo-100 text-xs mt-2">+18% this month</p>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-500/50 p-6">
          <Clock className="w-8 h-8 text-white mb-2" />
          <p className="text-emerald-100 text-sm">Avg Generation Time</p>
          <p className="text-3xl font-bold text-white mt-1">12.3s</p>
          <p className="text-emerald-100 text-xs mt-2">-2.1s vs last month</p>
        </Card>

        <Card className="bg-gradient-to-br from-amber-600 to-orange-600 border-amber-500/50 p-6">
          <Download className="w-8 h-8 text-white mb-2" />
          <p className="text-amber-100 text-sm">Downloads</p>
          <p className="text-3xl font-bold text-white mt-1">385</p>
          <p className="text-amber-100 text-xs mt-2">2.7 per report</p>
        </Card>

        <Card className="bg-gradient-to-br from-rose-600 to-pink-600 border-rose-500/50 p-6">
          <TrendingUp className="w-8 h-8 text-white mb-2" />
          <p className="text-rose-100 text-sm">Most Popular</p>
          <p className="text-xl font-bold text-white mt-1">Board Deck</p>
          <p className="text-rose-100 text-xs mt-2">45% of all reports</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Report Generation Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportGenerationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#818cf8"
                strokeWidth={2}
                dot={{ fill: "#818cf8", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Avg Generation Time by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generationTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="time" fill="#818cf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: "Board Deck generated", time: "2 hours ago", user: "john@company.com" },
            { action: "Risk Brief downloaded", time: "5 hours ago", user: "sarah@company.com" },
            { action: "Executive Summary generated", time: "1 day ago", user: "mike@company.com" },
            { action: "Board Deck generated", time: "2 days ago", user: "john@company.com" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-white">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.user}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
