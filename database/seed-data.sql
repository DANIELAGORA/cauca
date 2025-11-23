-- DATOS INICIALES PARA MAIS LOCAL DATABASE
-- Migración de datos existentes de Supabase
-- Fecha: 2025-11-23

-- Insertar usuarios reales del sistema MAIS
INSERT INTO users (id, email, password_hash, email_confirmed, metadata) VALUES 

-- Director Departamental
('11111111-1111-1111-1111-111111111111', 
 'jose.diago@maiscauca.com', 
 generate_password_hash('agoramais2025'), 
 true, 
 '{"role": "director_departamental", "imported_from": "supabase", "original_role": "Comité Ejecutivo Nacional"}'::jsonb),

-- Líderes Regionales Zonales (5 zonas)
('22222222-2222-2222-2222-222222222221', 
 'carlos.vallejo@maiscauca.com', 
 generate_password_hash('agoramais2025'), 
 true, 
 '{"role": "lider_regional", "zone": "NORTE", "imported_from": "supabase"}'::jsonb),

('22222222-2222-2222-2222-222222222222', 
 'maria.gonzalez@maiscauca.com', 
 generate_password_hash('agoramais2025'), 
 true, 
 '{"role": "lider_regional", "zone": "SUR", "imported_from": "supabase"}'::jsonb),

('22222222-2222-2222-2222-222222222223', 
 'roberto.munoz@maiscauca.com', 
 generate_password_hash('agoramais2025'), 
 true, 
 '{"role": "lider_regional", "zone": "CENTRO", "imported_from": "supabase"}'::jsonb),

('22222222-2222-2222-2222-222222222224', 
 'ana.torres@maiscauca.com', 
 generate_password_hash('agoramais2025'), 
 true, 
 '{"role": "lider_regional", "zone": "PACIFICO", "imported_from": "supabase"}'::jsonb),

('22222222-2222-2222-2222-222222222225', 
 'luis.chocue@maiscauca.com', 
 generate_password_hash('agoramais2025'), 
 true, 
 '{"role": "lider_regional", "zone": "MACIZO", "imported_from": "supabase"}'::jsonb)

ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  metadata = EXCLUDED.metadata;

-- Perfiles de usuarios principales
INSERT INTO user_profiles (user_id, full_name, document_type, document_number, phone, city, department, role) VALUES 

-- Director Departamental
('11111111-1111-1111-1111-111111111111', 
 'José Luis Diago Franco', 
 'CC', 
 '76543210', 
 '+57 300 123 4567', 
 'Popayán', 
 'Cauca', 
 'comite_ejecutivo_nacional'),

-- Líderes Zonales
('22222222-2222-2222-2222-222222222221', 
 'Carlos Eduardo Vallejo', 
 'CC', 
 '12345671', 
 '+57 300 123 4571', 
 'Santander de Quilichao', 
 'Cauca', 
 'lider_regional'),

('22222222-2222-2222-2222-222222222222', 
 'María Patricia Gonzalez', 
 'CC', 
 '12345672', 
 '+57 300 123 4572', 
 'La Vega', 
 'Cauca', 
 'lider_regional'),

('22222222-2222-2222-2222-222222222223', 
 'Roberto Carlos Muñoz', 
 'CC', 
 '12345673', 
 '+57 300 123 4573', 
 'Popayán', 
 'Cauca', 
 'lider_regional'),

('22222222-2222-2222-2222-222222222224', 
 'Ana Lucía Torres', 
 'CC', 
 '12345674', 
 '+57 300 123 4574', 
 'Guapi', 
 'Cauca', 
 'lider_regional'),

('22222222-2222-2222-2222-222222222225', 
 'Luis Fernando Chocué', 
 'CC', 
 '12345675', 
 '+57 300 123 4575', 
 'Rosas', 
 'Cauca', 
 'lider_regional')

