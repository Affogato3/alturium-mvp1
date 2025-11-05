import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BudgetAlert {
  type: 'overspend' | 'underspend' | 'forecast_drift';
  department: string;
  category: string;
  variance?: string;
  threshold?: string;
  actual?: string;
  planned?: string;
  drift?: string;
  predicted_amount?: string;
  forecast_date?: string;
  rule_name?: string;
  confidence?: number;
  recommendation?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export const useRealtimeBudgetAlerts = () => {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const connect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setConnectionError('Not authenticated');
        return;
      }

      // Close existing connection
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      // Connect to WebSocket edge function with token as query param
      const wsUrl = `wss://plnnfivkteqgofgwxplv.supabase.co/functions/v1/budget-alerts?token=${session.access_token}`;
      console.log('Connecting to budget alerts WebSocket');

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Budget alerts WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        
        // Request initial alert check
        ws.send(JSON.stringify({ type: 'check_alerts' }));
        
        // Set up ping interval to keep connection alive
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          } else {
            clearInterval(pingInterval);
          }
        }, 25000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);

          if (data.type === 'connected') {
            console.log('Connection confirmed:', data.message);
          } else if (data.type === 'budget_alerts') {
            console.log(`Received ${data.count} budget alerts`);
            setAlerts(data.alerts);

            // Show toast for critical alerts
            const criticalAlerts = data.alerts.filter((a: BudgetAlert) => a.severity === 'critical');
            if (criticalAlerts.length > 0) {
              toast({
                title: "🚨 Critical Budget Alert",
                description: `${criticalAlerts.length} critical variance${criticalAlerts.length > 1 ? 's' : ''} detected`,
                variant: "destructive",
              });
            }
          } else if (data.type === 'error') {
            console.error('WebSocket error:', data.message);
            setConnectionError(data.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error occurred');
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 5000);
      };

    } catch (error: any) {
      console.error('Failed to connect to budget alerts:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  const checkAlerts = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'check_alerts' }));
    }
  };

  const dismissAlert = (timestamp: string) => {
    setAlerts(prev => prev.filter(a => a.timestamp !== timestamp));
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    alerts,
    isConnected,
    connectionError,
    checkAlerts,
    dismissAlert,
    reconnect: connect
  };
};
