-- =============================================================================
-- MAIS CAUCA - ROLE HIERARCHY MAPPING AND SYSTEM UPDATE
-- Complete role mapping between electoral positions and system permissions
-- =============================================================================

-- =============================================================================
-- ROLE HIERARCHY DEFINITION (Based on Real Electoral Structure)
-- =============================================================================

-- Create function to define role hierarchy levels
CREATE OR REPLACE FUNCTION public.get_electoral_hierarchy_level(user_role text)
RETURNS INTEGER AS $$
BEGIN
  CASE user_role
    WHEN 'director-departamental' THEN RETURN 1;      -- Highest authority
    WHEN 'alcalde' THEN RETURN 2;                     -- Municipal executives  
    WHEN 'diputado-asamblea' THEN RETURN 3;           -- Departmental legislators
    WHEN 'concejal' THEN RETURN 4;                    -- Municipal legislators
    WHEN 'jal-local' THEN RETURN 5;                   -- Local administrators
    WHEN 'coordinador-municipal' THEN RETURN 6;       -- Party coordinators
    WHEN 'lider-comunitario' THEN RETURN 7;           -- Community leaders
    WHEN 'influenciador-digital' THEN RETURN 8;       -- Digital influencers
    WHEN 'colaborador' THEN RETURN 9;                 -- Party collaborators
    WHEN 'ciudadano-base' THEN RETURN 10;             -- Base citizens
    -- Legacy compatibility
    WHEN 'comite-ejecutivo-nacional' THEN RETURN 1;
    WHEN 'lider-regional' THEN RETURN 2;
    WHEN 'comite-departamental' THEN RETURN 3;
    WHEN 'candidato' THEN RETURN 6;
    WHEN 'votante' THEN RETURN 10;
    ELSE RETURN 99;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ROLE PERMISSIONS MAPPING
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_role_permissions(user_role text)
RETURNS TEXT[] AS $$
BEGIN
  CASE user_role
    WHEN 'director-departamental' THEN 
      RETURN ARRAY[
        'full_system_access',
        'create_all_roles',
        'manage_departments',
        'view_all_data',
        'financial_oversight',
        'strategic_planning',
        'departmental_coordination'
      ];
    WHEN 'alcalde' THEN 
      RETURN ARRAY[
        'municipal_management',
        'create_municipal_roles',
        'view_municipal_data',
        'municipal_finances',
        'coordinate_concejales',
        'public_works_oversight',
        'citizen_services'
      ];
    WHEN 'diputado-asamblea' THEN 
      RETURN ARRAY[
        'departmental_legislation',
        'budget_approval',
        'oversight_municipalities',
        'view_departmental_data',
        'propose_projects',
        'assembly_voting'
      ];
    WHEN 'concejal' THEN 
      RETURN ARRAY[
        'municipal_legislation',
        'local_oversight',
        'view_municipal_data',
        'propose_local_projects',
        'citizen_representation',
        'council_voting'
      ];
    WHEN 'jal-local' THEN 
      RETURN ARRAY[
        'local_administration',
        'community_oversight',
        'view_local_data',
        'local_project_management',
        'citizen_services'
      ];
    WHEN 'coordinador-municipal' THEN 
      RETURN ARRAY[
        'coordinate_activities',
        'manage_volunteers',
        'view_coordination_data',
        'organize_events'
      ];
    WHEN 'lider-comunitario' THEN 
      RETURN ARRAY[
        'community_leadership',
        'organize_activities',
        'view_community_data',
        'represent_community'
      ];
    WHEN 'influenciador-digital' THEN 
      RETURN ARRAY[
        'social_media_management',
        'content_creation',
        'digital_campaigns',
        'online_engagement'
      ];
    WHEN 'colaborador' THEN 
      RETURN ARRAY[
        'support_activities',
        'view_basic_data',
        'participate_events'
      ];
    WHEN 'ciudadano-base' THEN 
      RETURN ARRAY[
        'view_public_data',
        'participate_consultations',
        'submit_requests'
      ];
    ELSE RETURN ARRAY['basic_access'];
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TERRITORIAL MANAGEMENT MAPPING
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_managed_territories(user_role text, municipality text DEFAULT NULL)
RETURNS TEXT[] AS $$
BEGIN
  CASE user_role
    WHEN 'director-departamental' THEN 
      RETURN ARRAY['Cauca']; -- Entire department
    WHEN 'alcalde' THEN 
      RETURN ARRAY[COALESCE(municipality, 'Unknown')]; -- Specific municipality
    WHEN 'diputado-asamblea' THEN 
      RETURN ARRAY['Cauca']; -- Departmental scope
    WHEN 'concejal' THEN 
      RETURN ARRAY[COALESCE(municipality, 'Unknown')]; -- Municipal scope
    WHEN 'jal-local' THEN 
      RETURN ARRAY[COALESCE(municipality, 'Unknown')]; -- Local scope
    ELSE RETURN ARRAY['Local'];
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ROLE CREATION PERMISSIONS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_can_create_roles(user_role text)
RETURNS TEXT[] AS $$
BEGIN
  CASE user_role
    WHEN 'director-departamental' THEN 
      RETURN ARRAY[
        'alcalde',
        'diputado-asamblea', 
        'concejal',
        'jal-local',
        'coordinador-municipal',
        'lider-comunitario',
        'influenciador-digital',
        'colaborador',
        'ciudadano-base'
      ];
    WHEN 'alcalde' THEN 
      RETURN ARRAY[
        'concejal',
        'jal-local',
        'coordinador-municipal',
        'lider-comunitario',
        'colaborador',
        'ciudadano-base'
      ];
    WHEN 'diputado-asamblea' THEN 
      RETURN ARRAY[
        'coordinador-municipal',
        'lider-comunitario',
        'colaborador',
        'ciudadano-base'
      ];
    WHEN 'concejal' THEN 
      RETURN ARRAY[
        'lider-comunitario',
        'colaborador',
        'ciudadano-base'
      ];
    WHEN 'coordinador-municipal' THEN 
      RETURN ARRAY[
        'lider-comunitario',
        'colaborador',
        'ciudadano-base'
      ];
    WHEN 'lider-comunitario' THEN 
      RETURN ARRAY[
        'colaborador',
        'ciudadano-base'
      ];
    ELSE RETURN ARRAY[]::TEXT[];
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- UPDATE USER PROFILES WITH COMPUTED HIERARCHY DATA
-- =============================================================================

