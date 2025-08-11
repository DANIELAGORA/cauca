// MODO DEMO PURO - Sin conexión a base de datos externa
import { User, UserRole, Message, Campaign, DatabaseEntry, Analytics, CampaignFinanceEntry } from '../types';
import { logInfo } from './logger';

// DEMO MODE: Almacenamiento completamente local
logInfo("🚀 MODO DEMO ACTIVADO - Sin base de datos externa");

class DemoStorage {
  private static instance: DemoStorage;

  static getInstance(): DemoStorage {
    if (!DemoStorage.instance) {
      DemoStorage.instance = new DemoStorage();
    }
    return DemoStorage.instance;
  }

  async init(): Promise<void> {
    logInfo("✅ Storage inicializado en modo demo - Sin conexión externa");
    return Promise.resolve();
  }

  // DEMO MODE: Métodos de autenticación simulados
  async signInWithEmail(email: string, password: string): Promise<User | null> {
    logInfo("✅ Demo SignIn simulado:", email);
    return null; // Usar mockAuth en su lugar
  }

  async signUpWithEmail(email: string, password: string, name: string, role: UserRole, region?: string, department?: string): Promise<User | null> {
    logInfo("✅ Demo SignUp simulado:", email, role);
    return null; // Usar mockAuth en su lugar
  }

  async signOut(): Promise<void> {
    logInfo("✅ Demo SignOut simulado");
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<User | null> {
    logInfo("✅ Demo getCurrentUser simulado");
    return null;
  }

  // DEMO MODE: Métodos de base de datos simulados
  async getAll<T>(tableName: string): Promise<T[]> {
    logInfo(`✅ Demo getAll simulado para tabla: ${tableName}`);
    return [];
  }

  async store<T>(tableName: string, data: T): Promise<T | null> {
    logInfo(`✅ Demo store simulado para tabla: ${tableName}`, data);
    return data;
  }

  async getCampaignFinances(userId: string): Promise<CampaignFinanceEntry[]> {
    logInfo("✅ Demo getCampaignFinances simulado para usuario:", userId);
    return [];
  }

  async addCampaignFinanceEntry(entry: CampaignFinanceEntry): Promise<CampaignFinanceEntry> {
    logInfo("✅ Demo addCampaignFinanceEntry simulado:", entry);
    return entry;
  }

  async getMessages(userId: string): Promise<Message[]> {
    logInfo("✅ Demo getMessages simulado para usuario:", userId);
    return [];
  }

  async sendMessage(message: Message): Promise<Message> {
    logInfo("✅ Demo sendMessage simulado:", message);
    return message;
  }

  async getCampaigns(userId: string): Promise<Campaign[]> {
    logInfo("✅ Demo getCampaigns simulado para usuario:", userId);
    return [];
  }

  async addCampaign(campaign: Campaign): Promise<Campaign> {
    logInfo("✅ Demo addCampaign simulado:", campaign);
    return campaign;
  }

  async getDatabaseEntries(userId: string): Promise<DatabaseEntry[]> {
    logInfo("✅ Demo getDatabaseEntries simulado para usuario:", userId);
    return [];
  }

  async addDatabaseEntry(entry: DatabaseEntry): Promise<DatabaseEntry> {
    logInfo("✅ Demo addDatabaseEntry simulado:", entry);
    return entry;
  }

  async getAnalytics(userId: string): Promise<Analytics | null> {
    logInfo("✅ Demo getAnalytics simulado para usuario:", userId);
    return null;
  }

  async updateAnalytics(analytics: Analytics): Promise<Analytics> {
    logInfo("✅ Demo updateAnalytics simulado:", analytics);
    return analytics;
  }

  // Método para subir archivos simulado
  async uploadFile(file: File, path: string): Promise<string> {
    logInfo("✅ Demo uploadFile simulado:", file.name, "a", path);
    return `demo-url/${file.name}`;
  }

  // Método para escuchar cambios simulado
  subscribeToChanges(tableName: string, callback: (data: any) => void): () => void {
    logInfo(`✅ Demo subscribeToChanges simulado para tabla: ${tableName}`);
    return () => logInfo(`✅ Demo unsubscribe simulado para tabla: ${tableName}`);
  }
}

// Exportar instancia singleton
export const storage = DemoStorage.getInstance();