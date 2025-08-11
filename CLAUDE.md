# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# MAIS - Centro de Mando Político

## Project Overview
Production-ready political campaign management PWA for Movimiento Alternativo Indígena y Social (MAIS). React/TypeScript application with real data integration via GitHub, Netlify, and Supabase.

**Current State**: Production PWA with real data integration  
**Developer**: Daniel Lopez "DSimnivaciones" Wramba fxiw  
**Type**: Political Campaign Management PWA with Real Data Backend

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

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite 7.0.6
- **Styling**: TailwindCSS + Framer Motion
- **State Management**: Context API (AppContext only - no demo contexts)
- **Database**: Supabase PostgreSQL with RLS
- **AI Integration**: Google Gemini AI (production required)
- **PWA**: Vite PWA plugin with service worker
- **Deployment**: Netlify with production security headers

### Production Architecture

#### Database Schema (Supabase)
Real data stored in three main tables:
- **profiles**: User profiles linked to Supabase Auth (`src/types/index.ts:10-24`)
- **messages**: Real-time messaging system (`src/types/index.ts:26-39`)  
- **databases**: File metadata and campaign data (`src/types/index.ts:80-90`)

#### Authentication Flow
- Supabase Auth integration (replace mock auth)
- Real user sessions with JWT tokens
- Row Level Security policies configured

#### Data Integration Points
- **AppContext** (`src/contexts/AppContext.tsx`): Remove demo data generation
- **AI Manager** (`src/utils/ai.ts`): Production AI with required API keys
- **Storage**: Supabase Storage for file uploads

## Key Architecture Changes for Production

### Required Environment Variables
```bash
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Integration (Required)  
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional GitHub Integration
VITE_GITHUB_TOKEN=your_github_token
```

### State Management Migration
Current demo AppContext needs replacement with real data:
- Remove all `generateSample*` functions 
- Replace with Supabase real-time subscriptions
- Implement proper error handling for API failures

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

## Working with Real Data

### User Roles & Permissions
7 production roles with database-backed permissions:
- `comite-ejecutivo-nacional` - Full system access
- `lider-regional` - Multi-territory management  
- `comite-departamental` - Local operations
- `candidato` - Campaign management
- `influenciador` - Social media management
- `lider` - Community leadership
- `votante` - Citizen participation

### Widget Data Sources
All widgets connect to real data:
- **MessageCenter**: Supabase `messages` table with real-time
- **MetricsGrid**: Live analytics from campaign data
- **FileUpload**: Supabase Storage with metadata tracking
- **CuentasClaras**: Real financial transparency data

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