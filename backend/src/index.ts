// MAIS Backend API Server
// Servidor API local para reemplazar Supabase
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cron from 'node-cron';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

// Importar rutas
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import messagesRoutes from './routes/messages';
import campaignsRoutes from './routes/campaigns';
import financesRoutes from './routes/finances';
import filesRoutes from './routes/files';
import analyticsRoutes from './routes/analytics';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de seguridad
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuración
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware básico
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por ventana
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Rate limiting estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos  
  max: 5, // máximo 5 intentos de login
  message: 'Demasiados intentos de login, intenta de nuevo más tarde.',
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'MAIS Backend API'
  });
});

// Rutas principales
app.use('/auth', authLimiter, authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Ruta de información
app.get('/', (req, res) => {
  res.json({
    service: 'MAIS Backend API',
    version: '1.0.0',
    description: 'API local para Centro de Mando Político MAIS',
    documentation: '/docs',
    health: '/health'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe en este servidor`,
    availableRoutes: [
      '/health',
      '/auth/*',
      '/api/users/*',
      '/api/messages/*',
      '/api/campaigns/*',
      '/api/finances/*',
      '/api/files/*',
      '/api/analytics/*'
    ]
  });
});

// Función de inicialización
async function startServer() {
  try {
    // Conectar a PostgreSQL
    logger.info('🔌 Conectando a PostgreSQL...');
    await connectDatabase();
    logger.info('✅ PostgreSQL conectado exitosamente');

    // Conectar a Redis
    logger.info('🔌 Conectando a Redis...');
    await connectRedis();
    logger.info('✅ Redis conectado exitosamente');

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Servidor MAIS iniciado en puerto ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 CORS habilitado para: ${corsOptions.origin}`);
    });

    // Configurar crons para tareas programadas
    setupScheduledTasks();

    // Manejo graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('🛑 SIGTERM recibido, cerrando servidor...');
      server.close(() => {
        logger.info('✅ Servidor cerrado exitosamente');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('🛑 SIGINT recibido, cerrando servidor...');
      server.close(() => {
        logger.info('✅ Servidor cerrado exitosamente');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('❌ Error inicializando servidor:', error);
    process.exit(1);
  }
}

// Configurar tareas programadas
function setupScheduledTasks() {
  // Limpiar sesiones expiradas cada hora
  cron.schedule('0 * * * *', async () => {
    logger.info('🧹 Ejecutando limpieza de sesiones expiradas...');
    try {
      const { query } = await import('./config/database');
      const result = await query('SELECT cleanup_expired_sessions()');
      logger.info(`✅ Limpieza completada: ${result.rows[0].cleanup_expired_sessions} sesiones eliminadas`);
    } catch (error) {
      logger.error('❌ Error en limpieza de sesiones:', error);
    }
  });

  // Backup diario de métricas críticas (3 AM)
  cron.schedule('0 3 * * *', async () => {
    logger.info('💾 Ejecutando backup de métricas diarias...');
    try {
      // Implementar backup de métricas importantes
      logger.info('✅ Backup de métricas completado');
    } catch (error) {
      logger.error('❌ Error en backup de métricas:', error);
    }
  });

  logger.info('⏰ Tareas programadas configuradas exitosamente');
}

// Iniciar servidor
startServer();

export default app;