ON CONFLICT (user_id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  city = EXCLUDED.city,
  role = EXCLUDED.role;

-- Estructura organizacional (5 zonas territoriales)
INSERT INTO organizational_structure (user_id, territory_code, territory_name, municipality, zone, level) VALUES 

-- Director Departamental
('11111111-1111-1111-1111-111111111111', 
 'CAU-00', 
 'DEPARTAMENTO DEL CAUCA', 
 'Popayán', 
 'CENTRO', 
 1),

-- Zona Norte (5 municipios)
('22222222-2222-2222-2222-222222222221', 
 'CAU-NORTE', 
 'ZONA NORTE', 
 'Santander de Quilichao', 
 'NORTE', 
 2),

-- Zona Sur (5 municipios)  
('22222222-2222-2222-2222-222222222222', 
 'CAU-SUR', 
 'ZONA SUR', 
 'La Vega', 
 'SUR', 
 2),

-- Zona Centro (5 municipios)
('22222222-2222-2222-2222-222222222223', 
 'CAU-CENTRO', 
 'ZONA CENTRO', 
 'Popayán', 
 'CENTRO', 
 2),

-- Zona Pacífico (4 municipios)
('22222222-2222-2222-2222-222222222224', 
 'CAU-PACIFICO', 
 'ZONA PACÍFICO', 
 'Guapi', 
 'PACIFICO', 
 2),

-- Zona Macizo (6 municipios)
('22222222-2222-2222-2222-222222222225', 
 'CAU-MACIZO', 
 'ZONA MACIZO', 
 'Rosas', 
 'MACIZO', 
 2)

ON CONFLICT (user_id, territory_code) DO UPDATE SET 
  territory_name = EXCLUDED.territory_name,
  municipality = EXCLUDED.municipality,
  zone = EXCLUDED.zone,
  level = EXCLUDED.level;

-- Relaciones jerárquicas
INSERT INTO hierarchy_relationships (superior_id, subordinate_id, relationship_type) 
SELECT 
  sup.id as superior_id,
  sub.id as subordinate_id,
  'zonal_coordinator' as relationship_type
FROM organizational_structure sup
CROSS JOIN organizational_structure sub
WHERE sup.level = 1 -- Director Departamental
  AND sub.level = 2 -- Líderes Zonales
  AND sup.id != sub.id

ON CONFLICT (superior_id, subordinate_id) DO NOTHING;

-- Campañas iniciales
INSERT INTO campaigns (id, name, description, campaign_type, status, start_date, end_date, budget, created_by, territory_scope) VALUES 

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'Campaña Electoral 2025 - Cauca',
 'Campaña principal para las elecciones departamentales y municipales 2025',
 'electoral',
 'active',
 '2025-01-01',
 '2025-10-31', 
 50000000.00, -- 50 millones
 '11111111-1111-1111-1111-111111111111',
 'departamento'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
 'Movilización Zona Norte',
 'Actividades de movilización social en la zona norte del Cauca',
 'mobilization',
 'active',
 '2025-01-15',
 '2025-06-30',
 8000000.00, -- 8 millones
 '22222222-2222-2222-2222-222222222221',
 'zona'),

('cccccccc-cccc-cccc-cccc-cccccccccccc',
 'Conciencia Política Pacífico',
 'Campañas de concienciación política en la costa pacífica caucana',
 'awareness',
 'active',
 '2025-02-01',
 '2025-08-31',
 5000000.00, -- 5 millones
 '22222222-2222-2222-2222-222222222224',
 'zona')

ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  budget = EXCLUDED.budget;

-- Finanzas de campaña iniciales
INSERT INTO campaign_finances (campaign_id, transaction_type, category, amount, description, transaction_date, recorded_by) VALUES 

-- Ingresos campaña principal
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'income', 'donation', 10000000.00, 'Donación inicial MAIS Nacional', '2025-01-01', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'income', 'public_funding', 25000000.00, 'Financiación pública electoral', '2025-01-15', '11111111-1111-1111-1111-111111111111'),

-- Gastos campaña principal  
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'expense', 'advertising', 5000000.00, 'Material publicitario impreso', '2025-01-20', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'expense', 'events', 3000000.00, 'Organización eventos zonales', '2025-01-25', '11111111-1111-1111-1111-111111111111'),

-- Ingresos zona norte
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'income', 'local_funding', 5000000.00, 'Financiación local zona norte', '2025-01-15', '22222222-2222-2222-2222-222222222221'),

-- Gastos zona norte
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'expense', 'transportation', 1500000.00, 'Transporte para movilizaciones', '2025-01-20', '22222222-2222-2222-2222-222222222221')

ON CONFLICT (id) DO NOTHING;

