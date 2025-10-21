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
    },
  },
} as const
