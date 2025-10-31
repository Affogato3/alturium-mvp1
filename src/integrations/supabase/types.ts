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
