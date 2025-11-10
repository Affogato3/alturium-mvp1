import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, Plus, Sparkles, Save, Eye, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Widget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { w: number; h: number };
}

const widgetTypes = [
  { type: "chart", title: "Line Chart", icon: "📈" },
  { type: "bar", title: "Bar Chart", icon: "📊" },
  { type: "kpi", title: "KPI Card", icon: "🎯" },
  { type: "table", title: "Data Table", icon: "📋" },
  { type: "map", title: "Geo Map", icon: "🗺️" },
  { type: "gauge", title: "Gauge", icon: "⚡" },
];

export const DashboardBuilder = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [layoutName, setLayoutName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();

  const addWidget = (type: string, title: string) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title,
      position: { x: Math.floor(Math.random() * 3), y: widgets.length },
      size: { w: 1, h: 1 }
    };

    setWidgets(prev => [...prev, newWidget]);
    setShowWidgetLibrary(false);

    toast({
      title: "Widget Added",
      description: `${title} added to your dashboard`,
    });
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const getAIRecommendedLayout = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("dashboard-layout", {
        body: { action: "recommend", currentWidgets: widgets }
      });

      if (error) throw error;

      // Apply AI recommended positions
      const optimizedWidgets = widgets.map((widget, idx) => ({
        ...widget,
        position: data.layout[idx]?.position || widget.position,
        size: data.layout[idx]?.size || widget.size
      }));

      setWidgets(optimizedWidgets);

      toast({
        title: "Layout Optimized",
        description: data.explanation,
      });
    } catch (error: any) {
      toast({
        title: "Optimization Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveLayout = async () => {
    if (!layoutName) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your dashboard layout",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("dashboard-layout", {
        body: {
          action: "save",
          name: layoutName,
          widgets,
        }
      });

      if (error) throw error;

      toast({
        title: "Layout Saved",
        description: `Dashboard layout saved as "${layoutName}"`,
      });

      setLayoutName("");
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-[#0B0B0D] border-[#272A40]/40 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#D5B65C]" />
            <h3 className="text-lg font-semibold text-[#E9E9E9]">Dashboard Builder</h3>
          </div>
          <Button
            onClick={() => setShowDialog(true)}
            variant="outline"
            className="bg-[#272A40]/40 border-[#D5B65C]/30 text-[#D5B65C] hover:bg-[#D5B65C]/10"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Build Dashboard
          </Button>
        </div>
      </Card>

      {/* Dashboard Builder Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-7xl max-h-[95vh] bg-[#0B0B0D] border-[#272A40] p-0">
          <DialogHeader className="p-6 pb-4 border-b border-[#272A40]">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[#E9E9E9] flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#D5B65C]" />
                Custom Dashboard Builder
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowWidgetLibrary(true)}
                  size="sm"
                  className="bg-[#272A40] hover:bg-[#272A40]/80 text-[#E9E9E9]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Widget
                </Button>
                <Button
                  onClick={getAIRecommendedLayout}
                  disabled={isLoading || widgets.length === 0}
                  size="sm"
                  className="bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D]"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Optimize
                </Button>
                <Button
                  onClick={() => setIsPreview(!isPreview)}
                  size="sm"
                  variant="outline"
                  className="border-[#272A40] text-[#E9E9E9]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Canvas Area */}
          <div className={`p-6 overflow-y-auto ${isPreview ? 'bg-gradient-to-br from-[#0B0B0D] to-[#272A40]/20' : ''}`}>
            {widgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <LayoutDashboard className="w-16 h-16 text-[#272A40] mb-4" />
                <h3 className="text-xl font-semibold text-[#E9E9E9] mb-2">Empty Canvas</h3>
                <p className="text-[#BFBFBF] mb-4">Start building your custom dashboard by adding widgets</p>
                <Button
                  onClick={() => setShowWidgetLibrary(true)}
                  className="bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Widget
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <AnimatePresence>
                  {widgets.map((widget, idx) => (
                    <motion.div
                      key={widget.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      layout
                      className={`col-span-${widget.size.w} row-span-${widget.size.h}`}
                    >
                      <Card className="bg-[#272A40]/40 border-[#272A40] p-4 h-full group hover:border-[#D5B65C]/40 transition-all">
                        {!isPreview && (
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 cursor-move">
                              <GripVertical className="w-4 h-4 text-[#BFBFBF]" />
                              <span className="text-sm font-medium text-[#E9E9E9]">{widget.title}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                              onClick={() => removeWidget(widget.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center justify-center h-32 bg-[#0B0B0D]/40 rounded-lg">
                          <span className="text-4xl">{widgetTypes.find(w => w.type === widget.type)?.icon}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Save Layout Footer */}
          {widgets.length > 0 && (
            <div className="p-6 pt-4 border-t border-[#272A40] flex gap-3">
              <Input
                placeholder="Dashboard name (e.g., Finance Overview)"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="bg-[#272A40]/40 border-[#272A40] text-[#E9E9E9]"
              />
              <Button
                onClick={saveLayout}
                disabled={isLoading || !layoutName}
                className="bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D] whitespace-nowrap"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Widget Library Dialog */}
      <Dialog open={showWidgetLibrary} onOpenChange={setShowWidgetLibrary}>
        <DialogContent className="bg-[#0B0B0D] border-[#272A40]">
          <DialogHeader>
            <DialogTitle className="text-[#E9E9E9]">Widget Library</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {widgetTypes.map((widget, idx) => (
              <motion.div
                key={widget.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className="bg-[#272A40]/40 border-[#272A40] p-4 cursor-pointer hover:border-[#D5B65C]/40 hover:bg-[#272A40]/60 transition-all"
                  onClick={() => addWidget(widget.type, widget.title)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{widget.icon}</span>
                    <span className="text-sm font-medium text-[#E9E9E9]">{widget.title}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
