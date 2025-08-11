// HOOKS PARA MANEJO DE ESTRUCTURA ORGANIZACIONAL MAIS
// Sistema reactivo para jerarquía, creación de roles y comunicaciones

import { useState, useEffect, useCallback } from 'react';
import { organizationalService, OrganizationMember, RoleCreationRequest } from '../services/organizationalService';
import { useAuth } from './useAuth';

export interface UseOrganizationalStructureReturn {
  // Estado actual del usuario
  currentMember: OrganizationMember | null;
  isLoading: boolean;
  
  // Jerarquía
  directSubordinates: OrganizationMember[];
  allSubordinates: OrganizationMember[];
  superiorChain: OrganizationMember[];
  
  // Acciones
  createRole: (roleRequest: RoleCreationRequest) => Promise<{ success: boolean; error?: string }>;
  refreshHierarchy: () => Promise<void>;
  
  // Permisos
  canCreateRoles: string[];
  hasPermission: (action: string) => boolean;
}

export function useOrganizationalStructure(): UseOrganizationalStructureReturn {
  const { user } = useAuth();
  const [currentMember, setCurrentMember] = useState<OrganizationMember | null>(null);
  const [directSubordinates, setDirectSubordinates] = useState<OrganizationMember[]>([]);
  const [allSubordinates, setAllSubordinates] = useState<OrganizationMember[]>([]);
  const [superiorChain, setSuperiorChain] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos organizacionales del usuario actual
  const loadCurrentMemberData = useCallback(async () => {
    if (!user) {
      setCurrentMember(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const memberData = await organizationalService.getCurrentUserOrgData();
      setCurrentMember(memberData);

      if (memberData) {
        // Cargar subordinados directos
        const directSubs = await organizationalService.getDirectSubordinates(memberData.id);
        setDirectSubordinates(directSubs);

        // Cargar todos los subordinados
        const allSubs = await organizationalService.getAllSubordinates(memberData.id);
        setAllSubordinates(allSubs);

        // Construir cadena de superiores
        await buildSuperiorChain(memberData);
      }
    } catch (error) {
      console.error('Error loading organizational data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Construir cadena jerárquica hacia arriba
  const buildSuperiorChain = async (member: OrganizationMember) => {
    const chain: OrganizationMember[] = [];
    const currentSuperior = member.superior;

    while (currentSuperior && chain.length < 10) { // Límite de seguridad
      chain.push(currentSuperior);
      // Aquí podrías cargar el siguiente superior si es necesario
      break; // Por ahora solo un nivel hacia arriba
    }

    setSuperiorChain(chain);
  };

  // Crear nuevo rol/miembro en la organización
  const createRole = useCallback(async (roleRequest: RoleCreationRequest) => {
    if (!currentMember) {
      return { success: false, error: 'Usuario no autenticado en la organización' };
    }

    try {
      const result = await organizationalService.createOrganizationMember(
        currentMember.id,
        roleRequest
      );

      if (result.success) {
        // Refrescar la jerarquía para mostrar el nuevo miembro
        await refreshHierarchy();
      }

      return result;
    } catch (error) {
      console.error('Error creating role:', error);
      return { success: false, error: 'Error interno del sistema' };
    }
  }, [currentMember]);

  // Refrescar toda la jerarquía
  const refreshHierarchy = useCallback(async () => {
    await loadCurrentMemberData();
  }, [loadCurrentMemberData]);

  // Verificar permisos del usuario
  const hasPermission = useCallback((action: string): boolean => {
    if (!currentMember?.permissions) return false;
    
    const permissions = currentMember.permissions as Record<string, boolean>;
    return permissions[action] === true;
  }, [currentMember]);

  // Efectos
  useEffect(() => {
    loadCurrentMemberData();
  }, [loadCurrentMemberData]);

  return {
    currentMember,
    isLoading,
    directSubordinates,
    allSubordinates,
    superiorChain,
    createRole,
    refreshHierarchy,
    canCreateRoles: currentMember?.can_create_roles as string[] || [],
    hasPermission
  };
}

// Hook específico para reportes y métricas
export function usePerformanceMetrics() {
  const { currentMember } = useOrganizationalStructure();
  const [reports, setReports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = useCallback(async (reportData: any) => {
    if (!currentMember) return { success: false, error: 'No autenticado' };

    try {
      setIsSubmitting(true);
      const success = await organizationalService.submitPerformanceReport(
        currentMember.id,
        reportData
      );
      
      if (success) {
        // Refrescar reportes
        loadReports();
      }

      return { success, error: success ? null : 'Error al enviar reporte' };
    } catch (error) {
      console.error('Error submitting report:', error);
      return { success: false, error: 'Error interno' };
    } finally {
      setIsSubmitting(false);
    }
  }, [currentMember]);

  const loadReports = useCallback(async () => {
    if (!currentMember) return;

    try {
      const reportData = await organizationalService.getPerformanceReports(
        currentMember.id,
        true // Incluir subordinados
      );
      setReports(reportData as any);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  }, [currentMember]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return {
    reports,
    isSubmitting,
    submitReport,
    refreshReports: loadReports
  };
}

// Hook para comunicaciones internas
export function useInternalCommunications() {
  const { currentMember, allSubordinates, superiorChain } = useOrganizationalStructure();
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(async (messageData: {
    recipients: string[];
    subject: string;
    content: string;
    type: 'report' | 'directive' | 'consultation' | 'information';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }) => {
    if (!currentMember) return { success: false, error: 'No autenticado' };

    try {
      setIsSending(true);
      const success = await organizationalService.sendInternalMessage(
        currentMember.id,
        messageData.recipients,
        {
          subject: messageData.subject,
          content: messageData.content,
          type: messageData.type,
          priority: messageData.priority
        }
      );

      if (success) {
        loadMessages();
      }

      return { success, error: success ? null : 'Error al enviar mensaje' };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Error interno' };
    } finally {
      setIsSending(false);
    }
  }, [currentMember]);

  const loadMessages = useCallback(async () => {
    if (!currentMember) return;

    try {
      const messageData = await organizationalService.getInternalMessages(
        currentMember.id,
        'all'
      );
      setMessages(messageData as any);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [currentMember]);

  const getAvailableRecipients = useCallback(() => {
    const recipients = [
      ...superiorChain.map(s => ({ id: s.id, name: s.full_name, role: s.role_type, type: 'superior' })),
      ...allSubordinates.map(s => ({ id: s.id, name: s.full_name, role: s.role_type, type: 'subordinate' }))
    ];
    return recipients;
  }, [superiorChain, allSubordinates]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isSending,
    sendMessage,
    refreshMessages: loadMessages,
    availableRecipients: getAvailableRecipients()
  };
}

// Hook para datos específicos por rol
export function useRoleSpecificData() {
  const { currentMember } = useOrganizationalStructure();

  const getRoleSpecificWidgets = useCallback(() => {
    if (!currentMember) return [];

    const roleWidgets: Record<string, string[]> = {
      'director-departamental': [
        'departmental-overview',
        'elected-officials-management', 
        'territorial-metrics',
        'team-creation',
        'superior-reports'
      ],
      'concejal-electo': [
        'council-activities',
        'citizen-services',
        'project-management',
        'municipal-metrics',
        'department-reports'
      ],
      'coordinador-municipal': [
        'municipal-coordination',
        'local-team-management',
        'citizen-engagement',
        'electoral-metrics'
      ],
      'lider-local': [
        'community-engagement',
        'local-events',
        'citizen-feedback',
        'base-mobilization'
      ]
    };

    return roleWidgets[currentMember.role_type] || ['basic-dashboard'];
  }, [currentMember]);

  const getAIPersonality = useCallback(() => {
    if (!currentMember) return 'general';

    const aiPersonalities: Record<string, string> = {
      'director-departamental': 'strategic-leader',
      'concejal-electo': 'public-servant',
      'coordinador-municipal': 'local-coordinator',
      'lider-local': 'community-organizer',
      'influencer-digital': 'content-creator',
      'candidato': 'campaign-manager'
    };

    return aiPersonalities[currentMember.role_type] || 'general-assistant';
  }, [currentMember]);

  return {
    roleSpecificWidgets: getRoleSpecificWidgets(),
    aiPersonality: getAIPersonality(),
    hierarchyLevel: currentMember?.hierarchy_level || 6,
    territorialScope: {
      region: currentMember?.region,
      department: currentMember?.department,
      municipality: currentMember?.municipality
    }
  };
}