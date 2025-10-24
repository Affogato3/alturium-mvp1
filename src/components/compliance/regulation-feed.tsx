import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rss, ExternalLink } from "lucide-react";

export const RegulationFeed = () => {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('regulation_feed')
        .select('*')
        .eq('user_id', user.id)
        .order('published_at', { ascending: false })
        .limit(10);

      if (data) setFeed(data);
    } catch (error) {
      console.error('Error loading feed:', error);
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Rss className="w-5 h-5 text-cyan-400" />
          Adaptive Regulation Feed
        </h3>
        <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          Live
        </Badge>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {feed.map((item) => (
            <Card 
              key={item.id}
              className="bg-[#0B0B0B] border-gray-800/50 p-3 hover:border-cyan-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-700 text-gray-300">
                      {item.jurisdiction}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-700 text-gray-300">
                      {item.source}
                    </Badge>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                    {item.title}
                  </h4>
                  
                  {item.summary && (
                    <p className="text-xs text-gray-400 line-clamp-2">{item.summary}</p>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    {item.published_at && new Date(item.published_at).toLocaleDateString()}
                  </div>
                </div>

                {item.url && (
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-2" />
                )}
              </div>
            </Card>
          ))}

          {feed.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Rss className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No regulation updates yet.</p>
              <p className="text-sm mt-2">Feed updates every 6 hours.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};