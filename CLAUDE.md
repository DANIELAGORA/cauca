# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# MAIS - Centro de Mando Político

## Project Overview
**LIVE PRODUCTION PWA** for Movimiento Alternativo Indígena y Social (MAIS) - Fully operational political campaign management platform with real-time data, user authentication, and automated deployment.

**Production URL**: https://maiscauca.netlify.app  
**Current State**: 100% Operational with Real Data Integration  
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

### Database & User Management Scripts
```bash
npm run test:users           # Test all user authentication
npm run setup:users          # Setup user profiles
npm run check:database       # Verify database structure
npm run inspect:database     # Inspect real database data
npm run test:production      # Run complete production test suite
npx tsx scripts/final-system-verification.ts  # Full system verification
```

### Deployment
```bash
npm run deploy:netlify  # Deploy to Netlify (primary)
npm run deploy:vercel   # Deploy to Vercel
npm run deploy          # Deploy with Firebase (legacy)
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite 7.0.6
- **Styling**: TailwindCSS + Framer Motion  
- **State Management**: Context API with real Supabase integration
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with real user sessions
- **AI Integration**: Google Gemini AI (fully configured)
- **PWA**: Optimized service worker, installable app
- **Deployment**: Netlify with automated CI/CD from GitHub

### Core Application Structure

#### State Management (`src/contexts/AppContext.tsx`)
- **Central state hub** with Supabase integration
- Real-time subscriptions for messages and data updates
- User authentication state management
- Hierarchical user management system
- All data operations flow through this context

#### Database Integration (`src/lib/supabase.ts`)
- **Centralized Supabase client** with optimized configuration
- Type-safe database operations with TypeScript
- Auto-refresh tokens and persistent sessions
- Configured for production with security headers

#### Authentication Flow
1. **Login/Register**: Email/password via Supabase Auth
2. **Profile Creation**: Automatic profile in `user_profiles` table
3. **Role Assignment**: 7-tier hierarchical role system
4. **Dashboard Routing**: Role-specific UI components

### Dashboard Architecture (`src/components/dashboards/`)

**7 Role-Specific Dashboards:**
- `NationalDashboard.tsx` - National committee oversight
- `RegionalDashboard.tsx` - Regional/departmental coordination  
- `DepartmentalDashboard.tsx` - Local departmental operations
- `CandidateDashboard.tsx` - Personal campaign management
- `InfluencerDashboard.tsx` - Social media management
- `LeaderDashboard.tsx` - Community mobilization
- `VoterDashboard.tsx` - Citizen participation

**Each dashboard includes:**
- Role-specific widgets and analytics
- Hierarchical data access based on user permissions
- Real-time messaging and file management
- AI-powered insights via Google Gemini

### Widget System (`src/components/widgets/`)

**Core Widgets:**
- `MessageCenter.tsx` - Real-time messaging with Supabase subscriptions
- `MetricsGrid.tsx` - Live analytics from campaign data
- `FileUpload.tsx` - Supabase Storage integration
- `UserManagement.tsx` - Hierarchical user creation
- `CuentasClaras.tsx` - Financial transparency system
- `TerritoryMap.tsx` - Geographic campaign visualization

### Database Schema (Supabase)

**Core Tables:**
- `user_profiles` - User data with role-based permissions
- `messages` - Real-time messaging system
- `databases` - File uploads and document management
- `campaign_finances` - Financial tracking
- `campaigns` - Campaign data and analytics

**Security:** Row Level Security (RLS) policies enforce role-based data access

### Environment Configuration

**Production Environment Variables (Netlify):**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GEMINI_API_KEY` - Google Gemini AI API key

**Security Notes:**
- All API keys managed via Netlify environment variables
- No sensitive data in code or repository
- CSP headers configured for Supabase and AI services

### Real Data Integration

**Live Users (96+ political representatives):**
- 1 Director Departamental
- 5 Alcaldes (mayors)
- 7 Diputados (assembly deputies)  
- 83 Concejales (councilors)
- Universal password: `agoramais2025`

**Data Sources:**
- Real electoral data from MAIS Cauca
- Live Supabase tables with authentic political representatives
- Real-time messaging between actual campaign members
- Authentic financial and campaign data

### Build Configuration

**Vite Configuration (`vite.config.ts`):**
- Manual chunk splitting for optimal loading
- PWA manifest for political campaign use
- Service worker with Gemini AI caching
- Production-optimized build settings

**PWA Features:**
- Offline-first with service worker
- Push notifications capability
- Install prompt for mobile/desktop
- Background sync for offline actions

### Deployment Pipeline