-- Add computed columns for hierarchy data
UPDATE public.user_profiles SET
  metadata = metadata || 
  jsonb_build_object(
    'hierarchyLevel', public.get_electoral_hierarchy_level(role::text),
    'permissions', public.get_role_permissions(role::text),
    'managedTerritories', public.get_managed_territories(role::text, metadata->>'municipio'),
    'canCreateRoles', public.get_can_create_roles(role::text),
    'lastHierarchyUpdate', NOW()
  )
WHERE role IS NOT NULL;

-- =============================================================================
-- CREATE ORGANIZATIONAL STRUCTURE RECORDS
-- =============================================================================

-- Insert into organizational_structure for proper hierarchy tracking
INSERT INTO public.organizational_structure (
  id,
  user_id,
  profile_id,
  full_name,
  email,
  phone,
  role_type,
  territory_level,
  department,
  municipality,
  hierarchy_level,
  can_create_roles,
  managed_territories,
  permissions,
  is_active,
  is_elected,
  election_date,
  description,
  created_at
)
SELECT 
  up.id,
  up.user_id,
  up.id as profile_id,
  up.full_name,
  up.email,
  up.phone,
  up.role,
  CASE up.role
    WHEN 'director-departamental' THEN 'departamental'
    WHEN 'diputado-asamblea' THEN 'departamental'
    WHEN 'alcalde' THEN 'municipal'
    WHEN 'concejal' THEN 'municipal'
    WHEN 'jal-local' THEN 'local'
    ELSE 'local'
  END::territory_level_type,
  'Cauca',
  up.metadata->>'municipio',
  (up.metadata->>'hierarchyLevel')::integer,
  ARRAY(SELECT jsonb_array_elements_text(up.metadata->'canCreateRoles')),
  ARRAY(SELECT jsonb_array_elements_text(up.metadata->'managedTerritories')),
  up.metadata->'permissions',
  CASE up.status WHEN 'active' THEN true ELSE false END,
  (up.metadata->>'esRealElecto')::boolean,
  (up.metadata->>'fechaEleccion')::date,
  up.metadata->>'corporacion' || ' - ' || COALESCE(up.metadata->>'municipio', 'Departamental'),
  up.created_at
