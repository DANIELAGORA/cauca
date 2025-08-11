// SERVICIO DE ESTRUCTURA ORGANIZACIONAL MAIS
// Manejo completo de jerarquía, creación de roles y flujo de datos

import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type OrganizationalStructure = Database['public']['Tables']['organizational_structure']['Row'];
type OrganizationalInsert = Database['public']['Tables']['organizational_structure']['Insert'];
type HierarchyRelationship = Database['public']['Tables']['hierarchy_relationships']['Row'];
type PerformanceMetrics = Database['public']['Tables']['performance_metrics']['Row'];
type InternalCommunication = Database['public']['Tables']['internal_communications']['Row'];

// Tipos para la estructura organizacional
export interface OrganizationMember extends OrganizationalStructure {
  subordinates?: OrganizationMember[];
  superior?: OrganizationMember;
  managedTerritories?: string[];
}

export interface RoleCreationRequest {
  fullName: string;
  email: string;
  phone?: string;
  roleType: string;
  territory: {
    region?: string;
    department?: string;
    municipality?: string;
  };
  responsibilities?: string[];
  permissions?: Record<string, boolean>;
}

export interface HierarchyReport {
  member: OrganizationMember;
  directSubordinates: OrganizationMember[];
  allSubordinates: OrganizationMember[];
  superiorChain: OrganizationMember[];
  territorialScope: string[];
}

class OrganizationalService {
  
  // **GESTIÓN DE ESTRUCTURA ORGANIZACIONAL**
  
