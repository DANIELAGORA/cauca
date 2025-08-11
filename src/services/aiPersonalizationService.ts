// SERVICIO DE PERSONALIZACIÓN DE IA POR ROL JERÁRQUICO MAIS
// Sistema inteligente que adapta la IA según el rol, nivel y contexto del usuario

import { aiManager } from '../utils/ai';
import { UserContext } from '../hooks/useOrganizationalStructure';

export interface PersonalizedAIResponse {
  content: string;
  tone: 'formal' | 'casual' | 'strategic' | 'motivational' | 'technical';
  suggestions: string[];
  contextualActions: ContextualAction[];
  hierarchyInsights?: HierarchyInsight[];
}

export interface ContextualAction {
  type: 'report' | 'delegate' | 'escalate' | 'analyze' | 'create';
  label: string;
  description: string;
  targetRole?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface HierarchyInsight {
  type: 'upward' | 'downward' | 'lateral';
  message: string;
  actionRequired: boolean;
  relatedRoles: string[];
}

class AIPersonalizationService {
  private static instance: AIPersonalizationService;

  private constructor() {}

  static getInstance(): AIPersonalizationService {
    if (!AIPersonalizationService.instance) {
      AIPersonalizationService.instance = new AIPersonalizationService();
    }
    return AIPersonalizationService.instance;
  }

  // **PERSONALIZACIÓN POR ROL**

  async generatePersonalizedResponse(
    query: string,
    userContext: UserContext
  ): Promise<PersonalizedAIResponse> {
    const personality = this.getRolePersonality(userContext.roleType);
    const systemPrompt = this.buildSystemPrompt(userContext, personality);
    const enhancedQuery = this.enhanceQuery(query, userContext);

    try {
      const aiResponse = await aiManager.generateContent(enhancedQuery, systemPrompt);
      
      if (!aiResponse.success) {
        return this.getFallbackResponse(query, userContext);
      }

      return {
        content: aiResponse.data,
        tone: personality.tone,
        suggestions: await this.generateContextualSuggestions(query, userContext),
        contextualActions: this.getContextualActions(userContext),
        hierarchyInsights: this.getHierarchyInsights(userContext)
      };
    } catch (error) {
      console.error('Error in personalized AI:', error);
      return this.getFallbackResponse(query, userContext);
    }
  }

  // **ANÁLISIS ESPECÍFICO POR ROL**

  async analyzeForRole(
    content: string,
    userContext: UserContext,
    analysisType: 'performance' | 'communication' | 'strategy' | 'territory'
  ): Promise<any> {
    const roleSpecificPrompt = this.buildAnalysisPrompt(content, userContext, analysisType);
    
    try {
      const response = await aiManager.generateContent(roleSpecificPrompt);
      
      if (response.success) {
        return this.parseRoleSpecificAnalysis(response.data, userContext, analysisType);
      }
      
      return this.getDefaultAnalysis(analysisType, userContext);
    } catch (error) {
      console.error('Error in role analysis:', error);
      return this.getDefaultAnalysis(analysisType, userContext);
    }
  }

  // **GENERACIÓN DE CONTENIDO ESTRATÉGICO**

  async generateStrategicContent(
    contentType: 'report' | 'directive' | 'proposal' | 'communication',
    userContext: UserContext,
    specificContext?: string
  ): Promise<string> {
    const prompt = this.buildStrategicPrompt(contentType, userContext, specificContext);
    
    try {
      const response = await aiManager.generateContent(prompt);
      return response.success ? response.data : this.getTemplateContent(contentType, userContext);
    } catch (error) {
      console.error('Error generating strategic content:', error);
      return this.getTemplateContent(contentType, userContext);
    }
  }

  // **SUGERENCIAS JERÁRQUICAS**

  async getHierarchicalSuggestions(
    userContext: UserContext,
    scenario: 'daily_tasks' | 'escalation' | 'delegation' | 'reporting'
  ): Promise<ContextualAction[]> {
    const suggestions: ContextualAction[] = [];
    
    switch (userContext.roleType) {
      case 'director-departamental':
        suggestions.push(...this.getDirectorSuggestions(scenario, userContext));
        break;
      case 'concejal-electo':
        suggestions.push(...this.getConcejalSuggestions(scenario, userContext));
        break;
      case 'coordinador-municipal':
        suggestions.push(...this.getCoordinadorSuggestions(scenario, userContext));
        break;
      case 'lider-local':
        suggestions.push(...this.getLiderSuggestions(scenario, userContext));
        break;
      default:
        suggestions.push(...this.getGenericSuggestions(scenario, userContext));
    }

    return suggestions;
  }

