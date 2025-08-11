#!/bin/bash

# =============================================================================
# MAIS Political Campaign PWA - Production Setup Script
# Automated deployment script for GitHub + Netlify + Supabase integration
# =============================================================================

set -e  # Exit on any error

echo "🚀 MAIS Political PWA - Production Setup Starting..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All dependencies are installed."
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cat > .env << 'EOF'
# =============================================================================
# MAIS Political PWA - Production Environment Variables
# =============================================================================

# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI Integration (Required for full functionality)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional GitHub Integration
VITE_GITHUB_TOKEN=your_github_token_here

# App Configuration
VITE_APP_NAME="MAIS Centro de Mando Político"
VITE_APP_VERSION="2.1.0"

# Production flags
NODE_ENV=production
GENERATE_SOURCEMAP=false
EOF
        print_success "Created .env file. Please update with your actual API keys."
        print_warning "⚠️  You need to edit .env file with your actual credentials before deployment!"
    else
        print_warning ".env file already exists. Please verify it has all required variables."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed successfully."
}

# Build the application
build_application() {
    print_status "Building application for production..."
    npm run build
    print_success "Application built successfully."
}

# Run linting and type checking
run_quality_checks() {
    print_status "Running quality checks..."
    
    print_status "Running ESLint..."
    npm run lint || {
        print_warning "Linting issues found. Please fix them before deployment."
    }
    
    print_status "Running TypeScript type checking..."
    npm run type-check || {
        print_error "Type checking failed. Please fix type errors before deployment."
        exit 1
    }
    
    print_success "Quality checks completed."
}

# Initialize Git repository if needed
setup_git() {
    print_status "Setting up Git repository..."
    
    if [ ! -d .git ]; then
        git init
        git add .
        git commit -m "🚀 Initial commit: MAIS Political PWA - Production Ready

✨ Features:
- React 18 + TypeScript + Vite 7.0.6
- Supabase integration for real data
- Google Gemini AI integration
- PWA with service worker
- Role-based access control (7 user types)
- Real-time messaging system
- Campaign management tools
- Financial transparency tracking

🔧 Tech Stack:
- Frontend: React + TypeScript + TailwindCSS
- Backend: Supabase PostgreSQL + Auth
- AI: Google Gemini API
- Deployment: Netlify + GitHub

🎯 Ready for production deployment with real data integration.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
        print_success "Git repository initialized with initial commit."
    else
        print_status "Git repository already exists."
        
        # Check if there are uncommitted changes
        if ! git diff-index --quiet HEAD --; then
            print_status "Committing latest changes..."
            git add .
            git commit -m "🔄 Production setup: Update to real data integration

- Remove demo/mock data functionality
- Add Supabase real data integration
- Update environment configuration
- Production-ready deployment setup

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
        fi
        
        print_success "Git repository updated."
    fi
}

# Main execution
main() {
    echo -e "${GREEN}"
    echo "  __  __          _____  _____ "
    echo " |  \/  |   /\   |_   _|/ ____|"
    echo " | \  / |  /  \    | | | (___  "
    echo " | |\/| | / /\ \   | |  \___ \ "
    echo " | |  | |/ ____ \ _| |_ ____) |"
    echo " |_|  |_/_/    \_\_____|_____/ "
    echo "                               "
    echo "Political Campaign Management PWA"
    echo -e "${NC}"
    
    check_dependencies
    setup_environment
    install_dependencies
    run_quality_checks
    build_application
    setup_git
    
    echo ""
    echo "🎉 Production setup completed successfully!"
    echo "=================================================="
    echo ""
    echo -e "${GREEN}Next Steps:${NC}"
    echo "1. Edit .env file with your actual API keys"
    echo "2. Create Supabase project and run the SQL schema"
    echo "3. Push to GitHub repository"
    echo "4. Deploy to Netlify"
    echo ""
    echo -e "${BLUE}Quick Deploy Commands:${NC}"
    echo "git remote add origin https://github.com/yourusername/mais-political-pwa.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
    echo -e "${YELLOW}Important:${NC} Make sure to set environment variables in Netlify dashboard!"
    echo ""
}

# Run main function
main