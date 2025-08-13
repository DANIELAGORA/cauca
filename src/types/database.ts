// TIPOS DE BASE DE DATOS SUPABASE - ESQUEMA REAL
// Definiciones basadas en la estructura actual en producción
// ✅ SINCRONIZADO CON SUPABASE PRODUCTION

export interface Database {
  public: {
    Tables: {
      // TABLA PRINCIPAL DE PERFILES DE USUARIO (ESQUEMA REAL)
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: Record<string, any> | null;
          phone: string | null;
          document_type: string;
          document_number: string;
          birth_date: Record<string, any> | null;
          gender: string;
          address: Record<string, any> | null;
          role: string;
          status: string;
          territory_id: Record<string, any> | null;
          bio: Record<string, any> | null;
          social_links: Record<string, any> | null;
          preferences: Record<string, any> | null;
          metadata: Record<string, any> | null;
          last_login: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: Record<string, any> | null;
          phone?: string | null;
          document_type: string;
          document_number: string;
          birth_date?: Record<string, any> | null;
          gender: string;
          address?: Record<string, any> | null;
          role: string;
          status?: string;
          territory_id?: Record<string, any> | null;
          bio?: Record<string, any> | null;
          social_links?: Record<string, any> | null;
          preferences?: Record<string, any> | null;
          metadata?: Record<string, any> | null;
          last_login?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: Record<string, any> | null;
          phone?: string | null;
          document_type?: string;
          document_number?: string;
          birth_date?: Record<string, any> | null;
          gender?: string;
          address?: Record<string, any> | null;
          role?: string;
          status?: string;
          territory_id?: Record<string, any> | null;
          bio?: Record<string, any> | null;
          social_links?: Record<string, any> | null;
          preferences?: Record<string, any> | null;
          metadata?: Record<string, any> | null;
          last_login?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // TABLA DE PERFILES (VACÍA - LEGACY)
      profiles: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // TABLA DE MENSAJES (EXISTENTE - VACÍA)
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_ids: string[] | null;
          subject: string;
          content: string;
          message_type: string | null;
          priority: 'baja' | 'media' | 'alta';
          attachments: Record<string, any>[] | null;
          is_read_by: Record<string, any> | null;
          requires_response: boolean | null;
          response_deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_ids?: string[] | null;
          subject: string;
          content: string;
          message_type?: string | null;
          priority?: 'baja' | 'media' | 'alta';
          attachments?: Record<string, any>[] | null;
          is_read_by?: Record<string, any> | null;
          requires_response?: boolean | null;
          response_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_ids?: string[] | null;
          subject?: string;
          content?: string;
          message_type?: string | null;
          priority?: 'baja' | 'media' | 'alta';
          attachments?: Record<string, any>[] | null;
          is_read_by?: Record<string, any> | null;
          requires_response?: boolean | null;
          response_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // TABLA DE ARCHIVOS Y DOCUMENTOS (EXISTENTE - VACÍA)
      databases: {
        Row: {
          id: string;
          uploader_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          category: string | null;
          description: string | null;
          access_level: 'publico' | 'privado' | 'restringido';
          metadata: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          uploader_id: string;
          file_name: string;
          file_path: string;
          file_type: string;
          file_size: number;
          category?: string | null;
          description?: string | null;
          access_level?: 'publico' | 'privado' | 'restringido';
          metadata?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          uploader_id?: string;
          file_name?: string;
          file_path?: string;
          file_type?: string;
          file_size?: number;
          category?: string | null;
          description?: string | null;
          access_level?: 'publico' | 'privado' | 'restringido';
          metadata?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
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
      user_role: 'Comité Ejecutivo Nacional' | 'Líder Regional' | 'Comité Departamental' | 
                'Candidato' | 'Influenciador Digital' | 'Líder Comunitario' | 'Votante/Simpatizante';
      message_priority: 'baja' | 'media' | 'alta';
      file_access_level: 'publico' | 'privado' | 'restringido';
      user_status: 'activo' | 'inactivo' | 'suspendido' | 'pendiente';
    };
  };
}

// TIPOS ADICIONALES PARA LA APLICACIÓN
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type FileRecord = Database['public']['Tables']['databases']['Row'];
export type FileRecordInsert = Database['public']['Tables']['databases']['Insert'];
export type FileRecordUpdate = Database['public']['Tables']['databases']['Update'];

// TIPOS PARA ROLES JERÁRQUICOS
export type UserRole = Database['public']['Enums']['user_role'];
export type MessagePriority = Database['public']['Enums']['message_priority'];
export type FileAccessLevel = Database['public']['Enums']['file_access_level'];
export type UserStatus = Database['public']['Enums']['user_status'];

// INTERFAZ PARA DATOS DE USUARIO CON JERARQUÍA
export interface UserWithHierarchy extends UserProfile {
  hierarchy_level: number;
  can_create_roles: UserRole[];
  managed_territories: string[];
  subordinates_count?: number;
  superior_id?: string;
}

// INTERFAZ PARA MÉTRICAS DE CAMPAÑA
export interface CampaignMetrics {
  user_id: string;
  period_start: string;
  period_end: string;
  messages_sent: number;
  meetings_attended: number;
  citizens_contacted: number;
  social_media_engagement: number;
  projects_initiated: number;
  territory_coverage: Record<string, number>;
  performance_score: number;
}

// INTERFAZ PARA CONFIGURACIÓN DE SEGURIDAD
export interface SecurityConfig {
  max_login_attempts: number;
  session_timeout: number;
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
  };
  rate_limits: {
    messages_per_hour: number;
    file_uploads_per_day: number;
    api_calls_per_minute: number;
  };
}

console.log('📊 Tipos de base de datos actualizados con esquema real de producción');
console.log('✅ Sincronizado con: user_profiles, messages, databases, profiles (legacy)');
console.log('🔄 Tipos adicionales: UserWithHierarchy, CampaignMetrics, SecurityConfig');