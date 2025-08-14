// CLEAN ARCHITECTURE: SERVICIO DE GESTIÓN DE ROLES
// Implementación robusta para estructura jerárquica territorial

import {
  UserRoleHierarchical,
  UserTerritorial,
  ZonaCauca,
  HIERARCHY_LEVELS,
  ROLE_CREATION_MATRIX,
  MUNICIPIOS_POR_ZONA,
  canCreateInTerritory,
  getZonaByMunicipality,
  createMunicipalRole
} from '../types/roles';
import { supabase } from '../lib/supabase';
import { generateTemporaryPassword } from '../data/estructura-jerarquica-completa';
import { logError, logInfo } from '../utils/logger';

export interface CreateUserRequest {
  creatorId: string;
  name: string;
  email: string;
  targetRole: UserRoleHierarchical;
  municipality?: string;
  zona?: ZonaCauca;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface CreateUserResponse {
  success: boolean;
  user?: UserTerritorial;
  temporaryPassword?: string;
  error?: string;
  validationErrors?: string[];
}

export interface RoleValidationResult {
  canCreate: boolean;
  errors: string[];
  warnings: string[];
  suggestedRole?: UserRoleHierarchical;
}

export class RoleManagementService {
  
  /**
   * VALIDAR PERMISOS DE CREACIÓN
   * Verifica si un usuario puede crear otro rol específico
   */
  public static validateRoleCreation(
    creator: UserTerritorial,
    targetRole: UserRoleHierarchical,
    targetMunicipality?: string,
    targetZona?: ZonaCauca
  ): RoleValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 1. Verificar permisos básicos de rol
    const allowedRoles = ROLE_CREATION_MATRIX[creator.role] || [];
    if (!allowedRoles.includes(targetRole)) {
      errors.push(`El rol ${creator.role} no puede crear usuarios con rol ${targetRole}`);
    }
    
    // 2. Verificar jerarquía (no puede crear roles superiores o iguales)
    const creatorLevel = HIERARCHY_LEVELS[creator.role];
    const targetLevel = HIERARCHY_LEVELS[targetRole];
    
    if (creatorLevel >= targetLevel) {
      errors.push(`No se puede crear un rol de nivel ${targetLevel} desde nivel ${creatorLevel}`);
    }
    
    // 3. Validar restricciones territoriales
    if (!canCreateInTerritory(
      creator.role,
      creator.zona,
      creator.municipality,
      targetRole,
      targetZona,
      targetMunicipality
    )) {
      errors.push(`No tiene permisos territoriales para crear este rol en esa ubicación`);
    }
    
    // 4. Validaciones específicas por tipo de rol
    switch (targetRole) {
      case 'lider-municipal':
        if (!targetMunicipality) {
          errors.push('Se requiere especificar el municipio para líderes municipales');
        } else if (!targetZona) {
          const inferredZona = getZonaByMunicipality(targetMunicipality);
          if (!inferredZona) {
            errors.push(`No se pudo determinar la zona para el municipio: ${targetMunicipality}`);
          } else {
            warnings.push(`Zona inferida automáticamente: ${inferredZona}`);
          }
        }
        break;
        
      case 'concejal':
        if (!targetMunicipality) {
          errors.push('Se requiere especificar el municipio para concejales');
        }
        break;
        
      case 'coordinador-zona-norte':
      case 'coordinador-zona-sur':
      case 'coordinador-zona-centro':
      case 'coordinador-zona-pacifico':
      case 'coordinador-zona-macizo':
        if (creator.role !== 'coordinador-departamental') {
          errors.push('Solo el coordinador departamental puede crear coordinadores zonales');
        }
        break;
    }
    
    // 5. Sugerir rol alternativo si hay errores
    let suggestedRole: UserRoleHierarchical | undefined;
    if (errors.length > 0) {
      const possibleRoles = ROLE_CREATION_MATRIX[creator.role];
      if (possibleRoles.length > 0) {
        // Sugerir el rol más cercano al solicitado
        suggestedRole = possibleRoles.find(role => 
          HIERARCHY_LEVELS[role] === Math.min(...possibleRoles.map(r => HIERARCHY_LEVELS[r]))
        );
      }
    }
    
    return {
      canCreate: errors.length === 0,
      errors,
      warnings,
      suggestedRole
    };
  }
  
  /**
   * CREAR USUARIO CON VALIDACIONES COMPLETAS
   */
  public static async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      logInfo(`Iniciando creación de usuario: ${request.email} con rol ${request.targetRole}`);
      
