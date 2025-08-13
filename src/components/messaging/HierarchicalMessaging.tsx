/**
 * SISTEMA DE MENSAJERÍA JERÁRQUICA MAIS - 100% OPTIMIZADO
 * Comunicación interna por niveles políticos + integración n8n
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Crown,
  Building2,
  Users,
  MessageCircle,
  ChevronDown,
  UserCheck,
  Clock,
  AlertCircle,
  Webhook,
  Bot,
  Zap,
  Filter
} from 'lucide-react';
import { UserRole } from '../../types/index';
import { enhancedAI } from '../../utils/ai-enhanced';
import { logInfo, logError } from '../../utils/logger';

interface HierarchicalMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  sender_hierarchy_level: number;
  recipient_role?: UserRole;
  message_type: 'broadcast' | 'hierarchical' | 'peer' | 'escalation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  municipality?: string;
  created_at: string;
  read_by: string[];
  n8n_workflow_id?: string;
  ai_generated: boolean;
  thread_id?: string;
}

interface MessageThread {
  id: string;
  subject: string;
  participants: string[];
  message_count: number;
  last_message_at: string;
  priority: string;
}

interface N8nWebhookConfig {
  url: string;
  enabled: boolean;
  workflows: {
    'message-routing': string;
    'escalation-alert': string;
    'broadcast-distribution': string;
    'ai-response': string;
  };
}

export const HierarchicalMessaging: React.FC = () => {
  const { state } = useApp();
  const [messages, setMessages] = useState<HierarchicalMessage[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'broadcast' | 'hierarchical' | 'peer' | 'escalation'>('hierarchical');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [recipientRole, setRecipientRole] = useState<UserRole | 'all'>('all');
  const [isAIAssisted, setIsAIAssisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [n8nConfig, setN8nConfig] = useState<N8nWebhookConfig>({
    url: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
    enabled: false,
    workflows: {
      'message-routing': '/webhook/message-routing',
      'escalation-alert': '/webhook/escalation-alert', 
      'broadcast-distribution': '/webhook/broadcast-distribution',
      'ai-response': '/webhook/ai-response'
    }
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuración jerárquica
  const hierarchyLevels = {
    'comite-ejecutivo-nacional': 1,
    'lider-regional': 2,
    'comite-departamental': 3,
    'candidato': 4,
    'influenciador': 5,
    'lider': 6,
    'ciudadano-base': 7
  };

  const roleNames = {
    'comite-ejecutivo-nacional': 'Comité Ejecutivo Nacional',
    'lider-regional': 'Líder Regional',
    'comite-departamental': 'Director Departamental',
    'candidato': 'Candidato/Alcalde',
    'influenciador': 'Influenciador Digital',
    'lider': 'Líder Comunitario',
    'ciudadano-base': 'Ciudadano Base'
  };

  useEffect(() => {
    initializeMessaging();
    setupRealtimeSubscription();
    validateN8nConnection();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Inicializar sistema de mensajería
   */
  const initializeMessaging = async () => {
    await loadMessages();
    await loadThreads();
    await enhancedAI.init();
  };

  /**
   * Cargar mensajes con filtros jerárquicos
   */
  const loadMessages = async () => {
    try {
      setIsLoading(true);
      
      const userHierarchy = hierarchyLevels[state.user?.role as UserRole];
      
      // Query con filtros jerárquicos
      let query = supabase
        .from('hierarchical_messages')
        .select(`
          *,
          sender:sender_id(full_name, role, department, municipality)
        `)
        .or(`recipient_role.eq.${state.user?.role},recipient_role.is.null`)
        .order('created_at', { ascending: true });

      // Filtro por rol si está activo
      if (filterRole !== 'all') {
        query = query.eq('sender_role', filterRole);
      }

      // Filtro territorial
      if (state.user?.department) {
        query = query.eq('department', state.user.department);
      }

      const { data, error } = await query;

      if (error) throw error;

      setMessages(data || []);
      logInfo(`📨 ${data?.length || 0} mensajes cargados`);
    } catch (error) {
      logError('Error cargando mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cargar hilos de conversación
   */
  const loadThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('message_threads')
        .select('*')
        .contains('participants', [state.user?.id])
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      logError('Error cargando threads:', error);
    }
  };

  /**
   * Configurar suscripción en tiempo real
   */
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('hierarchical-messaging')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'hierarchical_messages',
          filter: `department=eq.${state.user?.department}`
        },
        (payload) => {
          const newMessage = payload.new as HierarchicalMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Trigger n8n si es mensaje de escalación
          if (newMessage.message_type === 'escalation' && n8nConfig.enabled) {
            triggerN8nWorkflow('escalation-alert', newMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  /**
   * Validar conexión n8n
   */
  const validateN8nConnection = async () => {
    if (!n8nConfig.url) return;

    try {
      const response = await fetch(n8nConfig.url + '/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setN8nConfig(prev => ({ ...prev, enabled: true }));
        logInfo('✅ n8n connection validated');
      }
    } catch (error) {
      logError('❌ n8n connection failed:', error);
      setN8nConfig(prev => ({ ...prev, enabled: false }));
    }
  };

  /**
   * Enviar mensaje con IA opcional
   */
  const sendMessage = async () => {
    if (!newMessage.trim() || !state.user) return;

    setIsLoading(true);
    let finalMessage = newMessage;

    try {
      // Generar contenido con IA si está habilitado
      if (isAIAssisted) {
        const context = {
          userRole: state.user.role as UserRole,
          department: state.user.department || '',
          municipality: state.user.municipality,
          hierarchyLevel: hierarchyLevels[state.user.role as UserRole],
          permissions: state.user.permissions || [],
          reportingTo: getReportingTo(state.user.role as UserRole)
        };

        const aiResponse = await enhancedAI.generateContextualContent(
          newMessage,
          context,
          messageType === 'broadcast' ? 'announcement' : 'message'
        );

        if (aiResponse.success) {
          finalMessage = aiResponse.data;
        }
      }

      // Crear mensaje
      const messageData: Partial<HierarchicalMessage> = {
        content: finalMessage,
        sender_id: state.user.id,
        sender_name: state.user.name,
        sender_role: state.user.role as UserRole,
        sender_hierarchy_level: hierarchyLevels[state.user.role as UserRole],
        recipient_role: recipientRole === 'all' ? undefined : recipientRole as UserRole,
        message_type: messageType,
        priority,
        department: state.user.department || '',
        municipality: state.user.municipality,
        ai_generated: isAIAssisted,
        thread_id: selectedThread,
        read_by: [state.user.id]
      };

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('hierarchical_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Trigger n8n workflows
      if (n8nConfig.enabled) {
        await triggerN8nWorkflow('message-routing', data);
        
        if (messageType === 'broadcast') {
          await triggerN8nWorkflow('broadcast-distribution', data);
        }
      }

      setNewMessage('');
      setIsAIAssisted(false);
      logInfo(`📤 Mensaje enviado: ${messageType}`);
      
    } catch (error) {
      logError('Error enviando mensaje:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Trigger n8n workflow
   */
  const triggerN8nWorkflow = async (workflowType: keyof N8nWebhookConfig['workflows'], data: any) => {
    if (!n8nConfig.enabled || !n8nConfig.url) return;

    try {
      const webhookPath = n8nConfig.workflows[workflowType];
      await fetch(n8nConfig.url + webhookPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: workflowType,
          timestamp: Date.now(),
          data,
          context: {
            user: state.user,
            department: state.user?.department,
            hierarchy_level: hierarchyLevels[state.user?.role as UserRole]
          }
        })
      });

      logInfo(`🚀 n8n workflow triggered: ${workflowType}`);
    } catch (error) {
      logError(`❌ Error triggering n8n ${workflowType}:`, error);
    }
  };

  /**
   * Obtener superior jerárquico
   */
  const getReportingTo = (role: UserRole): string => {
    const reporting = {
      'ciudadano-base': 'lider',
      'lider': 'influenciador',
      'influenciador': 'candidato',
      'candidato': 'comite-departamental',
      'comite-departamental': 'lider-regional',
      'lider-regional': 'comite-ejecutivo-nacional',
      'comite-ejecutivo-nacional': 'none'
    };
    return reporting[role] || 'none';
  };

  /**
   * Scroll al final
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Obtener color por rol
   */
  const getRoleColor = (role: UserRole): string => {
    const colors = {
      'comite-ejecutivo-nacional': 'text-red-600 bg-red-100',
      'lider-regional': 'text-orange-600 bg-orange-100',
      'comite-departamental': 'text-yellow-600 bg-yellow-100',
      'candidato': 'text-green-600 bg-green-100',
      'influenciador': 'text-blue-600 bg-blue-100',
      'lider': 'text-purple-600 bg-purple-100',
      'ciudadano-base': 'text-gray-600 bg-gray-100'
    };
    return colors[role] || 'text-gray-600 bg-gray-100';
  };

  /**
   * Obtener icono por rol
   */
  const getRoleIcon = (role: UserRole) => {
    const icons = {
      'comite-ejecutivo-nacional': Crown,
      'lider-regional': Building2,
      'comite-departamental': Building2,
      'candidato': UserCheck,
      'influenciador': Zap,
      'lider': Users,
      'ciudadano-base': MessageCircle
    };
    const Icon = icons[role] || MessageCircle;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
            Mensajería Jerárquica MAIS
          </h3>
          
          {/* Estado n8n */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${n8nConfig.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">
              n8n {n8nConfig.enabled ? 'conectado' : 'desconectado'}
            </span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">Todos los roles</option>
            {Object.entries(roleNames).map(([role, name]) => (
              <option key={role} value={role}>{name}</option>
            ))}
          </select>

          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value as any)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="hierarchical">Jerárquico</option>
            <option value="broadcast">Difusión</option>
            <option value="peer">Par</option>
            <option value="escalation">Escalación</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender_id === state.user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === state.user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {/* Header del mensaje */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(message.sender_role)}
                    <span className="text-xs font-medium">
                      {message.sender_name}
                    </span>
                    {message.ai_generated && (
                      <Bot className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {message.priority === 'urgent' && (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    )}
                    {message.n8n_workflow_id && (
                      <Webhook className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Footer */}
                <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                  <span className={`px-1 py-0.5 rounded text-xs ${getRoleColor(message.sender_role)}`}>
                    {roleNames[message.sender_role]}
                  </span>
                  <span>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={isAIAssisted}
              onChange={(e) => setIsAIAssisted(e.target.checked)}
              className="mr-1"
            />
            Asistencia IA
          </label>
          
          {messageType !== 'broadcast' && (
            <select
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value as any)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">Todos</option>
              {Object.entries(roleNames).map(([role, name]) => (
                <option key={role} value={role}>{name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isAIAssisted ? "Describe tu mensaje, IA lo optimizará..." : "Escribe tu mensaje..."}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};