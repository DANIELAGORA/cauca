-- MAIS LOCAL DATABASE SCHEMA
-- Esquema PostgreSQL completo para reemplazar Supabase
-- Fecha: 2025-11-23

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear schema principal
CREATE SCHEMA IF NOT EXISTS public;

-- TABLA DE USUARIOS (reemplaza auth.users de Supabase)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_sign_in_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- TABLA DE SESIONES
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- ENUM para roles políticos (unificado)
CREATE TYPE political_role AS ENUM (
    'comite_ejecutivo_nacional',    -- Nivel 1 - Director Nacional
    'lider_regional',               -- Nivel 2 - Coordinadores Zonales  
    'comite_departamental',         -- Nivel 3 - Comité Local
    'candidato_principal',          -- Nivel 4a - Candidatos
    'concejal_electo',             -- Nivel 4b - Concejales
    'influenciador_digital',        -- Nivel 5 - Influencers
    'lider_comunitario',           -- Nivel 6 - Líderes
    'votante_simpatizante'         -- Nivel 7 - Base
);

-- TABLA DE PERFILES DE USUARIO
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(20) NOT NULL DEFAULT 'CC',
    document_number VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    department VARCHAR(100) DEFAULT 'Cauca',
    role political_role NOT NULL DEFAULT 'votante_simpatizante',
    profile_image_url TEXT,
    bio TEXT,
    social_media JSONB DEFAULT '{}'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_document UNIQUE (document_type, document_number),
    CONSTRAINT email_format_check CHECK (LENGTH(full_name) >= 2),
    CONSTRAINT phone_format_check CHECK (phone ~ '^[+]?[0-9\s\-\(\)]{7,20}$' OR phone IS NULL)
);

-- TABLA DE ESTRUCTURA ORGANIZACIONAL
CREATE TABLE IF NOT EXISTS organizational_structure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    superior_id UUID REFERENCES organizational_structure(id),
    territory_code VARCHAR(20),
    territory_name VARCHAR(255),
    municipality VARCHAR(100),
    zone VARCHAR(50), -- ZONA NORTE, SUR, CENTRO, PACÍFICO, MACIZO
    level INTEGER NOT NULL DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints para jerarquía
    CONSTRAINT valid_level CHECK (level BETWEEN 1 AND 7),
    CONSTRAINT unique_user_territory UNIQUE (user_id, territory_code)
);

-- TABLA DE RELACIONES JERÁRQUICAS  
CREATE TABLE IF NOT EXISTS hierarchy_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    superior_id UUID NOT NULL REFERENCES organizational_structure(id),
    subordinate_id UUID NOT NULL REFERENCES organizational_structure(id),
    relationship_type VARCHAR(50) DEFAULT 'direct_report',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent self-references
    CONSTRAINT no_self_reference CHECK (superior_id != subordinate_id),
    CONSTRAINT unique_hierarchy_relation UNIQUE (superior_id, subordinate_id)
);

-- TABLA DE MENSAJES
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID REFERENCES users(id), -- NULL para mensajes broadcast
    message_type VARCHAR(50) DEFAULT 'individual', -- 'individual', 'broadcast', 'group'
    title VARCHAR(255),
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    CONSTRAINT valid_message_type CHECK (message_type IN ('individual', 'broadcast', 'group'))
);

-- TABLA DE CAMPAÑAS
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) DEFAULT 'electoral', -- 'electoral', 'awareness', 'mobilization'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2) DEFAULT 0,
    target_audience JSONB DEFAULT '{}'::jsonb,
    goals JSONB DEFAULT '[]'::jsonb,
    created_by UUID NOT NULL REFERENCES users(id),
    territory_scope VARCHAR(100), -- municipio, zona, departamento
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_campaign_status CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- TABLA DE FINANZAS DE CAMPAÑA
CREATE TABLE IF NOT EXISTS campaign_finances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- 'income', 'expense'
    category VARCHAR(100) NOT NULL, -- 'donation', 'advertising', 'events', etc.
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    receipt_number VARCHAR(100),
    payment_method VARCHAR(50), -- 'cash', 'transfer', 'check', etc.
    recorded_by UUID NOT NULL REFERENCES users(id),
    verified_by UUID REFERENCES users(id),
    verification_date TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('income', 'expense')),
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- TABLA DE DOCUMENTOS/ARCHIVOS
CREATE TABLE IF NOT EXISTS databases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_type VARCHAR(50),
    file_size BIGINT,
    file_path VARCHAR(500), -- ruta local del archivo
    file_url TEXT, -- URL si está en cloud storage
    uploaded_by UUID NOT NULL REFERENCES users(id),
    access_level VARCHAR(20) DEFAULT 'private', -- 'public', 'private', 'restricted'
    tags VARCHAR(255)[],
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_access_level CHECK (access_level IN ('public', 'private', 'restricted')),
    CONSTRAINT file_info_check CHECK (file_path IS NOT NULL OR file_url IS NOT NULL)
);

