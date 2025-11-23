# 🌐 CONFIGURACIÓN MANUAL CLOUDFLARE TUNNEL

## 📋 PASOS PARA VINCULAR VIA CLI

### **1. Instalar Cloudflared (Método Rápido)**

```bash
# Opción A: Descarga directa del binario
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared

# Opción B: Instalar vía snap (más rápido)
sudo snap install cloudflared

# Verificar instalación
cloudflared --version
```

### **2. Autenticación con Cloudflare**

```bash
# Autenticar con tu cuenta Cloudflare
cloudflared tunnel login

# Esto abrirá el navegador para autorizar
# Selecciona tu dominio/zona DNS
```

### **3. Crear Túnel desde CLI**

```bash
# Crear túnel llamado 'mais-api'
cloudflared tunnel create mais-api

# Listar túneles creados
cloudflared tunnel list

# El comando anterior mostrará algo como:
# ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# NAME: mais-api
```

### **4. Configurar DNS**

```bash
# Crear registro DNS (reemplaza tu-dominio.com)
cloudflared tunnel route dns mais-api api-mais.tu-dominio.com

# Verificar configuración DNS
cloudflared tunnel route dns mais-api
```

### **5. Crear Archivo de Configuración**

```bash
# Crear directorio de configuración
mkdir -p ~/.cloudflared

# Crear archivo de configuración
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: mais-api
credentials-file: ~/.cloudflared/mais-api.json

ingress:
  - hostname: api-mais.tu-dominio.com
    service: http://localhost:3001
  - hostname: "*.tu-dominio.com"  
    service: http://localhost:3001
  - service: http_status:404

EOF
```

### **6. Iniciar Túnel**

```bash
# Ejecutar túnel en primer plano (para testing)
cloudflared tunnel run mais-api

# Ejecutar en segundo plano
cloudflared tunnel run mais-api &

# Instalar como servicio del sistema
sudo cloudflared service install
```

---

## 🔧 CONFIGURACIÓN AUTOMÁTICA PARA MAIS

### **Script de Configuración Rápida**

```bash
#!/bin/bash
# Archivo: setup-cloudflare-tunnel.sh

echo "🌐 Configurando Cloudflare Tunnel para MAIS..."

# Variables (PERSONALIZAR AQUÍ)
DOMAIN="tu-dominio.com"
SUBDOMAIN="api-mais"
TUNNEL_NAME="mais-api"

# Verificar que API Gateway esté ejecutándose
if ! curl -s http://localhost:3001/health >/dev/null; then
    echo "❌ API Gateway no está ejecutándose en puerto 3001"
    echo "Ejecuta: node server-simple.js &"
    exit 1
fi

# Crear túnel
echo "📡 Creando túnel $TUNNEL_NAME..."
cloudflared tunnel create $TUNNEL_NAME

# Configurar DNS
echo "🌍 Configurando DNS para $SUBDOMAIN.$DOMAIN..."
cloudflared tunnel route dns $TUNNEL_NAME $SUBDOMAIN.$DOMAIN

# Crear configuración
echo "⚙️ Creando archivo de configuración..."
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_NAME
credentials-file: ~/.cloudflared/$TUNNEL_NAME.json

ingress:
  - hostname: $SUBDOMAIN.$DOMAIN
    service: http://localhost:3001
  - hostname: "*.$DOMAIN"
    service: http://localhost:3001
  - service: http_status:404
EOF

echo "🚀 Iniciando túnel..."
cloudflared tunnel run $TUNNEL_NAME

echo "✅ Túnel configurado!"
echo "🌐 API disponible en: https://$SUBDOMAIN.$DOMAIN"
echo "🧪 Test: curl https://$SUBDOMAIN.$DOMAIN/health"
```

---

## 🧪 PRUEBAS DE CONECTIVIDAD

### **Verificar Estado del Túnel**

```bash
# Ver túneles activos
cloudflared tunnel list

# Ver estado del túnel específico
cloudflared tunnel info mais-api

# Ver logs en tiempo real
cloudflared tunnel run mais-api --log-level debug
```

### **Probar Endpoints Públicos**

```bash
# Health check público
curl https://api-mais.tu-dominio.com/health

# Test generación AI
curl -X POST https://api-mais.tu-dominio.com/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "¿Qué es MAIS?"}'

# Ver modelos disponibles
curl https://api-mais.tu-dominio.com/api/ollama/models
```

---

## 🔐 CONFIGURACIÓN DE SEGURIDAD

### **Access Policies (Opcional)**

```bash
# Crear política de acceso para proteger la API
cloudflared access policy create \
  --application-id <app-id> \
  --name "MAIS Team Only" \
  --include "email_domain:maiscauca.com"
```

### **Rate Limiting**

```yaml
# En config.yml añadir:
ingress:
  - hostname: api-mais.tu-dominio.com
    service: http://localhost:3001
    originRequest:
      connectTimeout: 30s
      tlsTimeout: 30s
      tcpKeepAlive: 30s
      noHappyEyeballs: false
      keepAliveTimeout: 90s
      httpHostHeader: localhost
```

---

## 📊 MONITOREO Y LOGS

### **Logs del Túnel**

```bash
# Ver logs en tiempo real
journalctl -f -u cloudflared

# Ver logs históricos
journalctl -u cloudflared --since "1 hour ago"

# Logs específicos del túnel
cloudflared tunnel run mais-api --log-level info
```

### **Métricas de Cloudflare**

```bash
# Ver estadísticas de tráfico
cloudflared tunnel metrics mais-api

# Dashboard en Cloudflare
# https://dash.cloudflare.com > Traffic > Analytics
```

---

## 🚨 TROUBLESHOOTING

### **Problemas Comunes**

```bash
# Error: tunnel not found
cloudflared tunnel list  # Verificar que existe

# Error: DNS not configured
cloudflared tunnel route dns mais-api api-mais.tu-dominio.com

# Error: service not reachable
curl localhost:3001/health  # Verificar API local

# Error: certificate issues
cloudflared tunnel login  # Re-autenticar
```

### **Reiniciar Servicios**

```bash
# Reiniciar túnel
sudo systemctl restart cloudflared

# Reiniciar API Gateway
node server-simple.js &

# Verificar estado completo
curl localhost:3001/health && echo "✅ Local OK"
curl https://api-mais.tu-dominio.com/health && echo "✅ Público OK"
```

---

## 🎯 RESULTADO ESPERADO

Después de completar estos pasos:

✅ **API Local**: `http://localhost:3001/health`  
✅ **API Pública**: `https://api-mais.tu-dominio.com/health`  
✅ **Túnel Activo**: `cloudflared tunnel list`  
✅ **DNS Configurado**: `nslookup api-mais.tu-dominio.com`  

### **Frontend Integration**

```typescript
// En src/lib/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-mais.tu-dominio.com/api'
  : 'http://localhost:3001/api';

// Test desde frontend
fetch(`${API_BASE_URL}/ollama/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: '¿Qué es MAIS?' })
});
```

---

**📝 IMPORTANTE**: Reemplaza `tu-dominio.com` con tu dominio real registrado en Cloudflare.