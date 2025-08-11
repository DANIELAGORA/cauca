// TIPOS DE BASE DE DATOS SUPABASE
// Definiciones de tipos para todas las tablas y operaciones

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizational_structure: {
        Row: {
          id: string;
          user_id: string | null;
          profile_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          role_type: string;
          territory_level: string;
          country: string | null;
          region: string | null;
          department: string | null;
          municipality: string | null;
          reports_to: string | null;
          created_by: string | null;
          hierarchy_level: number;
          can_create_roles: string[] | null;
          managed_territories: string[] | null;
          permissions: Record<string, any> | null;
          is_active: boolean | null;
          is_elected: boolean | null;
          election_date: string | null;
          term_start: string | null;
          term_end: string | null;
          description: string | null;
          responsibilities: string[] | null;
          contact_preferences: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          profile_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          role_type: string;
          territory_level: string;
          country?: string | null;
          region?: string | null;
          department?: string | null;
          municipality?: string | null;
          reports_to?: string | null;
          created_by?: string | null;
          hierarchy_level: number;
          can_create_roles?: string[] | null;
          managed_territories?: string[] | null;
          permissions?: Record<string, any> | null;
          is_active?: boolean | null;
          is_elected?: boolean | null;
          election_date?: string | null;
          term_start?: string | null;
          term_end?: string | null;
          description?: string | null;
          responsibilities?: string[] | null;
          contact_preferences?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          profile_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          role_type?: string;
          territory_level?: string;
          country?: string | null;
          region?: string | null;
          department?: string | null;
          municipality?: string | null;
          reports_to?: string | null;
          created_by?: string | null;
          hierarchy_level?: number;
          can_create_roles?: string[] | null;
          managed_territories?: string[] | null;
          permissions?: Record<string, any> | null;
          is_active?: boolean | null;
          is_elected?: boolean | null;
          election_date?: string | null;
          term_start?: string | null;
          term_end?: string | null;
          description?: string | null;
          responsibilities?: string[] | null;
          contact_preferences?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      hierarchy_relationships: {
        Row: {
          id: string;
          superior_id: string;
          subordinate_id: string;
          relationship_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          superior_id: string;
          subordinate_id: string;
          relationship_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          superior_id?: string;
          subordinate_id?: string;
          relationship_type?: string;
          created_at?: string;
        };
      };
      performance_metrics: {
        Row: {
          id: string;
          organization_member_id: string;
          report_period_start: string;
          report_period_end: string;
          meetings_attended: number | null;
          projects_initiated: number | null;
          citizens_served: number | null;
          social_media_reach: number | null;
          role_specific_metrics: Record<string, any> | null;
          report_to_superior: string | null;
          superior_feedback: string | null;
          subordinates_managed: number | null;
          team_performance: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_member_id: string;
          report_period_start: string;
          report_period_end: string;
          meetings_attended?: number | null;
          projects_initiated?: number | null;
          citizens_served?: number | null;
          social_media_reach?: number | null;
          role_specific_metrics?: Record<string, any> | null;
          report_to_superior?: string | null;
          superior_feedback?: string | null;
          subordinates_managed?: number | null;
          team_performance?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_member_id?: string;
          report_period_start?: string;
          report_period_end?: string;
          meetings_attended?: number | null;
          projects_initiated?: number | null;
          citizens_served?: number | null;
          social_media_reach?: number | null;
          role_specific_metrics?: Record<string, any> | null;
          report_to_superior?: string | null;
          superior_feedback?: string | null;
          subordinates_managed?: number | null;
          team_performance?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      internal_communications: {
        Row: {
          id: string;
          sender_id: string;
          recipient_ids: string[];
          hierarchy_level: string | null;
          subject: string;
          message: string;
          message_type: string | null;
          priority: string | null;
          attachments: Record<string, any>[] | null;
          is_read_by: Record<string, any> | null;
          requires_response: boolean | null;
          response_deadline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_ids: string[];
          hierarchy_level?: string | null;
          subject: string;
          message: string;
          message_type?: string | null;
          priority?: string | null;
          attachments?: Record<string, any>[] | null;
          is_read_by?: Record<string, any> | null;
          requires_response?: boolean | null;
          response_deadline?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_ids?: string[];
          hierarchy_level?: string | null;
          subject?: string;
          message?: string;
          message_type?: string | null;
          priority?: string | null;
          attachments?: Record<string, any>[] | null;
          is_read_by?: Record<string, any> | null;
          requires_response?: boolean | null;
          response_deadline?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}