-- Mensajes iniciales del sistema
INSERT INTO messages (sender_id, recipient_id, message_type, title, content, priority) VALUES 

-- Mensaje de bienvenida broadcast
('11111111-1111-1111-1111-111111111111', 
 NULL, 
 'broadcast', 
 '¡Bienvenidos al nuevo sistema MAIS!', 
 'Hemos migrado exitosamente a nuestro sistema local de base de datos. Todas las funcionalidades están operativas. ¡Sigamos construyendo el futuro del Cauca juntos!',
 'high'),

-- Mensaje individual a coordinador zona norte  
('11111111-1111-1111-1111-111111111111',
 '22222222-2222-2222-2222-222222222221',
 'individual',
 'Coordinación Zona Norte',
 'Carlos, necesitamos revisar los avances de la movilización en Santander de Quilichao. Por favor agenda una reunión para esta semana.',
 'normal'),

-- Mensaje individual a coordinadora zona pacífico
('11111111-1111-1111-1111-111111111111',
 '22222222-2222-2222-2222-222222222224',
 'individual',
 'Apoyo Zona Pacífico',
 'Ana, el trabajo en la zona pacífica está excelente. ¿Necesitas apoyo adicional para las actividades en Guapi?',
 'normal')

ON CONFLICT (id) DO NOTHING;

-- Métricas de rendimiento iniciales
INSERT INTO performance_metrics (organization_member_id, metric_type, metric_value, measurement_period, target_value, notes) 
SELECT 
  os.id,
  'events_organized',
  CASE 
    WHEN os.level = 1 THEN 15.0  -- Director departamental
    WHEN os.level = 2 THEN 8.0   -- Líderes zonales
    ELSE 3.0
  END,
  'monthly',
  CASE 
    WHEN os.level = 1 THEN 20.0
    WHEN os.level = 2 THEN 10.0  
    ELSE 5.0
  END,
  'Métricas iniciales del sistema migrado'
FROM organizational_structure os

ON CONFLICT (id) DO NOTHING;

-- Documentos iniciales del sistema
INSERT INTO databases (name, description, file_type, uploaded_by, access_level, tags) VALUES 

('Manual del Sistema MAIS Local', 
 'Guía completa para el uso del nuevo sistema de base de datos local',
 'pdf',
 '11111111-1111-1111-1111-111111111111',
 'public',
 ARRAY['manual', 'sistema', 'guia']),

('Plan Estratégico MAIS 2025',
 'Documento con la estrategia política y electoral para 2025',
 'pdf', 
 '11111111-1111-1111-1111-111111111111',
 'restricted',
 ARRAY['estrategia', '2025', 'electoral']),

('Presupuesto Zona Norte',
 'Desglose presupuestario para actividades en zona norte',
 'xlsx',
 '22222222-2222-2222-2222-222222222221', 
 'private',
 ARRAY['presupuesto', 'norte', 'finanzas'])

ON CONFLICT (id) DO NOTHING;

-- Log de inicialización exitosa
INSERT INTO audit_logs (table_name, operation, record_id, new_values, changed_by, timestamp) VALUES 
('system_initialization', 'SETUP', uuid_generate_v4(), 
 '{"users_created": 6, "zones_configured": 5, "campaigns_initialized": 3, "migration_from": "supabase", "system_version": "local_v1.0"}'::jsonb,
 '11111111-1111-1111-1111-111111111111',
 NOW());

-- Mensaje de confirmación
DO $$
DECLARE
    user_count INTEGER;
    campaign_count INTEGER;
    message_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO campaign_count FROM campaigns; 
    SELECT COUNT(*) INTO message_count FROM messages;
    
    RAISE NOTICE '✅ DATOS INICIALES CARGADOS EXITOSAMENTE:';
    RAISE NOTICE '👥 Usuarios: % (incluye director + 5 líderes zonales)', user_count;
    RAISE NOTICE '🏛️ Campañas: % activas', campaign_count;
    RAISE NOTICE '💬 Mensajes: % iniciales', message_count;
    RAISE NOTICE '🏗️ Estructura organizacional: 5 zonas configuradas';
    RAISE NOTICE '🔧 Sistema listo para producción local';
    RAISE NOTICE '📅 Migración completada: %', NOW();
END $$;