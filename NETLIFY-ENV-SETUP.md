# 🔧 CONFIGURAR VARIABLES DE ENTORNO EN NETLIFY

## 🚨 **PROBLEMA DETECTADO:**
```
VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configuradas
VITE_GEMINI_API_KEY no encontrada
```

## ✅ **SOLUCIÓN - PASOS EXACTOS:**

### **1. Ir al Panel de Netlify:**
- Abre: https://app.netlify.com/
- Selecciona tu sitio (MAIS)
- Ve a: **Site settings** → **Environment variables**

### **2. Añadir las 3 Variables:**

**Variable 1:**
```
Key: VITE_GEMINI_API_KEY
Value: AIzaSyD-0p2Hoyc8OV1hIXx9AyFqfnu2jgqCYew
```

**Variable 2:**
```
Key: VITE_SUPABASE_URL  
Value: https://uqewroegfejrkjapbvhn.supabase.co
```

**Variable 3:**
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZXdyb2VnZmVqcmtqYXBidmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MjcwODUsImV4cCI6MjA2OTQwMzA4NX0.amCi9JTwu8-uorueTrqBs_Z8Jj4_xRt_rQbtgNQbX1Y
```

### **3. Opciones en Netlify:**
- **All scopes** ✅ (para que funcionen en build y runtime)
- **Save** 

### **4. Re-desplegar:**
- Ve a: **Deploys** → **Trigger deploy** → **Deploy site**
- O simplemente haz otro push a GitHub

## 🎯 **VERIFICACIÓN POST-CONFIGURACIÓN:**

Una vez configuradas las variables y re-desplegado:

### **✅ Debería funcionar:**
- Login/Register con Supabase
- Generación de contenido con IA
- Mensajería en tiempo real
- Upload de archivos
- Todas las funcionalidades

### **❌ Si aún falla:**
- Verifica que las variables estén en "All scopes"
- Confirma que los valores no tengan espacios extra
- Re-despliega manualmente

## 🔒 **SEGURIDAD:**
Las variables están configuradas de forma segura en Netlify y no se exponen en el código fuente.