-- TABLA DE MÉTRICAS DE RENDIMIENTO
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_member_id UUID NOT NULL REFERENCES organizational_structure(id),
    metric_type VARCHAR(50) NOT NULL, -- 'votes_secured', 'events_organized', 'contacts_made'
    metric_value DECIMAL(15,2) NOT NULL,
    measurement_period VARCHAR(20), -- 'daily', 'weekly', 'monthly'
    measurement_date DATE DEFAULT CURRENT_DATE,
    target_value DECIMAL(15,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_metric_period CHECK (measurement_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly'))
);

-- TABLA DE AUDIT TRAIL
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_document ON user_profiles(document_type, document_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_structure_user_id ON organizational_structure(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_structure_superior ON organizational_structure(superior_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_org_structure_zone ON organizational_structure(zone);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hierarchy_superior ON hierarchy_relationships(superior_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hierarchy_subordinate ON hierarchy_relationships(subordinate_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_finances_campaign_id ON campaign_finances(campaign_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_databases_uploaded_by ON databases(uploaded_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_org_member ON performance_metrics(organization_member_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- FUNCIONES AUXILIARES

-- Función para generar hash de password
CREATE OR REPLACE FUNCTION generate_password_hash(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql;

-- Función para verificar password
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql;

-- Función para generar token de sesión
CREATE OR REPLACE FUNCTION generate_session_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar sesiones expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS PARA AUDIT TRAIL

-- Función genérica para audit trail
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        operation,
        record_id,
        old_values,
        new_values,
        changed_by,
        timestamp
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE 
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
            WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)
            ELSE NULL
        END,
        CASE 
            WHEN TG_OP = 'DELETE' THEN NULL
            ELSE row_to_json(NEW)
        END,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.user_id
            ELSE NEW.user_id
        END
    );
    
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_profiles
CREATE TRIGGER audit_user_profiles
    AFTER INSERT OR UPDATE OR DELETE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Trigger para organizational_structure  
CREATE TRIGGER audit_organizational_structure
    AFTER INSERT OR UPDATE OR DELETE ON organizational_structure
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizational_structure_updated_at
    BEFORE UPDATE ON organizational_structure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_databases_updated_at
    BEFORE UPDATE ON databases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DATOS INICIALES

-- Usuario administrador por defecto
INSERT INTO users (id, email, password_hash, email_confirmed, metadata) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'admin@maiscauca.com',
    generate_password_hash('agoramais2025'),
    true,
    '{"role": "admin", "created_by": "system"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Perfil del director departamental
INSERT INTO user_profiles (
    user_id, 
    full_name, 
    document_type, 
    document_number, 
    phone, 
    city, 
    role
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'José Luis Diago Franco',
    'CC',
    '12345678',
    '+57 300 123 4567',
    'Popayán',
    'comite_ejecutivo_nacional'
) ON CONFLICT (user_id) DO NOTHING;

-- Estructura organizacional inicial
INSERT INTO organizational_structure (
    user_id,
    territory_code,
    territory_name,
    municipality,
    zone,
    level
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'CAU-00',
    'DEPARTAMENTO DEL CAUCA',
    'Popayán',
    'CENTRO',
    1
) ON CONFLICT (user_id, territory_code) DO NOTHING;

-- Configuración de limpieza automática
-- Crear job para limpiar sesiones expiradas cada hora
-- (Esto requeriría pg_cron en PostgreSQL, por simplicidad usaremos función manual)

COMMENT ON DATABASE mais_local IS 'Base de datos local del Sistema MAIS - Centro de Mando Político';
COMMENT ON TABLE users IS 'Tabla principal de usuarios (reemplaza auth.users de Supabase)';
COMMENT ON TABLE user_sessions IS 'Gestión de sesiones de usuario con tokens JWT locales';
COMMENT ON TABLE user_profiles IS 'Perfiles extendidos de usuarios con datos políticos';
COMMENT ON TABLE organizational_structure IS 'Estructura jerárquica de 5 zonas territoriales del Cauca';
COMMENT ON TABLE hierarchy_relationships IS 'Relaciones superior-subordinado en la organización';
COMMENT ON TABLE messages IS 'Sistema de mensajería interna con soporte para broadcast';
COMMENT ON TABLE campaigns IS 'Gestión de campañas políticas y electorales';
COMMENT ON TABLE campaign_finances IS 'Transparencia financiera de campañas (Cuentas Claras)';
COMMENT ON TABLE databases IS 'Gestión de documentos y archivos del sistema';
COMMENT ON TABLE performance_metrics IS 'Métricas de rendimiento por territorio y usuario';
COMMENT ON TABLE audit_logs IS 'Registro de auditoria para todas las operaciones críticas';

-- PERMISOS Y SEGURIDAD

-- Crear rol para la aplicación
CREATE ROLE mais_app_role;
GRANT CONNECT ON DATABASE mais_local TO mais_app_role;
GRANT USAGE ON SCHEMA public TO mais_app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mais_app_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mais_app_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO mais_app_role;

-- Usuario de aplicación
CREATE USER mais_app_user WITH PASSWORD 'mais_secure_2025_password';
GRANT mais_app_role TO mais_app_user;

COMMENT ON ROLE mais_app_role IS 'Rol con permisos para la aplicación MAIS';
COMMENT ON ROLE mais_app_user IS 'Usuario específico para conectar la aplicación MAIS';

-- Log de inicialización
DO $$
BEGIN
    RAISE NOTICE 'MAIS Local Database initialized successfully at %', NOW();
    RAISE NOTICE 'Total tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE 'Total indexes created: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
    RAISE NOTICE 'Total functions created: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
END $$;