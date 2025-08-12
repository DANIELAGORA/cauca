-- MIGRACIÓN CRÍTICA: Actualizar tabla profiles para sistema jerárquico
-- Ejecutar DESPUÉS del schema base

-- 1. Agregar nuevos campos requeridos para la jerarquía
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS municipality text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hierarchy_level integer DEFAULT 10;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS es_real_electo boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS can_create_roles jsonb DEFAULT '[]';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS managed_territories jsonb DEFAULT '[]';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reports_to uuid REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS election_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- 2. Crear tabla user_profiles si no existe (para evitar conflictos)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  region text,
  department text,
  municipality text,
  hierarchy_level integer DEFAULT 10,
  es_real_electo boolean DEFAULT false,
  can_create_roles jsonb DEFAULT '[]',
  managed_territories jsonb DEFAULT '[]',
  reports_to uuid REFERENCES public.user_profiles(id),
  phone text,
  position text,
  election_date date,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 3. Habilitar RLS para user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para user_profiles
CREATE POLICY "Users can view profiles based on hierarchy" ON public.user_profiles
  FOR SELECT USING (
    auth.uid() = id OR -- Propio perfil
    auth.uid() IN (
      SELECT reports_to FROM public.user_profiles WHERE id = user_profiles.id
    ) OR -- Superior jerárquico
    id IN (
      SELECT id FROM public.user_profiles WHERE reports_to = auth.uid()
    ) -- Subordinados
  );

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (
    auth.uid() = id OR -- Propio perfil
    auth.uid() IN (
      SELECT reports_to FROM public.user_profiles WHERE id = user_profiles.id
    ) -- Superior jerárquico puede editar
  );

-- 5. Insertar datos reales de electos MAIS Cauca
INSERT INTO public.user_profiles (
  id, name, role, region, department, municipality, hierarchy_level, 
  es_real_electo, phone, election_date, metadata
) VALUES 
-- Director Departamental
(
  gen_random_uuid(),
  'José Luis Diago Franco',
  'director-departamental',
  'Andina',
  'Cauca',
  'Popayán',
  1,
  true,
  '3104015537',
  '2023-10-29',
  '{"cargo": "Director Departamental", "partido": "MAIS"}'
),
-- Alcaldes
(
  gen_random_uuid(),
  'Gelmis Chate Rivera',
  'alcalde',
  'Andina',
  'Cauca',
  'Inza',
  2,
  true,
  '3225382560',
  '2023-10-29',
  '{"cargo": "Alcalde", "municipio": "Inza", "partido": "MAIS"}'
),
(
  gen_random_uuid(),
  'Jhon Jairo Fuentes Quinayas',
  'alcalde',
  'Andina',
  'Cauca',
  'Patía (El Bordo)',
  2,
  true,
  '3227684684',
  '2023-10-29',
  '{"cargo": "Alcalde", "municipio": "Patía", "partido": "MAIS"}'
),
(
  gen_random_uuid(),
  'Jaime Diaz Noscue',
  'alcalde',
  'Andina',
  'Cauca',
  'Toribio',
  2,
  true,
  '3214314309',
  '2023-10-29',
  '{"cargo": "Alcalde", "municipio": "Toribio", "partido": "MAIS"}'
),
(
  gen_random_uuid(),
  'Oscar Yamit Guacheta Arrubla',
  'alcalde',
  'Andina',
  'Cauca',
  'Morales',
  2,
  true,
  '3125268424',
  '2023-10-29',
  '{"cargo": "Alcalde", "municipio": "Morales", "partido": "MAIS"}'
),
(
  gen_random_uuid(),
  'Lida Emilse Paz Labio',
  'alcalde',
  'Andina',
  'Cauca',
  'Jambalo',
  2,
  true,
  '3117086819',
  '2023-10-29',
  '{"cargo": "Alcalde", "municipio": "Jambalo", "partido": "MAIS", "genero": "F"}'
),
-- Diputados
(
  gen_random_uuid(),
  'Gilberto Muñoz Coronado',
  'diputado-asamblea',
  'Andina',
  'Cauca',
  'Departamental',
  3,
  true,
  '3103473660',
  '2023-10-29',
  '{"cargo": "Diputado Asamblea", "partido": "MAIS"}'
),
(
  gen_random_uuid(),
  'Ferley Quintero Quinayas',
  'diputado-asamblea',
  'Andina',
  'Cauca',
  'Departamental',
  3,
  true,
  '3112198953',
  '2023-10-29',
  '{"cargo": "Diputado Asamblea", "partido": "MAIS"}'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Función para sincronizar con auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email), 'ciudadano-base')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 10. Vista para facilitar consultas jerárquicas
CREATE OR REPLACE VIEW public.hierarchy_view AS
SELECT 
  up1.id,
  up1.name,
  up1.role,
  up1.municipality,
  up1.hierarchy_level,
  up1.es_real_electo,
  up2.name as superior_name,
  up2.role as superior_role,
  (
    SELECT COUNT(*) 
    FROM public.user_profiles up3 
    WHERE up3.reports_to = up1.id
  ) as subordinates_count
FROM public.user_profiles up1
LEFT JOIN public.user_profiles up2 ON up1.reports_to = up2.id
ORDER BY up1.hierarchy_level, up1.name;

-- 11. Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_municipality ON public.user_profiles(municipality);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hierarchy ON public.user_profiles(hierarchy_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_reports_to ON public.user_profiles(reports_to);
CREATE INDEX IF NOT EXISTS idx_user_profiles_es_real_electo ON public.user_profiles(es_real_electo);

COMMENT ON TABLE public.user_profiles IS 'Perfiles de usuario con sistema jerárquico MAIS';
COMMENT ON VIEW public.hierarchy_view IS 'Vista simplificada de la jerarquía organizacional';