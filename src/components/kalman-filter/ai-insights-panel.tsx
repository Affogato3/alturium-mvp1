import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Lightbulb, Target, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIInsightsPanelProps {
  insight: any;
  metric: string;
  estimateData: any;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insight, metric, estimateData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customInsight, setCustomInsight] = useState<string | null>(null);

  const generateDeepInsight = async () => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in');
        return;
      }

      // Re-run estimation to get fresh AI insight
      const { data, error } = await supabase.functions.invoke('kalman-estimate', {
        body: {
          action: 'estimate',
          metric,
          observations: [
            {
              timestamp: new Date().toISOString(),
              source: 'manual_refresh',
              value: estimateData?.estimated_value || 100000,
              confidence: 0.9
            }
          ],
          forecast_horizon: 30
        }
      });

      if (error) throw error;

      if (data?.ai_insight?.explanation) {
        setCustomInsight(data.ai_insight.explanation);
        toast.success('Deep insight generated');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate insight');
    } finally {
      setIsGenerating(false);
    }
  };

  const displayInsight = customInsight || insight?.explanation;
  const recommendations = insight?.recommendations || [];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main AI Analysis */}
      <Card className="col-span-2 bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-500" />
                AI Analysis & Insights
              </CardTitle>
              <CardDescription>
                AI-powered interpretation of Kalman filter results
              </CardDescription>
            </div>
            <Button 
              onClick={generateDeepInsight} 
              disabled={isGenerating}
              variant="outline"
              size="sm"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Deep Insight
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {displayInsight ? (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-400">Executive Summary</span>
                </div>
                <p className="text-foreground">
                  {insight?.executive_summary || displayInsight.split('\n')[0]}
                </p>
              </div>

              {/* Full Analysis */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Detailed Analysis
                </h4>
                <div className="prose prose-sm prose-invert max-w-none">
                  {displayInsight.split('\n').map((paragraph: string, i: number) => (
                    paragraph.trim() && (
                      <p key={i} className="text-muted-foreground mb-2">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>

              {/* Key Metrics Interpretation */}
              {estimateData && (
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium">Trend Interpretation</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(estimateData.trend || 0) > 0 
                          ? `Positive momentum detected. ${metric.toUpperCase()} is growing at ${Math.abs(estimateData.trend || 0).toFixed(2)} per period.`
                          : (estimateData.trend || 0) < 0
                            ? `Declining trend observed. ${metric.toUpperCase()} is decreasing at ${Math.abs(estimateData.trend || 0).toFixed(2)} per period.`
                            : `${metric.toUpperCase()} is stable with minimal trend movement.`}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">Data Quality Assessment</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(estimateData.signal_to_noise_ratio || 0) > 5
                          ? 'Excellent signal quality. High confidence in estimates.'
                          : (estimateData.signal_to_noise_ratio || 0) > 3
                            ? 'Good signal quality. Estimates are reliable.'
                            : 'Signal quality could be improved. Consider adding more data sources.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No AI Insights Available</p>
              <p className="text-muted-foreground mt-1 mb-4">
                Run an estimation to generate AI-powered insights
              </p>
              <Button onClick={generateDeepInsight} disabled={isGenerating}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations & Actions */}
      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-amber-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run an estimation to receive personalized recommendations
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {((insight?.confidence || estimateData?.data_quality_score || 0.7) * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <p className="font-medium">
                  {(insight?.confidence || estimateData?.data_quality_score || 0.7) > 0.8 ? 'High Confidence' :
                   (insight?.confidence || estimateData?.data_quality_score || 0.7) > 0.6 ? 'Moderate Confidence' :
                   'Low Confidence'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on data quality and model fit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">AI Model</span>
            </div>
            <p className="text-lg font-semibold">Gemini 2.5 Flash</p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by Lovable AI for real-time financial analysis
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
