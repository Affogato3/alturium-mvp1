import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Kalman Filter Implementation
class KalmanFilter {
  private x: number[]; // State vector
  private P: number[][]; // Covariance matrix
  private F: number[][]; // State transition matrix
  private H: number[][]; // Observation matrix
  private Q: number[][]; // Process noise
  private R: number[][]; // Measurement noise
  private K: number[]; // Kalman gain

  constructor(initialState: number[], initialCovariance: number[][], config: any = {}) {
    this.x = initialState;
    this.P = initialCovariance;
    
    // Simple trend model: [value, trend]
    this.F = config.F || [[1, 1], [0, 1]];
    this.H = config.H || [[1, 0]];
    this.Q = config.Q || [[100, 0], [0, 10]];
    this.R = config.R || [[1000]];
    this.K = [];
  }

  // Matrix multiplication helper
  private matMul(A: number[][], B: number[][]): number[][] {
    const rows = A.length;
    const cols = B[0].length;
    const result: number[][] = [];
    for (let i = 0; i < rows; i++) {
      result[i] = [];
      for (let j = 0; j < cols; j++) {
        result[i][j] = 0;
        for (let k = 0; k < A[0].length; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  }

  // Matrix transpose
  private transpose(A: number[][]): number[][] {
    return A[0].map((_, i) => A.map(row => row[i]));
  }

  // Matrix addition
  private matAdd(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
  }

  // Matrix subtraction
  private matSub(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val - B[i][j]));
  }

  // 2x2 matrix inverse
  private inverse2x2(A: number[][]): number[][] {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (Math.abs(det) < 1e-10) return [[1, 0], [0, 1]];
    return [
      [A[1][1] / det, -A[0][1] / det],
      [-A[1][0] / det, A[0][0] / det]
    ];
  }

  // Scalar inverse for 1x1 matrix
  private inverseScalar(val: number): number {
    return val !== 0 ? 1 / val : 1;
  }

  predict(): { x_pred: number[], P_pred: number[][] } {
    // x_pred = F * x
    const x_pred = this.F.map(row => 
      row.reduce((sum, val, i) => sum + val * this.x[i], 0)
    );
    
    // P_pred = F * P * F' + Q
    const FP = this.matMul(this.F, this.P);
    const FPFt = this.matMul(FP, this.transpose(this.F));
    const P_pred = this.matAdd(FPFt, this.Q);

    return { x_pred, P_pred };
  }

  update(z: number, x_pred: number[], P_pred: number[][]): {
    x_est: number[],
    P_est: number[][],
    innovation: number,
    kalmanGain: number
  } {
    // Innovation: y = z - H * x_pred
    const Hx = this.H[0].reduce((sum, val, i) => sum + val * x_pred[i], 0);
    const innovation = z - Hx;

    // S = H * P_pred * H' + R
    const HP = this.H.map(row => 
      P_pred.map(col => row.reduce((sum, val, i) => sum + val * col[i], 0))
    );
    const HPHt = this.matMul(HP, this.transpose(this.H));
    const S = this.matAdd(HPHt, this.R)[0][0];

    // K = P_pred * H' * S^-1
    const PHt = P_pred.map(row => [row[0] * this.H[0][0] + row[1] * this.H[0][1]]);
    this.K = PHt.map(row => row[0] * this.inverseScalar(S));

    // x_est = x_pred + K * innovation
    const x_est = x_pred.map((val, i) => val + this.K[i] * innovation);

    // P_est = (I - K*H) * P_pred
    const KH = this.K.map(k => this.H[0].map(h => k * h));
    const I = [[1, 0], [0, 1]];
    const IKH = this.matSub(I, KH);
    const P_est = this.matMul(IKH, P_pred);

    // Update state
    this.x = x_est;
    this.P = P_est;

    return {
      x_est,
      P_est,
      innovation,
      kalmanGain: this.K[0]
    };
  }

  getState() {
    return { x: this.x, P: this.P, K: this.K };
  }

  setState(x: number[], P: number[][]) {
    this.x = x;
    this.P = P;
  }

  // Calculate confidence intervals
  getConfidenceIntervals(): {
    ci95: [number, number],
    ci68: [number, number]
  } {
    const variance = this.P[0][0];
    const std = Math.sqrt(variance);
    return {
      ci95: [this.x[0] - 1.96 * std, this.x[0] + 1.96 * std],
      ci68: [this.x[0] - std, this.x[0] + std]
    };
  }

  // Signal to noise ratio
  getSignalToNoiseRatio(): number {
    const signalVariance = this.x[0] * this.x[0];
    const noiseVariance = this.P[0][0];
    return noiseVariance > 0 ? Math.sqrt(signalVariance / noiseVariance) : 10;
  }
}

// Generate forecasts
function generateForecasts(filter: KalmanFilter, horizon: number): any[] {
  const forecasts = [];
  const state = filter.getState();
  let x = [...state.x];
  let P = state.P.map(row => [...row]);
  
  const F = [[1, 1], [0, 1]];
  const Q = [[100, 0], [0, 10]];

  for (let i = 1; i <= horizon; i++) {
    // Predict forward
    const x_new = F.map(row => row.reduce((sum, val, j) => sum + val * x[j], 0));
    const FP = [[F[0][0]*P[0][0] + F[0][1]*P[1][0], F[0][0]*P[0][1] + F[0][1]*P[1][1]],
                [F[1][0]*P[0][0] + F[1][1]*P[1][0], F[1][0]*P[0][1] + F[1][1]*P[1][1]]];
    const P_new = [[FP[0][0]*F[0][0] + FP[0][1]*F[0][1] + Q[0][0], FP[0][0]*F[1][0] + FP[0][1]*F[1][1] + Q[0][1]],
                   [FP[1][0]*F[0][0] + FP[1][1]*F[0][1] + Q[1][0], FP[1][0]*F[1][0] + FP[1][1]*F[1][1] + Q[1][1]]];
    
    const std = Math.sqrt(P_new[0][0]);
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecasts.push({
      date: date.toISOString().split('T')[0],
      predicted_value: x_new[0],
      confidence_interval_lower: x_new[0] - 1.96 * std,
      confidence_interval_upper: x_new[0] + 1.96 * std,
      model_confidence: Math.max(0.5, 1 - (i * 0.02))
    });
    
    x = x_new;
    P = P_new;
  }
  
  return forecasts;
}

// Detect anomalies based on innovation
function detectAnomaly(innovation: number, variance: number): any | null {
  const std = Math.sqrt(variance);
  const normalizedInnovation = Math.abs(innovation) / std;
  
  if (normalizedInnovation > 2.5) {
    return {
      type: normalizedInnovation > 4 ? 'severe_outlier' : 'measurement_outlier',
      severity: normalizedInnovation > 4 ? 'high' : 'medium',
      std_deviations: normalizedInnovation,
      innovation: innovation
    };
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, metric, observations, forecast_horizon = 30 } = await req.json();

    if (action === 'estimate') {
      // Get or create Kalman state
      let { data: stateData } = await supabase
        .from('kalman_states')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_name', metric)
        .single();

      let filter: KalmanFilter;
      
      if (stateData) {
        filter = new KalmanFilter(
          stateData.state_vector as number[],
          stateData.covariance_matrix as number[][]
        );
      } else {
        // Initialize with first observation or default
        const initialValue = observations?.[0]?.value || 100000;
        filter = new KalmanFilter(
          [initialValue, 0],
          [[10000, 0], [0, 100]]
        );
      }

      // Process observations
      let lastEstimate = null;
      let anomalies = [];

      for (const obs of (observations || [])) {
        const { x_pred, P_pred } = filter.predict();
        
        // Adjust measurement noise based on source confidence
        const confidenceAdjustment = 1 / (obs.confidence || 0.8);
        
        const result = filter.update(obs.value, x_pred, P_pred);
        
        // Check for anomalies
        const anomaly = detectAnomaly(result.innovation, P_pred[0][0]);
        if (anomaly) {
          anomalies.push({
            ...anomaly,
            timestamp: obs.timestamp,
            source: obs.source
          });
        }

        // Store observation
        await supabase.from('metric_observations').insert({
          user_id: user.id,
          metric_name: metric,
          observed_value: obs.value,
          source: obs.source,
          confidence: obs.confidence || 0.8,
          timestamp: obs.timestamp || new Date().toISOString()
        });

        lastEstimate = result;
      }

      // Get confidence intervals
      const ci = filter.getConfidenceIntervals();
      const snr = filter.getSignalToNoiseRatio();
      const state = filter.getState();

      // Save updated state
      await supabase.from('kalman_states').upsert({
        user_id: user.id,
        metric_name: metric,
        state_vector: state.x,
        covariance_matrix: state.P,
        kalman_gain: state.K[0] || 0,
        signal_to_noise_ratio: snr,
        last_updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,metric_name' });

      // Store estimate
      const estimate = {
        user_id: user.id,
        metric_name: metric,
        estimated_value: state.x[0],
        confidence_interval_95_lower: ci.ci95[0],
        confidence_interval_95_upper: ci.ci95[1],
        confidence_interval_68_lower: ci.ci68[0],
        confidence_interval_68_upper: ci.ci68[1],
        innovation: lastEstimate?.innovation || 0,
        kalman_gain: state.K[0] || 0,
        data_quality_score: Math.min(1, snr / 10)
      };

      await supabase.from('metric_estimates').insert(estimate);

      // Generate forecasts
      const forecasts = generateForecasts(filter, forecast_horizon);
      
      // Store forecasts
      for (const fc of forecasts.slice(0, 7)) {
        await supabase.from('metric_forecasts').insert({
          user_id: user.id,
          metric_name: metric,
          ...fc,
          forecast_horizon_days: forecast_horizon
        });
      }

      // Store anomalies
      for (const anomaly of anomalies) {
        await supabase.from('kalman_anomalies').insert({
          user_id: user.id,
          metric_name: metric,
          anomaly_type: anomaly.type,
          severity: anomaly.severity,
          innovation: anomaly.innovation,
          std_deviations: anomaly.std_deviations
        });
      }

      // Generate AI insight using Lovable AI
      let aiInsight = null;
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (LOVABLE_API_KEY) {
        try {
          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: `You are a financial analyst expert in Kalman filtering and metric estimation. Provide concise, actionable insights about the metric estimate. Be specific about what the numbers mean and what actions to take.`
                },
                {
                  role: 'user',
                  content: `Analyze this Kalman filter estimate for ${metric}:
                  
Estimated Value: $${state.x[0].toLocaleString()}
Trend: ${state.x[1] > 0 ? 'Upward' : 'Downward'} at ${Math.abs(state.x[1]).toFixed(2)} per period
95% Confidence Interval: $${ci.ci95[0].toLocaleString()} - $${ci.ci95[1].toLocaleString()}
Signal-to-Noise Ratio: ${snr.toFixed(2)}
Kalman Gain: ${(state.K[0] || 0).toFixed(4)}
Innovation (prediction error): ${lastEstimate?.innovation?.toFixed(2) || 'N/A'}
Anomalies detected: ${anomalies.length}

Provide:
1. A 2-sentence executive summary
2. What the Kalman gain indicates about data reliability
3. Key risk or opportunity based on the trend
4. One specific recommended action`
                }
              ],
              max_tokens: 500
            })
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const content = aiData.choices?.[0]?.message?.content || '';
            
            aiInsight = {
              explanation: content,
              executive_summary: content.split('\n')[0] || 'Metric analysis complete.',
              recommendations: [
                anomalies.length > 0 ? 'Review detected anomalies for data quality issues' : 'Continue monitoring trends',
                snr < 3 ? 'Consider adding more data sources to improve signal quality' : 'Signal quality is good'
              ]
            };

            await supabase.from('kalman_insights').insert({
              user_id: user.id,
              metric_name: metric,
              insight_type: 'estimate_analysis',
              explanation: aiInsight.explanation,
              executive_summary: aiInsight.executive_summary,
              recommendations: aiInsight.recommendations,
              confidence: Math.min(1, snr / 10)
            });
          }
        } catch (aiError) {
          console.error('AI insight generation failed:', aiError);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        metric,
        timestamp: new Date().toISOString(),
        estimated_value: state.x[0],
        trend: state.x[1],
        confidence_interval: {
          lower_95: ci.ci95[0],
          upper_95: ci.ci95[1],
          lower_68: ci.ci68[0],
          upper_68: ci.ci68[1]
        },
        kalman_gain: state.K[0] || 0,
        signal_to_noise_ratio: snr,
        data_quality_score: Math.min(1, snr / 10),
        innovation: lastEstimate?.innovation || 0,
        forecasts: forecasts.slice(0, 7),
        anomalies,
        ai_insight: aiInsight
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'get_state') {
      const { data: stateData } = await supabase
        .from('kalman_states')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_name', metric)
        .single();

      const { data: estimates } = await supabase
        .from('metric_estimates')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_name', metric)
        .order('timestamp', { ascending: false })
        .limit(20);

      const { data: forecasts } = await supabase
        .from('metric_forecasts')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_name', metric)
        .order('forecast_date', { ascending: true })
        .limit(30);

      const { data: anomalies } = await supabase
        .from('kalman_anomalies')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_name', metric)
        .order('detected_at', { ascending: false })
        .limit(10);

      const { data: insights } = await supabase
        .from('kalman_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_name', metric)
        .order('created_at', { ascending: false })
        .limit(5);

      return new Response(JSON.stringify({
        success: true,
        state: stateData,
        estimates: estimates || [],
        forecasts: forecasts || [],
        anomalies: anomalies || [],
        insights: insights || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'calibrate') {
      // AI-powered calibration
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      const { data: estimates } = await supabase
        .from('metric_estimates')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_name', metric)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (!estimates || estimates.length < 10) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Need at least 10 estimates to calibrate'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Calculate calibration metrics
      const innovations = estimates.map(e => e.innovation).filter(i => i !== null);
      const avgInnovation = innovations.reduce((a, b) => a + b, 0) / innovations.length;
      const innovationVariance = innovations.reduce((sum, i) => sum + Math.pow(i - avgInnovation, 2), 0) / innovations.length;

      let aiCalibration = null;
      if (LOVABLE_API_KEY) {
        try {
          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert in Kalman filter calibration. Analyze the filter performance and suggest parameter adjustments.'
                },
                {
                  role: 'user',
                  content: `Analyze Kalman filter calibration for ${metric}:
                  
Sample size: ${estimates.length}
Average innovation: ${avgInnovation.toFixed(2)}
Innovation variance: ${innovationVariance.toFixed(2)}
Data quality scores: ${estimates.slice(0, 5).map(e => e.data_quality_score?.toFixed(2)).join(', ')}

Suggest:
1. Whether process noise (Q) should increase/decrease
2. Whether measurement noise (R) should increase/decrease  
3. Overall model fit assessment
4. Specific numeric recommendations`
                }
              ],
              max_tokens: 400
            })
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            aiCalibration = aiData.choices?.[0]?.message?.content;
          }
        } catch (e) {
          console.error('Calibration AI error:', e);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        calibration: {
          sample_size: estimates.length,
          avg_innovation: avgInnovation,
          innovation_variance: innovationVariance,
          recommendations: aiCalibration || 'Calibration analysis complete. Consider adjusting process noise if innovation variance is high.'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Kalman estimate error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
