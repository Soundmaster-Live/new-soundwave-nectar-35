export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_content_logs: {
        Row: {
          content: string
          content_type: string
          created_at: string
          id: string
          is_flagged: boolean | null
          sentiment_score: number | null
          station_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          sentiment_score?: number | null
          station_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          is_flagged?: boolean | null
          sentiment_score?: number | null
          station_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_content_logs_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "radio_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_personalities: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          language: string | null
          name: string
          personality_prompt: string
          user_id: string | null
          voice_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          name: string
          personality_prompt: string
          user_id?: string | null
          voice_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          name?: string
          personality_prompt?: string
          user_id?: string | null
          voice_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          details: string | null
          event_date: string
          event_type: string
          id: string
          status: string | null
          time: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          event_date: string
          event_type: string
          id?: string
          status?: string | null
          time?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          event_date?: string
          event_type?: string
          id?: string
          status?: string | null
          time?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      broadcast_settings: {
        Row: {
          created_at: string
          current_dj: string | null
          id: string
          news_enabled: boolean | null
          station_name: string
          updated_at: string
          weather_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          current_dj?: string | null
          id?: string
          news_enabled?: boolean | null
          station_name: string
          updated_at?: string
          weather_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          current_dj?: string | null
          id?: string
          news_enabled?: boolean | null
          station_name?: string
          updated_at?: string
          weather_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_settings_current_dj_fkey"
            columns: ["current_dj"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      playlists: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_admin: boolean | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_admin?: boolean | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_admin?: boolean | null
          username?: string | null
        }
        Relationships: []
      }
      radio_shows: {
        Row: {
          created_at: string
          day: number
          description: string | null
          dj: string
          end_time: string
          genre: string | null
          id: string
          is_recurring: boolean | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day: number
          description?: string | null
          dj: string
          end_time: string
          genre?: string | null
          id?: string
          is_recurring?: boolean | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day?: number
          description?: string | null
          dj?: string
          end_time?: string
          genre?: string | null
          id?: string
          is_recurring?: boolean | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      radio_stations: {
        Row: {
          created_at: string
          description: string | null
          genre: string | null
          id: string
          is_active: boolean | null
          listeners_count: number | null
          logo_url: string | null
          name: string
          peak_listeners: number | null
          stream_url: string
          total_listening_time: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          is_active?: boolean | null
          listeners_count?: number | null
          logo_url?: string | null
          name: string
          peak_listeners?: number | null
          stream_url: string
          total_listening_time?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          is_active?: boolean | null
          listeners_count?: number | null
          logo_url?: string | null
          name?: string
          peak_listeners?: number | null
          stream_url?: string
          total_listening_time?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      songs: {
        Row: {
          album: string | null
          artist: string
          created_at: string
          genre: string | null
          id: string
          is_karaoke: boolean | null
          title: string
          url: string | null
          user_id: string | null
          year: number | null
        }
        Insert: {
          album?: string | null
          artist: string
          created_at?: string
          genre?: string | null
          id?: string
          is_karaoke?: boolean | null
          title: string
          url?: string | null
          user_id?: string | null
          year?: number | null
        }
        Update: {
          album?: string | null
          artist?: string
          created_at?: string
          genre?: string | null
          id?: string
          is_karaoke?: boolean | null
          title?: string
          url?: string | null
          user_id?: string | null
          year?: number | null
        }
        Relationships: []
      }
      station_analytics: {
        Row: {
          avg_listening_time: number | null
          id: string
          listeners_count: number | null
          station_id: string
          timestamp: string
          unique_listeners: number | null
        }
        Insert: {
          avg_listening_time?: number | null
          id?: string
          listeners_count?: number | null
          station_id: string
          timestamp?: string
          unique_listeners?: number | null
        }
        Update: {
          avg_listening_time?: number | null
          id?: string
          listeners_count?: number | null
          station_id?: string
          timestamp?: string
          unique_listeners?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "station_analytics_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "radio_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          created_at: string
          current_listeners: number | null
          description: string | null
          id: string
          is_live: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_listeners?: number | null
          description?: string | null
          id?: string
          is_live?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_listeners?: number | null
          description?: string | null
          id?: string
          is_live?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      stream_analytics: {
        Row: {
          created_at: string
          id: string
          listener_count: number | null
          peak_listeners: number | null
          session_id: string
          total_duration: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          listener_count?: number | null
          peak_listeners?: number | null
          session_id: string
          total_duration?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          listener_count?: number | null
          peak_listeners?: number | null
          session_id?: string
          total_duration?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
