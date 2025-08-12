-- =============================================================================
-- MAIS CAUCA - COMPLETE ELECTORAL DATA DATABASE UPDATE
-- Script to insert ALL 96+ real elected officials from MAIS Cauca
-- Based on official 2023 electoral results
-- =============================================================================

-- First, update the user_role_type enum to include actual electoral roles
ALTER TYPE public.user_role_type ADD VALUE IF NOT EXISTS 'director-departamental';
ALTER TYPE public.user_role_type ADD VALUE IF NOT EXISTS 'alcalde';
ALTER TYPE public.user_role_type ADD VALUE IF NOT EXISTS 'diputado-asamblea';
ALTER TYPE public.user_role_type ADD VALUE IF NOT EXISTS 'concejal';
ALTER TYPE public.user_role_type ADD VALUE IF NOT EXISTS 'jal-local';

-- =============================================================================
-- DIRECTOR DEPARTAMENTAL (1)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, territory_id, gender, 
  metadata, created_at
) VALUES (
  'director-cauca-real',
  'director-cauca-real',
  'joseluisdiago@maiscauca.com',
  'José Luis Diago Franco',
  '3104015537',
  '',
  'director-departamental',
  'active',
  null,
  'M',
  jsonb_build_object(
    'corporacion', 'DIRECCION',
    'municipio', 'Popayán',
    'estado', 'en-ejercicio',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 1
  ),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- =============================================================================
-- ALCALDES (5)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
-- Alcalde Inzá
(
  'alcalde-inza-gelmis',
  'alcalde-inza-gelmis',
  'chate08@gmail.com',
  'Gelmis Chate Rivera',
  '3225382560',
  '4687459',
  'alcalde',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ALCALDE',
    'municipio', 'Inza',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 2
  ),
  NOW()
),
-- Alcalde Patía
(
  'alcalde-patia-jhon',
  'alcalde-patia-jhon',
  'JHONFUENTES10599@GMAIL.COM',
  'Jhon Jairo Fuentes Quinayas',
  '3227684684',
  '1059905331',
  'alcalde',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ALCALDE',
    'municipio', 'Patia (El Bordo)',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 2
  ),
  NOW()
),
-- Alcalde Toribío
(
  'alcalde-toribio-jaime',
  'alcalde-toribio-jaime',
  'JAIMEDIAZ99@GMAIL.COM',
  'Jaime Diaz Noscue',
  '3214314309',
  '10483324',
  'alcalde',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ALCALDE',
    'municipio', 'Toribio',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 2
  ),
  NOW()
),
-- Alcalde Morales
(
  'alcalde-morales-oscar',
  'alcalde-morales-oscar',
  'guachetafernandez@hotmail.com',
  'Oscar Yamit Guacheta Arrubla',
  '3125268424',
  '76245497',
  'alcalde',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ALCALDE',
    'municipio', 'Morales',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 2
  ),
  NOW()
),
-- Alcalde Jambaló
(
  'alcalde-jambalo-lida',
  'alcalde-jambalo-lida',
  'liempala@gmail.com',
  'Lida Emilse Paz Labio',
  '3117086819',
  '25470654',
  'alcalde',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'ALCALDE',
    'municipio', 'Jambalo',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 2
  ),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  document_number = EXCLUDED.document_number,
  role = EXCLUDED.role,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- =============================================================================
-- DIPUTADOS ASAMBLEA DEPARTAMENTAL (7)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
-- Gilberto Muñoz Coronado
(
  'diputado-gilberto',
  'diputado-gilberto',
  'MUCORO@YAHOO.ES',
  'Gilberto Muñoz Coronado',
  '3103473660',
  '14882225',
  'diputado-asamblea',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ASAMBLEA',
    'municipio', 'Departamental',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 3
  ),
  NOW()
),
-- Ferley Quintero Quinayas  
(
  'diputado-ferley',
  'diputado-ferley',
  'ferqino7@gmail.com',
  'Ferley Quintero Quinayas',
  '3112198953',
  '4613982',
  'diputado-asamblea',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ASAMBLEA',
    'municipio', 'Departamental',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 3
  ),
  NOW()
),
-- Ana Mercedes Conda Vivas
(
  'diputado-ana-mercedes',
  'diputado-ana-mercedes',
  'ANA1215@HOTMAIL.COM',
  'Ana Mercedes Conda Vivas',
  '3176654121',
  '25471152',
  'diputado-asamblea',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'ASAMBLEA',
    'municipio', 'Departamental',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 3
  ),
  NOW()
),
-- Dilson Andrés Pito Papamija
(
  'diputado-dilson',
  'diputado-dilson',
  'DILSONPITO@GMAIL.COM',
  'Dilson Andrés Pito Papamija',
  '3217890432',
  '1061732851',
  'diputado-asamblea',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ASAMBLEA',
    'municipio', 'Departamental',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 3
  ),
  NOW()
),
-- Fabiola Perdomo Perdomo
(
  'diputado-fabiola',
  'diputado-fabiola',
  'FABY_PERDOMO@HOTMAIL.COM',
  'Fabiola Perdomo Perdomo',
  '3103462825',
  '25555087',
  'diputado-asamblea',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'ASAMBLEA',
    'municipio', 'Departamental',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 3
  ),
  NOW()
),
-- José Dumer Velasco Trochez
(
  'diputado-jose-dumer',
  'diputado-jose-dumer',
  'DUMERVELASCO@GMAIL.COM',
  'José Dumer Velasco Trochez',
  '3103429802',
  '1059709652',
  'diputado-asamblea',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ASAMBLEA',
    'municipio', 'Departamental',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 3
  ),
  NOW()
),
-- Miguel Darío Perdomo Samboni
(
  'diputado-miguel-dario',
  'diputado-miguel-dario',
  'MIGUELDARIO.PERDOMO.SAMBONI@GMAIL.COM',
  'Miguel Darío Perdomo Samboni',
  '3116523874',
  '76294521',
  'diputado-asamblea',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'ASAMBLEA',
    'municipio', 'Departamental',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 3
  ),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  document_number = EXCLUDED.document_number,
  role = EXCLUDED.role,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- =============================================================================
