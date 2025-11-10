import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Plus, X, Info, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Filter {
  id: string;
  type: string;
  value: string;
  label: string;
}

interface SmartFiltersProps {
  onFiltersChange?: (filters: Filter[]) => void;
}

export const SmartFilters = ({ onFiltersChange }: SmartFiltersProps) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newFilterType, setNewFilterType] = useState("");
  const [newFilterValue, setNewFilterValue] = useState("");
  const { toast } = useToast();

  const filterTypes = [
    { value: "department", label: "Department", options: ["Sales", "Marketing", "Finance", "Operations", "HR"] },
    { value: "region", label: "Region", options: ["North America", "Europe", "APAC", "EMEA", "Latin America"] },
    { value: "period", label: "Time Period", options: ["Today", "This Week", "This Month", "This Quarter", "This Year"] },
    { value: "status", label: "Status", options: ["Active", "Pending", "Completed", "Archived"] },
  ];

  const getAISuggestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("data-filter", {
        body: { action: "suggest", currentFilters: filters }
      });

      if (error) throw error;

      setAiSuggestions(data.suggestions || []);
      setShowSuggestions(true);
      
      toast({
        title: "AI Suggestions Ready",
        description: `Found ${data.suggestions?.length || 0} recommended filters`,
      });
    } catch (error: any) {
      toast({
        title: "Suggestion Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFilter = (type: string, value: string) => {
    const filterType = filterTypes.find(f => f.value === type);
    const newFilter: Filter = {
      id: `${type}-${value}-${Date.now()}`,
      type,
      value,
      label: `${filterType?.label}: ${value}`
    };
    
    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
    setNewFilterType("");
    setNewFilterValue("");

    toast({
      title: "Filter Added",
      description: newFilter.label,
    });
  };

  const removeFilter = (id: string) => {
    const updatedFilters = filters.filter(f => f.id !== id);
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const applySuggestedFilter = (suggestion: any) => {
    addFilter(suggestion.type, suggestion.value);
    setShowSuggestions(false);
  };

  const explainFilterImpact = async (filter: Filter) => {
    try {
      const { data, error } = await supabase.functions.invoke("data-filter", {
        body: { action: "explain", filter }
      });

      if (error) throw error;

      toast({
        title: "Filter Impact",
        description: data.explanation,
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Explanation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("data-filter", {
        body: { action: "apply", filters }
      });

      if (error) throw error;

      toast({
        title: "Filters Applied",
        description: `${data.recordsAffected} records match your criteria`,
      });
    } catch (error: any) {
      toast({
        title: "Filter Application Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#0B0B0D] border-[#272A40]/40 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D5B65C] animate-pulse" />
            <h3 className="text-lg font-semibold text-[#E9E9E9]">Smart Filters</h3>
          </div>
          <Button
            onClick={getAISuggestions}
            disabled={isLoading}
            variant="outline"
            className="bg-[#272A40]/40 border-[#D5B65C]/30 text-[#D5B65C] hover:bg-[#D5B65C]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Suggest
          </Button>
        </div>

        {/* Active Filters */}
        {filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.map((filter) => (
              <motion.div
                key={filter.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className="bg-[#272A40]/60 text-[#E9E9E9] border border-[#D5B65C]/20 pl-3 pr-1 py-1.5 cursor-pointer hover:border-[#D5B65C]/40 transition-all"
                >
                  {filter.label}
                  <div className="ml-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-[#D5B65C]/20"
                      onClick={() => explainFilterImpact(filter)}
                    >
                      <Info className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-destructive/20"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Add Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={newFilterType} onValueChange={setNewFilterType}>
            <SelectTrigger className="bg-[#272A40]/40 border-[#272A40] text-[#E9E9E9]">
              <SelectValue placeholder="Filter Type" />
            </SelectTrigger>
            <SelectContent>
              {filterTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {newFilterType && (
            <Select value={newFilterValue} onValueChange={setNewFilterValue}>
              <SelectTrigger className="bg-[#272A40]/40 border-[#272A40] text-[#E9E9E9]">
                <SelectValue placeholder="Select Value" />
              </SelectTrigger>
              <SelectContent>
                {filterTypes.find(f => f.value === newFilterType)?.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {newFilterType && newFilterValue && (
            <Button
              onClick={() => addFilter(newFilterType, newFilterValue)}
              className="bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Filter
            </Button>
          )}
        </div>

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {showSuggestions && aiSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="border border-[#D5B65C]/30 rounded-lg p-4 bg-[#272A40]/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D5B65C]" />
                  <h4 className="text-sm font-medium text-[#E9E9E9]">AI Suggested Filters</h4>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowSuggestions(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3 bg-[#0B0B0D]/40 rounded-lg hover:bg-[#0B0B0D]/60 transition-colors cursor-pointer"
                    onClick={() => applySuggestedFilter(suggestion)}
                  >
                    <div>
                      <p className="text-sm text-[#E9E9E9] font-medium">{suggestion.label}</p>
                      <p className="text-xs text-[#BFBFBF] mt-1">{suggestion.reason}</p>
                    </div>
                    <Plus className="w-4 h-4 text-[#D5B65C]" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Apply Button */}
        {filters.length > 0 && (
          <Button
            onClick={applyFilters}
            disabled={isLoading}
            className="w-full bg-[#D5B65C] hover:bg-[#D5B65C]/90 text-[#0B0B0D]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Apply Filters
          </Button>
        )}
      </div>
    </Card>
  );
};
