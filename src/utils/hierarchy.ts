// SISTEMA JERÁRQUICO MAIS - GESTIÓN DE PERMISOS Y CREACIÓN DE ROLES
// Sistema factory para protección de datos y estructura organizacional

import { UserRole, User } from '../types';
import { CandidatoElecto, getTodosLosElectos, getElectosPorMunicipio } from '../data/estructura-jerarquica-completa';

// Definición de jerarquía y permisos
export const HIERARCHY_LEVELS = {
  'director-departamental': 1,
  'alcalde': 2,
  'diputado-asamblea': 3,
  'concejal': 4,
  'jal-local': 5,
  'coordinador-municipal': 6,
  'lider-comunitario': 7,
  'influenciador-digital': 8,
  'colaborador': 9,
  'ciudadano-base': 10
} as const;

// Permisos de creación por rol (factory pattern)
export const ROLE_CREATION_PERMISSIONS: Record<UserRole, UserRole[]> = {
  'director-departamental': [
    'alcalde', 'diputado-asamblea', 'concejal', 'jal-local', 
    'coordinador-municipal', 'lider-comunitario', 'influenciador-digital', 
    'colaborador', 'ciudadano-base'
  ],
  'alcalde': [
    'coordinador-municipal', 'lider-comunitario', 'influenciador-digital',
    'colaborador', 'ciudadano-base'
  ],
  'diputado-asamblea': [
    'lider-comunitario', 'influenciador-digital', 'colaborador', 'ciudadano-base'
  ],
  'concejal': [
    'lider-comunitario', 'colaborador', 'ciudadano-base'
  ],
  'jal-local': [
    'colaborador', 'ciudadano-base'
  ],
  'coordinador-municipal': [
    'lider-comunitario', 'colaborador', 'ciudadano-base'
  ],
  'lider-comunitario': ['colaborador', 'ciudadano-base'],
  'influenciador-digital': ['colaborador'],
  'colaborador': ['ciudadano-base'],
  'ciudadano-base': []
};

// Alcance de visualización de datos por rol
export const DATA_VISIBILITY_SCOPE: Record<UserRole, 'departamental' | 'municipal' | 'local'> = {
  'director-departamental': 'departamental', // Ve todo el departamento
  'alcalde': 'municipal',                   // Ve su municipio completo
  'diputado-asamblea': 'departamental',     // Ve todo el departamento
  'concejal': 'municipal',                  // Ve su municipio
  'jal-local': 'local',                     // Ve su localidad
  'coordinador-municipal': 'municipal',
  'lider-comunitario': 'local',
  'influenciador-digital': 'municipal',
  'colaborador': 'local',
  'ciudadano-base': 'local'
};

// Función para verificar si un usuario puede crear un rol específico
export function canUserCreateRole(creatorRole: UserRole, targetRole: UserRole): boolean {
  const allowedRoles = ROLE_CREATION_PERMISSIONS[creatorRole] || [];
  return allowedRoles.includes(targetRole);
}

// Función para obtener todos los roles que un usuario puede crear
export function getRolesUserCanCreate(userRole: UserRole): UserRole[] {
  return ROLE_CREATION_PERMISSIONS[userRole] || [];
}

// Función para obtener la red de datos visible para un usuario
export function getUserDataNetwork(user: User): CandidatoElecto[] {
  const allElectos = getTodosLosElectos();
  const scope = DATA_VISIBILITY_SCOPE[user.role];
  
  switch (scope) {
    case 'departamental':
      // Ve todos los electos del departamento
      return allElectos.filter(electo => electo.partidoCodigo === '00012');
      
    case 'municipal':
      // Ve todos los electos de su municipio + coordinadores
      if (user.municipality) {
        return getElectosPorMunicipio(user.municipality);
      }
      return [];
      
    case 'local':
      // Ve solo su propia información y subordinados directos
      return allElectos.filter(electo => 
        electo.municipio === user.municipality && 
        HIERARCHY_LEVELS[electo.role as UserRole] >= HIERARCHY_LEVELS[user.role]
      );
      
    default:
      return [];
  }
}

