# 🚀 MAIS - Guía de Despliegue Híbrido

## 📋 Resumen Ejecutivo

**Arquitectura**: Frontend en Cloudflare Pages + Backend Local con Ollama Code  
**Recursos Optimizados**: 5GB RAM total del sistema  
**Modelo AI**: CodeLlama 7B (2.5GB RAM optimizado)  
**Base de Datos**: PostgreSQL local + cache Redis  

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Usuario Web   │───▶│ Cloudflare Pages │───▶│   PC Servidor   │
│                 │    │     (Frontend)   │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                 │                       │
                                 ▼                       ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Cloudflare Tunnel│    │  Ollama Code    │
                       │   (Seguridad)    │    │ CodeLlama 7B    │
                       └──────────────────┘    └─────────────────┘
```

---

## ⚙️ Configuración de Recursos

### **Distribución RAM (5.7GB Total)**
| Servicio | RAM Asignada | Descripción |
|----------|-------------|-------------|
| Sistema WSL | 1.0GB | Sistema operativo base |
| Ollama Code | 2.5GB | Modelo CodeLlama 7B |
| PostgreSQL | 512MB | Base de datos local |
| Redis Cache | 256MB | Cache de respuestas AI |
| API Gateway | 512MB | Servidor Node.js |
| Docker | 256MB | Overhead contenedores |
| **Buffer** | 0.7GB | Margen de seguridad |

### **Especificaciones del PC**
- **CPU**: Intel i3-1005G1 (2 cores, 4 threads)
- **RAM**: 5.7GB disponibles
- **Storage**: 925GB libres
- **GPU**: Integrada (sin aceleración CUDA)

---

## 🚀 Proceso de Despliegue

### **Paso 1: Preparación del Entorno**

```bash
# Verificar Docker
docker --version
docker-compose --version

# Clonar configuración (si no está hecho)
cd /home/sademarquez/mais/MAIS-main/deployment

# Ejecutar script de configuración
./scripts/setup-ollama.sh
```

### **Paso 2: Configurar Cloudflare Tunnel**

1. **Crear Túnel en Cloudflare**:
   - Ve a https://one.dash.cloudflare.com/
   - Navigate: Access > Tunnels > Create Tunnel
   - Nombre: `mais-cauca-local`
   - Copiar token generado

2. **Configurar Variables**:
   ```bash
   # Editar archivo de configuración
   nano .env.local
   
   # Actualizar:
   CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoi...tu_token_aqui
   ```

3. **Configurar Subdomain**:
   - Public hostname: `api-mais.tudominio.com`
   - Service: `http://localhost:3001`

### **Paso 3: Iniciar Servicios**

```bash
# Iniciar todos los servicios
docker-compose -f docker-compose.hybrid.yml up -d

# Verificar estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f api-gateway
```

### **Paso 4: Verificar Funcionamiento**

```bash
# Health check local
curl http://localhost:3001/health

# Test Ollama
curl -X POST http://localhost:3001/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explica qué es MAIS en 50 palabras"}'

# Test público (una vez configurado Cloudflare)
curl https://api-mais.tudominio.com/health
```

---

## 🔧 Configuración Frontend

### **Modificaciones en el Código MAIS**

1. **Actualizar API Base URL**:
   ```typescript
   // src/lib/api.ts
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://api-mais.tudominio.com/api'
     : 'http://localhost:3001/api';
   ```

2. **Integrar Ollama Code**:
   ```typescript
   // src/services/aiService.ts
   export async function queryLocalAI(prompt: string, context?: string) {
     const response = await fetch(`${API_BASE_URL}/ollama/generate`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ prompt, context })
     });
     return response.json();
   }
   ```

3. **Deploy a Cloudflare Pages**:
   ```bash
   # Desde la raíz del proyecto
   npm run build
   
   # Subir dist/ a Cloudflare Pages
   # O conectar repositorio GitHub
   ```

---

## 📊 Monitoreo y Mantenimiento

### **Scripts de Monitoreo**

```bash
# Monitoreo continuo de recursos
./scripts/monitor-resources.sh

# Verificar logs de API
docker-compose logs api-gateway | tail -f

# Estado de Ollama
curl http://localhost:11434/api/tags

# Métricas de base de datos
docker exec -it deployment_postgres_1 psql -U mais_user -d mais_local -c "
  SELECT COUNT(*) as total_conversations, 
         AVG(response_time_ms) as avg_response_time 
  FROM ai_conversations 
  WHERE created_at > NOW() - INTERVAL '24 hours';"
```

### **Mantenimiento Rutinario**

```bash
# Limpiar caché Redis (semanal)
docker exec deployment_redis_1 redis-cli FLUSHALL

# Backup base de datos (diario)
docker exec deployment_postgres_1 pg_dump -U mais_user mais_local > backup_$(date +%Y%m%d).sql

# Actualizar modelos Ollama (mensual)
docker exec deployment_ollama_1 ollama pull codellama:7b-instruct
```

