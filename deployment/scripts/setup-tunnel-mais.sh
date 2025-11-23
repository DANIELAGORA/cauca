#!/bin/bash

# Script automatizado para configurar túnel Cloudflare para MAIS
echo "🚀 Configurador Automático de Túnel MAIS"
echo "========================================"

# Verificar prerrequisitos
if ! command -v cloudflared &> /dev/null; then
    echo "❌ Cloudflared no está instalado"
    echo "Ejecuta primero: ./install-cloudflared.sh"
    exit 1
fi

if ! curl -s http://localhost:3001/health >/dev/null; then
    echo "❌ API Gateway no está ejecutándose"
    echo "Ejecuta: node server-simple.js &"
    exit 1
fi

echo "✅ Prerrequisitos verificados"

# Solicitar información del usuario
echo ""
echo "📋 Configuración del túnel:"
read -p "Ingresa tu dominio (ej: tudominio.com): " DOMAIN
read -p "Ingresa el subdominio (ej: api-mais): " SUBDOMAIN

if [[ -z "$DOMAIN" || -z "$SUBDOMAIN" ]]; then
    echo "❌ Dominio y subdominio son requeridos"
    exit 1
fi

TUNNEL_NAME="mais-api-$(date +%s)"
FULL_DOMAIN="$SUBDOMAIN.$DOMAIN"

echo ""
echo "🎯 Configuración:"
echo "  Túnel: $TUNNEL_NAME"
echo "  Dominio: $FULL_DOMAIN"
echo "  Servicio local: http://localhost:3001"

read -p "¿Continuar? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ Cancelado por el usuario"
    exit 1
fi

# Autenticación (si no está hecha)
echo ""
echo "🔐 Verificando autenticación..."
if [[ ! -f ~/.cloudflared/cert.pem ]]; then
    echo "🌐 Necesitas autenticarte con Cloudflare..."
    echo "Se abrirá el navegador. Selecciona tu zona DNS ($DOMAIN)"
    read -p "Presiona Enter para continuar..."
    
    cloudflared tunnel login
    
    if [[ ! -f ~/.cloudflared/cert.pem ]]; then
        echo "❌ Autenticación fallida"
        exit 1
    fi
fi

echo "✅ Autenticación verificada"

# Crear túnel
echo ""
echo "📡 Creando túnel $TUNNEL_NAME..."
TUNNEL_ID=$(cloudflared tunnel create $TUNNEL_NAME 2>&1 | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')

if [[ -z "$TUNNEL_ID" ]]; then
    echo "❌ Error creando el túnel"
    echo "Verifica que el dominio $DOMAIN esté en tu cuenta Cloudflare"
    exit 1
fi

echo "✅ Túnel creado: $TUNNEL_ID"

# Configurar DNS
echo ""
echo "🌍 Configurando DNS para $FULL_DOMAIN..."
if cloudflared tunnel route dns $TUNNEL_NAME $FULL_DOMAIN; then
    echo "✅ DNS configurado correctamente"
else
    echo "⚠️ Error configurando DNS (puede que ya exista)"
fi

# Crear archivo de configuración
echo ""
echo "⚙️ Creando archivo de configuración..."
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: ~/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $FULL_DOMAIN
    service: http://localhost:3001
  - service: http_status:404

# Configuración de logs
no-autoupdate: true
EOF

echo "✅ Configuración creada en ~/.cloudflared/config.yml"

# Crear script de inicio
cat > ~/.cloudflared/start-tunnel.sh << EOF
#!/bin/bash
echo "🚀 Iniciando túnel MAIS..."
cloudflared tunnel run $TUNNEL_NAME
EOF

chmod +x ~/.cloudflared/start-tunnel.sh

# Crear servicio systemd (si tiene permisos)
echo ""
echo "🔧 Configurando servicio del sistema..."
if sudo -n true 2>/dev/null; then
    sudo tee /etc/systemd/system/cloudflared-mais.service > /dev/null << EOF
[Unit]
Description=Cloudflare Tunnel for MAIS
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME
ExecStart=/usr/local/bin/cloudflared tunnel run $TUNNEL_NAME
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable cloudflared-mais
    echo "✅ Servicio configurado"
else
    echo "⚠️ Sin permisos sudo - usar script manual"
fi

# Guardar información del túnel
cat > ~/.cloudflared/tunnel-info.txt << EOF
# Información del Túnel MAIS
TUNNEL_NAME=$TUNNEL_NAME
TUNNEL_ID=$TUNNEL_ID
DOMAIN=$FULL_DOMAIN
CREATED=$(date)

# Comandos útiles:
# Iniciar túnel: cloudflared tunnel run $TUNNEL_NAME
# Ver logs: cloudflared tunnel run $TUNNEL_NAME --log-level debug
# Listar túneles: cloudflared tunnel list
# Estado: curl https://$FULL_DOMAIN/health

# Integración Frontend:
# API_BASE_URL = 'https://$FULL_DOMAIN/api'
EOF

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Información del túnel:"
echo "  Nombre: $TUNNEL_NAME"
echo "  ID: $TUNNEL_ID"
echo "  URL: https://$FULL_DOMAIN"
echo ""
echo "🚀 Para iniciar el túnel:"
echo "  cloudflared tunnel run $TUNNEL_NAME"
echo ""
echo "🧪 Para probar:"
echo "  curl https://$FULL_DOMAIN/health"
echo ""
echo "📁 Archivos creados:"
echo "  ~/.cloudflared/config.yml"
echo "  ~/.cloudflared/tunnel-info.txt"
echo "  ~/.cloudflared/start-tunnel.sh"

read -p "¿Iniciar el túnel ahora? (y/N): " start_now
if [[ $start_now == [yY] ]]; then
    echo ""
    echo "🚀 Iniciando túnel..."
    echo "⚠️ Presiona Ctrl+C para detener"
    cloudflared tunnel run $TUNNEL_NAME
fi