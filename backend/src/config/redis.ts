// Configuración de Redis
import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redis: Redis;

export async function connectRedis(): Promise<void> {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    await redis.connect();
    logger.info('✅ Redis conectado exitosamente');
  } catch (error) {
    logger.error('❌ Error conectando a Redis:', error);
    throw error;
  }
}

export { redis };