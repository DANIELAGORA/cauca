-- =============================================================================
-- MAIS POLITICAL COMMAND CENTER - SUPABASE COMPLETE SCHEMA
-- Production-ready database schema for electoral campaign management
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- ENUM TYPES DEFINITION
-- =============================================================================

-- User roles enum with all 7 political roles
DO $$ BEGIN
  CREATE TYPE public.user_role_type AS ENUM (
    'comite-ejecutivo-nacional',
    'lider-regional', 
    'comite-departamental',
    'candidato',
    'influenciador-digital',
    'lider-comunitario',
    'votante'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Political hierarchy levels
DO $$ BEGIN
  CREATE TYPE public.territory_level_type AS ENUM (
    'nacional',
    'regional',
    'departamental', 
    'municipal',
    'local'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Message types for communications
DO $$ BEGIN
  CREATE TYPE public.message_type AS ENUM (
    'announcement',
    'directive',
    'report',
    'request',
    'alert',
    'campaign'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Priority levels
DO $$ BEGIN
  CREATE TYPE public.priority_level AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- User status
DO $$ BEGIN
  CREATE TYPE public.user_status_type AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- USER PROFILES TABLE (Main user information)
-- =============================================================================

-- First, drop the table if it exists to recreate with proper structure
DROP TABLE IF EXISTS public.user_profiles CASCADE;

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  document_type TEXT,
  document_number TEXT,
  birth_date DATE,
  gender TEXT,
  address JSONB,
  role user_role_type NOT NULL DEFAULT 'votante',
  status user_status_type NOT NULL DEFAULT 'active',
  territory_id UUID,
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ORGANIZATIONAL STRUCTURE TABLE (Complete hierarchy)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.organizational_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role_type user_role_type NOT NULL,
  territory_level territory_level_type NOT NULL,
  country TEXT DEFAULT 'Colombia',
  region TEXT,
  department TEXT DEFAULT 'Cauca',
  municipality TEXT,
  reports_to UUID REFERENCES public.organizational_structure(id),
  created_by UUID REFERENCES auth.users(id),
  hierarchy_level INTEGER NOT NULL DEFAULT 1,
  can_create_roles TEXT[] DEFAULT '{}',
  managed_territories TEXT[] DEFAULT '{}',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_elected BOOLEAN DEFAULT false,
  election_date DATE,
  term_start DATE,
  term_end DATE,
  description TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  contact_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- HIERARCHY RELATIONSHIPS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.hierarchy_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  superior_id UUID NOT NULL REFERENCES public.organizational_structure(id) ON DELETE CASCADE,
  subordinate_id UUID NOT NULL REFERENCES public.organizational_structure(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'direct_report',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(superior_id, subordinate_id)
);

-- =============================================================================
-- PERFORMANCE METRICS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_member_id UUID NOT NULL REFERENCES public.organizational_structure(id) ON DELETE CASCADE,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  meetings_attended INTEGER DEFAULT 0,
  projects_initiated INTEGER DEFAULT 0,
  citizens_served INTEGER DEFAULT 0,
  social_media_reach INTEGER DEFAULT 0,
  role_specific_metrics JSONB DEFAULT '{}',
  report_to_superior TEXT,
  superior_feedback TEXT,
  subordinates_managed INTEGER DEFAULT 0,
  team_performance JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INTERNAL COMMUNICATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.internal_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_ids UUID[] NOT NULL,
  hierarchy_level TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type message_type DEFAULT 'announcement',
  priority priority_level DEFAULT 'medium',
  attachments JSONB DEFAULT '[]',
  is_read_by JSONB DEFAULT '{}',
  requires_response BOOLEAN DEFAULT false,
  response_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- MESSAGES TABLE (Real-time messaging)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_target user_role_type,
  subject TEXT,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'announcement',
  priority priority_level DEFAULT 'medium',
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES public.messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- DATABASES TABLE (File and document management)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.databases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  file_url TEXT,
  storage_path TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- CAMPAIGN FINANCES TABLE (Financial transparency)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.campaign_finances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES public.organizational_structure(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'income', 'expense', 'donation'
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'COP',
  description TEXT NOT NULL,
  category TEXT,
  source TEXT,
  date_transaction DATE NOT NULL,
  receipt_url TEXT,
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROFILES TABLE (Legacy Supabase Auth integration)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role_type DEFAULT 'votante',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizational_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hierarchy_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
DROP POLICY IF EXISTS "user_profiles_select_policy" ON public.user_profiles;
CREATE POLICY "user_profiles_select_policy" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "user_profiles_insert_policy" ON public.user_profiles;
CREATE POLICY "user_profiles_insert_policy" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "user_profiles_update_policy" ON public.user_profiles;
CREATE POLICY "user_profiles_update_policy" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Messages Policies
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
CREATE POLICY "messages_select_policy" ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid() OR
    role_target IN (
      SELECT role FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
CREATE POLICY "messages_insert_policy" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Databases Policies
DROP POLICY IF EXISTS "databases_select_policy" ON public.databases;
CREATE POLICY "databases_select_policy" ON public.databases
  FOR SELECT TO authenticated
  USING (is_public = true OR user_id = auth.uid());

DROP POLICY IF EXISTS "databases_insert_policy" ON public.databases;
CREATE POLICY "databases_insert_policy" ON public.databases
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Organizational Structure Policies
DROP POLICY IF EXISTS "org_structure_select_policy" ON public.organizational_structure;
CREATE POLICY "org_structure_select_policy" ON public.organizational_structure
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "org_structure_insert_policy" ON public.organizational_structure;
CREATE POLICY "org_structure_insert_policy" ON public.organizational_structure
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('comite-ejecutivo-nacional', 'lider-regional', 'comite-departamental')
    )
  );

-- Profiles (Legacy) Policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_organizational_structure_updated_at ON public.organizational_structure;
CREATE TRIGGER update_organizational_structure_updated_at
    BEFORE UPDATE ON public.organizational_structure
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_role_target ON public.messages(role_target);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Organizational structure indexes
CREATE INDEX IF NOT EXISTS idx_org_structure_role_type ON public.organizational_structure(role_type);
CREATE INDEX IF NOT EXISTS idx_org_structure_territory ON public.organizational_structure(territory_level);
CREATE INDEX IF NOT EXISTS idx_org_structure_reports_to ON public.organizational_structure(reports_to);

-- =============================================================================
-- STORAGE BUCKET SETUP
-- =============================================================================

-- Create files bucket for document storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'files',
  'files',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "files_bucket_select_policy" ON storage.objects;
CREATE POLICY "files_bucket_select_policy" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'files');

DROP POLICY IF EXISTS "files_bucket_insert_policy" ON storage.objects;
CREATE POLICY "files_bucket_insert_policy" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================================================
-- INITIAL DATA SETUP
-- =============================================================================

-- Insert master admin user
INSERT INTO public.user_profiles (
  id,
  user_id,
  email,
  full_name,
  role,
  status,
  department,
  created_at
) VALUES (
  'f2cbe065-4761-438a-8864-350d99d65fa6',
  'f2cbe065-4761-438a-8864-350d99d65fa6',
  'joseluisdiago@maiscauca.com',
  'José Luis Diago Franco',
  'comite-departamental',
  'active',
  'Cauca',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Insert test users with correct roles
INSERT INTO public.user_profiles (
  id,
  user_id,
  email,
  full_name,
  role,
  status,
  created_at
) VALUES 
(
  '2b4a37c1-0247-43a9-b309-7bc86f1e17cf',
  '2b4a37c1-0247-43a9-b309-7bc86f1e17cf',
  'testconcejal@maiscauca.com',
  'Ana María López',
  'lider-comunitario',
  'active',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Update existing profiles table for backward compatibility
INSERT INTO public.profiles (id, full_name, role, created_at)
SELECT user_id, full_name, role, created_at 
FROM public.user_profiles
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- =============================================================================
-- FUNCTIONS FOR DATA MANAGEMENT
-- =============================================================================

-- Function to get user role hierarchy
CREATE OR REPLACE FUNCTION public.get_user_role_level(user_role user_role_type)
RETURNS INTEGER AS $$
BEGIN
  CASE user_role
    WHEN 'comite-ejecutivo-nacional' THEN RETURN 1;
    WHEN 'lider-regional' THEN RETURN 2;
    WHEN 'comite-departamental' THEN RETURN 3;
    WHEN 'candidato' THEN RETURN 4;
    WHEN 'influenciador-digital' THEN RETURN 5;
    WHEN 'lider-comunitario' THEN RETURN 6;
    WHEN 'votante' THEN RETURN 7;
    ELSE RETURN 10;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can manage another user
CREATE OR REPLACE FUNCTION public.can_manage_user(manager_id UUID, target_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  manager_role user_role_type;
  target_role user_role_type;
  manager_level INTEGER;
  target_level INTEGER;
BEGIN
  SELECT role INTO manager_role FROM public.user_profiles WHERE user_id = manager_id;
  SELECT role INTO target_role FROM public.user_profiles WHERE user_id = target_id;
  
  SELECT public.get_user_role_level(manager_role) INTO manager_level;
  SELECT public.get_user_role_level(target_role) INTO target_level;
  
  RETURN manager_level < target_level;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '🎉 MAIS POLITICAL COMMAND CENTER DATABASE SETUP COMPLETED!';
  RAISE NOTICE '✅ All tables created with proper ENUM types';
  RAISE NOTICE '✅ Row Level Security configured';
  RAISE NOTICE '✅ Storage bucket configured';
  RAISE NOTICE '✅ Initial users configured';
  RAISE NOTICE '🚀 System ready for production deployment!';
END $$;