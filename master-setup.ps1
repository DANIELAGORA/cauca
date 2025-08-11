# master-setup.ps1 - Script Maestro de Configuración y Despliegue para MAIS

# Forzar que el script se detenga si hay un error
$ErrorActionPreference = "Stop"

# Limpiar la pantalla para una vista limpia
Clear-Host

# --- MENÚ DE OPCIONES ---
Write-Host "--- Asistente Maestro de MAIS ---" -ForegroundColor Green
Write-Host "Elige una opción:"
Write-Host "1. Configurar Entorno de Desarrollo (LIMPIEZA TOTAL E INSTALACION)" -ForegroundColor Yellow
Write-Host "2. Iniciar Servidor de Desarrollo (en puerto 3000)"
Write-Host "3. Construir Proyecto para Producción (npm run build)"
Write-Host "4. Desplegar Proyecto en Netlify"
Write-Host "5. Generar Scripts SQL de Supabase (Tablas, RLS, Storage)" -ForegroundColor Cyan
Write-Host "6. Salir"
Write-Host ""

$choice = Read-Host "Por favor, introduce el numero de tu eleccion"

# --- LÓGICA DEL SCRIPT ---
switch ($choice) {
    '1' {
        Write-Host "Opcion 1: Iniciando limpieza y configuración del entorno..." -ForegroundColor Cyan

        # 1. Eliminar node_modules si existe
        if (Test-Path -Path "node_modules") {
            Write-Host "Eliminando la carpeta 'node_modules'..."
            Remove-Item -Recurse -Force "node_modules"
        }

        # 2. Eliminar package-lock.json si existe
        if (Test-Path -Path "package-lock.json") {
            Write-Host "Eliminando el archivo 'package-lock.json'..."
            Remove-Item -Force "package-lock.json"
        }

        # 3. Limpiar la caché de NPM
        Write-Host "Limpiando la cache de NPM (puede tardar un momento)..."
        npm cache clean --force

        # 4. Instalar dependencias
        Write-Host "Instalando todas las dependencias desde cero..."
        npm install

        # 5. Limpiar la cache de Vite
        Write-Host "Limpiando la cache de Vite..."
        npx vite optimize --force

        Write-Host ""
        Write-Host "¡ÉXITO! El entorno ha sido configurado correctamente." -ForegroundColor Green
        Write-Host "Ahora puedes iniciar el servidor (Opción 2) o construir/desplegar (Opciones 3/4)."
    }
    '2' {
        Write-Host "Opcion 2: Iniciando servidor de desarrollo en http://localhost:3000 ..." -ForegroundColor Cyan
        npx vite --port 3000
    }
    '3' {
        Write-Host "Opcion 3: Construyendo el proyecto para producción..." -ForegroundColor Cyan
        npm run build
        Write-Host "
¡ÉXITO! Proyecto construido en la carpeta 'dist'." -ForegroundColor Green
    }
    '4' {
        Write-Host "Opcion 4: Iniciando despliegue a Netlify..." -ForegroundColor Cyan

        # Asegurarse de que el proyecto esté construido
        Write-Host "Asegurando que el proyecto esté construido..."
        npm run build

        # Desplegar usando Netlify CLI
        Write-Host "Desplegando a Netlify (se podrian requerir pasos de autenticacion)..."
        npx netlify deploy --prod --dir=dist

        Write-Host "
¡ÉXITO! El despliegue a Netlify ha sido enviado." -ForegroundColor Green
    }
    '5' {
        Write-Host "Opcion 5: Generando Scripts SQL de Supabase..." -ForegroundColor Cyan
        $sqlContent = @"
-- Script SQL Consolidado para Supabase - Proyecto MAIS
-- Ejecuta este script completo en el SQL Editor de tu panel de control de Supabase.

-- Desactivar la verificación de claves foráneas temporalmente para evitar problemas de orden
SET session_replication_role = 'replica';

-- Eliminar tablas existentes si ya las tienes y quieres empezar de cero (opcional, descomentar si es necesario)
-- DROP TABLE IF EXISTS public.messages CASCADE;
-- DROP TABLE IF EXISTS public.databases CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;
-- DROP TABLE IF EXISTS public.campaign_finances CASCADE;

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

-- Políticas de RLS para profiles
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
  read_by uuid[], -- Array de IDs de usuarios que han leído el mensaje
  timestamp timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para messages
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
  url text, -- URL pública del archivo en Supabase Storage
  metadata jsonb -- Para almacenar metadatos adicionales como tamaño, tipo MIME
);

-- Habilitar RLS para databases
ALTER TABLE public.databases ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para databases
DROP POLICY IF EXISTS "Authenticated users can view database entries." ON public.databases;
CREATE POLICY "Authenticated users can view database entries."
  ON public.databases FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert their own database entries." ON public.databases;
CREATE POLICY "Authenticated users can insert their own database entries."
  ON public.databases FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- NUEVA TABLA: campaign_finances (Cuentas Claras)
CREATE TABLE IF NOT EXISTS public.campaign_finances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE, -- Quién registró el movimiento
  type text NOT NULL, -- 'income' o 'expense'
  category text, -- Ej: 'donacion', 'publicidad', 'transporte'
  description text,
  amount numeric NOT NULL,
  transaction_date date NOT NULL,
  document_url text, -- URL a un documento de soporte en Supabase Storage
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para campaign_finances
ALTER TABLE public.campaign_finances ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para campaign_finances
-- Permitir a los usuarios autenticados ver sus propios movimientos financieros
DROP POLICY IF EXISTS "Users can view their own campaign finances." ON public.campaign_finances;
CREATE POLICY "Users can view their own campaign finances."
  ON public.campaign_finances FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir a los usuarios autenticados insertar sus propios movimientos financieros
DROP POLICY IF EXISTS "Users can insert their own campaign finances." ON public.campaign_finances;
CREATE POLICY "Users can insert their own campaign finances."
  ON public.campaign_finances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir a los usuarios autenticados actualizar sus propios movimientos financieros
DROP POLICY IF EXISTS "Users can update their own campaign finances." ON public.campaign_finances;
CREATE POLICY "Users can update their own campaign finances."
  ON public.campaign_finances FOR UPDATE
  USING (auth.uid() = user_id);

-- Reactivar la verificación de claves foráneas
SET session_replication_role = 'origin';

-- Políticas de Storage para el bucket 'files'
-- Asegúrate de que el bucket 'files' exista en Supabase Storage.
-- Si no existe, créalo manualmente en el panel de control de Supabase.
-- Luego, puedes ejecutar estas políticas.

-- Permitir a los usuarios autenticados subir archivos
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'files');

-- Permitir a los usuarios autenticados ver sus propios archivos (o todos si es público)
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
"@
        Set-Content -Path "./supabase_schema.sql" -Value $sqlContent -Encoding UTF8
        Write-Host "
¡ÉXITO! Scripts SQL de Supabase generados en 'supabase_schema.sql'." -ForegroundColor Green
        Write-Host "Copia el contenido de este archivo y ejecútalo en el SQL Editor de tu panel de control de Supabase."
    }
    '6' {
        Write-Host "Saliendo del script."
    }
    default {
        Write-Host "Opcion no valida. Por favor, ejecuta el script de nuevo y elige una opcion del 1 al 6." -ForegroundColor Red
    }
}