# 🚀 MAIS Political PWA - Guía de Despliegue Completa

## ✅ Estado Actual: LISTO PARA PRODUCCIÓN

Tu PWA está **completamente preparada** para despliegue en producción. Todos los sistemas han sido migrados de demo a **datos reales** con Supabase.

---

## 📋 Pasos para Desplegar en Menos de 1 Hora

### 1. 🗄️ Configurar Base de Datos Supabase (10 minutos)

**Tu proyecto Supabase:** https://supabase.com/dashboard/project/djgkjtqpzedxnqwqdcjx

1. **Ejecutar Schema SQL:**
   - Ve a **SQL Editor** → **New Query**
   - Copia y pega todo el contenido del archivo `supabase_schema.sql`
   - Haz clic en **Run** para crear las tablas

2. **Crear Bucket de Storage:**
   - Ve a **Storage** en el dashboard
   - Crear nuevo bucket llamado `files`
   - Configurar como **público** para acceso directo a archivos

### 2. 🤖 Obtener API Key de Google Gemini (5 minutos)

1. Ve a: https://makersuite.google.com/app/apikey
2. Crear nueva API key
3. Copiar la key (algo como: `AIzaSyBxxx...`)

### 3. 🌐 Desplegar en Netlify (15 minutos)

#### Opción A: Conectar Repositorio GitHub
1. **Subir código a GitHub:**
   ```bash
   # En tu terminal, ejecuta:
   git remote add origin https://github.com/tu-usuario/mais-political-pwa.git
   git branch -M main
   git push -u origin main
   ```

2. **Configurar en Netlify:**
   - Ve a: https://app.netlify.com/start
   - Conecta tu repositorio GitHub
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

#### Opción B: Deploy Directo (Drag & Drop)
1. Ve a: https://app.netlify.com/drop
2. Arrastra la carpeta `dist/` que ya está generada

### 4. ⚙️ Variables de Entorno en Netlify (5 minutos)

En tu site de Netlify, ve a **Site settings** → **Environment variables** y agrega:

```
VITE_SUPABASE_URL=https://djgkjtqpzedxnqwqdcjx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

### 5. 🎯 ¡Deploy y Listo! (5 minutos)

Netlify desplegará automáticamente y tendrás tu PWA live en una URL como:
`https://mais-political-pwa.netlify.app`

---

## 🎉 Características de Producción Incluidas

### ✅ **Sistema de Autenticación Real**
- Registro de usuarios con email/contraseña
- 7 roles diferentes con permisos específicos
- Sesiones persistentes con JWT

### ✅ **Base de Datos Supabase**
- PostgreSQL con Row Level Security
- Tablas: `profiles`, `messages`, `databases`
- Real-time subscriptions para updates instantáneos

### ✅ **Storage de Archivos**
- Subida de archivos a Supabase Storage
- URLs públicas para acceso directo
- Metadatos organizados por categorías

### ✅ **Sistema de Mensajería**
- Mensajes en tiempo real
- Diferentes tipos: directos, broadcast, jerárquicos
- Prioridades: baja, media, alta, urgente

### ✅ **PWA Optimizada**
- Service worker con caché inteligente
- Offline-first architecture
- Instalable en móviles y desktop
- Bundle size optimizado (< 1MB total)

### ✅ **AI Integration**
- Google Gemini para generación de contenido
- Análisis de sentimientos
- Sugerencias inteligentes
- Fallback graceful si no hay API key

### ✅ **7 Dashboards Personalizados**
1. **Comité Ejecutivo Nacional** - Control total del sistema
2. **Líder Regional** - Gestión multi-territorial  
3. **Comité Departamental** - Operaciones locales
4. **Candidato** - Gestión de campaña personal
5. **Influenciador Digital** - Herramientas de redes sociales
6. **Líder Comunitario** - Movilización local
7. **Votante/Simpatizante** - Participación ciudadana

### ✅ **Analytics en Tiempo Real**
- Métricas de participación basadas en datos reales
- Gráficos interactivos con Recharts
- Análisis territorial y de sentiment

### ✅ **Seguridad de Producción**
- Content Security Policy configurado
- Headers HSTS y anti-clickjacking  
- Sanitización de inputs
- API keys en variables de entorno únicamente

---

## 🔧 URLs de Configuración

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/djgkjtqpzedxnqwqdcjx | Gestión de base de datos |
| **Google AI Studio** | https://makersuite.google.com/app/apikey | Obtener API key Gemini |
| **Netlify Deploy** | https://app.netlify.com/start | Conectar y desplegar |
| **Netlify Drop** | https://app.netlify.com/drop | Deploy directo |

---

## 🛠️ Troubleshooting

### Si las tablas no se crean en Supabase:
```sql
-- Ejecuta esto manualmente si hay errores:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Luego ejecuta el resto del schema SQL
```

### Si el build falla:
```bash
# Limpiar y reconstruir:
rm -rf node_modules dist
npm install
npm run build
```

### Si la PWA no se instala:
Verifica que tengas HTTPS habilitado en Netlify (se activa automáticamente).

---

## 🎯 Resultado Final

Después de completar estos pasos tendrás:

✅ **PWA de producción funcionando con datos reales**  
✅ **URL pública accesible desde cualquier dispositivo**  
✅ **Sistema de autenticación completo**  
✅ **Base de datos PostgreSQL configurada**  
✅ **7 tipos de usuarios con dashboards únicos**  
✅ **Mensajería en tiempo real**  
✅ **AI integration para contenido inteligente**  
✅ **Analytics basados en datos reales**  
✅ **PWA instalable en móviles y desktop**  

**Tiempo total estimado: 40-50 minutos** ⚡

---

## 👨‍💻 Desarrollado por

**Daniel Lopez "DSimnivaciones" Wramba**  
Movimiento Alternativo Indígena y Social - MAIS

🤖 *Optimizado con Claude Code*