# 🆘 SOLUCIÓN URGENTE - VARIABLES DE ENTORNO NETLIFY

## 🚨 **PROBLEMA PERSISTENTE:**
Las variables de entorno NO están llegando al build de producción en Netlify.

## ✅ **SOLUCIÓN PASO A PASO:**

### **OPCIÓN 1: Panel Web de Netlify**
1. Ve a: https://app.netlify.com/
2. Encuentra tu sitio MAIS
3. Click en el sitio → **Site settings**
4. En el menú lateral: **Environment variables**
5. **Add a variable** (hacer 3 veces):

```
Variable 1:
Key: VITE_GEMINI_API_KEY
Value: AIzaSyD-0p2Hoyc8OV1hIXx9AyFqfnu2jgqCYew
Scopes: All scopes ✓

Variable 2:
Key: VITE_SUPABASE_URL
Value: https://uqewroegfejrkjapbvhn.supabase.co
Scopes: All scopes ✓

Variable 3:
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZXdyb2VnZmVqcmtqYXBidmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MjcwODUsImV4cCI6MjA2OTQwMzA4NX0.amCi9JTwu8-uorueTrqBs_Z8Jj4_xRt_rQbtgNQbX1Y
Scopes: All scopes ✓
```

6. **Save** cada variable
7. Ve a **Deploys** → **Trigger deploy** → **Deploy site**

### **OPCIÓN 2: Netlify CLI (Alternativa)**
```bash
# Si tienes Netlify CLI instalado
netlify env:set VITE_GEMINI_API_KEY "AIzaSyD-0p2Hoyc8OV1hIXx9AyFqfnu2jgqCYew"
netlify env:set VITE_SUPABASE_URL "https://uqewroegfejrkjapbvhn.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZXdyb2VnZmVqcmtqYXBidmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MjcwODUsImV4cCI6MjA2OTQwMzA4NX0.amCi9JTwu8-uorueTrqBs_Z8Jj4_xRt_rQbtgNQbX1Y"
```

## 🔍 **VERIFICACIÓN POST-CONFIGURACIÓN:**

### **En el Panel de Netlify:**
- Debería mostrar las 3 variables configuradas
- En **Deploys** → Ver el nuevo deploy iniciando

### **En la aplicación:**
- Los errores de console deberían desaparecer
- Login/register deberían funcionar
- IA debería generar contenido

## ⚠️ **PUNTOS IMPORTANTES:**

1. **"All scopes"** es crucial - permite que las variables funcionen tanto en build como en runtime
2. **Re-deploy manual** es necesario después de añadir variables
3. **Sin espacios** extra en los valores
4. **Prefijo VITE_** es requerido para que Vite las incluya en el build

## 🎯 **RESULTADO ESPERADO:**
Una vez configuradas correctamente, deberías ver:
- ✅ Sin errores en console
- ✅ Login funcional
- ✅ IA generando contenido
- ✅ Todas las funcionalidades operativas