// Función para verificar si un usuario puede ver los datos de otro
export function canUserViewData(viewer: User, target: User): boolean {
  const viewerLevel = HIERARCHY_LEVELS[viewer.role];
  const targetLevel = HIERARCHY_LEVELS[target.role];
  
  // Los superiores pueden ver a los inferiores
  if (viewerLevel < targetLevel) return true;
  
  // Los del mismo nivel pueden verse entre sí si están en el mismo territorio
  if (viewerLevel === targetLevel && viewer.municipality === target.municipality) return true;
  
  // Casos especiales para roles departamentales
  if (viewer.role === 'director-departamental' || viewer.role === 'diputado-asamblea') {
    return true; // Ven todo el departamento
  }
  
  return false;
}

// Función para obtener electos reales por municipio con permisos
export function getRealElectosByMunicipality(municipality: string): CandidatoElecto[] {
  const electos = getElectosPorMunicipio(municipality);
  return electos.filter(electo => electo.esRealElecto);
}

// Factory para crear usuario con validación jerárquica
export function createUserWithHierarchy(
  creatorRole: UserRole,
  newUserData: Partial<User>,
  targetRole: UserRole
): { success: boolean; error?: string; user?: User } {
  
  // Verificar permisos de creación
  if (!canUserCreateRole(creatorRole, targetRole)) {
    return {
      success: false,
      error: `El rol ${creatorRole} no tiene permisos para crear usuarios con rol ${targetRole}`
    };
  }
  
  // Validar datos requeridos
  if (!newUserData.email || !newUserData.name) {
    return {
      success: false,
      error: 'Email y nombre son requeridos'
    };
  }
  
  // Crear usuario con estructura jerárquica
  const newUser: User = {
    id: crypto.randomUUID(),
    email: newUserData.email,
    name: newUserData.name,
    role: targetRole,
    hierarchyLevel: HIERARCHY_LEVELS[targetRole],
    canCreateRoles: getRolesUserCanCreate(targetRole),
    managedTerritories: [newUserData.municipality || ''].filter(Boolean),
    esRealElecto: false, // Por defecto, solo los importados son electos reales
    region: newUserData.region || 'Andina',
    department: newUserData.department || 'Cauca',
    municipality: newUserData.municipality,
    phone: newUserData.phone,
    isActive: true,
    isRealUser: true,
    metadata: {
      createdBy: creatorRole,
      createdAt: new Date().toISOString(),
      isFactory: true // Marca para sistema factory
    }
  };
  
  return {
    success: true,
    user: newUser
  };
}

// Sistema de backup factory para protección de datos
export const DATA_PROTECTION = {
  // Prevenir pérdida de datos de electos reales
  PROTECTED_ROLES: ['director-departamental', 'alcalde', 'diputado-asamblea', 'concejal', 'jal-local'],
  
  // Validar que no se eliminen electos reales
  canDeleteUser(user: User): boolean {
    if (user.esRealElecto) return false;
    if (this.PROTECTED_ROLES.includes(user.role)) return false;
    return true;
  },
  
  // Backup automático antes de cambios críticos
  createBackup(users: User[]): string {
    const backup = {
      timestamp: new Date().toISOString(),
      realElectos: users.filter(u => u.esRealElecto),
      allUsers: users,
      version: '1.0'
    };
    return JSON.stringify(backup, null, 2);
  }
};

export default {
  HIERARCHY_LEVELS,
  ROLE_CREATION_PERMISSIONS,
  DATA_VISIBILITY_SCOPE,
  canUserCreateRole,
  getRolesUserCanCreate,
  getUserDataNetwork,
  canUserViewData,
  getRealElectosByMunicipality,
  createUserWithHierarchy,
  DATA_PROTECTION
};