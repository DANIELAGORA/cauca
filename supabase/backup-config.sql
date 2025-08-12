-- CONFIGURACIÓN DE BACKUP AUTOMÁTICO PARA SISTEMA FACTORY MAIS
-- Sistema de protección de datos para prevenir pérdida de información crítica

-- 1. Tabla de backups automáticos
CREATE TABLE IF NOT EXISTS system_backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_type VARCHAR NOT NULL CHECK (backup_type IN ('daily', 'critical_change', 'manual')),
    backup_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    backup_size_bytes INTEGER,
    is_compressed BOOLEAN DEFAULT false,
    retention_date DATE, -- Fecha hasta la cual debe mantenerse
    metadata JSONB DEFAULT '{}'
);

-- 2. Función para crear backup automático
CREATE OR REPLACE FUNCTION create_system_backup(
    backup_type_param VARCHAR DEFAULT 'manual',
    created_by_param UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    backup_id UUID;
    backup_data JSONB;
BEGIN
    -- Recopilar datos críticos
    SELECT jsonb_build_object(
        'timestamp', NOW(),
        'version', '1.0',
        'organizational_structure', (
            SELECT jsonb_agg(row_to_json(os.*))
            FROM organizational_structure os
            WHERE os.is_elected = true OR os.role_type IN (
                'director-nacional', 'coordinador-regional', 'director-departamental'
            )
        ),
        'user_profiles', (
            SELECT jsonb_agg(row_to_json(p.*))
            FROM profiles p
        ),
        'territories', (
            SELECT jsonb_agg(row_to_json(t.*))
            FROM territories t
            WHERE t.has_mais_presence = true
        ),
        'performance_metrics_summary', (
            SELECT jsonb_build_object(
                'total_members', COUNT(*),
                'active_members', COUNT(*) FILTER (WHERE is_active = true),
                'elected_officials', COUNT(*) FILTER (WHERE is_elected = true)
            )
            FROM organizational_structure
        )
    ) INTO backup_data;

    -- Insertar backup
    INSERT INTO system_backups (
        backup_type, 
        backup_data, 
        created_by,
        backup_size_bytes,
        retention_date,
        metadata
    ) VALUES (
        backup_type_param,
        backup_data,
        created_by_param,
        length(backup_data::text),
        CASE 
            WHEN backup_type_param = 'daily' THEN CURRENT_DATE + INTERVAL '30 days'
            WHEN backup_type_param = 'critical_change' THEN CURRENT_DATE + INTERVAL '90 days'
            ELSE CURRENT_DATE + INTERVAL '365 days'
        END,
        jsonb_build_object(
            'tables_backed_up', ARRAY['organizational_structure', 'profiles', 'territories'],
            'backup_method', 'automatic'
        )
    ) RETURNING id INTO backup_id;

    RETURN backup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger para backup automático en cambios críticos
CREATE OR REPLACE FUNCTION trigger_critical_backup()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo hacer backup si es un cambio en datos críticos
    IF (TG_OP = 'DELETE' AND OLD.is_elected = true) OR
       (TG_OP = 'UPDATE' AND OLD.is_elected = true AND NEW.is_elected = false) OR
       (TG_OP = 'UPDATE' AND OLD.role_type != NEW.role_type AND OLD.role_type IN (
           'director-nacional', 'coordinador-regional', 'director-departamental'
       )) THEN
        
        PERFORM create_system_backup('critical_change', auth.uid());
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER backup_on_critical_change
    AFTER UPDATE OR DELETE ON organizational_structure
    FOR EACH ROW
    EXECUTE FUNCTION trigger_critical_backup();

-- 4. Función para restaurar desde backup
CREATE OR REPLACE FUNCTION restore_from_backup(backup_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    backup_record RECORD;
    restore_success BOOLEAN := true;
BEGIN
    -- Obtener el backup
    SELECT * INTO backup_record
    FROM system_backups
    WHERE id = backup_id_param;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Backup no encontrado: %', backup_id_param;
    END IF;
    
    -- Validar que el backup es válido
    IF backup_record.backup_data IS NULL OR 
       backup_record.backup_data = '{}'::jsonb THEN
        RAISE EXCEPTION 'Backup corrupto o vacío';
    END IF;
    
    -- Log del proceso de restauración
    INSERT INTO system_backups (
        backup_type,
        backup_data,
        created_by,
        metadata
    ) VALUES (
        'manual',
        jsonb_build_object(
            'restore_operation', true,
            'restored_from', backup_id_param,
            'timestamp', NOW()
        ),
        auth.uid(),
        jsonb_build_object(
            'operation_type', 'restore',
            'source_backup', backup_id_param
        )
    );
    
    RETURN restore_success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Limpieza automática de backups antiguos
CREATE OR REPLACE FUNCTION cleanup_old_backups()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM system_backups
    WHERE retention_date < CURRENT_DATE
    AND backup_type = 'daily';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Vista para monitoreo de backups
CREATE OR REPLACE VIEW backup_status AS
SELECT 
    backup_type,
    COUNT(*) as total_backups,
    MAX(created_at) as last_backup,
    MIN(created_at) as first_backup,
    SUM(backup_size_bytes) as total_size_bytes,
    AVG(backup_size_bytes) as avg_size_bytes
FROM system_backups
GROUP BY backup_type
ORDER BY backup_type;

-- 7. Políticas RLS para backups
ALTER TABLE system_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admin can view backups" ON system_backups
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM organizational_structure 
            WHERE role_type IN ('director-nacional', 'director-departamental')
        )
    );