**Netlify Configuration (`netlify.toml`):**
- Production security headers
- CSP configured for Supabase and AI services
- Asset optimization and caching
- SPA routing for React application

**GitHub Integration:**
- Auto-deploy on push to main branch
- Environment variables managed in Netlify
- Site ID: fa8b1d78-6aff-4bcd-96bf-de490e8179be

### Hierarchical User System - 5 ZONAS IMPLEMENTADAS ✅

**Role Hierarchy (4 operational levels):**
1. **Director Departamental** - José Luis Diago Franco (system administration)
2. **Líderes Regionales Zonales** - 5 zone coordinators (territorial management)
3. **Candidatos** - Municipal candidates (campaign management)
4. **Votantes/Líderes Comunitarios** - Community mobilization

**✅ STRUCTURE TERRITORIAL COMPLETA:**
- **ZONA NORTE**: Carlos Eduardo Vallejo (`carlos.vallejo@maiscauca.com`) - 5 municipios
- **ZONA SUR**: María Patricia Gonzalez (`maria.gonzalez@maiscauca.com`) - 5 municipios  
- **ZONA CENTRO**: Roberto Carlos Muñoz (`roberto.munoz@maiscauca.com`) - 5 municipios
- **ZONA PACÍFICO**: Ana Lucía Torres (`ana.torres@maiscauca.com`) - 4 municipios
- **ZONA MACIZO**: Luis Fernando Chocué (`luis.chocue@maiscauca.com`) - 6 municipios

**Permission System:**
- Each role can create and manage specific lower-tier roles
- Territory-based permissions: 25 municipios distributed across 5 zones
- RLS policies enforce geographical and hierarchical access control
- 100% functional login system with password: `agoramais2025`

### Development Guidelines

**Working with Real Data:**
- All features must integrate with production Supabase backend
- Remove any demo/mock functionality when implementing new features
- Test with real user accounts using verification scripts
- Maintain data integrity for live political representatives

**Security Requirements:**
- Never commit API keys or sensitive data
- Use environment variables for all external service credentials
- Implement proper RLS policies for new database tables
- Follow CSP guidelines for any new external integrations

**Testing:**
- Use provided scripts to verify user authentication
- Test role-specific dashboard functionality
- Verify real-time features with multiple user sessions
- Run production verification before major deployments

When working on this codebase, prioritize real data integration and maintain the production-ready state for active political campaign operations.

## Frontend Excellence Standards - RELOJ SUIZO ⚡

### UI/UX Components (`src/components/ui/`)

**✅ OPTIMIZED COMPONENTS:**
- `MAISLogo.tsx` - Universal logo component with intelligent fallback chain
- Automatic error handling with graceful degradation
- GPU-optimized animations with Framer Motion
- Lazy loading and performance optimization

**Logo Management System:**
- Primary: `/app.png` (best quality)
- Fallback chain: `/app.ico` → `/favicon.png` → `/favicon.ico`
- Error fallback: Gradient MAIS badge with brand colors
- Smart device detection for optimal format selection

### Design System - MAIS Palette

**Brand Colors (Official):**
- Primary Gradient: `from-red-600 via-yellow-500 to-green-600`
- Secondary: `from-red-700 via-yellow-600 to-green-700`
- CSS Variables: `--mais-gradient-primary`, `--mais-gradient-secondary`

**3D Effects & Animations:**
- GPU acceleration: `transform-gpu` and `will-change-transform`
- Smooth transitions with `transition-all duration-300 ease-in-out`
- Tailwind 3D utilities: perspective, transform-style, backface-visibility
- Framer Motion for complex animations with spring physics

### Performance Optimizations

**Image Loading:**
- Universal lazy loading: `loading="lazy"`
- WebP detection and optimal format selection
- Progressive image enhancement
- Fallback system for offline scenarios

**CSS Performance:**
- CSS-in-JS optimized with Tailwind JIT
- Critical CSS inlining for above-the-fold content
- Purged unused styles in production builds
- CSS variables for dynamic theming

### Testing Standards

**Frontend Verification Scripts:**
```bash
npm run test:frontend        # Component testing suite
npm run audit:accessibility  # A11y compliance check
npm run performance:audit    # Core Web Vitals analysis
npm run visual:regression    # Visual diff testing
```

**Quality Gates:**
- 100% logo fallback coverage across all components
- Consistent MAIS gradient usage (red-yellow-green)
- GPU-optimized 3D effects for mobile performance
- Zero console errors in production builds

Maintain Swiss precision in all frontend implementations - every component should be bulletproof and visually consistent.