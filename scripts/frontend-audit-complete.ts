#!/usr/bin/env npx tsx

import { promises as fs } from 'fs';
import path from 'path';

interface LogoIssue {
  file: string;
  line: number;
  issue: string;
  priority: 'alta' | 'media' | 'baja';
  description: string;
  solution: string;
}

interface Style3DIssue {
  file: string;
  line: number;
  issue: string;
  priority: 'alta' | 'media' | 'baja';
  description: string;
  solution: string;
}

interface AuditReport {
  logoIssues: LogoIssue[];
  style3DIssues: Style3DIssue[];
  summary: {
    totalIssues: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  };
}

class FrontendAuditor {
  private logoIssues: LogoIssue[] = [];
  private style3DIssues: Style3DIssue[] = [];
  
  private existingAssets = [
    '/app.ico',
    '/app.png', 
    '/favicon.ico',
    '/favicon.png',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/mais-logo.svg'
  ];

  private inconsistentLogoReferences = [
    { pattern: 'src="/app.ico"', file: 'multiple', issue: 'Referencia inconsistente a app.ico' },
    { pattern: 'src="/app.png"', file: 'multiple', issue: 'Referencia inconsistente a app.png' },
    { pattern: 'app.png.*rounded-2xl', file: 'multiple', issue: 'Estilos inconsistentes en logos' }
  ];

  async auditProject(): Promise<AuditReport> {
    console.log('🔍 Iniciando auditoría completa del frontend MAIS...');
    
    await this.auditLogos();
    await this.audit3DStyles();
    
    const summary = this.generateSummary();
    
    return {
      logoIssues: this.logoIssues,
      style3DIssues: this.style3DIssues,
      summary
    };
  }

  private async auditLogos(): Promise<void> {
    console.log('📷 Auditando logos y referencias de assets...');
    
    // Verificar assets físicos
    const publicDir = path.join(process.cwd(), 'public');
    const rootDir = process.cwd();
    
    for (const asset of this.existingAssets) {
      const publicPath = path.join(publicDir, asset.substring(1));
      const rootPath = path.join(rootDir, asset.substring(1));
      
      const existsInPublic = await fs.access(publicPath).then(() => true).catch(() => false);
      const existsInRoot = await fs.access(rootPath).then(() => true).catch(() => false);
      
      if (!existsInPublic && !existsInRoot) {
        this.logoIssues.push({
          file: asset,
          line: 0,
          issue: 'Asset referenciado no existe',
          priority: 'alta',
          description: `El archivo ${asset} es referenciado en el código pero no existe físicamente`,
          solution: `Crear el archivo ${asset} o actualizar todas las referencias para usar un asset existente`
        });
      }
    }

    // Analizar referencias en código
    await this.analyzeCodeReferences();
  }

  private async analyzeCodeReferences(): Promise<void> {
    const srcDir = path.join(process.cwd(), 'src');
    await this.scanDirectory(srcDir);
  }