  // **MÉTODOS PRIVADOS**

  private getRolePersonality(roleType: string): { tone: PersonalizedAIResponse['tone']; approach: string; focus: string[] } {
    const personalities: Record<string, any> = {
      'director-departamental': {
        tone: 'strategic',
        approach: 'executive',
        focus: ['leadership', 'oversight', 'coordination', 'strategic_planning']
      },
      'concejal-electo': {
        tone: 'formal',
        approach: 'representative',
        focus: ['legislation', 'citizen_service', 'municipal_development', 'public_accountability']
      },
      'coordinador-municipal': {
        tone: 'technical',
        approach: 'coordinator',
        focus: ['local_coordination', 'team_management', 'operational_efficiency', 'community_engagement']
      },
      'lider-local': {
        tone: 'motivational',
        approach: 'community_organizer',
        focus: ['grassroots_organizing', 'community_building', 'local_advocacy', 'citizen_mobilization']
      },
      'influencer-digital': {
        tone: 'casual',
        approach: 'content_creator',
        focus: ['digital_engagement', 'content_strategy', 'audience_growth', 'brand_building']
      }
    };

    return personalities[roleType] || {
      tone: 'formal',
      approach: 'general',
      focus: ['general_assistance']
    };
  }

  private buildSystemPrompt(userContext: UserContext, personality: any): string {
    return `
    Eres un asistente de IA especializado para el Movimiento Alternativo Indígena y Social (MAIS).
    
    CONTEXTO DEL USUARIO:
    - Rol: ${userContext.roleType}
    - Nivel jerárquico: ${userContext.hierarchyLevel}
    - Departamento: ${userContext.department || 'No especificado'}
    - Municipio: ${userContext.municipality || 'No especificado'}
    - Nombre: ${userContext.fullName}
    - Subordinados bajo supervisión: ${userContext.subordinatesCount}
    - Reporta a: ${userContext.superiorsChain.join(', ') || 'Nivel superior no especificado'}
    
    PERSONALIDAD Y ENFOQUE:
    - Tono: ${personality.tone}
    - Enfoque: ${personality.approach}
    - Áreas de especialización: ${personality.focus.join(', ')}
    
    RESPONSABILIDADES ESPECÍFICAS:
    ${userContext.responsibilities.map(r => `- ${r}`).join('\n')}
    
    TERRITORIO DE GESTIÓN:
    ${userContext.managedTerritories.map(t => `- ${t}`).join('\n')}
    
    INSTRUCCIONES:
    1. Adapta todas las respuestas al nivel jerárquico y responsabilidades del usuario
    2. Considera el contexto político colombiano y la estructura MAIS
    3. Proporciona insights específicos para su rol y territorio
    4. Sugiere acciones que correspondan a su nivel de autoridad
    5. Menciona cuando algo debe escalarse a niveles superiores o delegarse
    6. Usa un lenguaje apropiado para su posición en la organización
    
    Responde siempre pensando en cómo esta información ayuda específicamente a este usuario en su rol dentro de MAIS.
    `;
  }

  private enhanceQuery(query: string, userContext: UserContext): string {
    const roleContext = this.getRoleSpecificContext(userContext.roleType);
    
    return `
    Como ${roleContext.title} en MAIS, responsable de ${userContext.managedTerritories.join(', ')}, 
    necesito ayuda con lo siguiente:
    
    ${query}
    
    Ten en cuenta mi nivel de autoridad (nivel ${userContext.hierarchyLevel}) y que tengo 
    ${userContext.subordinatesCount} personas bajo mi supervisión directa.
    `;
  }

  private getRoleSpecificContext(roleType: string): { title: string; scope: string; authority: string } {
    const contexts: Record<string, any> = {
      'director-departamental': {
        title: 'Director Departamental',
        scope: 'gestión estratégica departamental',
        authority: 'autoridad para crear roles, asignar recursos y coordinar con nivel regional/nacional'
      },
      'concejal-electo': {
        title: 'Concejal Electo',
        scope: 'representación municipal y legislación local',
        authority: 'poder de voto en concejo, presentación de proyectos y atención ciudadana'
      },
      'coordinador-municipal': {
        title: 'Coordinador Municipal',
        scope: 'operaciones municipales de MAIS',
        authority: 'coordinación local y gestión de equipos municipales'
      },
      'lider-local': {
        title: 'Líder Local',
        scope: 'movilización comunitaria de base',
        authority: 'organización ciudadana y representación comunitaria'
      }
    };

    return contexts[roleType] || {
      title: 'Miembro MAIS',
      scope: 'participación general',
      authority: 'según rol asignado'
    };
  }

