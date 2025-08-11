-- SISTEMA JERÁRQUICO MAIS - ESTRUCTURA ORGANIZACIONAL REAL
-- Migración para establecer la jerarquía completa del partido político

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla principal de estructura organizacional
CREATE TABLE organizational_structure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Información personal y de contacto
    full_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR,
    
    -- Estructura jerárquica
    role_type VARCHAR NOT NULL CHECK (role_type IN (
        'director-nacional',
        'coordinador-regional', 
        'director-departamental',
        'coordinador-municipal',
        'concejal-electo',
        'candidato',
        'lider-local',
        'influencer-digital',
        'ciudadano-base'
    )),
    
    -- Ubicación geográfica
    territory_level VARCHAR NOT NULL CHECK (territory_level IN ('nacional', 'regional', 'departamental', 'municipal', 'local')),
    country VARCHAR DEFAULT 'Colombia',
    region VARCHAR, -- Andina, Caribe, Pacífica, etc.
    department VARCHAR, -- Cauca, Valle, etc.
    municipality VARCHAR, -- Popayán, Cali, etc.
    
    -- Jerarquía organizacional
    reports_to UUID REFERENCES organizational_structure(id), -- A quién reporta
    created_by UUID REFERENCES organizational_structure(id), -- Quién lo creó
    hierarchy_level INTEGER NOT NULL, -- 1=Nacional, 2=Regional, 3=Depto, 4=Municipal, 5=Local
    
    -- Permisos y capacidades
    can_create_roles JSONB DEFAULT '[]', -- Roles que puede crear
    managed_territories JSONB DEFAULT '[]', -- Territorios que administra
    permissions JSONB DEFAULT '{}', -- Permisos específicos
    
    -- Estado y metadatos
    is_active BOOLEAN DEFAULT true,
    is_elected BOOLEAN DEFAULT false, -- Si es cargo electo (concejal, alcalde, etc.)
    election_date DATE, -- Fecha de elección si aplica
    term_start DATE, -- Inicio del periodo
    term_end DATE, -- Fin del periodo
    
    -- Información adicional
    description TEXT,
    responsibilities JSONB DEFAULT '[]',
    contact_preferences JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relaciones jerárquicas (para queries complejas)
CREATE TABLE hierarchy_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    superior_id UUID REFERENCES organizational_structure(id) ON DELETE CASCADE,
    subordinate_id UUID REFERENCES organizational_structure(id) ON DELETE CASCADE,
    relationship_type VARCHAR NOT NULL, -- 'direct', 'indirect', 'territorial'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(superior_id, subordinate_id)
);

-- Tabla de territorios con datos reales
CREATE TABLE territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('country', 'region', 'department', 'municipality', 'locality')),
    parent_territory_id UUID REFERENCES territories(id),
    
    -- Información geográfica
    coordinates JSONB, -- lat, lng
    population INTEGER,
    electoral_data JSONB, -- votación histórica, censo electoral, etc.
    
    -- Administración MAIS
    has_mais_presence BOOLEAN DEFAULT false,
    mais_coordinator_id UUID REFERENCES organizational_structure(id),
    elected_officials_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de métricas y reportes por nivel
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_member_id UUID REFERENCES organizational_structure(id) ON DELETE CASCADE,
    
    -- Periodo del reporte
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    
    -- Métricas generales
    meetings_attended INTEGER DEFAULT 0,
    projects_initiated INTEGER DEFAULT 0,
    citizens_served INTEGER DEFAULT 0,
    social_media_reach INTEGER DEFAULT 0,
    
    -- Métricas específicas por rol
    role_specific_metrics JSONB DEFAULT '{}',
    
    -- Reportes hacia arriba
    report_to_superior TEXT,
    superior_feedback TEXT,
    
    -- Gestión hacia abajo
    subordinates_managed INTEGER DEFAULT 0,
    team_performance JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comunicaciones internas
CREATE TABLE internal_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES organizational_structure(id) ON DELETE CASCADE,
    
    -- Destinatarios
    recipient_ids UUID[] NOT NULL, -- Array de IDs de destinatarios
    hierarchy_level VARCHAR, -- 'up', 'down', 'lateral' - dirección del mensaje
    
    -- Contenido
    subject VARCHAR NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR CHECK (message_type IN ('report', 'directive', 'consultation', 'information')),
    priority VARCHAR DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Archivos adjuntos
    attachments JSONB DEFAULT '[]',
    
    -- Estado
    is_read_by JSONB DEFAULT '{}', -- tracking de lectura por usuario
    requires_response BOOLEAN DEFAULT false,
    response_deadline TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_org_structure_role_type ON organizational_structure(role_type);
