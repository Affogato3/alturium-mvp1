import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { BriefDetailModal } from "./brief-detail-modal";

export const BriefArchive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrief, setSelectedBrief] = useState<any>(null);

  const { data: briefs, isLoading } = useQuery({
    queryKey: ['briefs-archive'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('daily_briefs')
        .select('*')
        .eq('user_id', user.id)
        .order('brief_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    }
  });

  const filteredBriefs = briefs?.filter(brief =>
    brief.brief_date.includes(searchTerm) ||
    brief.status.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search briefs by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-800"
          />
        </div>
      </div>

      {/* Briefs List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6 text-center text-slate-400">
              Loading briefs...
            </CardContent>
          </Card>
        ) : filteredBriefs && filteredBriefs.length > 0 ? (
          filteredBriefs.map((brief: any) => {
            const hasActions = brief.action_items_count > 0;
            const statusColor = hasActions ? 'text-amber-400' : 'text-green-400';
            const StatusIcon = hasActions ? AlertCircle : CheckCircle;

            return (
              <Card key={brief.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                    onClick={() => setSelectedBrief(brief)}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {new Date(brief.brief_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-slate-400">Cash</p>
                          <p className="text-lg font-bold text-white">
                            ${Number(brief.cash_amount).toLocaleString()}
                          </p>
                          <p className={`text-sm ${Number(brief.cash_change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(brief.cash_change) >= 0 ? '↑' : '↓'} ${Math.abs(Number(brief.cash_change)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Revenue</p>
                          <p className="text-lg font-bold text-white">
                            ${Number(brief.revenue).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Burn Rate</p>
                          <p className="text-lg font-bold text-white">
                            ${Number(brief.burn_rate).toLocaleString()}/day
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Action Items</p>
                          <p className="text-lg font-bold text-amber-400">
                            {brief.action_items_count || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="border-slate-700">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6 text-center text-slate-400">
              No briefs found. Generate your first daily brief!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBrief && (
        <BriefDetailModal
          brief={selectedBrief}
          open={!!selectedBrief}
          onClose={() => setSelectedBrief(null)}
        />
      )}
    </div>
  );
};