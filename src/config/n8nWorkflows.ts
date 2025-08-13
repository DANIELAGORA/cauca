/**
 * N8N WORKFLOWS CONFIGURATION - MAIS POLITICAL PLATFORM
 * Configuración completa de flujos automatizados para comunicación jerárquica
 */

import { UserRole } from '../types/index';

export interface N8nWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: 'webhook' | 'schedule' | 'database' | 'manual';
  webhookPath?: string;
  schedule?: string;
  active: boolean;
  tags: string[];
  nodes: N8nNode[];
  connections: N8nConnection[];
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: string;
}

export interface N8nConnection {
  sourceNodeId: string;
  targetNodeId: string;
  sourceOutputIndex?: number;
  targetInputIndex?: number;
}

export interface N8nWebhookEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  authentication?: 'basic' | 'bearer' | 'none';
  description: string;
  expectedPayload: Record<string, any>;
}

/**
 * CONFIGURACIÓN DE WORKFLOWS PRINCIPALES
 */
export const MAIS_N8N_WORKFLOWS: N8nWorkflow[] = [
  {
    id: 'hierarchical-message-routing',
    name: 'Enrutamiento Jerárquico de Mensajes',
    description: 'Enruta mensajes según jerarquía política MAIS y tipo de comunicación',
    trigger: 'webhook',
    webhookPath: '/webhook/message-routing',
    active: true,
    tags: ['messaging', 'hierarchy', 'routing'],
    nodes: [
      {
        id: 'webhook-trigger',
        name: 'Webhook Trigger',
        type: 'n8n-nodes-base.webhook',
        position: [100, 100],
        parameters: {
          path: 'message-routing',
          httpMethod: 'POST',
          responseMode: 'responseNode',
          options: {}
        }
      },
      {
        id: 'message-validator',
        name: 'Validar Mensaje',
        type: 'n8n-nodes-base.function',
        position: [300, 100],
        parameters: {
          functionCode: `
            const { message, senderRole, messageType, priority, department } = $input.item.json;
            
            // Validaciones básicas
            if (!message || !senderRole || !messageType) {
              throw new Error('Datos de mensaje incompletos');
            }
            
            const hierarchyLevels = {
              'comite-ejecutivo-nacional': 1,
              'lider-regional': 2,
              'comite-departamental': 3,
              'candidato': 4,
              'influenciador': 5,
              'lider': 6,
              'ciudadano-base': 7
            };
            
            return {
              ...item.json,
              senderHierarchyLevel: hierarchyLevels[senderRole],
              timestamp: new Date().toISOString(),
              validated: true
            };
          `
        }
      },
      {
        id: 'route-determiner',
        name: 'Determinar Ruta',
        type: 'n8n-nodes-base.switch',
        position: [500, 100],
        parameters: {
          values: [
            { value: 'broadcast', operation: 'equal' },
            { value: 'hierarchical', operation: 'equal' },
            { value: 'peer', operation: 'equal' },
            { value: 'escalation', operation: 'equal' }
          ],
          rules: [
            { condition: 'messageType' }
          ]
        }
      },
      {
        id: 'broadcast-handler',
        name: 'Manejar Difusión',
        type: 'n8n-nodes-base.function',
        position: [700, 50],
        parameters: {
          functionCode: `
            const { senderRole, department, message } = $input.item.json;
            
            // Determinar alcance de difusión
            const broadcastScopes = {
              'comite-ejecutivo-nacional': 'nacional',
              'lider-regional': 'regional',
              'comite-departamental': 'departamental',
              'candidato': 'municipal'
            };
            
            const scope = broadcastScopes[senderRole] || 'local';
            
            return {
              ...item.json,
              broadcastScope: scope,
              requiresApproval: senderRole !== 'comite-ejecutivo-nacional',
              estimatedRecipients: scope === 'nacional' ? 1000 : scope === 'regional' ? 500 : 200
            };
          `
        }
      },
      {
        id: 'hierarchical-handler',
        name: 'Manejar Jerárquico',
        type: 'n8n-nodes-base.function',
        position: [700, 100],
        parameters: {
          functionCode: `
            const { senderHierarchyLevel, department } = $input.item.json;
            
            // Determinar subordinados
            const targetLevels = [];
            for (let level = senderHierarchyLevel + 1; level <= 7; level++) {
              targetLevels.push(level);
            }
            
            return {
              ...item.json,
              targetHierarchyLevels: targetLevels,
              filterByDepartment: true,
              cascadeDown: true
            };
          `
        }
      },
      {
        id: 'escalation-handler',
        name: 'Manejar Escalación',
        type: 'n8n-nodes-base.function',
        position: [700, 150],
        parameters: {
          functionCode: `
            const { senderHierarchyLevel, priority } = $input.item.json;
            
            // Determinar superior jerárquico
            const targetLevel = Math.max(1, senderHierarchyLevel - 1);
            
            return {
              ...item.json,
              targetHierarchyLevel: targetLevel,
              escalationUrgent: priority === 'urgent',
              requiresImmediate: priority === 'urgent',
              notifyChain: true
            };
          `
        }
      },
      {
        id: 'supabase-insert',
        name: 'Guardar en Supabase',
        type: 'n8n-nodes-base.supabase',
        position: [900, 100],
        parameters: {
          operation: 'insert',
          table: 'hierarchical_messages',
          columns: 'content,sender_id,sender_role,message_type,priority,department,n8n_workflow_id',
          additionalFields: {
            workflowId: '{{ $workflow.id }}',
            processedAt: '{{ $now }}'
          }
        },
        credentials: 'supabaseApi'
      },
      {
        id: 'notify-recipients',
        name: 'Notificar Destinatarios',
        type: 'n8n-nodes-base.httpRequest',
        position: [1100, 100],
        parameters: {
          url: '{{ $env.MAIS_NOTIFICATION_API }}/send-notification',
          method: 'POST',
          body: {
            recipients: '{{ $json.targetRecipients }}',
            message: '{{ $json.message }}',
            type: '{{ $json.messageType }}',
            priority: '{{ $json.priority }}'
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{ $env.MAIS_API_TOKEN }}'
          }
        }
      }
    ],
    connections: [
      { sourceNodeId: 'webhook-trigger', targetNodeId: 'message-validator' },
      { sourceNodeId: 'message-validator', targetNodeId: 'route-determiner' },
      { sourceNodeId: 'route-determiner', targetNodeId: 'broadcast-handler' },
      { sourceNodeId: 'route-determiner', targetNodeId: 'hierarchical-handler' },
      { sourceNodeId: 'route-determiner', targetNodeId: 'escalation-handler' },
      { sourceNodeId: 'broadcast-handler', targetNodeId: 'supabase-insert' },
      { sourceNodeId: 'hierarchical-handler', targetNodeId: 'supabase-insert' },
      { sourceNodeId: 'escalation-handler', targetNodeId: 'supabase-insert' },
      { sourceNodeId: 'supabase-insert', targetNodeId: 'notify-recipients' }
    ]
  },
  
  {
    id: 'ai-content-generation',
    name: 'Generación de Contenido IA',
    description: 'Genera contenido político contextualizado usando IA y datos jerárquicos',
    trigger: 'webhook',
    webhookPath: '/webhook/ai-content',
    active: true,
    tags: ['ai', 'content', 'generation'],
    nodes: [
      {
        id: 'ai-webhook',
        name: 'AI Content Request',
        type: 'n8n-nodes-base.webhook',
        position: [100, 100],
        parameters: {
          path: 'ai-content',
          httpMethod: 'POST'
        }
      },
      {
        id: 'context-enricher',
        name: 'Enriquecer Contexto',
        type: 'n8n-nodes-base.function',
        position: [300, 100],
        parameters: {
          functionCode: `
            const { userRole, department, municipality, contentType, prompt } = $input.item.json;
            
            const roleDescriptions = {
              'comite-ejecutivo-nacional': 'Comité Ejecutivo Nacional MAIS - Máxima autoridad',
              'comite-departamental': 'Director Departamental MAIS - Gestión territorial',
              'candidato': 'Candidato/Alcalde MAIS - Representación municipal'
            };
            
            const enrichedContext = {
              roleDescription: roleDescriptions[userRole] || 'Oficial MAIS',
              territory: municipality ? department + ' - ' + municipality : department,
              hierarchyContext: userRole.includes('nacional') ? 'nacional' : 'territorial',
              audienceLevel: userRole.includes('ejecutivo') ? 'institucional' : 'ciudadano'
            };
            
            return {
              ...item.json,
              enrichedContext,
              fullPrompt: prompt + '\\n\\nCONTEXTO: ' + JSON.stringify(enrichedContext)
            };
          `
        }
      },
      {
        id: 'gemini-ai',
        name: 'Generar con Gemini',
        type: 'n8n-nodes-base.httpRequest',
        position: [500, 100],
        parameters: {
          url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{ $env.GEMINI_API_KEY }}'
          },
          body: {
            contents: [{
              parts: [{
                text: '{{ $json.fullPrompt }}'
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000
            }
          }
        }
      },
      {
        id: 'content-processor',
        name: 'Procesar Contenido',
        type: 'n8n-nodes-base.function',
        position: [700, 100],
        parameters: {
          functionCode: `
            const response = $input.item.json;
            const originalRequest = $input.item.json;
            
            let generatedText = '';
            if (response.candidates && response.candidates[0] && response.candidates[0].content) {
              generatedText = response.candidates[0].content.parts[0].text;
            }
            
            return {
              ...originalRequest,
              generatedContent: generatedText,
              processingTime: Date.now() - originalRequest.timestamp,
              success: !!generatedText,
              wordCount: generatedText.split(' ').length
            };
          `
        }
      },
      {
        id: 'save-content',
        name: 'Guardar Contenido',
        type: 'n8n-nodes-base.supabase',
        position: [900, 100],
        parameters: {
          operation: 'insert',
          table: 'ai_generated_content',
          columns: 'user_role,content_type,original_prompt,generated_content,department,municipality'
        },
        credentials: 'supabaseApi'
      }
    ],
    connections: [
      { sourceNodeId: 'ai-webhook', targetNodeId: 'context-enricher' },
      { sourceNodeId: 'context-enricher', targetNodeId: 'gemini-ai' },
      { sourceNodeId: 'gemini-ai', targetNodeId: 'content-processor' },
      { sourceNodeId: 'content-processor', targetNodeId: 'save-content' }
    ]
  },

  {
    id: 'sellerchat-integration',
    name: 'Integración Sellerchat',
    description: 'Integra comunicaciones externas via Sellerchat con sistema MAIS',
    trigger: 'webhook',
    webhookPath: '/webhook/sellerchat',
    active: false, // Activar cuando esté configurado
    tags: ['sellerchat', 'external', 'communication'],
    nodes: [
      {
        id: 'sellerchat-webhook',
        name: 'Sellerchat Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [100, 100],
        parameters: {
          path: 'sellerchat',
          httpMethod: 'POST'
        }
      },
      {
        id: 'message-transformer',
        name: 'Transformar Mensaje',
        type: 'n8n-nodes-base.function',
        position: [300, 100],
        parameters: {
          functionCode: `
            const { message, sender, channel, timestamp } = $input.item.json;
            
            // Determinar rol MAIS basado en canal o sender
            let assignedRole = 'ciudadano-base'; // Default
            
            if (channel && channel.includes('alcalde')) {
              assignedRole = 'candidato';
            } else if (channel && channel.includes('director')) {
              assignedRole = 'comite-departamental';
            }
            
            return {
              content: message,
              sender_external: sender,
              external_channel: channel,
              assigned_role: assignedRole,
              message_type: 'external',
              priority: 'medium',
              source: 'sellerchat',
              received_at: timestamp || new Date().toISOString()
            };
          `
        }
      },
      {
        id: 'route-to-mais',
        name: 'Enrutar a MAIS',
        type: 'n8n-nodes-base.httpRequest',
        position: [500, 100],
        parameters: {
          url: '{{ $env.MAIS_API_URL }}/api/external-messages',
          method: 'POST',
          body: '{{ $json }}',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{ $env.MAIS_API_TOKEN }}'
          }
        }
      }
    ],
    connections: [
      { sourceNodeId: 'sellerchat-webhook', targetNodeId: 'message-transformer' },
      { sourceNodeId: 'message-transformer', targetNodeId: 'route-to-mais' }
    ]
  },

  {
    id: 'chatwoot-integration',
    name: 'Integración Chatwoot',
    description: 'Integra soporte ciudadano via Chatwoot con sistema jerárquico MAIS',
    trigger: 'webhook',
    webhookPath: '/webhook/chatwoot',
    active: false, // Activar cuando esté configurado
    tags: ['chatwoot', 'support', 'citizens'],
    nodes: [
      {
        id: 'chatwoot-webhook',
        name: 'Chatwoot Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [100, 100],
        parameters: {
          path: 'chatwoot',
          httpMethod: 'POST'
        }
      },
      {
        id: 'citizen-classifier',
        name: 'Clasificar Ciudadano',
        type: 'n8n-nodes-base.function',
        position: [300, 100],
        parameters: {
          functionCode: `
            const { message_type, content, contact, conversation } = $input.item.json;
            
            // Clasificar por tipo de consulta
            let category = 'general';
            let assignedLevel = 'lider'; // Nivel base para atención ciudadana
            
            const urgentKeywords = ['urgente', 'emergencia', 'denuncia'];
            const politicalKeywords = ['propuesta', 'proyecto', 'presupuesto'];
            
            if (urgentKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
              category = 'urgent';
              assignedLevel = 'candidato'; // Escalar a alcalde/candidato
            } else if (politicalKeywords.some(keyword => content.toLowerCase().includes(keyword))) {
              category = 'political';
              assignedLevel = 'comite-departamental'; // Escalar a nivel departamental
            }
            
            return {
              citizen_message: content,
              citizen_contact: contact,
              category,
              assigned_level: assignedLevel,
              priority: category === 'urgent' ? 'high' : 'medium',
              source: 'chatwoot',
              conversation_id: conversation?.id
            };
          `
        }
      },
      {
        id: 'assign-to-mais',
        name: 'Asignar en MAIS',
        type: 'n8n-nodes-base.supabase',
        position: [500, 100],
        parameters: {
          operation: 'insert',
          table: 'citizen_requests',
          columns: 'message,contact_info,category,assigned_role,priority,source,conversation_id'
        },
        credentials: 'supabaseApi'
      },
      {
        id: 'notify-assigned',
        name: 'Notificar Asignado',
        type: 'n8n-nodes-base.httpRequest',
        position: [700, 100],
        parameters: {
          url: '{{ $env.MAIS_NOTIFICATION_API }}/citizen-request',
          method: 'POST',
          body: {
            assigned_role: '{{ $json.assigned_level }}',
            category: '{{ $json.category }}',
            priority: '{{ $json.priority }}',
            request_id: '{{ $json.id }}'
          }
        }
      }
    ],
    connections: [
      { sourceNodeId: 'chatwoot-webhook', targetNodeId: 'citizen-classifier' },
      { sourceNodeId: 'citizen-classifier', targetNodeId: 'assign-to-mais' },
      { sourceNodeId: 'assign-to-mais', targetNodeId: 'notify-assigned' }
    ]
  }
];