  private async generateContextualSuggestions(query: string, userContext: UserContext): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Sugerencias basadas en rol
    switch (userContext.roleType) {
      case 'director-departamental':
        suggestions.push(
          'Revisar métricas de todos los municipios bajo tu jurisdicción',
          'Coordinar reunión con concejales electos del departamento',
          'Preparar reporte mensual para el nivel regional',
          'Evaluar necesidad de crear nuevos roles municipales'
        );
        break;
      
      case 'concejal-electo':
        suggestions.push(
          'Programar sesiones de atención ciudadana',
          'Revisar proyectos pendientes en el concejo',
          'Coordinar con el director departamental',
          'Analizar impacto de propuestas legislativas'
        );
        break;
      
      case 'coordinador-municipal':
        suggestions.push(
          'Organizar actividades comunitarias locales',
          'Reportar avances al director departamental',
          'Coordinar con líderes locales',
          'Planificar estrategias de movilización'
        );
        break;
      
      case 'lider-local':
        suggestions.push(
          'Organizar reuniones comunitarias',
          'Recopilar feedback ciudadano',
          'Coordinar con coordinador municipal',
          'Planificar eventos de movilización'
        );
        break;
    }
    
    return suggestions;
  }

  private getContextualActions(userContext: UserContext): ContextualAction[] {
    const actions: ContextualAction[] = [];
    
    // Acciones hacia arriba (reportar)
    if (userContext.superiorsChain.length > 0) {
      actions.push({
        type: 'report',
        label: 'Enviar Reporte Superior',
        description: `Reportar avances a ${userContext.superiorsChain[0]}`,
        targetRole: userContext.superiorsChain[0],
        priority: 'medium'
      });
    }
    
    // Acciones hacia abajo (delegar)
    if (userContext.subordinatesCount > 0) {
      actions.push({
        type: 'delegate',
        label: 'Delegar Tarea',
        description: 'Asignar responsabilidades a equipo',
        priority: 'medium'
      });
    }
    
    // Acciones específicas por rol
    switch (userContext.roleType) {
      case 'director-departamental':
        actions.push({
          type: 'create',
          label: 'Crear Nuevo Rol',
          description: 'Crear rol municipal o local en el equipo',
          priority: 'low'
        });
        break;
      
      case 'concejal-electo':
        actions.push({
          type: 'analyze',
          label: 'Analizar Propuesta',
          description: 'Evaluar proyecto de acuerdo o ordenanza',
          priority: 'high'
        });
        break;
    }
    
    return actions;
  }

  private getHierarchyInsights(userContext: UserContext): HierarchyInsight[] {
    const insights: HierarchyInsight[] = [];
    
    // Insights hacia arriba
    if (userContext.superiorsChain.length > 0) {
      insights.push({
        type: 'upward',
        message: 'Considera informar estos avances al nivel departamental/regional',
        actionRequired: false,
        relatedRoles: userContext.superiorsChain
      });
    }
    
    // Insights hacia abajo
    if (userContext.subordinatesCount > 0) {
      insights.push({
        type: 'downward',
        message: 'Esta decisión podría requerir coordinación con tu equipo',
        actionRequired: true,
        relatedRoles: ['equipo-directo']
      });
    }
    
    return insights;
  }

  // Métodos para sugerencias específicas por rol
  private getDirectorSuggestions(scenario: string, userContext: UserContext): ContextualAction[] {
    const suggestions: ContextualAction[] = [];
    
    switch (scenario) {
      case 'daily_tasks':
        suggestions.push(
          {
            type: 'analyze',
            label: 'Dashboard Departamental',
            description: 'Revisar métricas consolidadas del departamento',
            priority: 'high'
          },
          {
            type: 'report',
            label: 'Reporte Regional',
            description: 'Preparar informe mensual para coordinación regional',
            priority: 'medium'
          }
        );
        break;
      
      case 'escalation':
        suggestions.push({
          type: 'escalate',
          label: 'Escalar a Nacional',
          description: 'Consultar con comité ejecutivo nacional',
          targetRole: 'comite-ejecutivo-nacional',
          priority: 'high'
        });
        break;
    }
    
    return suggestions;
  }

  private getConcejalSuggestions(scenario: string, userContext: UserContext): ContextualAction[] {
    // Implementar sugerencias específicas para concejales
    return [
      {
        type: 'analyze',
        label: 'Analizar Proyecto',
        description: 'Evaluar propuesta de ordenanza o acuerdo',
        priority: 'high'
      }
    ];
  }