  async getCurrentUserOrgData(): Promise<OrganizationMember | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('organizational_structure')
      .select(`
        *,
        superior:reports_to (
          id, full_name, role_type, email, hierarchy_level
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching org data:', error);
      return null;
    }

    return data as OrganizationMember;
  }

  async getOrganizationHierarchy(rootId?: string): Promise<OrganizationMember[]> {
    let query = supabase
      .from('organizational_structure')
      .select(`
        *,
        subordinates:organizational_structure!reports_to (
          id, full_name, role_type, email, hierarchy_level, territory_level
        )
      `)
      .eq('is_active', true)
      .order('hierarchy_level', { ascending: true });

    if (rootId) {
      query = query.eq('reports_to', rootId);
    } else {
      query = query.is('reports_to', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching hierarchy:', error);
      return [];
    }

    return data as OrganizationMember[];
  }

  async getDirectSubordinates(memberId: string): Promise<OrganizationMember[]> {
    const { data, error } = await supabase
      .from('organizational_structure')
      .select('*')
      .eq('reports_to', memberId)
      .eq('is_active', true)
      .order('hierarchy_level', { ascending: true });

    if (error) {
      console.error('Error fetching subordinates:', error);
      return [];
    }

    return data;
  }

  async getAllSubordinates(memberId: string): Promise<OrganizationMember[]> {
    const { data, error } = await supabase
      .from('hierarchy_relationships')
      .select(`
        subordinate:subordinate_id (
          id, full_name, role_type, email, hierarchy_level, 
          territory_level, department, municipality
        )
      `)
      .eq('superior_id', memberId);

    if (error) {
      console.error('Error fetching all subordinates:', error);
      return [];
    }

    return data.map(rel => rel.subordinate).filter(Boolean) as OrganizationMember[];
  }

  // **SISTEMA DE CREACIÓN DE ROLES**

  async canCreateRole(creatorId: string, roleType: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('organizational_structure')
      .select('can_create_roles, role_type, hierarchy_level')
      .eq('id', creatorId)
      .single();

    if (error || !data) return false;

    const allowedRoles = data.can_create_roles as string[];
    return allowedRoles.includes(roleType);
  }

  async createOrganizationMember(
    creatorId: string, 
    roleRequest: RoleCreationRequest
  ): Promise<{ success: boolean; member?: OrganizationMember; error?: string }> {
    
    // Verificar permisos del creador
    const canCreate = await this.canCreateRole(creatorId, roleRequest.roleType);
    if (!canCreate) {
      return { success: false, error: 'No tiene permisos para crear este rol' };
    }

    // Obtener datos del creador para establecer jerarquía
    const { data: creator } = await supabase
      .from('organizational_structure')
      .select('hierarchy_level, department, region')
      .eq('id', creatorId)
      .single();

    if (!creator) {
      return { success: false, error: 'Creador no encontrado' };
    }

    // Determinar nivel jerárquico del nuevo rol
    const hierarchyLevel = this.getHierarchyLevelForRole(roleRequest.roleType);
    
    // Crear usuario en auth si no existe
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: roleRequest.email,
      password: 'agoramais2025', // Contraseña temporal
      email_confirm: true
    });

    if (authError && authError.message !== 'User already registered') {
      return { success: false, error: `Error creando usuario: ${authError.message}` };
    }

    // Crear perfil en organizational_structure
    const newMember: OrganizationalInsert = {
      user_id: authUser?.user?.id,
      full_name: roleRequest.fullName,
      email: roleRequest.email,
      phone: roleRequest.phone,
      role_type: roleRequest.roleType as any,
      territory_level: this.getTerritoryLevelForRole(roleRequest.roleType) as any,
      region: roleRequest.territory.region || creator.region,
      department: roleRequest.territory.department || creator.department,
      municipality: roleRequest.territory.municipality,
      reports_to: creatorId,
      created_by: creatorId,
      hierarchy_level: hierarchyLevel,
      can_create_roles: this.getAllowedSubRoles(roleRequest.roleType),
      responsibilities: roleRequest.responsibilities || [],
      permissions: roleRequest.permissions || {},
      is_active: true
    };

    const { data: insertedMember, error: insertError } = await supabase
      .from('organizational_structure')
      .insert(newMember)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating member:', insertError);
      return { success: false, error: `Error creando miembro: ${insertError.message}` };
    }

    return { success: true, member: insertedMember as OrganizationMember };
  }

  // **SISTEMA DE MÉTRICAS Y REPORTES**

  async submitPerformanceReport(
    memberId: string,
    reportData: {
      periodStart: string;
      periodEnd: string;
      metrics: {
        meetingsAttended?: number;
        projectsInitiated?: number;
        citizensServed?: number;
        socialMediaReach?: number;
      };
      reportToSuperior: string;
      teamPerformance?: Record<string, any>;
    }
  ): Promise<boolean> {
    const { error } = await supabase
      .from('performance_metrics')
      .insert({
        organization_member_id: memberId,
        report_period_start: reportData.periodStart,
        report_period_end: reportData.periodEnd,
        meetings_attended: reportData.metrics.meetingsAttended || 0,
        projects_initiated: reportData.metrics.projectsInitiated || 0,
        citizens_served: reportData.metrics.citizensServed || 0,
        social_media_reach: reportData.metrics.socialMediaReach || 0,
        report_to_superior: reportData.reportToSuperior,
        team_performance: reportData.teamPerformance || {}
      });

    return !error;
  }

  async getPerformanceReports(
    memberId: string,
    includeSubordinates = false
  ): Promise<PerformanceMetrics[]> {
    let query = supabase
      .from('performance_metrics')
      .select(`
        *,
        member:organization_member_id (
          full_name, role_type, department, municipality
        )
      `);

    if (includeSubordinates) {
      const subordinates = await this.getAllSubordinates(memberId);
      const subordinateIds = subordinates.map(s => s.id);
      query = query.in('organization_member_id', [memberId, ...subordinateIds]);
    } else {
      query = query.eq('organization_member_id', memberId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return [];
    }

    return data;
  }

  // **SISTEMA DE COMUNICACIONES INTERNAS**

  async sendInternalMessage(
    senderId: string,
    recipientIds: string[],
    message: {
      subject: string;
      content: string;
      type: 'report' | 'directive' | 'consultation' | 'information';
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      requiresResponse?: boolean;
      responseDeadline?: string;
    }
  ): Promise<boolean> {
    const { error } = await supabase
      .from('internal_communications')
      .insert({
        sender_id: senderId,
        recipient_ids: recipientIds,
        subject: message.subject,
        message: message.content,
        message_type: message.type,
        priority: message.priority || 'normal',
        requires_response: message.requiresResponse || false,
        response_deadline: message.responseDeadline
      });

    return !error;
  }

  async getInternalMessages(
    userId: string,
    direction: 'received' | 'sent' | 'all' = 'received'
  ): Promise<InternalCommunication[]> {
    let query = supabase
      .from('internal_communications')
      .select(`
        *,
        sender:sender_id (full_name, role_type, email)
      `);

    switch (direction) {
      case 'received':
        query = query.contains('recipient_ids', [userId]);
        break;
      case 'sent':
        query = query.eq('sender_id', userId);
        break;
      case 'all':
        query = query.or(`sender_id.eq.${userId},recipient_ids.cs.{${userId}}`);
        break;
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data;
  }

  // **UTILIDADES PRIVADAS**

  private getHierarchyLevelForRole(roleType: string): number {
    const levels: Record<string, number> = {
      'director-nacional': 1,
      'coordinador-regional': 2,
      'director-departamental': 3,
      'coordinador-municipal': 4,
      'concejal-electo': 4,
      'candidato': 4,
      'lider-local': 5,
      'influencer-digital': 4,
      'ciudadano-base': 6
    };
    return levels[roleType] || 6;
  }

  private getTerritoryLevelForRole(roleType: string): string {
    const levels: Record<string, string> = {
      'director-nacional': 'nacional',
      'coordinador-regional': 'regional',
      'director-departamental': 'departamental',
      'coordinador-municipal': 'municipal',
      'concejal-electo': 'municipal',
      'candidato': 'municipal',
      'lider-local': 'local',
      'influencer-digital': 'regional',
      'ciudadano-base': 'local'
    };
    return levels[roleType] || 'local';
  }

  private getAllowedSubRoles(roleType: string): string[] {
    const allowedRoles: Record<string, string[]> = {
      'director-nacional': ['coordinador-regional'],
      'coordinador-regional': ['director-departamental'],
      'director-departamental': ['coordinador-municipal', 'concejal-electo', 'lider-local'],
      'coordinador-municipal': ['lider-local', 'ciudadano-base'],
      'concejal-electo': ['lider-local', 'ciudadano-base'],
      'candidato': ['lider-local', 'ciudadano-base'],
      'lider-local': ['ciudadano-base'],
      'influencer-digital': ['ciudadano-base']
    };
    return allowedRoles[roleType] || [];
  }
}

export const organizationalService = new OrganizationalService();