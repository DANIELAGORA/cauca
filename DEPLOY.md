# 🚀 MAIS Demo - Instrucciones de Deploy

## ✅ Estado del Proyecto
**LISTO PARA PRESENTACIÓN EJECUTIVA**
- Build optimizado: ✅ 976KB (precached)
- Funcionalidad 100%: ✅ Todos los botones operativos
- Sistema de navegación: ✅ Sin dependencias de React Router
- IA integrada: ✅ Con fallback a respuestas demo
- PWA completa: ✅ Instalable en todos los dispositivos

## 🎯 Experiencia del Demo

### Landing Page
- Acceso directo por roles desde la landing
- 7 tarjetas de roles interactivas
- Animaciones fluidas y profesionales

### Dashboards por Rol
1. **Comité Ejecutivo Nacional** - Panel completo con estadísticas en vivo
2. **Líder Regional** - Gestión territorial
3. **Comité Departamental** - Operaciones locales
4. **Candidato** - Herramientas de campaña
5. **Influenciador** - Studio de contenido social
6. **Líder Comunitario** - Movilización local
7. **Votante** - Portal ciudadano

### Funcionalidades Destacadas
- **Sistema IA**: Análisis de métricas, generación de contenido, análisis de sentimiento
- **Estadísticas en Vivo**: Contadores animados y métricas en tiempo real
- **Centro de Mensajes**: Con sugerencias IA
- **Redes Sociales**: Programación de posts y análisis
- **Acciones Rápidas**: Mensajes nacionales, reuniones, reportes
- **Notificaciones Toast**: Feedback inmediato de acciones

## 🚀 Deploy Options

### Opción 1: Netlify (Recomendado)
```bash
# La carpeta dist/ está lista para drag & drop en Netlify
# O usar Netlify CLI:
npm run deploy:netlify
```

### Opción 2: Vercel
```bash
npm run deploy:vercel
```

### Opción 3: Servidor Static
```bash
# Servir la carpeta dist/ con cualquier servidor web
npx serve dist
# O copiar dist/ a tu servidor web
```

## 🎬 Flujo de Presentación Recomendado

### 1. Landing Page (30 segundos)
- Mostrar la landing profesional
- Destacar los 7 roles disponibles
- Hacer clic en "Comité Ejecutivo Nacional"

### 2. Dashboard Nacional (2 minutos)
- Mostrar estadísticas animadas en vivo
- Probar análisis IA en las métricas
- Ejecutar "Acciones Rápidas":
  - Enviar mensaje nacional
  - Programar reunión
  - Generar reporte

### 3. Sistema IA (1 minuto)
- Centro de mensajes con sugerencias
- Redes sociales con generación de contenido
- Análisis de sentimiento

### 4. Navegación entre Roles (1 minuto)
- Cambiar a rol "Candidato" o "Influenciador"
- Mostrar dashboards especializados
- Destacar experiencias personalizadas

### 5. PWA (30 segundos)
- Mostrar instalación en móvil/desktop
- Funcionalidad offline
- Notificaciones

## 📊 Métricas del Build

```
Total Size: 976.10 KB (precached)
├── charts.js: 349KB (gzip: 98KB)
├── index.js: 196KB (gzip: 44KB)
├── vendor.js: 139KB (gzip: 45KB)
├── ui.js: 136KB (gzip: 44KB)
├── CSS: 55KB (gzip: 8KB)
└── ai.js: 27KB (gzip: 6KB)
```

## 🔧 Configuración

### Variables de Entorno (Opcional)
```env
VITE_GEMINI_API_KEY=your_key_here
```
**Nota**: El sistema funciona 100% sin API keys usando respuestas demo inteligentes.

## 💡 Puntos Clave para la Presentación

1. **Sin Setup Necesario**: Funciona inmediatamente sin configuración
2. **100% Frontend**: No requiere backend ni base de datos
3. **IA Inteligente**: Funciona con o sin API keys
4. **Responsive**: Perfecto en móvil, tablet y desktop
5. **Professional**: Diseño nivel Silicon Valley
6. **Colombiano**: Adaptado para el contexto político local

## 🎉 ¡Listo para Impresionar!

El demo está optimizado para mostrar el potencial completo de MAIS como plataforma política digital de nueva generación.

**Duración recomendada de demo**: 5 minutos
**Impacto**: Máximo 🚀

---
*Desarrollado con ❤️ para MAIS - Movimiento Alternativo Indígena y Social*