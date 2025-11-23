#!/bin/bash

# Script simplificado para MAIS + Ollama
echo "🚀 Configuración Simplificada MAIS + Ollama..."

# Crear directorios básicos
mkdir -p logs data/ollama data/postgres data/redis
chmod 755 logs data/*

echo "📦 Instalando Ollama directamente en el sistema..."

# Instalar Ollama directamente (sin Docker inicialmente)
if ! command -v ollama &> /dev/null; then
    echo "📥 Descargando e instalando Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
else
    echo "✅ Ollama ya está instalado"
fi

# Verificar instalación
if command -v ollama &> /dev/null; then
    echo "✅ Ollama instalado correctamente"
    
    # Iniciar servicio Ollama en segundo plano
    echo "🚀 Iniciando servicio Ollama..."
    ollama serve &
    OLLAMA_PID=$!
    
    # Esperar que esté listo
    sleep 10
    
    # Descargar modelo optimizado para tu RAM
    echo "📦 Descargando modelo CodeLlama 7B..."
    ollama pull codellama:7b-instruct
    
    # Modelo de respaldo más pequeño
    echo "📦 Descargando modelo de respaldo Phi3..."
    ollama pull phi3:mini
    
    # Verificar modelos
    echo "✅ Modelos disponibles:"
    ollama list
    
    # Detener servicio temporal
    kill $OLLAMA_PID 2>/dev/null || true
    
else
    echo "❌ Error instalando Ollama"
    exit 1
fi

echo "🏗️ Configurando base de datos PostgreSQL..."

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "📥 Instalando PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# Configurar usuario y base de datos
sudo -u postgres psql -c "CREATE USER mais_user WITH PASSWORD 'mais_secure_2025!';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE mais_local OWNER mais_user;" 2>/dev/null || true

echo "🔧 Configurando Redis..."

# Instalar Redis si no está presente
if ! command -v redis-server &> /dev/null; then
    echo "📥 Instalando Redis..."
    sudo apt install -y redis-server
fi

# Configurar Redis con contraseña
sudo tee /etc/redis/redis.conf > /dev/null << EOF
bind 127.0.0.1
port 6379
requirepass mais_redis_2025!
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF

# Reiniciar Redis
sudo systemctl restart redis

echo "📝 Creando configuración de API Gateway..."

# Crear package.json simplificado
cat > package.json << 'EOF'
{
  "name": "mais-api-simple",
  "version": "1.0.0",
  "main": "server-simple.js",
  "scripts": {
    "start": "node server-simple.js",
    "dev": "nodemon server-simple.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.2",
    "cors": "^2.8.5"
  }
}
EOF

# Crear servidor API simplificado
cat > server-simple.js << 'EOF'
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Ollama endpoint
app.post('/api/ollama/generate', async (req, res) => {
  try {
    const { prompt, model = 'codellama:7b-instruct' } = req.body;
    
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt,
      stream: false
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
EOF

echo "📦 Instalando dependencias Node.js..."
npm install

echo "🎯 Configurando servicios del sistema..."

# Crear servicio systemd para Ollama
sudo tee /etc/systemd/system/ollama.service > /dev/null << EOF
[Unit]
Description=Ollama Server
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=$USER
Group=$USER
Restart=always
RestartSec=3
Environment=OLLAMA_HOST=127.0.0.1

[Install]
WantedBy=default.target
EOF

# Crear servicio systemd para API Gateway
sudo tee /etc/systemd/system/mais-api.service > /dev/null << EOF
[Unit]
Description=MAIS API Gateway
After=network.target ollama.service
Requires=ollama.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node server-simple.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Habilitar servicios
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl enable mais-api

echo "🚀 Iniciando servicios..."

# Iniciar servicios
sudo systemctl start ollama
sleep 5
sudo systemctl start mais-api

echo "✅ Verificando estado de servicios..."

# Verificar estado
sudo systemctl status ollama --no-pager -l
sudo systemctl status mais-api --no-pager -l

echo "🧪 Probando configuración..."

# Test básico
sleep 3
curl -s http://localhost:3001/health | jq '.' 2>/dev/null || echo "API Gateway iniciando..."

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "🔧 Comandos útiles:"
echo "  sudo systemctl status ollama     # Estado Ollama"
echo "  sudo systemctl status mais-api   # Estado API"
echo "  curl localhost:3001/health       # Test API"
echo "  ollama list                      # Ver modelos"
echo ""
echo "🌐 Para conectar desde frontend:"
echo "  API_BASE_URL = 'http://localhost:3001/api'"
echo ""
echo "⚠️ SIGUIENTE PASO:"
echo "  Configurar Cloudflare Tunnel para acceso público"
EOF

chmod +x /home/sademarquez/mais/MAIS-main/deployment/scripts/setup-simple.sh