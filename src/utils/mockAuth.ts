import { User, UserRole } from '../types';
import { demoUsers, realAdminUsers } from '../data/demoUsers';

export class MockAuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'mais_mock_user';

  constructor() {
    // Cargar usuario desde localStorage si existe
    const savedUser = localStorage.getItem(this.STORAGE_KEY);
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        logError('Error loading saved user:', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  async signUpWithEmail(
    email: string, 
    password: string, 
    role: UserRole, 
    name: string, 
    region?: string, 
    department?: string
  ): Promise<User> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verificar si es un usuario demo predefinido
    const demoUser = [...demoUsers, ...realAdminUsers].find(u => u.email === email);
    if (demoUser) {
      this.currentUser = demoUser;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    // Crear nuevo usuario mock
    const newUser: User = {
      id: `mock-${Date.now()}`,
      email,
      name,
      role,
      region,
      department,
      joinedAt: new Date(),
      lastActive: new Date(),
      isActive: true,
      permissions: this.getRolePermissions(role)
    };

    this.currentUser = newUser;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Buscar usuario en datos demo
    const user = [...demoUsers, ...realAdminUsers].find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña mock
    const validPasswords = ['demo123', 'MAIS2024!Admin'];
    if (!validPasswords.includes(password)) {
      throw new Error('Contraseña incorrecta');
    }

    this.currentUser = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Método para login con rol (para RoleSelector)
  login(role: UserRole, name: string, region?: string, department?: string): User {
    logInfo(`🔍 Buscando usuario demo para rol: ${role}`);
    
    // Buscar usuario demo por rol
    const demoUser = [...demoUsers, ...realAdminUsers].find(u => u.role === role);
    if (demoUser) {
      logInfo(`✅ Usuario demo encontrado:`, demoUser);
      this.currentUser = demoUser;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    logInfo(`⚠️ No se encontró usuario demo para rol ${role}, creando temporal`);
    // Crear usuario temporal si no existe demo
    const tempUser: User = {
      id: `temp-${Date.now()}`,
      email: `${name.toLowerCase().replace(' ', '.')}@mais.demo`,
      name,
      role,
      region,
      department,
      joinedAt: new Date(),
      lastActive: new Date(),
      isActive: true,
      permissions: this.getRolePermissions(role)
    };

    logInfo(`✅ Usuario temporal creado:`, tempUser);
    this.currentUser = tempUser;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tempUser));
    return tempUser;
  }

  // Método específico para login con credenciales desde el DirectLogin
  loginWithCredentials(name: string, email: string, password: string): User {
    // Buscar usuario en datos demo por email
    const user = [...demoUsers, ...realAdminUsers].find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña mock
    const validPasswords = ['demo123', 'MAIS2024!Admin'];
    if (!validPasswords.includes(password)) {
      throw new Error('Contraseña incorrecta');
    }

    this.currentUser = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  private getRolePermissions(role: UserRole): string[] {
    const permissions: Record<UserRole, string[]> = {
      'comite-ejecutivo-nacional': ['all'],
      'lider-regional': ['region-management', 'user-management', 'campaigns'],
      'comite-departamental': ['department-management', 'campaigns', 'reports'],
      'candidato': ['own-campaigns', 'metrics', 'content'],
      'influenciador': ['content-creation', 'social-media', 'campaigns'],
      'lider': ['community-management', 'reports', 'messaging'],
      'votante': ['basic-access', 'messaging', 'voting']
    };
    return permissions[role] || ['basic-access'];
  }
}

export const mockAuthService = new MockAuthService();
export const mockAuth = mockAuthService; // Backward compatibility