CREATE INDEX idx_org_structure_hierarchy_level ON organizational_structure(hierarchy_level);
CREATE INDEX idx_org_structure_department ON organizational_structure(department);
CREATE INDEX idx_org_structure_reports_to ON organizational_structure(reports_to);
CREATE INDEX idx_hierarchy_relationships_superior ON hierarchy_relationships(superior_id);
CREATE INDEX idx_hierarchy_relationships_subordinate ON hierarchy_relationships(subordinate_id);
CREATE INDEX idx_territories_type ON territories(type);
CREATE INDEX idx_territories_parent ON territories(parent_territory_id);
CREATE INDEX idx_performance_metrics_member ON performance_metrics(organization_member_id);
CREATE INDEX idx_internal_comms_sender ON internal_communications(sender_id);

-- Triggers para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_org_structure_updated_at BEFORE UPDATE ON organizational_structure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_territories_updated_at BEFORE UPDATE ON territories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON performance_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) para control de acceso jerárquico
ALTER TABLE organizational_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE hierarchy_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_communications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para organizational_structure
CREATE POLICY "Users can view their own org data" ON organizational_structure
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view subordinates data" ON organizational_structure
    FOR SELECT USING (
        id IN (
            SELECT subordinate_id FROM hierarchy_relationships 
            WHERE superior_id = (
                SELECT id FROM organizational_structure WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can view superiors data" ON organizational_structure
    FOR SELECT USING (
        id IN (
            SELECT superior_id FROM hierarchy_relationships 
            WHERE subordinate_id = (
                SELECT id FROM organizational_structure WHERE user_id = auth.uid()
            )
        )
    );

-- Función para crear estructura jerárquica automáticamente
CREATE OR REPLACE FUNCTION create_hierarchy_relationship()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear relación directa si tiene un superior
    IF NEW.reports_to IS NOT NULL THEN
        INSERT INTO hierarchy_relationships (superior_id, subordinate_id, relationship_type)
        VALUES (NEW.reports_to, NEW.id, 'direct')
        ON CONFLICT (superior_id, subordinate_id) DO NOTHING;
        
        -- Crear relaciones indirectas (todos los superiores en la cadena)
        WITH RECURSIVE hierarchy_chain AS (
            SELECT reports_to as superior_id, 1 as level
            FROM organizational_structure 
            WHERE id = NEW.reports_to
            
            UNION ALL
            
            SELECT os.reports_to, hc.level + 1
            FROM organizational_structure os
            JOIN hierarchy_chain hc ON os.id = hc.superior_id
            WHERE os.reports_to IS NOT NULL AND hc.level < 10
        )
        INSERT INTO hierarchy_relationships (superior_id, subordinate_id, relationship_type)
        SELECT superior_id, NEW.id, 'indirect'
        FROM hierarchy_chain
        WHERE superior_id IS NOT NULL
        ON CONFLICT (superior_id, subordinate_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_hierarchy_on_insert
    AFTER INSERT ON organizational_structure
    FOR EACH ROW
    EXECUTE FUNCTION create_hierarchy_relationship();

-- Insertar datos iniciales de territorios
INSERT INTO territories (name, type, parent_territory_id, has_mais_presence, elected_officials_count) VALUES
    ('Colombia', 'country', NULL, true, 5),
    ('Región Andina', 'region', (SELECT id FROM territories WHERE name = 'Colombia'), true, 5),
    ('Cauca', 'department', (SELECT id FROM territories WHERE name = 'Región Andina'), true, 5),
    ('Almaguer', 'municipality', (SELECT id FROM territories WHERE name = 'Cauca'), true, 1),
    ('Caldono', 'municipality', (SELECT id FROM territories WHERE name = 'Cauca'), true, 1),
    ('Caloto', 'municipality', (SELECT id FROM territories WHERE name = 'Cauca'), true, 1),
    ('Morales', 'municipality', (SELECT id FROM territories WHERE name = 'Cauca'), true, 1),
    ('Paez (Belalcazar)', 'municipality', (SELECT id FROM territories WHERE name = 'Cauca'), true, 1);

COMMENT ON TABLE organizational_structure IS 'Estructura organizacional jerárquica completa de MAIS';
COMMENT ON TABLE hierarchy_relationships IS 'Relaciones jerárquicas para consultas eficientes';
COMMENT ON TABLE territories IS 'Divisiones territoriales con presencia MAIS';
COMMENT ON TABLE performance_metrics IS 'Métricas de rendimiento por rol y nivel';
COMMENT ON TABLE internal_communications IS 'Sistema de comunicaciones internas jerárquicas';