---

## 🔄 Estrategia de Escalado

### **Escalado Vertical (Mismo PC)**

**Cuando RAM > 8GB:**
```yaml
# docker-compose.hybrid.yml
ollama:
  mem_limit: 4g  # Aumentar a 4GB
  environment:
    - OLLAMA_MODEL=codellama:13b-instruct  # Modelo más grande
```

**Cuando RAM > 16GB:**
```yaml
ollama:
  mem_limit: 8g
  environment:
    - OLLAMA_MODEL=codellama:34b-instruct  # Modelo profesional
```

### **Escalado Horizontal (Multi-PC)**

**PC Adicional como Worker:**
```yaml
# docker-compose.worker.yml
services:
  ollama-worker:
    image: ollama/ollama:latest
    mem_limit: 6g
    environment:
      - OLLAMA_MODEL=codellama:34b-instruct
    
  load-balancer:
    image: nginx:alpine
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
```

### **Escalado Cloud (GPU Remoto)**

**Para modelos 70B+:**
```typescript
// Fallback a cloud para modelos grandes
if (complexQuery || modelSize > '13b') {
  return await queryCloudGPU(prompt);
} else {
  return await queryLocalOllama(prompt);
}
```

**Proveedores Recomendados:**
- **RunPod**: $0.79/hora (RTX 4090)
- **Lambda Labs**: $0.50/hora (A10G)
- **Vast.ai**: $0.20/hora (RTX 3090)

---

## 🔐 Seguridad y Performance

### **Configuración de Seguridad**

1. **Cloudflare WAF Rules**:
   ```
   Rule 1: Block SQLi attempts
   Expression: http.request.body contains "' OR 1=1"
   Action: Block
   
   Rule 2: Rate limiting AI endpoints
   Expression: http.request.uri.path contains "/api/ollama"
   Action: Challenge after 10 requests/minute
   ```

2. **Local Firewall**:
   ```bash
   # Solo permitir conexiones de Cloudflare
   ufw allow from 173.245.48.0/20
   ufw allow from 103.21.244.0/22
   ufw allow from 103.22.200.0/22
   ufw deny 3001  # Bloquear acceso directo externo
   ```

### **Optimizaciones de Performance**

1. **Cache Strategy**:
   ```javascript
   // 5 minutos para respuestas AI
   redis.setEx(cacheKey, 300, response);
   
   // 1 hora para consultas DB
   redis.setEx(dbCacheKey, 3600, dbResult);
   ```

2. **Model Loading Optimization**:
   ```bash
   # Pre-cargar modelo en memoria
   curl -X POST http://localhost:11434/api/generate \
     -d '{"model": "codellama:7b-instruct", "prompt": "warm up", "keep_alive": -1}'
   ```

---

## 📈 Métricas de Éxito

### **KPIs Operacionales**
- **Tiempo de respuesta AI**: < 5 segundos (promedio)
- **Uptime del sistema**: > 99%
- **Uso de RAM**: < 90% del total
- **Cache hit ratio**: > 70%

### **KPIs de Negocio**
- **Consultas AI diarias**: Meta 500+
- **Usuarios concurrentes**: Soporte 50+
- **Disponibilidad 24/7**: Sin interrupciones
- **Escalabilidad**: Lista para 5 municipios adicionales

---

## 🚨 Troubleshooting

### **Problemas Comunes**

**1. Ollama no responde**:
```bash
# Reiniciar servicio
docker-compose restart ollama

# Verificar logs
docker-compose logs ollama

# Re-descargar modelo
docker exec deployment_ollama_1 ollama pull codellama:7b-instruct
```

**2. RAM insuficiente**:
```bash
# Verificar uso actual
free -h

# Limpiar cache sistema
sudo sync && echo 3 | sudo tee /proc/sys/vm/drop_caches

# Reducir workers Docker
docker-compose down && docker-compose up -d --scale api-gateway=1
```

**3. Cloudflare tunnel desconectado**:
```bash
# Verificar token
docker-compose logs cloudflared

# Regenerar tunnel en dashboard Cloudflare
# Actualizar token en .env.local
```

---

## 📞 Soporte y Contacto

**Sistema desarrollado para**: MAIS Cauca  
**Responsable Técnico**: Sistema AI Híbrido  
**Última actualización**: $(date)  

**Para soporte técnico**:
- Verificar logs: `docker-compose logs`
- Health check: `curl localhost:3001/health`
- Monitoreo: `./scripts/monitor-resources.sh`

---

**✅ Sistema listo para producción con 96+ usuarios políticos reales del departamento del Cauca**