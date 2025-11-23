#!/bin/bash

# Script para instalar Cloudflared en Ubuntu/WSL
echo "🌐 Instalador Cloudflared para MAIS"
echo "=================================="

# Verificar si ya está instalado
if command -v cloudflared &> /dev/null; then
    echo "✅ Cloudflared ya está instalado"
    cloudflared --version
    exit 0
fi

echo "📦 Opciones de instalación:"
echo "1. Snap (Recomendado - más rápido)"
echo "2. Binario directo desde GitHub"
echo "3. Repositorio Cloudflare oficial"

read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo "📥 Instalando via Snap..."
        sudo snap install cloudflared
        ;;
    2)
        echo "📥 Descargando binario directo..."
        cd /tmp
        wget -O cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
        chmod +x cloudflared
        sudo mv cloudflared /usr/local/bin/
        ;;
    3)
        echo "📥 Instalando desde repositorio oficial..."
        # Añadir clave GPG
        curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
        
        # Añadir repositorio
        echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
        
        # Instalar
        sudo apt update && sudo apt install cloudflared
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

# Verificar instalación
if command -v cloudflared &> /dev/null; then
    echo "✅ Cloudflared instalado correctamente"
    cloudflared --version
    
    echo ""
    echo "🎯 Siguientes pasos:"
    echo "1. cloudflared tunnel login"
    echo "2. ./setup-tunnel-mais.sh"
    echo ""
else
    echo "❌ Error en la instalación"
    exit 1
fi