  private getCoordinadorSuggestions(scenario: string, userContext: UserContext): ContextualAction[] {
    // Implementar sugerencias específicas para coordinadores
    return [
      {
        type: 'delegate',
        label: 'Coordinar Equipo',
        description: 'Organizar actividades con líderes locales',
        priority: 'medium'
      }
    ];
  }

  private getLiderSuggestions(scenario: string, userContext: UserContext): ContextualAction[] {
    // Implementar sugerencias específicas para líderes
    return [
      {
        type: 'create',
        label: 'Evento Comunitario',
        description: 'Organizar actividad de movilización local',
        priority: 'medium'
      }
    ];
  }

  private getGenericSuggestions(scenario: string, userContext: UserContext): ContextualAction[] {
    return [
      {
        type: 'analyze',
        label: 'Revisar Contexto',
        description: 'Analizar situación actual y próximos pasos',
        priority: 'medium'
      }
    ];
  }

  private buildAnalysisPrompt(content: string, userContext: UserContext, analysisType: string): string {
    return `
    Como ${userContext.roleType} en MAIS, analiza el siguiente contenido desde la perspectiva de ${analysisType}:
    
    ${content}
    
    Proporciona insights específicos para mi rol y nivel jerárquico (${userContext.hierarchyLevel}).
    `;
  }

  private buildStrategicPrompt(
    contentType: string, 
    userContext: UserContext, 
    specificContext?: string
  ): string {
    return `
    Genera un ${contentType} profesional apropiado para un ${userContext.roleType} de MAIS.
    
    Contexto específico: ${specificContext || 'Comunicación general'}
    Territorio: ${userContext.managedTerritories.join(', ')}
    Nivel jerárquico: ${userContext.hierarchyLevel}
    
    El contenido debe ser apropiado para el rol y seguir las mejores prácticas de comunicación política.
    `;
  }

  private parseRoleSpecificAnalysis(data: any, userContext: UserContext, analysisType: string): any {
    // Personalizar análisis según el rol
    return {
      analysis: data,
      roleContext: userContext.roleType,
      actionableInsights: this.getActionableInsights(data, userContext),
      hierarchyRecommendations: this.getHierarchyRecommendations(userContext)
    };
  }

  private getActionableInsights(data: any, userContext: UserContext): string[] {
    const insights: string[] = [];
    
    // Generar insights específicos según el rol
    switch (userContext.roleType) {
      case 'director-departamental':
        insights.push('Considera delegar tareas operativas a coordinadores municipales');
        insights.push('Evalúa si requiere escalamiento al nivel regional');
        break;
      
      case 'concejal-electo':
        insights.push('Analiza impacto en tu municipio');
        insights.push('Considera coordinar con otros concejales del departamento');
        break;
    }
    
    return insights;
  }

  private getHierarchyRecommendations(userContext: UserContext): string[] {
    const recommendations: string[] = [];
    
    if (userContext.subordinatesCount > 0) {
      recommendations.push('Involucra a tu equipo en la implementación');
    }
    
    if (userContext.superiorsChain.length > 0) {
      recommendations.push('Mantén informado al nivel superior');
    }
    
    return recommendations;
  }

  private getFallbackResponse(query: string, userContext: UserContext): PersonalizedAIResponse {
    return {
      content: `Como ${userContext.roleType} en MAIS, entiendo tu consulta sobre: "${query}". Te sugiero revisar los recursos disponibles en tu dashboard o contactar con tu coordinador superior para mayor orientación.`,
      tone: 'formal',
      suggestions: ['Consultar dashboard', 'Contactar superior', 'Revisar documentación'],
      contextualActions: this.getContextualActions(userContext)
    };
  }

  private getDefaultAnalysis(analysisType: string, userContext: UserContext): any {
    return {
      analysis: `Análisis de ${analysisType} no disponible temporalmente`,
      roleContext: userContext.roleType,
      actionableInsights: ['Intentar más tarde', 'Consultar con equipo'],
      hierarchyRecommendations: ['Mantener comunicación regular con estructura']
    };
  }

  private getTemplateContent(contentType: string, userContext: UserContext): string {
    const templates: Record<string, string> = {
      report: `Reporte ${contentType} para ${userContext.roleType} - ${userContext.fullName}`,
      directive: `Directiva desde ${userContext.roleType} para equipo de trabajo`,
      proposal: `Propuesta presentada por ${userContext.roleType} - ${userContext.managedTerritories.join(', ')}`,
      communication: `Comunicación oficial de ${userContext.roleType} - MAIS ${userContext.department}`
    };

    return templates[contentType] || 'Contenido no disponible temporalmente';
  }
}

export const aiPersonalizationService = AIPersonalizationService.getInstance();