#!/bin/bash

# =============================================================================
# MAIS PWA - GitHub + Netlify Integration Setup
# Configuración automática de tokens y despliegue continuo
# =============================================================================

set -e

echo "🔧 MAIS PWA - Configuración GitHub + Netlify"
echo "============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check GitHub CLI authentication
check_gh_auth() {
    print_status "Verificando autenticación de GitHub CLI..."
    
    if ! gh auth status &>/dev/null; then
        print_warning "GitHub CLI no está autenticado"
        echo ""
        echo "🔐 Para configurar GitHub CLI:"
        echo "1. Ejecuta: gh auth login"
        echo "2. Selecciona: GitHub.com"
        echo "3. Selecciona: HTTPS"
        echo "4. Autentica con tu navegador"
        echo ""
        read -p "¿Quieres autenticar ahora? (y/n): " auth_now
        
        if [ "$auth_now" = "y" ] || [ "$auth_now" = "Y" ]; then
            gh auth login
        else
            print_error "Autenticación requerida para continuar"
            exit 1
        fi
    else
        print_success "GitHub CLI autenticado correctamente"
    fi
}

# Push código a GitHub
push_to_github() {
    print_status "Subiendo código a GitHub..."
    
    # Add all files
    git add .
    
    # Commit if there are changes
    if git diff --staged --quiet; then
        print_warning "No hay cambios para commitear"
    else
        git commit -m "🚀 PRODUCTION READY: Auto-deploy setup

✨ GitHub Actions configurado para despliegue automático
🔧 Netlify integration con GitHub
⚡ Deploy automático en cada push a main
🛡️ Variables de entorno seguras
🎯 PWA lista para producción continua

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
    fi
    
    # Push to GitHub
    print_status "Pushing a GitHub..."
    git push -u origin main --force
    
    print_success "Código subido a GitHub correctamente"
}

# Get Netlify site info
get_netlify_info() {
    print_status "Obteniendo información de Netlify..."
    
    echo ""
    echo "🌐 Para configurar el despliegue automático necesitas:"
    echo "1. 🔑 NETLIFY_AUTH_TOKEN"
    echo "2. 🆔 NETLIFY_SITE_ID"
    echo ""
    
    print_warning "📋 PASOS PARA OBTENER TOKENS:"
    echo ""
    echo "🔑 NETLIFY_AUTH_TOKEN:"
    echo "   1. Ve a: https://app.netlify.com/user/applications"
    echo "   2. Clic en 'New access token'"
    echo "   3. Nombre: 'MAIS PWA GitHub Actions'"
    echo "   4. Copia el token generado"
    echo ""
    
    echo "🆔 NETLIFY_SITE_ID:"
    echo "   1. Ve a tu sitio en Netlify"
    echo "   2. Site settings → General → Site details"
    echo "   3. Copia el 'Site ID' (ej: abc123-def456-ghi789)"
    echo ""
    
    echo "🤖 GEMINI_API_KEY:"
    echo "   1. Ve a: https://makersuite.google.com/app/apikey"
    echo "   2. Create API Key"
    echo "   3. Copia la key generada"
    echo ""
}

# Configure GitHub secrets
configure_github_secrets() {
    print_status "Configurando secrets en GitHub..."
    
    echo ""
    read -p "🔑 Pega tu NETLIFY_AUTH_TOKEN: " NETLIFY_AUTH_TOKEN
    read -p "🆔 Pega tu NETLIFY_SITE_ID: " NETLIFY_SITE_ID
    read -p "🤖 Pega tu VITE_GEMINI_API_KEY: " VITE_GEMINI_API_KEY
    
    if [ -n "$NETLIFY_AUTH_TOKEN" ]; then
        gh secret set NETLIFY_AUTH_TOKEN --body "$NETLIFY_AUTH_TOKEN"
        print_success "NETLIFY_AUTH_TOKEN configurado"
    fi
    
    if [ -n "$NETLIFY_SITE_ID" ]; then
        gh secret set NETLIFY_SITE_ID --body "$NETLIFY_SITE_ID"
        print_success "NETLIFY_SITE_ID configurado"
    fi
    
    if [ -n "$VITE_GEMINI_API_KEY" ]; then
        gh secret set VITE_GEMINI_API_KEY --body "$VITE_GEMINI_API_KEY"
        print_success "VITE_GEMINI_API_KEY configurado"
    fi
    
    print_success "Secrets de GitHub configurados"
}

# Main execution
main() {
    echo -e "${GREEN}"
    echo "  ______ _ _   _    _       _"
    echo " |  ____(_) | | |  | |     | |"
    echo " | |__   _| |_| |__| |_   _| |__"
    echo " |  __| | | __|  __  | | | | '_ \\"
    echo " | |____| | |_| |  | | |_| | |_) |"
    echo " |______|_|\\__|_|  |_|\\__,_|_.__/"
    echo ""
    echo "    GitHub + Netlify Integration"
    echo -e "${NC}"
    
    check_gh_auth
    push_to_github
    get_netlify_info
    
    echo ""
    read -p "¿Tienes los tokens listos para configurar? (y/n): " configure_now
    
    if [ "$configure_now" = "y" ] || [ "$configure_now" = "Y" ]; then
        configure_github_secrets
        
        echo ""
        print_success "🎉 ¡Configuración completada!"
        echo ""
        echo "✅ Próximos pasos automáticos:"
        echo "  1. GitHub Actions se ejecutará en cada push"
        echo "  2. Build automático de la PWA"
        echo "  3. Deploy automático a Netlify"
        echo "  4. URL de producción actualizada"
        echo ""
        echo "🌐 Tu repositorio: https://github.com/DANIELAGORA/cauca"
        echo "🚀 GitHub Actions: https://github.com/DANIELAGORA/cauca/actions"
        
    else
        echo ""
        print_warning "⚠️  Para completar la configuración:"
        echo "1. Obtén los tokens de Netlify y Gemini"
        echo "2. Ejecuta: gh secret set NETLIFY_AUTH_TOKEN --body 'tu_token'"
        echo "3. Ejecuta: gh secret set NETLIFY_SITE_ID --body 'tu_site_id'"  
        echo "4. Ejecuta: gh secret set VITE_GEMINI_API_KEY --body 'tu_api_key'"
        echo "5. Haz push al repositorio para activar el deploy automático"
    fi
    
    echo ""
    print_success "✨ MAIS PWA configurado para CI/CD"
}

# Run main function
main