/**
 * ENDPOINTS DE WEBHOOK DISPONIBLES
 */
export const WEBHOOK_ENDPOINTS: N8nWebhookEndpoint[] = [
  {
    path: '/webhook/message-routing',
    method: 'POST',
    authentication: 'bearer',
    description: 'Enrutamiento automático de mensajes jerárquicos',
    expectedPayload: {
      message: 'string',
      senderRole: 'UserRole',
      messageType: 'broadcast | hierarchical | peer | escalation',
      priority: 'low | medium | high | urgent',
      department: 'string',
      municipality: 'string?'
    }
  },
  {
    path: '/webhook/ai-content',
    method: 'POST',
    authentication: 'bearer',
    description: 'Generación de contenido IA contextualizada',
    expectedPayload: {
      userRole: 'UserRole',
      department: 'string',
      municipality: 'string?',
      contentType: 'announcement | report | strategy | response',
      prompt: 'string'
    }
  },
  {
    path: '/webhook/sellerchat',
    method: 'POST',
    authentication: 'none',
    description: 'Recepción de mensajes desde Sellerchat',
    expectedPayload: {
      message: 'string',
      sender: 'string',
      channel: 'string',
      timestamp: 'string'
    }
  },
  {
    path: '/webhook/chatwoot',
    method: 'POST',
    authentication: 'none',
    description: 'Recepción de solicitudes ciudadanas desde Chatwoot',
    expectedPayload: {
      message_type: 'string',
      content: 'string',
      contact: 'object',
      conversation: 'object'
    }
  }
];

