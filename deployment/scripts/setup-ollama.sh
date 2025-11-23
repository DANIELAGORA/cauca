#!/bin/bash

# Script de configuración de Ollama Code para MAIS
# Optimizado para PC con 5GB RAM

set -e

echo "🚀 Configurando Ollama Code para MAIS..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Crear directorios
mkdir -p deployment/logs
mkdir -p deployment/data/ollama
mkdir -p deployment/data/postgres
mkdir -p deployment/data/redis

# Configurar permisos
chmod 755 deployment/logs
chmod 755 deployment/data/*

echo "📥 Descargando imagen Ollama (puede tardar unos minutos)..."

# Descargar imagen Ollama con timeout extendido
timeout 600s docker pull ollama/ollama:latest || {
    echo "⚠️ Descarga lenta, continuando en segundo plano..."
}

# Verificar que la imagen esté disponible
if docker images ollama/ollama:latest | grep -q ollama; then
    echo "✅ Imagen Ollama descargada correctamente"
    
    # Iniciar Ollama temporalmente para descargar modelos
    echo "🚀 Iniciando Ollama temporalmente..."
    docker run --rm -d --name ollama-temp \
      -v $(pwd)/data/ollama:/root/.ollama \
      -p 11434:11434 \
      ollama/ollama:latest

    # Esperar que Ollama esté listo (timeout más largo)
    echo "⏳ Esperando que Ollama esté listo..."
    sleep 15

    # Verificar que Ollama esté respondiendo
    for i in {1..10}; do
        if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
            echo "✅ Ollama está listo"
            break
        fi
        echo "⏳ Esperando Ollama... intento $i/10"
        sleep 5
    done

    # Descargar modelo Code Llama 7B (optimizado para 5GB RAM)
    echo "📦 Descargando CodeLlama 7B (esto puede tardar 10-15 minutos)..."
    docker exec ollama-temp ollama pull codellama:7b-instruct || {
        echo "⚠️ Error descargando CodeLlama 7B, probando modelo más pequeño..."
        docker exec ollama-temp ollama pull codellama:7b-code || {
            echo "⚠️ Usando modelo de respaldo Phi3..."
            docker exec ollama-temp ollama pull phi3:mini
        }
    }

    # Verificar modelos descargados
    echo "✅ Modelos disponibles:"
    docker exec ollama-temp ollama list

    # Detener Ollama temporal
    docker stop ollama-temp
else
    echo "❌ No se pudo descargar la imagen Ollama"
    echo "🔧 Intenta manualmente: docker pull ollama/ollama:latest"
    echo "⏭️ Continuando con el resto de la configuración..."
fi

echo "🏗️ Configurando base de datos inicial..."

# Crear archivo de inicialización de DB
cat > deployment/init.sql << 'EOF'
-- Tabla de usuarios local (sincronizada con Supabase)
CREATE TABLE IF NOT EXISTS user_profiles_local (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50),
    municipality VARCHAR(100),
    zone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    last_sync TIMESTAMP DEFAULT NOW()
);

-- Tabla de prompts y respuestas
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_profiles_local(id),
    prompt TEXT NOT NULL,
    response TEXT,
    model_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    response_time_ms INTEGER
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles_local(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_zone ON user_profiles_local(zone);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created ON ai_conversations(created_at);

-- Insertar datos de prueba
INSERT INTO user_profiles_local (email, full_name, role, municipality, zone) VALUES
('admin@maiscauca.com', 'José Luis Diago Franco', 'director-departamental', 'Popayán', 'CENTRO'),
('carlos.vallejo@maiscauca.com', 'Carlos Eduardo Vallejo', 'lider-regional', 'El Tambo', 'NORTE'),
('maria.gonzalez@maiscauca.com', 'María Patricia González', 'lider-regional', 'La Vega', 'SUR')
ON CONFLICT (email) DO NOTHING;
EOF

echo "🔧 Configurando variables de entorno..."

# Generar contraseñas seguras si no existen
if [ ! -f deployment/.env.local ]; then
    POSTGRES_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    REDIS_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    cat > deployment/.env.local << EOF
# Configuración generada automáticamente
POSTGRES_PASSWORD=${POSTGRES_PASS}
REDIS_PASSWORD=${REDIS_PASS}
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token_here

# Configuración Ollama
OLLAMA_MODEL=codellama:7b-instruct
OLLAMA_MAX_CONTEXT=4096
OLLAMA_TEMPERATURE=0.3

# API Gateway
API_PORT=3001
MAX_CONCURRENT_REQUESTS=10
CACHE_TTL=300

# Cloudflare
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_API_TOKEN=your_api_token

# Monitoring
HEALTH_CHECK_INTERVAL=60
LOG_LEVEL=info
METRICS_ENABLED=true
EOF

    echo "🔐 Contraseñas generadas automáticamente en .env.local"
fi

echo "🎯 Configurando Cloudflare Tunnel..."
echo "Para configurar el túnel de Cloudflare:"
echo "1. Ve a https://one.dash.cloudflare.com/"
echo "2. Navigate to Access > Tunnels"
echo "3. Create a new tunnel named 'mais-local'"
echo "4. Copy the tunnel token"
echo "5. Replace 'your_tunnel_token_here' in .env.local"

echo "🚦 Configurando sistema de monitoreo..."

# Script de monitoreo de recursos
cat > deployment/scripts/monitor-resources.sh << 'EOF'
#!/bin/bash

while true; do
    echo "=== $(date) ==="
    echo "RAM Usage:"
    free -h | grep "Mem:"
    echo
    echo "Docker Stats:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
    echo
    echo "Ollama Status:"
    curl -s http://localhost:11434/api/tags | jq '.models[].name' 2>/dev/null || echo "Ollama not responding"
    echo "========================"
    sleep 30
done
EOF

chmod +x deployment/scripts/monitor-resources.sh

echo "✅ Configuración completada!"
echo ""
echo "🚀 Para iniciar el sistema:"
echo "  cd deployment"
echo "  docker-compose -f docker-compose.hybrid.yml up -d"
echo ""
echo "📊 Para monitorear:"
echo "  ./scripts/monitor-resources.sh"
echo ""
echo "🔍 Health check:"
echo "  curl http://localhost:3001/health"
echo ""
echo "⚠️ IMPORTANTE:"
echo "- Configura tu token de Cloudflare en .env.local"
echo "- El sistema usará aproximadamente 4.5GB de RAM"
echo "- CodeLlama 7B es el modelo recomendado para tu hardware"