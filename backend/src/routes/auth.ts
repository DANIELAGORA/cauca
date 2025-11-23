// Rutas de autenticación - reemplazo de Supabase Auth
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { dbUtils } from '../config/database';
import { logger } from '../utils/logger';
import { rateLimitAuth } from '../middleware/rateLimit';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mais_jwt_secret_2025_super_secure_key';
const JWT_EXPIRY = '7d'; // 7 días

// Validaciones
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('full_name').isLength({ min: 2 }),
  body('document_number').isLength({ min: 6 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// POST /auth/register - Registro de nuevos usuarios
router.post('/register', registerValidation, async (req: any, res: any) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errors.array()
      });
    }

    const { email, password, full_name, document_type = 'CC', document_number, phone, city, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await dbUtils.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Usuario ya existe',
        message: 'Ya existe un usuario registrado con este email'
      });
    }

    // Hash del password
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await dbUtils.createUser(email, passwordHash, {
      registered_via: 'web',
      registration_ip: req.ip
    });

    // Crear perfil
    const profile = await dbUtils.createUserProfile(user.id, {
      full_name,
      document_type,
      document_number,
      phone,
      city,
      role: role || 'votante_simpatizante'
    });

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: profile.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Crear sesión en BD
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    await dbUtils.createSession(
      user.id,
      token,
      expiresAt,
      req.ip,
      req.get('User-Agent')
    );

    logger.info(`✅ Nuevo usuario registrado: ${email}`);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        profile: {
          full_name: profile.full_name,
          role: profile.role,
          city: profile.city
        }
      },
      token,
      expiresAt
    });

  } catch (error: any) {
    logger.error('❌ Error en registro:', error);
    
    // Error específico de constraint violation (usuario duplicado)
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Usuario ya existe',
        message: 'El email o documento ya están registrados'
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error creando usuario'
    });
  }
});

// POST /auth/login - Inicio de sesión
router.post('/login', rateLimitAuth, loginValidation, async (req: any, res: any) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const user = await dbUtils.getUserByEmail(email);
    if (!user) {
      logger.warn(`❌ Intento de login con email inexistente: ${email}`);
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o password incorrectos'
      });
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      logger.warn(`❌ Intento de login con password incorrecto: ${email}`);
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o password incorrectos'
      });
    }

    // Obtener perfil completo
    const profile = await dbUtils.getUserProfile(user.id);

    // Generar nuevo token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: profile.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Crear nueva sesión
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await dbUtils.createSession(
      user.id,
      token,
      expiresAt,
      req.ip,
      req.get('User-Agent')
    );

    // Actualizar last_sign_in
    const { query } = await import('../config/database');
    await query(
      'UPDATE users SET last_sign_in_at = NOW() WHERE id = $1',
      [user.id]
    );

    logger.info(`✅ Login exitoso: ${email}`);

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        profile: {
          full_name: profile.full_name,
          role: profile.role,
          city: profile.city,
          municipality: profile.municipality,
          zone: profile.zone
        }
      },
      token,
      expiresAt
    });

  } catch (error: any) {
    logger.error('❌ Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error procesando login'
    });
  }
});

// POST /auth/logout - Cerrar sesión
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await dbUtils.deleteSession(token);
      logger.info('✅ Sesión cerrada exitosamente');
    }

    res.json({
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    logger.error('❌ Error en logout:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error cerrando sesión'
    });
  }
});

// GET /auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Token requerido',
        message: 'Authorization header requerido'
      });
    }

    // Validar token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Validar sesión en BD
    const session = await dbUtils.validateSession(token);
    if (!session) {
      return res.status(401).json({
        error: 'Sesión expirada',
        message: 'Token inválido o expirado'
      });
    }

    // Obtener perfil completo
    const profile = await dbUtils.getUserProfile(decoded.userId);
    if (!profile) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe'
      });
    }

    res.json({
      user: {
        id: profile.id,
        email: profile.email,
        profile: {
          full_name: profile.full_name,
          document_type: profile.document_type,
          document_number: profile.document_number,
          phone: profile.phone,
          city: profile.city,
          role: profile.role,
          municipality: profile.municipality,
          zone: profile.zone,
          territory_name: profile.territory_name
        },
        created_at: profile.created_at,
        last_sign_in_at: profile.last_sign_in_at
      }
    });

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token JWT inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token ha expirado'
      });
    }

    logger.error('❌ Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error obteniendo perfil'
    });
  }
});

// POST /auth/refresh - Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Token requerido'
      });
    }

    // Validar sesión actual
    const session = await dbUtils.validateSession(token);
    if (!session) {
      return res.status(401).json({
        error: 'Sesión inválida'
      });
    }

    // Obtener usuario
    const user = await dbUtils.getUserByEmail(session.email);
    const profile = await dbUtils.getUserProfile(user.id);

    // Generar nuevo token
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: profile.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Eliminar sesión anterior
    await dbUtils.deleteSession(token);

    // Crear nueva sesión
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await dbUtils.createSession(
      user.id,
      newToken,
      expiresAt,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      message: 'Token renovado exitosamente',
      token: newToken,
      expiresAt
    });

  } catch (error) {
    logger.error('❌ Error renovando token:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error renovando token'
    });
  }
});

export default router;