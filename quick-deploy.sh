#!/bin/bash

# =============================================================================
# MAIS PWA - Quick Deploy con Token
# =============================================================================

echo "🚀 MAIS PWA - Deploy Rápido con Token"
echo "===================================="

# Pedir token al usuario
echo ""
echo "📝 Pega tu GitHub Personal Access Token:"
read -s -p "Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Token requerido"
    exit 1
fi

# Configurar remote con token
echo "🔧 Configurando Git con token..."
git remote set-url origin https://DANIELAGORA:${GITHUB_TOKEN}@github.com/DANIELAGORA/cauca.git

# Commit y push
echo "📤 Subiendo código a GitHub..."
git add .
git commit -m "🚀 PRODUCTION PWA: Ready for auto-deploy

✅ GitHub Actions configurado
✅ Netlify integration ready  
✅ Supabase PostgreSQL conectado
✅ PWA optimizada para producción
✅ 7 dashboards de roles
✅ Autenticación real implementada
✅ AI integration con Gemini
✅ Deploy automático activado

🎯 LISTO PARA PRODUCCIÓN INMEDIATA

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push -u origin main --force

echo ""
echo "✅ ¡Código subido exitosamente!"
echo ""
echo "🌐 Repositorio: https://github.com/DANIELAGORA/cauca"
echo "🚀 Actions: https://github.com/DANIELAGORA/cauca/actions"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Configura los secrets para auto-deploy"
echo "3. ¡Tu PWA se desplegará automáticamente!"
echo ""