FROM public.user_profiles up
WHERE up.role IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  role_type = EXCLUDED.role_type,
  territory_level = EXCLUDED.territory_level,
  municipality = EXCLUDED.municipality,
  hierarchy_level = EXCLUDED.hierarchy_level,
  can_create_roles = EXCLUDED.can_create_roles,
  managed_territories = EXCLUDED.managed_territories,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  is_elected = EXCLUDED.is_elected,
  election_date = EXCLUDED.election_date,
  description = EXCLUDED.description,
  updated_at = NOW();

-- =============================================================================
-- CREATE HIERARCHY RELATIONSHIPS
-- =============================================================================

-- Create relationships: Alcaldes report to Director Departamental
INSERT INTO public.hierarchy_relationships (superior_id, subordinate_id, relationship_type)
SELECT 
  (SELECT id FROM public.organizational_structure WHERE role_type = 'director-departamental' LIMIT 1),
  id,
  'direct_report'
FROM public.organizational_structure
WHERE role_type = 'alcalde'
ON CONFLICT (superior_id, subordinate_id) DO NOTHING;

-- Create relationships: Concejales report to their respective Alcalde
INSERT INTO public.hierarchy_relationships (superior_id, subordinate_id, relationship_type)
SELECT 
  a.id as superior_id,
  c.id as subordinate_id,
  'municipal_coordination'
FROM public.organizational_structure a
JOIN public.organizational_structure c ON c.municipality = a.municipality
WHERE a.role_type = 'alcalde' 
  AND c.role_type = 'concejal'
  AND a.municipality IS NOT NULL
ON CONFLICT (superior_id, subordinate_id) DO NOTHING;

-- Create relationships: Diputados report to Director Departamental
INSERT INTO public.hierarchy_relationships (superior_id, subordinate_id, relationship_type)
SELECT 
  (SELECT id FROM public.organizational_structure WHERE role_type = 'director-departamental' LIMIT 1),
  id,
  'departmental_coordination'
FROM public.organizational_structure
WHERE role_type = 'diputado-asamblea'
ON CONFLICT (superior_id, subordinate_id) DO NOTHING;

-- =============================================================================
-- UPDATE ORGANIZATIONAL STRUCTURE WITH REPORTING RELATIONSHIPS
-- =============================================================================

-- Update reports_to for alcaldes
UPDATE public.organizational_structure SET
  reports_to = (SELECT id FROM public.organizational_structure WHERE role_type = 'director-departamental' LIMIT 1)
WHERE role_type = 'alcalde';

-- Update reports_to for diputados
UPDATE public.organizational_structure SET
  reports_to = (SELECT id FROM public.organizational_structure WHERE role_type = 'director-departamental' LIMIT 1)
WHERE role_type = 'diputado-asamblea';

