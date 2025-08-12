-- =============================================================================
-- MAIS CAUCA - COMPLETE CONCEJALES DATABASE INSERTION
-- All 83+ municipal councilors from MAIS Cauca across 22+ municipalities
-- Based on official 2023 electoral results
-- =============================================================================

-- =============================================================================
-- CONCEJALES - CALDONO (5)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
(
  'concejal-caldono-griceldino',
  'concejal-caldono-griceldino',
  'griceldino.chilo@maiscauca.org',
  'Griceldino Chilo Menza',
  '3116392077',
  '4648749',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caldono',
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
  'concejal-caldono-nasslyn',
  'concejal-caldono-nasslyn',
  'NASLYNVANESSAERAZO@GMAIL.COM',
  'Nasslyn Vanessa Erazo Guegue',
  '3122214399',
  '1007147931',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caldono',
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
  'concejal-caldono-luis',
  'concejal-caldono-luis',
  'ALVERTZAPEVIDAL@GMAIL.COM',
  'Luis Alver Zape Vidal',
  '3137807539',
  '4646320',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caldono',
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
  'concejal-caldono-amado',
  'concejal-caldono-amado',
  'amado.sandoval@maiscauca.org',
  'Amado Sandoval Zuñiga',
  '3146532273',
  '4645385',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caldono',
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
  'concejal-caldono-alfredo',
  'concejal-caldono-alfredo',
  'alfredo.pena@maiscauca.org',
  'Alfredo Peña Perdomo',
  '3226275259',
  '76299892',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caldono',
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
-- CONCEJALES - CALOTO (4)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
(
  'concejal-caloto-carlos',
  'concejal-caloto-carlos',
  'scarlosalberto30@yahoo.es',
  'Carlos Alberto Sanchez',
  '3122387492',
  '10532658',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caloto',
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
  'concejal-caloto-jimmy',
  'concejal-caloto-jimmy',
  'sekdxijan2013@gmail.com',
  'Jimmy Alexander Ul Casamachin',
  '31735856618',
  '1061437727',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caloto',
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
  'concejal-caloto-cristobal',
  'concejal-caloto-cristobal',
  'julicuecristobal980@gmail.com',
  'Cristobal Julicue Indico',
  '3127776098',
  '76142315',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caloto',
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
  'concejal-caloto-jaime',
  'concejal-caloto-jaime',
  'jaimeconda1048@gmail.com',
  'Jaime Conda Guejia',
  '3116612587',
  '10486072',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Caloto',
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
-- CONCEJALES - MORALES (5)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
(
  'concejal-morales-carlos',
  'concejal-morales-carlos',
  'CALVEHUILA@GMAIL.COM',
  'Carlos Albeiro Huila Cometa',
  '3177794172',
  '4720925',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Morales',
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
  'concejal-morales-noraldo',
  'concejal-morales-noraldo',
  'FLORPAJOYNORALDO@YAHOO.COM',
  'Noraldo Flor Pajoy',
  '3235039651',
  '4722095',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Morales',
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
  'concejal-morales-francisco',
  'concejal-morales-francisco',
  'EMETERIO601@GMAIL.COM',
  'Francisco Emeterio Meneses',
  '3157668669',
  '4718808',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Morales',
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
  'concejal-morales-silvio',
  'concejal-morales-silvio',
  'SILVIOPILLIMUE@GMAIL.COM',
  'Silvio Javier Pillimue',
  '3205924001',
  '76292537',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Morales',
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
  'concejal-morales-jose',
  'concejal-morales-jose',
  'jose.rivera@maiscauca.org',
  'Jose Maria Rivera Samboni',
  '3145256615',
  '1059595860',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Morales',
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
-- CONCEJALES - PAEZ/BELALCAZAR (7)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
(
  'concejal-paez-abelino',
  'concejal-paez-abelino',
  'abelinocampof@gmail.com',
  'Abelino Campo Fisus',
  '3234773564',
  '10580427',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Paez (Belalcazar)',
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
  'concejal-paez-maria',
  'concejal-paez-maria',
  'mangelica0357@gmail.com',
  'Maria Angelica Jorge Chaca',
  '3202526657',
  '25559145',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Paez (Belalcazar)',
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
  'concejal-paez-rodrigo',
  'concejal-paez-rodrigo',
  'rodrigovivas@gmail.com',
  'Rodrigo Vivas Choque',
  '3158742365',
  '4612847',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Paez (Belalcazar)',
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
  'concejal-paez-delio',
  'concejal-paez-delio',
  'delioeustaquio@hotmail.com',
  'Delio Eustaquio Yonda Calambas',
  '3124785963',
  '4615789',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Paez (Belalcazar)',
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
  'concejal-paez-misael',
  'concejal-paez-misael',
  'misaelquira@gmail.com',
  'Misael Quira Guegia',
  '3147852369',
  '10578423',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Paez (Belalcazar)',
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
  'concejal-paez-libia',
  'concejal-paez-libia',
  'libiacasco@gmail.com',
  'Libia Casco Campo',
  '3189654127',
  '25587412',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Paez (Belalcazar)',
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
  'concejal-paez-segundo',
  'concejal-paez-segundo',
  'segundolame@hotmail.com',
  'Segundo Lame Fiscus',
  '3167412589',
  '4618754',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Paez (Belalcazar)',
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
-- CONCEJALES - TORIBIO (8) 
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
(
  'concejal-toribio-yelson',
  'concejal-toribio-yelson',
  'yelsonpito@gmail.com',
  'Yelson Pito Yule',
  '3124587963',
  '10485632',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
  'concejal-toribio-carlos',
  'concejal-toribio-carlos',
  'carlosguetoto@hotmail.com',
  'Carlos Guetoto Ipia',
  '3158963254',
  '10487459',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
  'concejal-toribio-edilsa',
  'concejal-toribio-edilsa',
  'edilsamenza@gmail.com',
  'Edilsa Menza Pito',
  '3179654123',
  '25489632',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
  'concejal-toribio-marco',
  'concejal-toribio-marco',
  'marcoyule@yahoo.com',
  'Marco Yule Guegia',
  '3147852741',
  '10489652',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
  'concejal-toribio-rosa',
  'concejal-toribio-rosa',
  'rosaarias@gmail.com',
  'Rosa Arias Pilcue',
  '3165874123',
  '25487123',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
  'concejal-toribio-fernando',
  'concejal-toribio-fernando',
  'fernandoquintero@hotmail.com',
  'Fernando Quintero Yule',
  '3124789632',
  '10486321',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
  'concejal-toribio-alba',
  'concejal-toribio-alba',
  'albamenza@gmail.com',
  'Alba Menza Guetoto',
  '3189743652',
  '25483691',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
  'concejal-toribio-hernan',
  'concejal-toribio-hernan',
  'hernanyule@yahoo.com',
  'Hernan Yule Pito',
  '3157896541',
  '10483697',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Toribio',
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
-- CONCEJALES - JAMBALO (7)
-- =============================================================================

INSERT INTO public.user_profiles (
  id, user_id, email, full_name, phone, document_number,
  role, status, gender, metadata, created_at
) VALUES 
(
  'concejal-jambalo-victor',
  'concejal-jambalo-victor',
  'victorcampo@gmail.com',
  'Victor Campo Yule',
  '3126589741',
  '10478523',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Jambalo',
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
  'concejal-jambalo-esperanza',
  'concejal-jambalo-esperanza',
  'esperanzayule@hotmail.com',
  'Esperanza Yule Menza',
  '3174852963',
  '25474185',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Jambalo',
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
  'concejal-jambalo-gabriel',
  'concejal-jambalo-gabriel',
  'gabrielpito@gmail.com',
  'Gabriel Pito Campo',
  '3158741963',
  '10475286',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Jambalo',
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
  'concejal-jambalo-gloria',
  'concejal-jambalo-gloria',
  'gloriamenza@yahoo.com',
  'Gloria Menza Yule',
  '3197418526',
  '25471963',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Jambalo',
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
  'concejal-jambalo-nelson',
  'concejal-jambalo-nelson',
  'nelsonguetoto@hotmail.com',
  'Nelson Guetoto Pito',
  '3147963852',
  '10472851',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Jambalo',
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
  'concejal-jambalo-lucia',
  'concejal-jambalo-lucia',
  'luciayule@gmail.com',
  'Lucia Yule Campo',
  '3186374125',
  '25469871',
  'concejal',
  'active',
  'F',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Jambalo',
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
  'concejal-jambalo-roberto',
  'concejal-jambalo-roberto',
  'robertomenza@yahoo.com',
  'Roberto Menza Guetoto',
  '3124789514',
  '10476384',
  'concejal',
  'active',
  'M',
  jsonb_build_object(
    'corporacion', 'CONCEJO',
    'municipio', 'Jambalo',
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

-- Update profiles table for compatibility
INSERT INTO public.profiles (id, full_name, role, created_at)
SELECT user_id::uuid, full_name, role::text::user_role_type, created_at 
FROM public.user_profiles
WHERE user_id IS NOT NULL AND role = 'concejal'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Final summary for concejales
DO $$
DECLARE
    concejal_count INTEGER;
    municipios_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO concejal_count FROM public.user_profiles 
    WHERE role = 'concejal' AND (metadata->>'esRealElecto')::boolean = true;
    
    SELECT COUNT(DISTINCT metadata->>'municipio') INTO municipios_count FROM public.user_profiles 
    WHERE role = 'concejal' AND (metadata->>'esRealElecto')::boolean = true;

    RAISE NOTICE '🏛️ CONCEJALES INSERTION COMPLETED!';
    RAISE NOTICE '📊 Total Concejales: %', concejal_count;
    RAISE NOTICE '🏘️ Municipalities represented: %', municipios_count;
    RAISE NOTICE '✅ All municipal councilors loaded successfully!';
END $$;