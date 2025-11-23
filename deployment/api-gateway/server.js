const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const winston = require('winston');
const axios = require('axios');
const Redis = require('redis');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.API_PORT || 3001;

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/api-gateway.log' })
  ]
});

// Redis client
const redis = Redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
  password: process.env.REDIS_PASSWORD
});

redis.on('error', (err) => logger.error('Redis error:', err));
redis.connect();

// PostgreSQL connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: 5432,
  database: 'mais_local',
  user: 'mais_user',
  password: process.env.POSTGRES_PASSWORD,
  max: 10,
  connectionTimeoutMillis: 5000
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  }
}));

app.use(cors({
  origin: [
    'https://maiscauca.netlify.app',
    'https://mais-cauca.pages.dev',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(compression());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) }}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check Ollama
    const ollamaResponse = await axios.get(`http://${process.env.OLLAMA_HOST || 'ollama'}:11434/api/tags`);
    
    // Check Redis
    await redis.ping();
    
    // Check PostgreSQL
    const dbResult = await pool.query('SELECT NOW()');
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        ollama: ollamaResponse.status === 200 ? 'ok' : 'error',
        redis: 'ok',
        postgres: 'ok'
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Ollama Code Endpoint
app.post('/api/ollama/generate', async (req, res) => {
  try {
    const { prompt, context, model = 'codellama:7b-instruct' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Cache key
    const cacheKey = `ollama:${Buffer.from(prompt).toString('base64')}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.info('Cache hit for prompt');
      return res.json({
        response: JSON.parse(cached),
        source: 'cache'
      });
    }

    // Call Ollama
    const ollamaResponse = await axios.post(`http://${process.env.OLLAMA_HOST || 'ollama'}:11434/api/generate`, {
      model,
      prompt: `[INST] ${prompt} [/INST]`,
      stream: false,
      options: {
        temperature: parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.3,
        num_ctx: parseInt(process.env.OLLAMA_MAX_CONTEXT) || 4096
      }
    }, {
      timeout: 60000 // 60 segundos timeout
    });

    const response = ollamaResponse.data.response;

    // Cache response for 5 minutes
    await redis.setEx(cacheKey, 300, JSON.stringify(response));

    res.json({
      response,
      source: 'ollama',
      model_used: model
    });

  } catch (error) {
    logger.error('Ollama generation error:', error);
    res.status(500).json({
      error: 'Error generating response',
      details: error.message
    });
  }
});

// Database operations
app.post('/api/database/query', async (req, res) => {
  try {
    const { query, params } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    });

  } catch (error) {
    logger.error('Database query error:', error);
    res.status(500).json({
      error: 'Database query failed',
      details: error.message
    });
  }
});

// Analytics endpoint
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'alcalde' THEN 1 END) as alcaldes,
        COUNT(CASE WHEN role = 'concejal' THEN 1 END) as concejales,
        COUNT(CASE WHEN role = 'lider-regional' THEN 1 END) as lideres
      FROM user_profiles
    `);

    res.json({
      success: true,
      data: stats.rows[0]
    });

  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({
      error: 'Analytics query failed',
      details: error.message
    });
  }
});

// Error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  await redis.disconnect();
  await pool.end();
  
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});