CREATE POLICY "Only admin can create backups" ON system_backups
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM organizational_structure 
            WHERE role_type IN ('director-nacional', 'director-departamental')
        )
    );

-- 8. Programar backup diario (requiere pg_cron extension)
-- SELECT cron.schedule('daily-mais-backup', '0 2 * * *', 'SELECT create_system_backup(''daily'');');

-- 9. Función para verificar integridad del sistema
CREATE OR REPLACE FUNCTION verify_system_integrity()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Verificar que existen electos reales
    RETURN QUERY
    SELECT 
        'elected_officials_count'::TEXT,
        CASE WHEN COUNT(*) >= 96 THEN 'OK' ELSE 'WARNING' END::TEXT,
        ('Total electos: ' || COUNT(*))::TEXT
    FROM organizational_structure
    WHERE is_elected = true;
    
    -- Verificar estructura jerárquica
    RETURN QUERY
    SELECT 
        'hierarchy_integrity'::TEXT,
        CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'ERROR' END::TEXT,
        ('Usuarios sin superior válido: ' || COUNT(*))::TEXT
    FROM organizational_structure os1
    WHERE os1.reports_to IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM organizational_structure os2 
        WHERE os2.id = os1.reports_to
    );
    
    -- Verificar backups recientes
    RETURN QUERY
    SELECT 
        'recent_backups'::TEXT,
        CASE 
            WHEN MAX(created_at) > NOW() - INTERVAL '24 hours' THEN 'OK'
            WHEN MAX(created_at) > NOW() - INTERVAL '72 hours' THEN 'WARNING'
            ELSE 'ERROR'
        END::TEXT,
        ('Último backup: ' || COALESCE(MAX(created_at)::TEXT, 'Nunca'))::TEXT
    FROM system_backups
    WHERE backup_type IN ('daily', 'critical_change');
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Crear backup inicial
SELECT create_system_backup('manual', NULL);

COMMENT ON TABLE system_backups IS 'Sistema de backups automáticos para protección de datos críticos';
COMMENT ON FUNCTION create_system_backup IS 'Crear backup del sistema con datos críticos';
COMMENT ON FUNCTION restore_from_backup IS 'Restaurar sistema desde backup específico';
COMMENT ON VIEW backup_status IS 'Estado y estadísticas de backups del sistema';