# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# MAIS - Centro de Mando Político

## Project Overview
**LIVE PRODUCTION PWA** for Movimiento Alternativo Indígena y Social (MAIS) - Fully operational political campaign management platform with real-time data, user authentication, and automated deployment.

**Production URL**: https://maiscauca.netlify.app  
**Current State**: 100% Operational with Real Data Integration  
**Developer**: Daniel Lopez "DSimnivaciones" Wramba fxiw  
**Type**: Political Campaign Management PWA - Production Ready

## Essential Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Deployment
```bash
npm run deploy:netlify  # Deploy to Netlify (primary)
npm run deploy:vercel   # Deploy to Vercel
npm run deploy          # Deploy with Firebase (legacy)
```

## Production Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite 7.0.6
- **Styling**: TailwindCSS + Framer Motion  
- **State Management**: Context API with real Supabase integration
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with real user sessions
- **AI Integration**: Google Gemini AI (fully configured)
- **PWA**: Optimized service worker, installable app
- **Deployment**: Netlify with automated CI/CD from GitHub
- **Domain**: Custom domain maiscauca.netlify.app

### Live Production Database (Supabase)

#### Production Tables
- **profiles**: User profiles with role-based permissions
- **messages**: Real-time messaging between users and roles
- **databases**: File uploads and campaign document management
- **RLS Policies**: Configured for secure data access by role

#### Production Authentication
- **Supabase Auth**: Live user registration and login
- **7 User Roles**: Each with specific dashboard and permissions
- **Real Sessions**: JWT tokens with automatic renewal
- **Email Verification**: Optional email confirmation system

#### Real-Time Features
- **Live Messaging**: Instant message updates via Supabase subscriptions
- **File Uploads**: Direct upload to Supabase Storage bucket 'files'
- **User Management**: Role-based access control implemented

## Production Environment Configuration

### Environment Variables (Configured)
```bash
# Supabase Production (LIVE)
VITE_SUPABASE_URL=https://djgkjtqpzedxnqwqdcjx.supabase.co
VITE_SUPABASE_ANON_KEY=[Configured in Netlify]

# AI Integration (ACTIVE)
VITE_GEMINI_API_KEY=[Configured in GitHub Secrets]

# Production Settings
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

### Automated Deployment (ACTIVE)
- **GitHub Actions**: Auto-deploy on every push to main
- **Netlify Integration**: Automatic build and deployment
- **Site ID**: fa8b1d78-6aff-4bcd-96bf-de490e8179be
- **Domain**: maiscauca.netlify.app (custom domain configured)

### Component Architecture
```
src/components/
├── dashboards/           # 7 role-specific dashboards
├── widgets/             # Real data widgets (no mock data)
├── Layout.tsx           # Production layout with auth
└── RoleSelector.tsx     # Real user role switching
```

## Production Implementation Requirements

### Critical Files Requiring Updates
1. **src/contexts/AppContext.tsx**: Remove demo data, add Supabase integration
2. **src/utils/ai.ts**: Remove fallback responses, require API keys  
3. **src/App.tsx**: Replace mock auth with Supabase Auth
4. **All dashboard components**: Connect to real Supabase data

### Database Integration (`supabase_schema.sql`)
- Tables: `profiles`, `messages`, `databases`
- RLS policies configured for role-based access
- Storage bucket `files` for media uploads
- Real-time subscriptions for live updates

### Security Implementation
- CSP headers in `netlify.toml` configured for Supabase
- API key environment variables (never in code)
- Supabase RLS enforcing data access controls
- Production security headers enabled

## Build Configuration

### Vite Config (`vite.config.ts`)
- Manual chunk splitting optimized for production
- PWA manifest configured for political campaign use
- Service worker with API caching for Gemini AI
- Build target: `esnext` with Terser minification

### Netlify Configuration (`netlify.toml`)
- Node.js 18+ required
- Security headers for production deployment  
- SPA routing for React application
- Asset optimization and caching strategies

## Live User Management System

### 7 Production User Roles (ACTIVE)

#### 1. 🏛️ Comité Ejecutivo Nacional
- **Permissions**: Full system administration
- **Dashboard**: Complete oversight and control panel
- **Functions**: User management, global analytics, system configuration

#### 2. 🗺️ Líder Regional  
- **Permissions**: Multi-territory coordination
- **Dashboard**: Regional maps, territorial analytics
- **Functions**: Departmental coordination, regional campaigns

#### 3. 🏢 Comité Departamental
- **Permissions**: Local departmental operations
- **Dashboard**: Local finances, departmental campaigns
- **Functions**: Municipal coordination, local resource management

#### 4. 🎯 Candidato
- **Permissions**: Personal campaign management
- **Dashboard**: Campaign tools, personal metrics
- **Functions**: Content creation, campaign scheduling, voter outreach

#### 5. 📱 Influenciador Digital
- **Permissions**: Social media management
- **Dashboard**: Social analytics, content scheduler
- **Functions**: Social media automation, engagement metrics

#### 6. 👥 Líder Comunitario
- **Permissions**: Local community mobilization
- **Dashboard**: Community tools, local messaging
- **Functions**: Event organization, grassroots mobilization

#### 7. 🗳️ Votante/Simpatizante
- **Permissions**: Citizen participation
- **Dashboard**: Information access, participation tools
- **Functions**: Feedback, donations, civic engagement

### User Registration Process (LIVE)
1. **Access**: https://maiscauca.netlify.app
2. **Register**: Email + password + role selection
3. **Automatic**: Profile created in Supabase with role permissions
4. **Immediate**: Access to role-specific dashboard

### Live Data Sources
All widgets connect to real Supabase data:
- **MessageCenter**: Real-time messaging with live subscriptions
- **MetricsGrid**: Live analytics from actual campaign data  
- **FileUpload**: Supabase Storage with instant file processing
- **CuentasClaras**: Real financial transparency with live updates

## Performance & Monitoring

### Bundle Size Management
- Vendor chunk: React core (separate loading)
- Charts chunk: Recharts visualization library
- UI chunk: Lucide icons + Framer Motion
- AI chunk: Google Generative AI client

### PWA Features
- Offline-first with service worker
- Push notifications for campaign updates  
- Install prompt for mobile/desktop
- Background sync for offline actions

When working on this codebase, prioritize real data integration and remove all demo/mock functionality. All features must work with production Supabase backend.