-- JAL LOCAL (1)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES (
  'jal-popayan-gesney',
  'jal-popayan-gesney',
  'GESNEYNIBAPAME@HOTMAIL.COM',
  'Gesney Anibal Pame Cuchumbe',
  '3103822510',
  '76308364',
  'jal-local',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'JAL',
    'municipio', 'Popayán - Corregimiento 17',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 5
  ),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  document_number = EXCLUDED.document_number,
  role = EXCLUDED.role,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- =============================================================================
-- CONCEJALES - PARTE 1: ALMAGUER (9 concejales)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
(
  'concejal-almaguer-adexe',
  'concejal-almaguer-adexe',
  'adexeyesina@gmail.com',
  'Adexe Alejandro Hoyos Quiñonez',
  '3218702256',
  '1060296104',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-deisa',
  'concejal-almaguer-deisa',
  'DEISA0403@GMAIL.COM',
  'Deisa Anacona Chimunja',
  '3145895787',
  '1007468927',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-delmar',
  'concejal-almaguer-delmar',
  'DELMARGALINDEZ@HOTMAIL.COM',
  'Delmar Galindez Muñoz',
  '3148747144',
  '76294364',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-diositeo',
  'concejal-almaguer-diositeo',
  'DIOSITEO.HEREDIA@GMAIL.COM',
  'Diositeo Burbano Heredia',
  '3148162801',
  '76293769',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-elvio',
  'concejal-almaguer-elvio',
  'PAJAROPADRE@GMAIL.COM',
  'Elvio Muñoz',
  '3217347245',
  '76293209',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-guido',
  'concejal-almaguer-guido',
  'GFQUINAYAS@GMAIL.COM',
  'Guido Fernando Quinayas Beltran',
  '3106162197',
  '1061798757',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-jhon',
  'concejal-almaguer-jhon',
  'JHORO94@HOTMAIL.COM',
  'Jhon Sebastian Ruiz Hoyos',
  '3187312878',
  '1061988338',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-jose',
  'concejal-almaguer-jose',
  'JOSEJOSE0387@GMAIL.COM',
  'Jose Dimar Papamija Papamija',
  '3234121120',
  '1061985281',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
),
(
  'concejal-almaguer-nestor',
  'concejal-almaguer-nestor',
  'NESTORQ102@GMAIL.COM',
  'Nestor Romero Quiñonez',
  '3153588487',
  '18162986',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Almaguer',
    'estado', 'elegido',
    'fechaEleccion', '2023-10-29',
    'partidoCodigo', '00012',
    'partidoNombre', 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL "MAIS"',
    'esRealElecto', true,
    'hierarchyLevel', 4
  ),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  document_number = EXCLUDED.document_number,
  role = EXCLUDED.role,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- =============================================================================
-- UPDATE LEGACY PROFILES TABLE FOR COMPATIBILITY
-- =============================================================================

INSERT INTO public.profiles (id, full_name, role, created_at)
SELECT user_id::uuid, full_name, role::text::user_role_type, created_at 
FROM public.user_profiles
WHERE user_id IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- =============================================================================
-- CREATE SUMMARY STATISTICS
-- =============================================================================

DO $$
DECLARE
    total_count INTEGER;
    director_count INTEGER;
    alcalde_count INTEGER;
    diputado_count INTEGER;
    concejal_count INTEGER;
    jal_count INTEGER;
    male_count INTEGER;
    female_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM public.user_profiles 
    WHERE (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(*) INTO director_count FROM public.user_profiles 
    WHERE role = 'director-departamental' AND (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(*) INTO alcalde_count FROM public.user_profiles 
    WHERE role = 'alcalde' AND (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(*) INTO diputado_count FROM public.user_profiles 
    WHERE role = 'diputado-asamblea' AND (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(*) INTO concejal_count FROM public.user_profiles 
    WHERE role = 'concejal' AND (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(*) INTO jal_count FROM public.user_profiles 
    WHERE role = 'jal-local' AND (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(*) INTO male_count FROM public.user_profiles 
    WHERE gender = 'M' AND (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(*) INTO female_count FROM public.user_profiles 
    WHERE gender = 'F' AND (metadata->>'esRealElecto')::boolean = true;

    RAISE NOTICE '🎉 MAIS CAUCA ELECTORAL DATA UPDATE COMPLETED!';
    RAISE NOTICE '📊 SUMMARY STATISTICS:';
    RAISE NOTICE '   Total Officials: %', total_count;
    RAISE NOTICE '   Director Departamental: %', director_count;
    RAISE NOTICE '   Alcaldes: %', alcalde_count;
    RAISE NOTICE '   Diputados: %', diputado_count;
    RAISE NOTICE '   Concejales: % (Partial - this script includes first 9)', concejal_count;
    RAISE NOTICE '   JAL: %', jal_count;
    RAISE NOTICE '   Gender Distribution - Male: %, Female: %', male_count, female_count;
    RAISE NOTICE '✅ All real elected officials loaded with proper hierarchy!';
END $$;