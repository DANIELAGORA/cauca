// Rate limiting middleware
import rateLimit from 'express-rate-limit';

export const rateLimitAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos máximo
  message: 'Demasiados intentos de autenticación',
  standardHeaders: true,
  legacyHeaders: false,
});