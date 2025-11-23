// Cliente de base de datos local - reemplazo de Supabase
import { logger } from '../utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface User {
  id: string;
  email: string;
  profile: {
    full_name: string;
    role: string;
    city: string;
    municipality?: string;
    zone?: string;
    territory_name?: string;
  };
  created_at?: string;
  last_sign_in_at?: string;
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
  expiresAt: string;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  title?: string;
  content: string;
  message_type: 'individual' | 'broadcast' | 'group';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_email?: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_by: string;
  territory_scope?: string;
  created_at: string;
}

class LocalDatabaseClient {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    // Recuperar token del localStorage
    this.token = localStorage.getItem('mais_auth_token');
    const userData = localStorage.getItem('mais_user_data');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (error) {
        logger.error('Error parsing stored user data:', error);
        localStorage.removeItem('mais_user_data');
      }
    }
  }

  // Método para hacer peticiones HTTP autenticadas
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response.text() as unknown as T;
    } catch (error) {
      logger.error(`Error en petición a ${url}:`, error);
      throw error;
    }
  }

  // AUTENTICACIÓN
  
  async signUp(data: {
    email: string;
    password: string;
    full_name: string;
    document_type?: string;
    document_number: string;
    phone?: string;
    city?: string;
    role?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setAuthData(response.token, response.user);
    return response;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setAuthData(response.token, response.user);
    return response;
  }

  async signOut(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      logger.error('Error en logout:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await this.request<{ user: User }>('/auth/profile');
      this.currentUser = response.user;
      localStorage.setItem('mais_user_data', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      logger.error('Error obteniendo usuario actual:', error);
      this.clearAuthData();
      return null;
    }
  }

  async refreshToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await this.request<{ token: string; expiresAt: string }>('/auth/refresh', {
        method: 'POST',
      });

      this.token = response.token;
      localStorage.setItem('mais_auth_token', this.token);
      return true;
    } catch (error) {
      logger.error('Error renovando token:', error);
      this.clearAuthData();
      return false;
    }
  }

  // MENSAJES
  
  async getMessages(limit = 50, offset = 0): Promise<Message[]> {
    return this.request<Message[]>(`/api/messages?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(data: {
    recipient_id?: string;
    title?: string;
    content: string;
    message_type?: 'individual' | 'broadcast' | 'group';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    metadata?: any;
  }): Promise<Message> {
    return this.request<Message>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.request(`/api/messages/${messageId}/read`, {
      method: 'PATCH',
    });
  }

  // CAMPAÑAS
  
  async getCampaigns(): Promise<Campaign[]> {
    return this.request<Campaign[]>('/api/campaigns');
  }

  async createCampaign(data: {
    name: string;
    description?: string;
    campaign_type?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    territory_scope?: string;
    target_audience?: any;
    goals?: any;
  }): Promise<Campaign> {
    return this.request<Campaign>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    return this.request<Campaign>(`/api/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // FINANZAS
  
  async getCampaignFinances(campaignId?: string): Promise<any[]> {
    const endpoint = campaignId 
      ? `/api/finances?campaign_id=${campaignId}`
      : '/api/finances';
    return this.request<any[]>(endpoint);
  }

  async addFinanceEntry(data: {
    campaign_id: string;
    transaction_type: 'income' | 'expense';
    category: string;
    amount: number;
    description?: string;
    transaction_date?: string;
    payment_method?: string;
    receipt_number?: string;
    metadata?: any;
  }): Promise<any> {
    return this.request('/api/finances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ARCHIVOS
  
  async uploadFile(file: File, metadata?: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error uploading file');
    }

    return await response.json();
  }

  async getFiles(limit = 50, offset = 0): Promise<any[]> {
    return this.request<any[]>(`/api/files?limit=${limit}&offset=${offset}`);
  }

  // ANALÍTICAS
  
  async getAnalytics(period = 'monthly'): Promise<any> {
    return this.request<any>(`/api/analytics?period=${period}`);
  }

  async getPerformanceMetrics(userId?: string): Promise<any[]> {
    const endpoint = userId 
      ? `/api/analytics/metrics?user_id=${userId}`
      : '/api/analytics/metrics';
    return this.request<any[]>(endpoint);
  }

  // UTILIDADES PRIVADAS
  
  private setAuthData(token: string, user: User): void {
    this.token = token;
    this.currentUser = user;
    localStorage.setItem('mais_auth_token', token);
    localStorage.setItem('mais_user_data', JSON.stringify(user));
  }

  private clearAuthData(): void {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('mais_auth_token');
    localStorage.removeItem('mais_user_data');
  }

  // GETTERS
  
  get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  get user(): User | null {
    return this.currentUser;
  }

  // LISTENER DE EVENTOS (para reemplazar subscripciones en tiempo real)
  
  private eventListeners: Map<string, Function[]> = new Map();

  addEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // POLLING PARA SIMULAR SUBSCRIPCIONES EN TIEMPO REAL
  
  private pollingIntervals: Map<string, number> = new Map();

  startPolling(type: 'messages' | 'campaigns' | 'finances', intervalMs = 10000): void {
    if (this.pollingIntervals.has(type)) {
      return; // Ya está corriendo
    }

    const interval = window.setInterval(async () => {
      try {
        let data;
        switch (type) {
          case 'messages':
            data = await this.getMessages(10, 0); // Últimos 10 mensajes
            break;
          case 'campaigns':
            data = await this.getCampaigns();
            break;
          case 'finances':
            data = await this.getCampaignFinances();
            break;
        }
        this.emit(`${type}_update`, data);
      } catch (error) {
        logger.error(`Error en polling de ${type}:`, error);
      }
    }, intervalMs);

    this.pollingIntervals.set(type, interval);
  }

  stopPolling(type: 'messages' | 'campaigns' | 'finances'): void {
    const interval = this.pollingIntervals.get(type);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(type);
    }
  }

  stopAllPolling(): void {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.pollingIntervals.clear();
  }
}

// Instancia singleton del cliente
export const localDB = new LocalDatabaseClient();

// Compatibilidad con la API de Supabase para facilitar migración
export const supabaseCompat = {
  auth: {
    signUp: (data: any) => localDB.signUp(data),
    signIn: (email: string, password: string) => localDB.signIn(email, password),
    signOut: () => localDB.signOut(),
    user: () => localDB.user,
    getUser: () => localDB.getCurrentUser(),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Implementar cambios de estado de auth
      localDB.addEventListener('auth_change', callback);
      return {
        data: { subscription: null },
        unsubscribe: () => localDB.removeEventListener('auth_change', callback)
      };
    }
  },
  
  from: (table: string) => {
    const queryBuilder = {
      select: (columns = '*') => queryBuilder,
      insert: (data: any) => queryBuilder,
      update: (data: any) => queryBuilder,
      delete: () => queryBuilder,
      eq: (column: string, value: any) => queryBuilder,
      neq: (column: string, value: any) => queryBuilder,
      gt: (column: string, value: any) => queryBuilder,
      gte: (column: string, value: any) => queryBuilder,
      lt: (column: string, value: any) => queryBuilder,
      lte: (column: string, value: any) => queryBuilder,
      like: (column: string, pattern: string) => queryBuilder,
      in: (column: string, values: any[]) => queryBuilder,
      order: (column: string, options?: { ascending?: boolean }) => queryBuilder,
      limit: (count: number) => queryBuilder,
      range: (from: number, to: number) => queryBuilder,
      
      // Ejecutar la query
      async execute() {
        switch (table) {
          case 'messages':
            return { data: await localDB.getMessages(), error: null };
          case 'campaigns':
            return { data: await localDB.getCampaigns(), error: null };
          case 'campaign_finances':
            return { data: await localDB.getCampaignFinances(), error: null };
          default:
            throw new Error(`Tabla ${table} no implementada en cliente local`);
        }
      }
    };
    
    return queryBuilder;
  },

  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => localDB.uploadFile(file, { path, bucket }),
      list: () => localDB.getFiles(),
      remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
      createSignedUrl: (path: string, expiresIn: number) => Promise.resolve({ 
        data: { signedUrl: `${API_BASE_URL}/api/files/${path}` }, 
        error: null 
      })
    })
  }
};

export default localDB;