      // 1. Obtener datos del creador
      const creator = await this.getUserById(request.creatorId);
      if (!creator) {
        return {
          success: false,
          error: 'Usuario creador no encontrado'
        };
      }
      
      // 2. Validar permisos de creación
      const validation = this.validateRoleCreation(
        creator,
        request.targetRole,
        request.municipality,
        request.zona
      );
      
      if (!validation.canCreate) {
        return {
          success: false,
          error: 'Permisos insuficientes para crear este usuario',
          validationErrors: validation.errors
        };
      }
      
      // 3. Preparar datos del nuevo usuario
      const zona = request.zona || (request.municipality ? getZonaByMunicipality(request.municipality) : undefined);
      const temporaryPassword = generateTemporaryPassword();
      
      const newUser: UserTerritorial = {
        id: crypto.randomUUID(),
        email: request.email,
        name: request.name,
        role: request.targetRole,
        department: 'Cauca',
        zona,
        municipality: request.municipality,
        hierarchyLevel: HIERARCHY_LEVELS[request.targetRole],
        reportsTo: creator.id,
        canCreateRoles: ROLE_CREATION_MATRIX[request.targetRole] || [],
        managedTerritories: request.municipality ? [request.municipality] : (zona ? MUNICIPIOS_POR_ZONA[zona] : []),
        esRealElecto: false,
        isActive: true,
        createdAt: new Date(),
        permissions: this.generatePermissions(request.targetRole),
        metadata: {
          ...request.metadata,
          createdBy: creator.id,
          createdByRole: creator.role,
          temporaryPassword: true
        }
      };
      
