# Backend API para MAIS - Base de datos local
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache postgresql-client curl

# Crear directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiar código fuente
COPY src/ ./src/
COPY tsconfig.json ./

# Compilar TypeScript
RUN npm run build

# Limpiar devDependencies después de compilar
RUN npm prune --production

# Crear directorios necesarios
RUN mkdir -p logs uploads

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mais -u 1001 && \
    chown -R mais:nodejs /app

# Cambiar a usuario no-root
USER mais

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["npm", "start"]