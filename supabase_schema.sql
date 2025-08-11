-- Script SQL Consolidado para Supabase - Proyecto MAIS
-- Ejecuta este script completo en el SQL Editor de tu panel de control de Supabase.

-- Desactivar la verificaciÃ³n de claves forÃ¡neas temporalmente para evitar problemas de orden
SET session_replication_role = 'replica';

-- Eliminar tablas existentes si ya las tienes y quieres empezar de cero (opcional, descomentar si es necesario)
-- DROP TABLE IF EXISTS public.messages CASCADE;
-- DROP TABLE IF EXISTS public.databases CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Tabla para perfiles de usuario (vinculada a Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text,
  role text,
  region text,
  department text,
  PRIMARY KEY (id)
);

-- Habilitar RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- PolÃ­ticas de RLS para profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tabla para mensajes
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users ON DELETE CASCADE,
  sender_name text,
  sender_role text,
  content text NOT NULL,
  type text, -- 'direct' or 'broadcast'
  priority text, -- 'low', 'medium', 'high', 'urgent'
  read_by uuid[], -- Array de IDs de usuarios que han leÃ­do el mensaje
  timestamp timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PolÃ­ticas de RLS para messages
DROP POLICY IF EXISTS "Authenticated users can view messages." ON public.messages;
CREATE POLICY "Authenticated users can view messages."
  ON public.messages FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert messages." ON public.messages;
CREATE POLICY "Authenticated users can insert messages."
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Tabla para metadatos de archivos/ingesta de datos
CREATE TABLE IF NOT EXISTS public.databases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text, -- 'image', 'excel', 'document'
  uploaded_by uuid REFERENCES auth.users ON DELETE SET NULL,
  upload_date timestamp with time zone DEFAULT now(),
  territory text,
  category text,
  url text, -- URL pÃºblica del archivo en Supabase Storage
  metadata jsonb -- Para almacenar metadatos adicionales como tamaÃ±o, tipo MIME
);

-- Habilitar RLS para databases
ALTER TABLE public.databases ENABLE ROW LEVEL SECURITY;

-- PolÃ­ticas de RLS para databases
DROP POLICY IF EXISTS "Authenticated users can view database entries." ON public.databases;
CREATE POLICY "Authenticated users can view database entries."
  ON public.databases FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert their own database entries." ON public.databases;
CREATE POLICY "Authenticated users can insert their own database entries."
  ON public.databases FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Reactivar la verificaciÃ³n de claves forÃ¡neas
SET session_replication_role = 'origin';

-- PolÃ­ticas de Storage para el bucket 'files'
-- AsegÃºrate de que el bucket 'files' exista en Supabase Storage.
-- Si no existe, crÃ©alo manualmente en el panel de control de Supabase.
-- Luego, puedes ejecutar estas polÃ­ticas.

-- Permitir a los usuarios autenticados subir archivos
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'files');

-- Permitir a los usuarios autenticados ver sus propios archivos (o todos si es pÃºblico)
DROP POLICY IF EXISTS "Allow authenticated read access" ON storage.objects;
CREATE POLICY "Allow authenticated read access"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'files');

-- Opcional: Permitir a los usuarios autenticados eliminar sus propios archivos
-- DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
-- CREATE POLICY "Allow authenticated delete"
--   ON storage.objects FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'files' AND auth.uid() = owner);