      // 4. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: request.email,
        password: temporaryPassword
      });
      
      if (authError) {
        logError('Error creando usuario en Auth:', authError);
        return {
          success: false,
          error: `Error en autenticación: ${authError.message}`
        };
      }
      
      if (authData.user) {
        newUser.id = authData.user.id;
      }
      
      // 5. Crear perfil en base de datos
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.name,
          role: this.mapToSupabaseRole(newUser.role),
          status: 'active',
          department: newUser.department,
          municipality: newUser.municipality,
          zona: newUser.zona,
          hierarchy_level: newUser.hierarchyLevel,
          reports_to: newUser.reportsTo,
          managed_territories: newUser.managedTerritories,
          permissions: newUser.permissions,
          metadata: newUser.metadata
        });
      
      if (profileError) {
        logError('Error creando perfil:', profileError);
        return {
          success: false,
          error: `Error creando perfil: ${profileError.message}`
        };
      }
      
      // 6. Log y notificación exitosa
      logInfo(`Usuario creado exitosamente: ${newUser.email} (${newUser.role})`);
      
      return {
        success: true,
        user: newUser,
        temporaryPassword
      };
      
    } catch (error) {
      logError('Error inesperado creando usuario:', error);
      return {
        success: false,
        error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * OBTENER USUARIOS QUE UN ROL PUEDE CREAR
   */
  public static getCreatableRoles(userRole: UserRoleHierarchical): UserRoleHierarchical[] {
    return ROLE_CREATION_MATRIX[userRole] || [];
  }
  
  /**
   * OBTENER USUARIOS POR JERARQUÍA
   */
  public static async getUsersByHierarchy(
    userId: string,
    includeSubordinates: boolean = true
  ): Promise<UserTerritorial[]> {
    try {
      const user = await this.getUserById(userId);
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(
          includeSubordinates 
            ? `reports_to.eq.${userId},id.eq.${userId}`
            : `id.eq.${userId}`
        );
      
      if (error) {
        logError('Error obteniendo usuarios por jerarquía:', error);
        return [];
      }
      
      return data?.map(this.mapFromSupabaseProfile) || [];
    } catch (error) {
      logError('Error inesperado obteniendo jerarquía:', error);
      return [];
    }
  }
  
  /**
   * VALIDAR ESTRUCTURA TERRITORIAL COMPLETA
   */
  public static async validateTerritorialStructure(): Promise<{
    isValid: boolean;
    missing: string[];
    suggestions: string[];
  }> {
    const missing: string[] = [];
    const suggestions: string[] = [];
    
    try {
      // 1. Verificar que existe coordinador departamental
      const departmentalCoord = await this.getUsersByRole('coordinador-departamental');
      if (departmentalCoord.length === 0) {
        missing.push('Falta Coordinador Departamental');
        suggestions.push('Crear coordinador departamental como primer paso');
      }
      
      // 2. Verificar coordinadores zonales
      const zonalRoles: UserRoleHierarchical[] = [
        'coordinador-zona-norte',
        'coordinador-zona-sur', 
        'coordinador-zona-centro',
        'coordinador-zona-pacifico',
        'coordinador-zona-macizo'
      ];
      
      for (const zoneRole of zonalRoles) {
        const zoneCoords = await this.getUsersByRole(zoneRole);
        if (zoneCoords.length === 0) {
          missing.push(`Falta ${zoneRole.replace('coordinador-zona-', 'Coordinador Zona ')}`);
        }
      }
      
      // 3. Verificar cobertura municipal
      const municipalLeaders = await this.getUsersByRole('lider-municipal');
      const totalMunicipios = Object.values(MUNICIPIOS_POR_ZONA).flat().length;
      
      if (municipalLeaders.length < totalMunicipios * 0.5) {
        suggestions.push(`Solo ${municipalLeaders.length} de ${totalMunicipios} municipios tienen líder asignado`);
      }
      
      return {
        isValid: missing.length === 0,
        missing,
        suggestions
      };
      
    } catch (error) {
      logError('Error validando estructura territorial:', error);
      return {
        isValid: false,
        missing: ['Error técnico en validación'],
        suggestions: ['Revisar conectividad a base de datos']
      };
    }
  }
  
  // MÉTODOS AUXILIARES PRIVADOS
  
  private static async getUserById(id: string): Promise<UserTerritorial | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        logError('Error obteniendo usuario por ID:', error);
        return null;
      }
      
      return this.mapFromSupabaseProfile(data);
    } catch (error) {
      logError('Error inesperado obteniendo usuario:', error);
      return null;
    }
  }
  
  private static async getUsersByRole(role: UserRoleHierarchical): Promise<UserTerritorial[]> {
    try {
      const supabaseRole = this.mapToSupabaseRole(role);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', supabaseRole);
      
      if (error) {
        logError('Error obteniendo usuarios por rol:', error);
        return [];
      }
      
      return data?.map(this.mapFromSupabaseProfile) || [];
    } catch (error) {
      logError('Error inesperado obteniendo usuarios por rol:', error);
      return [];
    }
  }
  
  private static generatePermissions(role: UserRoleHierarchical): string[] {
    const basePermissions = ['dashboard.view', 'profile.edit'];
    
    switch (role) {
      case 'coordinador-departamental':
        return [...basePermissions, 'users.create', 'users.manage', 'analytics.department', 'campaigns.manage'];
        
      case 'coordinador-zona-norte':
      case 'coordinador-zona-sur':
      case 'coordinador-zona-centro':
      case 'coordinador-zona-pacifico':
      case 'coordinador-zona-macizo':
        return [...basePermissions, 'users.create.municipal', 'analytics.zone', 'campaigns.zone'];
        
      case 'lider-municipal':
        return [...basePermissions, 'users.create.local', 'analytics.municipal', 'campaigns.municipal'];
        
      case 'concejal':
        return [...basePermissions, 'users.create.community', 'analytics.municipal'];
        
      default:
        return basePermissions;
    }
  }
  
  private static mapToSupabaseRole(role: UserRoleHierarchical): string {
    // Mapear roles nuevos a roles existentes en Supabase
    const mapping: Record<UserRoleHierarchical, string> = {
      'coordinador-departamental': 'comite-departamental',
      'coordinador-zona-norte': 'lider-regional',
      'coordinador-zona-sur': 'lider-regional',
      'coordinador-zona-centro': 'lider-regional',
      'coordinador-zona-pacifico': 'lider-regional',
      'coordinador-zona-macizo': 'lider-regional',
      'lider-municipal': 'candidato',
      'concejal': 'votante',
      'lider-comunitario': 'votante',
      'influenciador-digital': 'votante',
      'colaborador': 'votante',
      'votante': 'votante',
      'simpatizante': 'votante'
    };
    
    return mapping[role] || 'votante';
  }
  
  private static mapFromSupabaseProfile(profile: any): UserTerritorial {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.full_name || profile.email,
      role: profile.role as UserRoleHierarchical,
      department: 'Cauca',
      zona: profile.zona as ZonaCauca,
      municipality: profile.municipality,
      hierarchyLevel: profile.hierarchy_level || HIERARCHY_LEVELS[profile.role] || 6,
      reportsTo: profile.reports_to,
      canCreateRoles: profile.can_create_roles || [],
      managedTerritories: profile.managed_territories || [],
      esRealElecto: profile.es_real_electo || false,
      isActive: profile.status === 'active',
      createdAt: new Date(profile.created_at),
      lastActive: profile.last_active ? new Date(profile.last_active) : undefined,
      permissions: profile.permissions || [],
      metadata: profile.metadata || {}
    };
  }
}

export default RoleManagementService;