  private async scanDirectory(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        await this.analyzeFile(fullPath);
      }
    }
  }

  private async analyzeFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(process.cwd(), filePath);
    
    lines.forEach((line, index) => {
      // Buscar referencias a logos
      this.checkLogoReferences(relativePath, index + 1, line);
      
      // Buscar problemas de estilos 3D
      this.check3DStyles(relativePath, index + 1, line);
    });
  }

  private checkLogoReferences(file: string, lineNum: number, line: string): void {
    // Referencias inconsistentes a logos
    const logoPatterns = [
      { pattern: /src=["']\/app\.ico["']/, asset: '/app.ico' },
      { pattern: /src=["']\/app\.png["']/, asset: '/app.png' },
      { pattern: /src=["']\/mais-logo\.svg["']/, asset: '/mais-logo.svg' },
      { pattern: /src=["']\/favicon\.(ico|png|svg)["']/, asset: '/favicon.*' }
    ];

    logoPatterns.forEach(({ pattern, asset }) => {
      if (pattern.test(line)) {
        // Verificar inconsistencias de tamaño
        if (line.includes('w-20 h-20') && line.includes('w-16 h-16')) {
          this.logoIssues.push({
            file,
            line: lineNum,
            issue: 'Tamaños inconsistentes de logo',
            priority: 'media',
            description: 'El mismo logo tiene tamaños diferentes en la misma línea',
            solution: 'Estandarizar el tamaño del logo usando variables CSS o clases consistentes'
          });
        }

        // Verificar fallbacks
        if (!line.includes('onError') && asset.includes('app.')) {
          this.logoIssues.push({
            file,
            line: lineNum,
            issue: 'Falta fallback para logo',
            priority: 'baja',
            description: `Logo ${asset} no tiene manejo de errores de carga`,
            solution: 'Agregar onError handler para mostrar fallback si la imagen no carga'
          });
        }

        // Verificar mixing de assets
        if (line.includes('/app.ico') && file.includes('Layout')) {
          this.logoIssues.push({
            file,
            line: lineNum,
            issue: 'Uso inconsistente de assets',
            priority: 'media',
            description: 'Layout.tsx usa app.png en algunas líneas y app.ico en otras',
            solution: 'Estandarizar el uso de un solo asset (preferiblemente app.png para mejor calidad)'
          });
        }
      }
    });

    // Logo con estilos 3D inconsistentes
    if (line.includes('img') && line.includes('app.') && line.includes('shadow')) {
      const shadowTypes = ['shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'];
      let shadowCount = 0;
      shadowTypes.forEach(shadow => {
        if (line.includes(shadow)) shadowCount++;
      });
      
      if (shadowCount > 1) {
        this.logoIssues.push({
          file,
          line: lineNum,
          issue: 'Múltiples sombras aplicadas',
          priority: 'baja',
          description: 'Se están aplicando múltiples clases de sombra al mismo elemento',
          solution: 'Usar una sola clase de sombra consistente'
        });
      }
    }
  }

  private check3DStyles(file: string, lineNum: number, line: string): void {
    // Transform inconsistencies
    const transformPatterns = [
      /transform.*scale\([\d.]+\)/g,
      /transform.*rotate\([^)]+\)/g,
      /transform.*translate\([^)]+\)/g,
      /hover:scale-[\d.]+/g,
      /hover:rotate-[\d.]+/g
    ];

    transformPatterns.forEach((pattern, index) => {
      const matches = line.match(pattern);
      if (matches && matches.length > 1) {
        this.style3DIssues.push({
          file,
          line: lineNum,
          issue: 'Transforms duplicados',
          priority: 'media',
          description: 'Se están aplicando múltiples transforms del mismo tipo',
          solution: 'Consolidar transforms en una sola declaración'
        });
      }
    });

    // Gradient inconsistencies
    if (line.includes('bg-gradient-to-r') || line.includes('bg-gradient-to-br')) {
      const gradients = line.match(/from-\w+-\d+/g);
      const gradientEnds = line.match(/to-\w+-\d+/g);
      
      if (gradients && gradientEnds) {
        // Verificar si los colores siguen el patrón MAIS (rojo-amarillo-verde)
        const maisColors = ['red', 'yellow', 'green'];
        const hasAllMaisColors = maisColors.every(color => 
          line.includes(`from-${color}`) || line.includes(`via-${color}`) || line.includes(`to-${color}`)
        );
        
        if (!hasAllMaisColors && (file.includes('Dashboard') || file.includes('Landing'))) {
          this.style3DIssues.push({
            file,
            line: lineNum,
            issue: 'Gradiente fuera del patrón MAIS',
            priority: 'baja',
            description: 'El gradiente no sigue la paleta de colores oficial MAIS (rojo-amarillo-verde)',
            solution: 'Usar gradientes que incluyan los colores oficiales: from-red-600 via-yellow-500 to-green-600'
          });
        }
      }
    }

    // Animation inconsistencies
    const animationClasses = ['animate-pulse', 'animate-bounce', 'animate-spin', 'animate-ping'];
    const usedAnimations = animationClasses.filter(anim => line.includes(anim));
    
    if (usedAnimations.length > 1) {
      this.style3DIssues.push({
        file,
        line: lineNum,
        issue: 'Múltiples animaciones conflictivas',
        priority: 'media',
        description: 'Se están aplicando múltiples animaciones que pueden conflictir',
        solution: 'Usar una sola animación o combinar usando CSS custom'
      });
    }

    // Shadow inconsistencies
    if (line.includes('shadow-') && line.includes('hover:shadow-')) {
      const shadows = line.match(/shadow-[\w\d]+/g) || [];
      const uniqueShadows = [...new Set(shadows)];
      
      if (uniqueShadows.length > 2) {
        this.style3DIssues.push({
          file,
          line: lineNum,
          issue: 'Exceso de efectos de sombra',
          priority: 'baja',
          description: 'Se están aplicando demasiados efectos de sombra diferentes',
          solution: 'Simplificar a máximo 2 efectos: uno base y uno para hover'
        });
      }
    }

    // Perspective/3D inconsistencies
    if (line.includes('perspective') || line.includes('rotateX') || line.includes('rotateY')) {
      if (!line.includes('transform-gpu') && !line.includes('will-change-transform')) {
        this.style3DIssues.push({
          file,
          line: lineNum,
          issue: 'Efectos 3D sin optimización GPU',
          priority: 'media',
          description: 'Los efectos 3D no están optimizados para GPU',
          solution: 'Agregar transform-gpu o will-change-transform para mejor performance'
        });
      }
    }

    // Framer Motion inconsistencies
    if (line.includes('motion.') && line.includes('animate=')) {
      if (!line.includes('transition=')) {
        this.style3DIssues.push({
          file,
          line: lineNum,
          issue: 'Animación Framer Motion sin transición',
          priority: 'baja',
          description: 'La animación no especifica duración o easing',
          solution: 'Agregar transition={{ duration: X, ease: "easeInOut" }}'
        });
      }
    }

    // Button hover inconsistencies  
    if (line.includes('button') && line.includes('hover:')) {
      const hoverEffects = (line.match(/hover:[\w-]+/g) || []).length;
      if (hoverEffects > 4) {
        this.style3DIssues.push({
          file,
          line: lineNum,
          issue: 'Exceso de efectos hover',
          priority: 'baja',
          description: 'El botón tiene demasiados efectos hover que pueden causar conflictos',
          solution: 'Limitar a máximo 4 efectos hover: color, background, scale y shadow'
        });
      }
    }
  }

  private async audit3DStyles(): Promise<void> {
    console.log('✨ Auditando estilos 3D y efectos visuales...');
    
    // Verificar consistencia en efectos 3D globales
    const layoutPath = path.join(process.cwd(), 'src/components/Layout.tsx');
    const landingPath = path.join(process.cwd(), 'src/components/LandingPageNew.tsx');
    const effectsPath = path.join(process.cwd(), 'src/components/effects/MAISParticles.tsx');
    
    // Verificar si archivos críticos existen
    for (const criticalFile of [layoutPath, landingPath, effectsPath]) {
      const exists = await fs.access(criticalFile).then(() => true).catch(() => false);
      if (!exists) {
        this.style3DIssues.push({
          file: path.relative(process.cwd(), criticalFile),
          line: 0,
          issue: 'Archivo crítico de efectos faltante',
          priority: 'alta',
          description: `Archivo crítico ${criticalFile} no encontrado`,
          solution: 'Crear el archivo con los efectos 3D estándar del proyecto'
        });
      }
    }

    // Verificar Tailwind 3D config
    const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');
    const tailwindExists = await fs.access(tailwindPath).then(() => true).catch(() => false);
    
    if (tailwindExists) {
      const tailwindContent = await fs.readFile(tailwindPath, 'utf-8');
      if (!tailwindContent.includes('transform-gpu') && !tailwindContent.includes('perspective')) {
        this.style3DIssues.push({
          file: 'tailwind.config.js',
          line: 0,
          issue: 'Configuración 3D faltante en Tailwind',
          priority: 'media',
          description: 'El config de Tailwind no incluye utilidades 3D extendidas',
          solution: 'Agregar utilities para perspective, transform-style, backface-visibility'
        });
      }
    }
  }

  private generateSummary() {
    const allIssues = [...this.logoIssues, ...this.style3DIssues];
    
    return {
      totalIssues: allIssues.length,
      highPriority: allIssues.filter(i => i.priority === 'alta').length,
      mediumPriority: allIssues.filter(i => i.priority === 'media').length,
      lowPriority: allIssues.filter(i => i.priority === 'baja').length
    };
  }

  async generateReport(report: AuditReport): Promise<string> {
    const timestamp = new Date().toISOString();
    
    let output = `# 🔍 REPORTE COMPLETO DE AUDITORÍA FRONTEND - MAIS CAUCA\n\n`;
    output += `**Fecha de auditoría:** ${timestamp}\n`;
    output += `**Proyecto:** MAIS Centro de Mando Político\n`;
    output += `**Ambiente:** Producción (https://maiscauca.netlify.app)\n\n`;

    // Resumen ejecutivo
    output += `## 📊 RESUMEN EJECUTIVO\n\n`;
    output += `- **Total de inconsistencias encontradas:** ${report.summary.totalIssues}\n`;
    output += `- **🔴 Prioridad Alta:** ${report.summary.highPriority}\n`;
    output += `- **🟡 Prioridad Media:** ${report.summary.mediumPriority}\n`;
    output += `- **🟢 Prioridad Baja:** ${report.summary.lowPriority}\n\n`;

    // Problemas de logos
    if (report.logoIssues.length > 0) {
      output += `## 🖼️ INCONSISTENCIAS EN LOGOS Y ASSETS\n\n`;
      
      const logoPriorities = ['alta', 'media', 'baja'] as const;
      for (const priority of logoPriorities) {
        const issues = report.logoIssues.filter(i => i.priority === priority);
        if (issues.length > 0) {
          const emoji = priority === 'alta' ? '🔴' : priority === 'media' ? '🟡' : '🟢';
          output += `### ${emoji} Prioridad ${priority.toUpperCase()}\n\n`;
          
          issues.forEach((issue, index) => {
            output += `#### ${index + 1}. ${issue.issue}\n`;
            output += `**Archivo:** \`${issue.file}\`${issue.line > 0 ? ` (línea ${issue.line})` : ''}\n`;
            output += `**Descripción:** ${issue.description}\n`;
            output += `**Solución:** ${issue.solution}\n\n`;
          });
        }
      }
    }

    // Problemas de estilos 3D
    if (report.style3DIssues.length > 0) {
      output += `## ✨ INCONSISTENCIAS EN ESTILOS 3D Y EFECTOS\n\n`;
      
      const stylePriorities = ['alta', 'media', 'baja'] as const;
      for (const priority of stylePriorities) {
        const issues = report.style3DIssues.filter(i => i.priority === priority);
        if (issues.length > 0) {
          const emoji = priority === 'alta' ? '🔴' : priority === 'media' ? '🟡' : '🟢';
          output += `### ${emoji} Prioridad ${priority.toUpperCase()}\n\n`;
          
          issues.forEach((issue, index) => {
            output += `#### ${index + 1}. ${issue.issue}\n`;
            output += `**Archivo:** \`${issue.file}\`${issue.line > 0 ? ` (línea ${issue.line})` : ''}\n`;
            output += `**Descripción:** ${issue.description}\n`;
            output += `**Solución:** ${issue.solution}\n\n`;
          });
        }
      }
    }

    // Assets encontrados
    output += `## 📁 ASSETS VERIFICADOS\n\n`;
    output += `### ✅ Assets existentes encontrados:\n`;
    for (const asset of this.existingAssets) {
      const publicPath = path.join(process.cwd(), 'public', asset.substring(1));
      const rootPath = path.join(process.cwd(), asset.substring(1));
      
      const existsInPublic = await fs.access(publicPath).then(() => true).catch(() => false);
      const existsInRoot = await fs.access(rootPath).then(() => true).catch(() => false);
      
      const status = existsInPublic || existsInRoot ? '✅' : '❌';
      const location = existsInPublic ? 'public/' : existsInRoot ? 'root/' : 'MISSING';
      output += `- ${status} \`${asset}\` (${location})\n`;
    }

    // Recomendaciones
    output += `\n## 🎯 RECOMENDACIONES PRIORITARIAS\n\n`;
    
    if (report.summary.highPriority > 0) {
      output += `### 1. CRÍTICAS (Resolver inmediatamente)\n`;
      output += `- Corregir ${report.summary.highPriority} problemas de alta prioridad\n`;
      output += `- Estas inconsistencias afectan la experiencia de usuario en producción\n\n`;
    }
    
    if (report.summary.mediumPriority > 0) {
      output += `### 2. IMPORTANTES (Resolver en próximo sprint)\n`;
      output += `- Estandarizar ${report.summary.mediumPriority} inconsistencias de prioridad media\n`;
      output += `- Implementar sistema de diseño consistente\n\n`;
    }
    
    if (report.summary.lowPriority > 0) {
      output += `### 3. MEJORAS (Backlog de optimización)\n`;
      output += `- Optimizar ${report.summary.lowPriority} detalles de baja prioridad\n`;
      output += `- Establecer guías de estilo para nuevos desarrollos\n\n`;
    }

    // Plan de acción
    output += `## 📋 PLAN DE ACCIÓN SUGERIDO\n\n`;
    output += `### Fase 1: Corrección Crítica (1-2 días)\n`;
    output += `1. Corregir assets faltantes y referencias rotas\n`;
    output += `2. Estandarizar referencias de logos (usar /app.png consistentemente)\n`;
    output += `3. Implementar fallbacks para todas las imágenes\n\n`;
    
    output += `### Fase 2: Estandarización (3-5 días)\n`;
    output += `1. Crear sistema de diseño con variables CSS para efectos 3D\n`;
    output += `2. Unificar gradientes usando paleta MAIS oficial\n`;
    output += `3. Optimizar animaciones para GPU\n\n`;
    
    output += `### Fase 3: Optimización (1 semana)\n`;
    output += `1. Implementar lazy loading para imágenes\n`;
    output += `2. Crear componentes reutilizables para efectos comunes\n`;
    output += `3. Establecer guías de desarrollo para consistencia futura\n\n`;

    output += `---\n`;
    output += `**Generado por:** Electoral Software Architect\n`;
    output += `**Herramienta:** Claude Code Frontend Auditor\n`;
    output += `**Versión:** 1.0.0\n`;

    return output;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando auditoría completa del frontend MAIS...');
    
    const auditor = new FrontendAuditor();
    const report = await auditor.auditProject();
    const reportContent = await auditor.generateReport(report);
    
    // Guardar reporte
    const reportPath = path.join(process.cwd(), 'FRONTEND-AUDIT-COMPLETE.md');
    await fs.writeFile(reportPath, reportContent, 'utf-8');
    
    console.log(`✅ Auditoría completada exitosamente!`);
    console.log(`📄 Reporte guardado en: ${reportPath}`);
    console.log(`\n📊 RESUMEN:`);
    console.log(`- Total de problemas: ${report.summary.totalIssues}`);
    console.log(`- Prioridad alta: ${report.summary.highPriority}`);
    console.log(`- Prioridad media: ${report.summary.mediumPriority}`);
    console.log(`- Prioridad baja: ${report.summary.lowPriority}`);
    
    return report;
    
  } catch (error) {
    console.error('❌ Error durante la auditoría:', error);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { FrontendAuditor, type AuditReport };