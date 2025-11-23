// Configuración de PostgreSQL
import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

export async function connectDatabase(): Promise<void> {
  try {
    const databaseUrl = process.env.DATABASE_URL || 
      'postgresql://mais_app_user:mais_secure_2025_password@localhost:5432/mais_local';

    pool = new Pool({
      connectionString: databaseUrl,
      max: 20, // máximo 20 conexiones
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: false, // Deshabilitado para desarrollo local
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('✅ Conexión a PostgreSQL establecida');
  } catch (error) {
    logger.error('❌ Error conectando a PostgreSQL:', error);
    throw error;
  }
}

export async function query(text: string, params?: any[]): Promise<any> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      logger.warn(`🐌 Query lenta detectada: ${duration}ms - ${text.substring(0, 100)}...`);
    }
    
    return result;
  } catch (error) {
    logger.error('❌ Error en query:', { error, text: text.substring(0, 100) });
    throw error;
  }
}

export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Funciones de utilidad para el esquema
export const dbUtils = {
  // Crear usuario
  async createUser(email: string, passwordHash: string, metadata: any = {}) {
    const query = `
      INSERT INTO users (email, password_hash, email_confirmed, metadata)
      VALUES ($1, $2, true, $3)
      RETURNING id, email, created_at
    `;
    const result = await pool.query(query, [email, passwordHash, JSON.stringify(metadata)]);
    return result.rows[0];
  },

  // Obtener usuario por email
  async getUserByEmail(email: string) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Crear perfil de usuario
  async createUserProfile(userId: string, profileData: any) {
    const {
      full_name,
      document_type = 'CC',
      document_number,
      phone,
      address,
      city,
      department = 'Cauca',
      role = 'votante_simpatizante'
    } = profileData;

    const query = `
      INSERT INTO user_profiles (
        user_id, full_name, document_type, document_number,
        phone, address, city, department, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId, full_name, document_type, document_number,
      phone, address, city, department, role
    ]);
    return result.rows[0];
  },

  // Obtener perfil completo del usuario
  async getUserProfile(userId: string) {
    const query = `
      SELECT 
        u.id, u.email, u.created_at, u.last_sign_in_at,
        up.*,
        os.territory_code, os.territory_name, os.municipality, os.zone, os.level
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN organizational_structure os ON u.id = os.user_id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },

  // Crear sesión
  async createSession(userId: string, token: string, expiresAt: Date, ipAddress?: string, userAgent?: string) {
    const query = `
      INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, token, expires_at
    `;
    const result = await pool.query(query, [userId, token, expiresAt, ipAddress, userAgent]);
    return result.rows[0];
  },

  // Validar sesión
  async validateSession(token: string) {
    const query = `
      SELECT s.*, u.email 
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = $1 AND s.expires_at > NOW()
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  },

  // Eliminar sesión
  async deleteSession(token: string) {
    const query = 'DELETE FROM user_sessions WHERE token = $1';
    await pool.query(query, [token]);
  },

  // Obtener mensajes del usuario
  async getUserMessages(userId: string, limit = 50, offset = 0) {
    const query = `
      SELECT 
        m.*,
        u_sender.email as sender_email,
        up_sender.full_name as sender_name
      FROM messages m
      JOIN users u_sender ON m.sender_id = u_sender.id
      LEFT JOIN user_profiles up_sender ON u_sender.id = up_sender.user_id
      WHERE m.recipient_id = $1 OR m.recipient_id IS NULL
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  },

  // Crear mensaje
  async createMessage(senderId: string, recipientId: string | null, messageData: any) {
    const { title, content, message_type = 'individual', priority = 'normal', metadata = {} } = messageData;
    
    const query = `
      INSERT INTO messages (sender_id, recipient_id, title, content, message_type, priority, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      senderId, recipientId, title, content, message_type, priority, JSON.stringify(metadata)
    ]);
    return result.rows[0];
  },

  // Obtener campañas del usuario
  async getUserCampaigns(userId: string) {
    const query = `
      SELECT * FROM campaigns 
      WHERE created_by = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Obtener estructura jerárquica
  async getHierarchy(userId: string) {
    const query = `
      WITH RECURSIVE hierarchy AS (
        SELECT 
          os.id, os.user_id, os.territory_name, os.zone, os.level,
          up.full_name, up.role,
          0 as depth
        FROM organizational_structure os
        JOIN user_profiles up ON os.user_id = up.user_id
        WHERE os.user_id = $1
        
        UNION ALL
        
        SELECT 
          os.id, os.user_id, os.territory_name, os.zone, os.level,
          up.full_name, up.role,
          h.depth + 1
        FROM organizational_structure os
        JOIN user_profiles up ON os.user_id = up.user_id
        JOIN hierarchy_relationships hr ON os.id = hr.subordinate_id
        JOIN hierarchy h ON hr.superior_id = h.id
        WHERE h.depth < 3
      )
      SELECT * FROM hierarchy ORDER BY depth, level, territory_name
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
};

export { pool };