-- Update reports_to for concejales (report to their municipality's alcalde)
UPDATE public.organizational_structure SET
  reports_to = (
    SELECT a.id 
    FROM public.organizational_structure a 
    WHERE a.role_type = 'alcalde' 
      AND a.municipality = public.organizational_structure.municipality
    LIMIT 1
  )
WHERE role_type = 'concejal'
  AND municipality IS NOT NULL;

-- =============================================================================
-- CREATE PERFORMANCE METRICS BASELINE
-- =============================================================================

INSERT INTO public.performance_metrics (
  organization_member_id,
  report_period_start,
  report_period_end,
  meetings_attended,
  projects_initiated,
  citizens_served,
  role_specific_metrics
)
SELECT 
  id,
  '2024-01-01'::date,
  '2024-12-31'::date,
  CASE role_type
    WHEN 'alcalde' THEN 48        -- Weekly meetings
    WHEN 'diputado-asamblea' THEN 24  -- Bi-weekly assembly
    WHEN 'concejal' THEN 36       -- Municipal council meetings
    ELSE 12
  END,
  CASE role_type
    WHEN 'alcalde' THEN 15        -- Major municipal projects
    WHEN 'diputado-asamblea' THEN 8   -- Departmental initiatives  
    WHEN 'concejal' THEN 5        -- Local projects
    ELSE 2
  END,
  CASE role_type
    WHEN 'alcalde' THEN 5000      -- Municipal population served
    WHEN 'diputado-asamblea' THEN 15000 -- Departmental constituency
    WHEN 'concejal' THEN 1500     -- Local constituency
    ELSE 500
  END,
  jsonb_build_object(
    'electoral_mandate', metadata->>'corporacion',
    'territory_coverage', metadata->>'municipio',
    'election_date', metadata->>'fechaEleccion',
    'party_representation', metadata->>'partidoNombre',
    'baseline_established', NOW()
  )
FROM public.organizational_structure
WHERE is_elected = true
ON CONFLICT (organization_member_id, report_period_start, report_period_end) 
DO UPDATE SET
  meetings_attended = EXCLUDED.meetings_attended,
  projects_initiated = EXCLUDED.projects_initiated,
  citizens_served = EXCLUDED.citizens_served,
  role_specific_metrics = EXCLUDED.role_specific_metrics,
  updated_at = NOW();

-- =============================================================================
-- COMPLETION SUMMARY
-- =============================================================================

DO $$
DECLARE
    org_count INTEGER;
    hierarchy_count INTEGER;
    metrics_count INTEGER;
    director_count INTEGER;
    alcalde_count INTEGER;
    diputado_count INTEGER;
    concejal_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO org_count FROM public.organizational_structure;
    SELECT COUNT(*) INTO hierarchy_count FROM public.hierarchy_relationships;
    SELECT COUNT(*) INTO metrics_count FROM public.performance_metrics;
    
    SELECT COUNT(*) INTO director_count FROM public.organizational_structure WHERE role_type = 'director-departamental';
    SELECT COUNT(*) INTO alcalde_count FROM public.organizational_structure WHERE role_type = 'alcalde';
    SELECT COUNT(*) INTO diputado_count FROM public.organizational_structure WHERE role_type = 'diputado-asamblea';
    SELECT COUNT(*) INTO concejal_count FROM public.organizational_structure WHERE role_type = 'concejal';

    RAISE NOTICE '🏛️ MAIS CAUCA ROLE HIERARCHY SYSTEM COMPLETED!';
    RAISE NOTICE '📊 ORGANIZATIONAL STRUCTURE:';
    RAISE NOTICE '   Total Officials: %', org_count;
    RAISE NOTICE '   Director Departamental: %', director_count;
    RAISE NOTICE '   Alcaldes: %', alcalde_count;
    RAISE NOTICE '   Diputados: %', diputado_count;
    RAISE NOTICE '   Concejales: %', concejal_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔗 HIERARCHY RELATIONSHIPS:';
    RAISE NOTICE '   Total Relationships: %', hierarchy_count;
    RAISE NOTICE '';
    RAISE NOTICE '📈 PERFORMANCE METRICS:';
    RAISE NOTICE '   Baseline Records: %', metrics_count;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Complete role hierarchy mapping established!';
    RAISE NOTICE '✅ Organizational structure populated!';
    RAISE NOTICE '✅ Performance metrics baseline created!';
    RAISE NOTICE '🚀 MAIS Cauca political command center fully operational!';
END $$;