/**
 * CONFIGURACIÓN DE CREDENCIALES NECESARIAS
 */
export const REQUIRED_CREDENTIALS = {
  supabaseApi: {
    name: 'Supabase API',
    type: 'supabaseApi',
    required_fields: ['host', 'serviceRole'],
    description: 'Credenciales para acceso a base de datos Supabase'
  },
  geminiApi: {
    name: 'Google Gemini API',
    type: 'httpHeaderAuth',
    required_fields: ['name', 'value'],
    description: 'API Key para Google Gemini AI'
  },
  maisApi: {
    name: 'MAIS Platform API',
    type: 'httpHeaderAuth', 
    required_fields: ['name', 'value'],
    description: 'Token de autenticación para API interna MAIS'
  }
};

/**
 * VARIABLES DE ENTORNO NECESARIAS
 */
export const ENVIRONMENT_VARIABLES = {
  MAIS_API_URL: 'https://maiscauca.netlify.app',
  MAIS_NOTIFICATION_API: 'https://maiscauca.netlify.app/api',
  GEMINI_API_KEY: 'your_gemini_api_key_here',
  MAIS_API_TOKEN: 'your_mais_api_token_here',
  N8N_WEBHOOK_BASE_URL: 'https://your-n8n-instance.com'
};

/**
 * HELPER FUNCTIONS
 */
export const generateN8nImportJson = (workflow: N8nWorkflow) => {
  return {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    active: workflow.active,
    tags: workflow.tags,
    settings: {
      executionOrder: 'v1'
    },
    staticData: null,
    meta: {
      templateCredsSetupCompleted: true
    },
    pinData: {},
    versionId: '1'
  };
};

export const validateWorkflowConfig = (workflow: N8nWorkflow): boolean => {
  return !!(
    workflow.id &&
    workflow.name &&
    workflow.trigger &&
    workflow.nodes.length > 0 &&
    workflow.connections.length > 0
  );
};