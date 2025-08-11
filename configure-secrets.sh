#!/bin/bash

# =============================================================================
# MAIS PWA - GitHub Secrets Configuration Helper
# =============================================================================

echo "🔑 CONFIGURACIÓN DE SECRETS PARA AUTO-DEPLOY"
echo "============================================="

echo ""
echo "📋 Necesitamos configurar estos 3 secrets en GitHub:"
echo ""

# Helper function to set GitHub secret
set_github_secret() {
    local secret_name=$1
    local secret_description=$2
    
    echo "🔸 $secret_name"
    echo "   $secret_description"
    read -p "   Pega aquí el valor: " secret_value
    
    if [ -n "$secret_value" ]; then
        if gh auth status &>/dev/null; then
            gh secret set "$secret_name" --body "$secret_value"
            echo "   ✅ $secret_name configurado correctamente"
        else
            echo "   ⚠️  GitHub CLI no autenticado. Configura manualmente en:"
            echo "      https://github.com/DANIELAGORA/cauca/settings/secrets/actions"
            echo "      Name: $secret_name"
            echo "      Value: [el valor que acabas de pegar]"
        fi
    else
        echo "   ❌ Valor vacío, omitido"
    fi
    echo ""
}

echo "1️⃣ NETLIFY_AUTH_TOKEN"
echo "   Ve a: https://app.netlify.com/user/applications"
echo "   Crea un 'New access token' llamado 'MAIS PWA Deploy'"
echo "   El token se ve como: nfp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""
read -p "¿Ya tienes el token de Netlify? (y/n): " has_netlify_token

if [ "$has_netlify_token" = "y" ] || [ "$has_netlify_token" = "Y" ]; then
    set_github_secret "NETLIFY_AUTH_TOKEN" "Token de acceso personal de Netlify"
fi

echo "2️⃣ NETLIFY_SITE_ID"
echo "   Tu Site ID es: effulgent-croissant-951287"
echo "   (Este ya lo sabemos)"
echo ""
if gh auth status &>/dev/null; then
    gh secret set NETLIFY_SITE_ID --body "effulgent-croissant-951287"
    echo "   ✅ NETLIFY_SITE_ID configurado correctamente"
else
    echo "   ⚠️  Configura manualmente: Name: NETLIFY_SITE_ID, Value: effulgent-croissant-951287"
fi
echo ""

echo "3️⃣ VITE_GEMINI_API_KEY"
echo "   Tu API key de Google Gemini AI"
echo "   Se ve como: AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""
set_github_secret "VITE_GEMINI_API_KEY" "API Key de Google Gemini AI"

echo "🎉 CONFIGURACIÓN COMPLETADA"
echo ""
echo "✅ Próximos pasos automáticos:"
echo "   1. Cada push a 'main' activará el auto-deploy"
echo "   2. GitHub Actions construirá la PWA"
echo "   3. Deploy automático a Netlify"
echo "   4. URL actualizada: https://effulgent-croissant-951287.netlify.app"
echo ""
echo "🚀 ¡Tu PWA está lista para despliegue continuo!"