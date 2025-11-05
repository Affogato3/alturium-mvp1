export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          insight_type: string
          message: string
          metadata: Json | null
          priority: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          insight_type: string
          message: string
          metadata?: Json | null
          priority?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          insight_type?: string
          message?: string
          metadata?: Json | null
          priority?: string
          user_id?: string
        }
        Relationships: []
      }
      anomaly_detections: {
        Row: {
          anomaly_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          resolved_at: string | null
          risk_score: number
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          anomaly_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          risk_score: number
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          anomaly_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          risk_score?: number
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anomaly_detections_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          hash_signature: string | null
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          hash_signature?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          hash_signature?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          action_json: Json
          condition_json: Json
          created_at: string
          execution_count: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_json: Json
          condition_json: Json
          created_at?: string
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_json?: Json
          condition_json?: Json
          created_at?: string
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      banking_connections: {
        Row: {
          account_number_encrypted: string
          account_type: string
          api_provider: string
          bank_name: string
          connection_status: string
          created_at: string
          id: string
          last_synced_at: string | null
          metadata: Json | null
          routing_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number_encrypted: string
          account_type?: string
          api_provider?: string
          bank_name: string
          connection_status?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          metadata?: Json | null
          routing_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number_encrypted?: string
          account_type?: string
          api_provider?: string
          bank_name?: string
          connection_status?: string
          created_at?: string
          id?: string
          last_synced_at?: string | null
          metadata?: Json | null
          routing_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budget_actuals: {
        Row: {
          actual_amount: number
          budget_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          transaction_date: string
          user_id: string
          vendor_name: string | null
        }
        Insert: {
          actual_amount?: number
          budget_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_date: string
          user_id: string
          vendor_name?: string | null
        }
        Update: {
          actual_amount?: number
          budget_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_date?: string
          user_id?: string
          vendor_name?: string | null
        }
        Relationships: []
      }
      budget_forecasts: {
        Row: {
          ai_recommendation: string | null
          budget_id: string
          confidence_score: number | null
          created_at: string
          drift_percentage: number | null
          forecast_date: string
          id: string
          predicted_amount: number
          user_id: string
        }
        Insert: {
          ai_recommendation?: string | null
          budget_id: string
          confidence_score?: number | null
          created_at?: string
          drift_percentage?: number | null
          forecast_date: string
          id?: string
          predicted_amount: number
          user_id: string
        }
        Update: {
          ai_recommendation?: string | null
          budget_id?: string
          confidence_score?: number | null
          created_at?: string
          drift_percentage?: number | null
          forecast_date?: string
          id?: string
          predicted_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      budget_rebalances: {
        Row: {
          ai_confidence: number | null
          amount: number
          approved_at: string | null
          created_at: string
          executed_at: string | null
          from_department: string
          id: string
          reason: string | null
          status: string
          to_department: string
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          amount: number
          approved_at?: string | null
          created_at?: string
          executed_at?: string | null
          from_department: string
          id?: string
          reason?: string | null
          status?: string
          to_department: string
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          amount?: number
          approved_at?: string | null
          created_at?: string
          executed_at?: string | null
          from_department?: string
          id?: string
          reason?: string | null
          status?: string
          to_department?: string
          user_id?: string
        }
        Relationships: []
      }
      budget_rules: {
        Row: {
          created_at: string
          department: string
          id: string
          is_active: boolean | null
          notification_type: string
          rule_name: string
          threshold_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department: string
          id?: string
          is_active?: boolean | null
          notification_type: string
          rule_name: string
          threshold_percentage: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean | null
          notification_type?: string
          rule_name?: string
          threshold_percentage?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budget_scenarios: {
        Row: {
          base_period: string
          base_year: number
          created_at: string
          description: string | null
          id: string
          scenario_data: Json
          scenario_name: string
          simulation_results: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          base_period: string
          base_year: number
          created_at?: string
          description?: string | null
          id?: string
          scenario_data?: Json
          scenario_name: string
          simulation_results?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          base_period?: string
          base_year?: number
          created_at?: string
          description?: string | null
          id?: string
          scenario_data?: Json
          scenario_name?: string
          simulation_results?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          category: string
          created_at: string
          department: string
          fiscal_period: string
          fiscal_year: number
          id: string
          planned_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          department: string
          fiscal_period: string
          fiscal_year: number
          id?: string
          planned_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          department?: string
          fiscal_period?: string
          fiscal_year?: number
          id?: string
          planned_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_events: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          decision: string
          decision_payload: Json | null
          event_data: Json
          event_type: string
          id: string
          ledger_tx_hash: string | null
          payload_hash: string
          policy_version: string | null
          rules_evaluated: string[] | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          decision: string
          decision_payload?: Json | null
          event_data: Json
          event_type: string
          id?: string
          ledger_tx_hash?: string | null
          payload_hash: string
          policy_version?: string | null
          rules_evaluated?: string[] | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          decision?: string
          decision_payload?: Json | null
          event_data?: Json
          event_type?: string
          id?: string
          ledger_tx_hash?: string | null
          payload_hash?: string
          policy_version?: string | null
          rules_evaluated?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      correlation_edges: {
        Row: {
          correlation_value: number | null
          created_at: string | null
          edge_type: string | null
          from_node_id: string | null
          id: string
          to_node_id: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          correlation_value?: number | null
          created_at?: string | null
          edge_type?: string | null
          from_node_id?: string | null
          id?: string
          to_node_id?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          correlation_value?: number | null
          created_at?: string | null
          edge_type?: string | null
          from_node_id?: string | null
          id?: string
          to_node_id?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "correlation_edges_from_node_id_fkey"
            columns: ["from_node_id"]
            isOneToOne: false
            referencedRelation: "correlation_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correlation_edges_to_node_id_fkey"
            columns: ["to_node_id"]
            isOneToOne: false
            referencedRelation: "correlation_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      correlation_nodes: {
        Row: {
          created_at: string | null
          id: string
          node_type: string | null
          position_x: number | null
          position_y: number | null
          position_z: number | null
          strength: number | null
          symbol: string
          user_id: string
          volatility: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          node_type?: string | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          strength?: number | null
          symbol: string
          user_id: string
          volatility?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          node_type?: string | null
          position_x?: number | null
          position_y?: number | null
          position_z?: number | null
          strength?: number | null
          symbol?: string
          user_id?: string
          volatility?: number | null
        }
        Relationships: []
      }
      employee_logs: {
        Row: {
          attendance_score: number | null
          contribution_keywords: Json | null
          created_at: string | null
          employee_name: string
          id: string
          key_actions: number | null
          meeting_id: string | null
          sentiment_score: number | null
          talk_time_percent: number | null
        }
        Insert: {
          attendance_score?: number | null
          contribution_keywords?: Json | null
          created_at?: string | null
          employee_name: string
          id?: string
          key_actions?: number | null
          meeting_id?: string | null
          sentiment_score?: number | null
          talk_time_percent?: number | null
        }
        Update: {
          attendance_score?: number | null
          contribution_keywords?: Json | null
          created_at?: string | null
          employee_name?: string
          id?: string
          key_actions?: number | null
          meeting_id?: string | null
          sentiment_score?: number | null
          talk_time_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_logs_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_artifacts: {
        Row: {
          artifact_hash: string
          artifact_type: string
          compliance_event_id: string | null
          created_at: string | null
          file_name: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          artifact_hash: string
          artifact_type: string
          compliance_event_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          artifact_hash?: string
          artifact_type?: string
          compliance_event_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_artifacts_compliance_event_id_fkey"
            columns: ["compliance_event_id"]
            isOneToOne: false
            referencedRelation: "compliance_events"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_orders: {
        Row: {
          broker: string | null
          compliance_checked: boolean | null
          created_at: string | null
          executed_at: string | null
          execution_mode: string | null
          id: string
          order_type: string
          price: number | null
          quantity: number
          side: string
          signal_id: string | null
          status: string | null
          symbol: string
          user_id: string
        }
        Insert: {
          broker?: string | null
          compliance_checked?: boolean | null
          created_at?: string | null
          executed_at?: string | null
          execution_mode?: string | null
          id?: string
          order_type: string
          price?: number | null
          quantity: number
          side: string
          signal_id?: string | null
          status?: string | null
          symbol: string
          user_id: string
        }
        Update: {
          broker?: string | null
          compliance_checked?: boolean | null
          created_at?: string | null
          executed_at?: string | null
          execution_mode?: string | null
          id?: string
          order_type?: string
          price?: number | null
          quantity?: number
          side?: string
          signal_id?: string | null
          status?: string | null
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "execution_orders_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "market_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      fabric_accounts: {
        Row: {
          account_number: string
          account_type: string
          balance: number
          client_id: string
          created_at: string | null
          currency: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          account_type?: string
          balance?: number
          client_id: string
          created_at?: string | null
          currency?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          account_type?: string
          balance?: number
          client_id?: string
          created_at?: string | null
          currency?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fabric_api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          scopes: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          scopes?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          scopes?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      fabric_compliance_events: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          rule_triggered: string
          severity: string
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          rule_triggered: string
          severity: string
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          rule_triggered?: string
          severity?: string
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fabric_compliance_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "fabric_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      fabric_integrations: {
        Row: {
          api_key_encrypted: string | null
          config: Json | null
          created_at: string | null
          id: string
          integration_type: string
          provider: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key_encrypted?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          integration_type: string
          provider: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key_encrypted?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          integration_type?: string
          provider?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fabric_ledger_entries: {
        Row: {
          amount: number
          block_hash: string | null
          created_at: string | null
          credit_account: string | null
          currency: string
          debit_account: string | null
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          block_hash?: string | null
          created_at?: string | null
          credit_account?: string | null
          currency?: string
          debit_account?: string | null
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          block_hash?: string | null
          created_at?: string | null
          credit_account?: string | null
          currency?: string
          debit_account?: string | null
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fabric_ledger_entries_credit_account_fkey"
            columns: ["credit_account"]
            isOneToOne: false
            referencedRelation: "fabric_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_ledger_entries_debit_account_fkey"
            columns: ["debit_account"]
            isOneToOne: false
            referencedRelation: "fabric_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      fabric_transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string | null
          created_at: string | null
          currency: string
          description: string | null
          id: string
          initiated_by: string | null
          metadata: Json | null
          status: string
          tx_number: string
          type: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          status?: string
          tx_number: string
          type: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          status?: string
          tx_number?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fabric_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "fabric_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          account_name: string
          account_type: string
          balance: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_type: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_documents: {
        Row: {
          ai_confidence: number | null
          amount: number | null
          category: string | null
          created_at: string
          currency: string | null
          description: string | null
          doc_type: string
          due_date: string | null
          extracted_data: Json | null
          file_url: string | null
          id: string
          issue_date: string | null
          priority: number | null
          status: string
          updated_at: string
          user_id: string
          vendor_name: string | null
        }
        Insert: {
          ai_confidence?: number | null
          amount?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          doc_type: string
          due_date?: string | null
          extracted_data?: Json | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          priority?: number | null
          status?: string
          updated_at?: string
          user_id: string
          vendor_name?: string | null
        }
        Update: {
          ai_confidence?: number | null
          amount?: number | null
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          doc_type?: string
          due_date?: string | null
          extracted_data?: Json | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          priority?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          vendor_name?: string | null
        }
        Relationships: []
      }
      insider_activities: {
        Row: {
          anomaly_score: number | null
          cluster_id: string | null
          detected_at: string | null
          filing_date: string | null
          id: string
          insider_name: string | null
          price: number | null
          shares: number | null
          symbol: string
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          anomaly_score?: number | null
          cluster_id?: string | null
          detected_at?: string | null
          filing_date?: string | null
          id?: string
          insider_name?: string | null
          price?: number | null
          shares?: number | null
          symbol: string
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          anomaly_score?: number | null
          cluster_id?: string | null
          detected_at?: string | null
          filing_date?: string | null
          id?: string
          insider_name?: string | null
          price?: number | null
          shares?: number | null
          symbol?: string
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interlock_conflicts: {
        Row: {
          affected_departments: string[]
          auto_resolution_suggested: Json | null
          conflict_type: string
          created_at: string
          description: string
          id: string
          predicted_impact_hours: number
          resolution_status: string
          resolved_at: string | null
          severity: string
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          affected_departments: string[]
          auto_resolution_suggested?: Json | null
          conflict_type: string
          created_at?: string
          description: string
          id?: string
          predicted_impact_hours: number
          resolution_status?: string
          resolved_at?: string | null
          severity: string
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          affected_departments?: string[]
          auto_resolution_suggested?: Json | null
          conflict_type?: string
          created_at?: string
          description?: string
          id?: string
          predicted_impact_hours?: number
          resolution_status?: string
          resolved_at?: string | null
          severity?: string
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interlock_conflicts_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "interlock_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      interlock_dependencies: {
        Row: {
          created_at: string
          dependency_type: string
          depends_on_task_id: string
          id: string
          task_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          dependency_type: string
          depends_on_task_id: string
          id?: string
          task_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          dependency_type?: string
          depends_on_task_id?: string
          id?: string
          task_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "interlock_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "interlock_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interlock_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "interlock_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      interlock_reschedules: {
        Row: {
          ai_confidence: number | null
          conflict_id: string | null
          created_at: string
          id: string
          new_end_date: string
          new_start_date: string
          old_end_date: string
          old_start_date: string
          reason: string
          stakeholders_notified: string[] | null
          task_id: string
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          conflict_id?: string | null
          created_at?: string
          id?: string
          new_end_date: string
          new_start_date: string
          old_end_date: string
          old_start_date: string
          reason: string
          stakeholders_notified?: string[] | null
          task_id: string
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          conflict_id?: string | null
          created_at?: string
          id?: string
          new_end_date?: string
          new_start_date?: string
          old_end_date?: string
          old_start_date?: string
          reason?: string
          stakeholders_notified?: string[] | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interlock_reschedules_conflict_id_fkey"
            columns: ["conflict_id"]
            isOneToOne: false
            referencedRelation: "interlock_conflicts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interlock_reschedules_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "interlock_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      interlock_tasks: {
        Row: {
          conflict_probability: number | null
          created_at: string
          department: string
          description: string | null
          end_date: string
          id: string
          owner_name: string
          predicted_delay_hours: number | null
          priority: string
          progress: number
          resource_requirement: string | null
          start_date: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conflict_probability?: number | null
          created_at?: string
          department: string
          description?: string | null
          end_date: string
          id?: string
          owner_name: string
          predicted_delay_hours?: number | null
          priority: string
          progress?: number
          resource_requirement?: string | null
          start_date: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conflict_probability?: number | null
          created_at?: string
          department?: string
          description?: string | null
          end_date?: string
          id?: string
          owner_name?: string
          predicted_delay_hours?: number | null
          priority?: string
          progress?: number
          resource_requirement?: string | null
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jurisdictions: {
        Row: {
          code: string
          compliance_status: Database["public"]["Enums"]["compliance_status"]
          created_at: string | null
          id: string
          last_audit_date: string | null
          name: string
          next_review_date: string | null
          region: string
          regulators: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          compliance_status?: Database["public"]["Enums"]["compliance_status"]
          created_at?: string | null
          id?: string
          last_audit_date?: string | null
          name: string
          next_review_date?: string | null
          region: string
          regulators?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          compliance_status?: Database["public"]["Enums"]["compliance_status"]
          created_at?: string | null
          id?: string
          last_audit_date?: string | null
          name?: string
          next_review_date?: string | null
          region?: string
          regulators?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      kpi_mappings: {
        Row: {
          correlation_score: number | null
          id: string
          impact_type: string | null
          kpi_name: string
          kpi_value: number | null
          related_symbols: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correlation_score?: number | null
          id?: string
          impact_type?: string | null
          kpi_name: string
          kpi_value?: number | null
          related_symbols?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correlation_score?: number | null
          id?: string
          impact_type?: string | null
          kpi_name?: string
          kpi_value?: number | null
          related_symbols?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      liquidity_forecasts: {
        Row: {
          confidence_level: number | null
          created_at: string
          forecast_date: string
          id: string
          predicted_balance: number | null
          recommendations: Json | null
          risk_level: string | null
          user_id: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          forecast_date: string
          id?: string
          predicted_balance?: number | null
          recommendations?: Json | null
          risk_level?: string | null
          user_id: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          forecast_date?: string
          id?: string
          predicted_balance?: number | null
          recommendations?: Json | null
          risk_level?: string | null
          user_id?: string
        }
        Relationships: []
      }
      liquidity_nodes: {
        Row: {
          account_type: string
          balance: number
          created_at: string | null
          entity: string
          flow_direction: string | null
          id: string
          maturity_date: string | null
          risk_weight: number | null
          timestamp: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type: string
          balance?: number
          created_at?: string | null
          entity: string
          flow_direction?: string | null
          id?: string
          maturity_date?: string | null
          risk_weight?: number | null
          timestamp?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string | null
          entity?: string
          flow_direction?: string | null
          id?: string
          maturity_date?: string | null
          risk_weight?: number | null
          timestamp?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      market_scenarios: {
        Row: {
          created_at: string | null
          id: string
          parameters: Json | null
          results: Json | null
          scenario_name: string
          scenario_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameters?: Json | null
          results?: Json | null
          scenario_name: string
          scenario_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameters?: Json | null
          results?: Json | null
          scenario_name?: string
          scenario_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      market_signals: {
        Row: {
          audit_ref: string | null
          confidence: number
          created_at: string | null
          explainability: Json | null
          id: string
          model_version: string | null
          signal_type: string
          status: string | null
          suggested_action: Json
          symbol: string
          user_id: string
        }
        Insert: {
          audit_ref?: string | null
          confidence: number
          created_at?: string | null
          explainability?: Json | null
          id?: string
          model_version?: string | null
          signal_type: string
          status?: string | null
          suggested_action: Json
          symbol: string
          user_id: string
        }
        Update: {
          audit_ref?: string | null
          confidence?: number
          created_at?: string | null
          explainability?: Json | null
          id?: string
          model_version?: string | null
          signal_type?: string
          status?: string | null
          suggested_action?: Json
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      meeting_analytics: {
        Row: {
          created_at: string | null
          id: string
          meeting_id: string | null
          sentiment_timeline: Json | null
          speaker_balance: Json | null
          task_density: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          sentiment_timeline?: Json | null
          speaker_balance?: Json | null
          task_density?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          sentiment_timeline?: Json | null
          speaker_balance?: Json | null
          task_density?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_analytics_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_decisions: {
        Row: {
          category: string | null
          created_at: string | null
          decision_text: string
          id: string
          meeting_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          decision_text: string
          id?: string
          meeting_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          decision_text?: string
          id?: string
          meeting_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_decisions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_insights: {
        Row: {
          content: string
          created_at: string | null
          id: string
          insight_type: string
          meeting_id: string | null
          pinned: boolean | null
          priority: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          insight_type: string
          meeting_id?: string | null
          pinned?: boolean | null
          priority?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          insight_type?: string
          meeting_id?: string | null
          pinned?: boolean | null
          priority?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_insights_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_tasks: {
        Row: {
          assignee: string
          completed: boolean | null
          created_at: string | null
          deadline: string | null
          id: string
          meeting_id: string | null
          task_title: string
        }
        Insert: {
          assignee: string
          completed?: boolean | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          meeting_id?: string | null
          task_title: string
        }
        Update: {
          assignee?: string
          completed?: boolean | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          meeting_id?: string | null
          task_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_tasks_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_transcripts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          meeting_id: string | null
          speaker: string | null
          timestamp_ms: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          speaker?: string | null
          timestamp_ms?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          speaker?: string | null
          timestamp_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_transcripts_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          duration: number | null
          id: string
          meeting_date: string
          participants: Json | null
          sentiment_score: number | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          id?: string
          meeting_date: string
          participants?: Json | null
          sentiment_score?: number | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          id?: string
          meeting_date?: string
          participants?: Json | null
          sentiment_score?: number | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_approvals: {
        Row: {
          amount: number
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          document_id: string | null
          executed_at: string | null
          id: string
          metadata: Json | null
          payment_method: string
          requested_by: string | null
          scheduled_date: string | null
          status: string
          user_id: string
          vendor_name: string
        }
        Insert: {
          amount: number
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          document_id?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string
          requested_by?: string | null
          scheduled_date?: string | null
          status?: string
          user_id: string
          vendor_name: string
        }
        Update: {
          amount?: number
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          document_id?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string
          requested_by?: string | null
          scheduled_date?: string | null
          status?: string
          user_id?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_approvals_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "financial_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          approval_id: string | null
          bank_ref: string | null
          completed_at: string | null
          created_at: string
          currency: string
          document_id: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          payment_method: string
          status: string
          transaction_ref: string
          user_id: string
          vendor_account: string | null
          vendor_name: string
        }
        Insert: {
          amount: number
          approval_id?: string | null
          bank_ref?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          document_id?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_method: string
          status?: string
          transaction_ref: string
          user_id: string
          vendor_account?: string | null
          vendor_name: string
        }
        Update: {
          amount?: number
          approval_id?: string | null
          bank_ref?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          document_id?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string
          status?: string
          transaction_ref?: string
          user_id?: string
          vendor_account?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "payment_approvals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "financial_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          effective_from: string | null
          expires_at: string | null
          id: string
          jurisdiction: string[]
          priority: number | null
          rule_id: string
          rule_json: Json
          source_url: string | null
          status: Database["public"]["Enums"]["policy_status"]
          title: string
          updated_at: string | null
          user_id: string
          version: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          expires_at?: string | null
          id?: string
          jurisdiction: string[]
          priority?: number | null
          rule_id: string
          rule_json: Json
          source_url?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          title: string
          updated_at?: string | null
          user_id: string
          version: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          expires_at?: string | null
          id?: string
          jurisdiction?: string[]
          priority?: number | null
          rule_id?: string
          rule_json?: Json
          source_url?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          title?: string
          updated_at?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      portfolio_positions: {
        Row: {
          account: string | null
          avg_price: number
          created_at: string | null
          current_price: number | null
          id: string
          qty: number
          sector: string | null
          symbol: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account?: string | null
          avg_price: number
          created_at?: string | null
          current_price?: number | null
          id?: string
          qty: number
          sector?: string | null
          symbol: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account?: string | null
          avg_price?: number
          created_at?: string | null
          current_price?: number | null
          id?: string
          qty?: number
          sector?: string | null
          symbol?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      predictive_flows: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          model_version: string | null
          net_flow: number | null
          predicted_inflow: number | null
          predicted_outflow: number | null
          prediction_horizon: string | null
          sector: string | null
          symbol: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          model_version?: string | null
          net_flow?: number | null
          predicted_inflow?: number | null
          predicted_outflow?: number | null
          prediction_horizon?: string | null
          sector?: string | null
          symbol: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          model_version?: string | null
          net_flow?: number | null
          predicted_inflow?: number | null
          predicted_outflow?: number | null
          prediction_horizon?: string | null
          sector?: string | null
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          industry: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          industry?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reconciliation_logs: {
        Row: {
          anomalies_found: number | null
          confidence_score: number | null
          created_at: string
          details: Json | null
          id: string
          sources_checked: number | null
          status: string
          user_id: string
        }
        Insert: {
          anomalies_found?: number | null
          confidence_score?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          sources_checked?: number | null
          status: string
          user_id: string
        }
        Update: {
          anomalies_found?: number | null
          confidence_score?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          sources_checked?: number | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      regulation_feed: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          jurisdiction: string
          published_at: string | null
          relevance_score: number | null
          source: string
          summary: string | null
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          jurisdiction: string
          published_at?: string | null
          relevance_score?: number | null
          source: string
          summary?: string | null
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          jurisdiction?: string
          published_at?: string | null
          relevance_score?: number | null
          source?: string
          summary?: string | null
          title?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      risk_clusters: {
        Row: {
          affected_entities: string[] | null
          cluster_name: string
          created_at: string | null
          description: string | null
          detected_at: string | null
          id: string
          jurisdiction: string
          mitigation_status: string | null
          resolved_at: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          user_id: string
        }
        Insert: {
          affected_entities?: string[] | null
          cluster_name: string
          created_at?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          jurisdiction: string
          mitigation_status?: string | null
          resolved_at?: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          user_id: string
        }
        Update: {
          affected_entities?: string[] | null
          cluster_name?: string
          created_at?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          jurisdiction?: string
          mitigation_status?: string | null
          resolved_at?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          user_id?: string
        }
        Relationships: []
      }
      sentiment_data: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          published_at: string | null
          sentiment_score: number | null
          source: string | null
          symbol: string
          url: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          sentiment_score?: number | null
          source?: string | null
          symbol: string
          url?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          sentiment_score?: number | null
          source?: string | null
          symbol?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      smart_contracts: {
        Row: {
          contract_data: Json | null
          contract_type: string
          created_at: string
          executed_at: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contract_data?: Json | null
          contract_type: string
          created_at?: string
          executed_at?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contract_data?: Json | null
          contract_type?: string
          created_at?: string
          executed_at?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean
          notification_method: string
          symbol: string
          threshold_value: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          notification_method: string
          symbol: string
          threshold_value: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          notification_method?: string
          symbol?: string
          threshold_value?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          status: string
          transaction_date: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_date?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          transaction_date?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          layout_preference: string
          theme_settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          layout_preference?: string
          theme_settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          layout_preference?: string
          theme_settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          name: string
          risk_score: number | null
          total_spent: number | null
          transaction_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
          risk_score?: number | null
          total_spent?: number | null
          transaction_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
          risk_score?: number | null
          total_spent?: number | null
          transaction_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          added_at: string
          id: string
          name: string
          symbol: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          name: string
          symbol: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          name?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "executive" | "analyst" | "auditor"
      compliance_status:
        | "compliant"
        | "pending_update"
        | "audit_flagged"
        | "non_compliant"
      policy_status: "draft" | "staging" | "canary" | "production" | "archived"
      risk_level: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "executive", "analyst", "auditor"],
      compliance_status: [
        "compliant",
        "pending_update",
        "audit_flagged",
        "non_compliant",
      ],
      policy_status: ["draft", "staging", "canary", "production", "archived"],
      risk_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
