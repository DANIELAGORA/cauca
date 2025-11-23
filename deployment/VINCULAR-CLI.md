# 🌐 VINCULAR MAIS CON CLOUDFLARE VIA CLI

## ⚡ COMANDOS RÁPIDOS

### **1. Instalar Cloudflared**
```bash
# Ejecutar script automatizado
./scripts/install-cloudflared.sh

# O manualmente con snap (más rápido)
sudo snap install cloudflared
```

### **2. Configurar Túnel Automáticamente**
```bash
# Script completo automatizado
./scripts/setup-tunnel-mais.sh

# Te pedirá:
# - Tu dominio (ej: tudominio.com)  
# - Subdominio (ej: api-mais)
# - Autenticación Cloudflare (abre navegador)
```

### **3. Comandos Manuales (Alternativos)**
```bash
# Autenticar con Cloudflare
cloudflared tunnel login

# Crear túnel
cloudflared tunnel create mais-api

# Configurar DNS
cloudflared tunnel route dns mais-api api-mais.tudominio.com

# Iniciar túnel
cloudflared tunnel run mais-api
```

---

## 🧪 VERIFICACIÓN COMPLETA

### **Estado Local**
```bash
# 1. Verificar API Gateway local
curl http://localhost:3001/health

# 2. Verificar Ollama funcionando  
ollama list

# 3. Test respuesta AI local
curl -X POST localhost:3001/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "¿Qué es MAIS?"}'
```

### **Estado Público (Después del túnel)**
```bash
# 1. Health check público
curl https://api-mais.tudominio.com/health

# 2. Test AI público
curl -X POST https://api-mais.tudominio.com/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explica la estructura territorial de MAIS"}'

# 3. Ver modelos disponibles
curl https://api-mais.tudominio.com/api/ollama/models
```

---

## 📊 ESTADO ACTUAL ANTES DE TÚNEL

```
✅ Ollama instalado y ejecutándose
✅ API Gateway funcionando (puerto 3001)
✅ Respuestas simuladas operativas  
✅ Scripts de configuración listos
✅ Documentación completa

❌ Sin acceso público (solo localhost)
```

---

## 🎯 RESULTADO ESPERADO DESPUÉS

```
✅ API accesible públicamente
✅ Frontend puede conectar via HTTPS
✅ Respuestas AI disponibles globalmente
✅ Sistema escalable y seguro
✅ Túnel Cloudflare activo 24/7
```

---

## 🚀 INTEGRACIÓN CON FRONTEND MAIS

### **Actualizar API Base URL**
```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-mais.tudominio.com/api'  // ← Nueva URL pública
  : 'http://localhost:3001/api';
```

### **Crear Servicio AI**
```typescript
// src/services/aiService.ts
export async function queryMAISAI(prompt: string) {
  const response = await fetch(`${API_BASE_URL}/ollama/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  return response.json();
}
```

### **Componente Chat AI**
```tsx
// src/components/ai/MAISChat.tsx
import { queryMAISAI } from '@/services/aiService';

export function MAISChat() {
  const [response, setResponse] = useState('');
  
  const handleQuery = async (prompt: string) => {
    const result = await queryMAISAI(prompt);
    setResponse(result.response);
  };
  
  return (
    <div className="mais-ai-chat">
      {/* Interfaz de chat con MAIS AI */}
    </div>
  );
}
```

---

## 🔧 COMANDOS DE MANTENIMIENTO

### **Verificar Estado**
```bash
# Ver túneles activos
cloudflared tunnel list

# Ver logs del túnel
cloudflared tunnel run mais-api --log-level debug

# Estado del API Gateway
ps aux | grep "node server-simple"
```

### **Reiniciar Servicios**
```bash
# Reiniciar API Gateway
pkill -f "node server-simple"; node server-simple.js &

# Reiniciar túnel
cloudflared tunnel run mais-api &

# Verificar todo funcionando
curl localhost:3001/health && curl https://api-mais.tudominio.com/health
```

---

## 📞 INSTRUCCIONES DE EJECUCIÓN

### **Paso a Paso:**

1. **Instalar Cloudflared:**
   ```bash
   cd /home/sademarquez/mais/MAIS-main/deployment
   ./scripts/install-cloudflared.sh
   ```

2. **Configurar Túnel:**
   ```bash
   ./scripts/setup-tunnel-mais.sh
   ```

3. **Verificar Local:**
   ```bash
   curl localhost:3001/health
   ```

4. **Iniciar Túnel:**
   ```bash
   cloudflared tunnel run mais-api
   ```

5. **Verificar Público:**
   ```bash
   curl https://api-mais.tudominio.com/health
   ```

---

**🎯 Una vez completado, el sistema MAIS estará accesible públicamente para los 96+ usuarios políticos del Cauca con respuestas AI especializadas sobre estructura territorial, procesos electorales e información del movimiento.**