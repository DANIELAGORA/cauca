/**
 * INTEGRATION HUB - CENTRO DE INTEGRACIONES MAIS
 * Configuración y gestión de n8n, Sellerchat, Chatwoot y MCP desde interfaz
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Zap, 
  MessageSquare, 
  Bot, 
  Webhook,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Save,
  RefreshCw,
  Database,
  Key,
  Globe,
  Phone,
  Mail,
  Users
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mcpService } from '../../services/mcpService';
import { enhancedAI } from '../../utils/ai-enhanced';
import { MAIS_N8N_WORKFLOWS, WEBHOOK_ENDPOINTS } from '../../config/n8nWorkflows';
import { logInfo, logError } from '../../utils/logger';

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  enabled: boolean;
  icon: React.ComponentType<any>;
  config: Record<string, any>;
  endpoints: string[];
  lastSync?: string;
  version?: string;
}

interface N8nInstanceConfig {
  url: string;
  apiKey: string;
  webhookBase: string;
  enabled: boolean;
  workflows: string[];
}

interface SellerchatConfig {
  apiUrl: string;
  apiKey: string;
  channelMapping: Record<string, string>;
  enabled: boolean;
}

interface ChatwootConfig {
  apiUrl: string;
  apiKey: string;
  inboxId: string;
  webhookUrl: string;
  enabled: boolean;
}

export const IntegrationHub: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  
  // Configuraciones específicas
  const [n8nConfig, setN8nConfig] = useState<N8nInstanceConfig>({
    url: '',
    apiKey: '',
    webhookBase: '',
    enabled: false,
    workflows: []
  });
  
  const [sellerchatConfig, setSellerchatConfig] = useState<SellerchatConfig>({
    apiUrl: '',
    apiKey: '',
    channelMapping: {},
    enabled: false
  });
  
  const [chatwootConfig, setChatwootConfig] = useState<ChatwootConfig>({
    apiUrl: '',
    apiKey: '',
    inboxId: '',
    webhookUrl: '',
    enabled: false
  });

  useEffect(() => {
    initializeIntegrations();
    loadConfigurations();
  }, []);

  /**
   * Inicializar integraciones disponibles
   */
  const initializeIntegrations = () => {
    const defaultIntegrations: IntegrationConfig[] = [
      {
        id: 'n8n',
        name: 'n8n Workflows',
        description: 'Automatización de flujos de comunicación jerárquica',
        status: 'disconnected',
        enabled: false,
        icon: Zap,
        config: {},
        endpoints: ['/webhook/message-routing', '/webhook/ai-content'],
        version: '1.0.0'
      },
      {
        id: 'mcp',
        name: 'Model Context Protocol',
        description: 'Protocolo de contexto avanzado para IA',
        status: 'disconnected',
        enabled: false,
        icon: Bot,
        config: {},
        endpoints: ['/mcp/electoral-context', '/mcp/communication-hub'],
        version: '1.0.0'
      },
      {
        id: 'sellerchat',
        name: 'Sellerchat',
        description: 'Integración con plataforma de comunicación externa',
        status: 'disconnected',
        enabled: false,
        icon: MessageSquare,
        config: {},
        endpoints: ['/webhook/sellerchat'],
        version: '1.0.0'
      },
      {
        id: 'chatwoot',
        name: 'Chatwoot',
        description: 'Soporte ciudadano y atención al público',
        status: 'disconnected',
        enabled: false,
        icon: Users,
        config: {},
        endpoints: ['/webhook/chatwoot'],
        version: '1.0.0'
      },
      {
        id: 'gemini-ai',
        name: 'Google Gemini AI',
        description: 'Inteligencia artificial para generación de contenido',
        status: enhancedAI.isAvailable() ? 'connected' : 'disconnected',
        enabled: enhancedAI.isAvailable(),
        icon: Bot,
        config: {},
        endpoints: ['/api/ai/generate', '/api/ai/analyze'],
        version: '1.5.0'
      }
    ];

    setIntegrations(defaultIntegrations);
  };

  /**
   * Cargar configuraciones guardadas
   */
  const loadConfigurations = async () => {
    try {
      // Cargar desde localStorage o API
      const savedN8n = localStorage.getItem('mais_n8n_config');
      if (savedN8n) {
        setN8nConfig(JSON.parse(savedN8n));
      }

      const savedSellerchat = localStorage.getItem('mais_sellerchat_config');
      if (savedSellerchat) {
        setSellerchatConfig(JSON.parse(savedSellerchat));
      }

      const savedChatwoot = localStorage.getItem('mais_chatwoot_config');
      if (savedChatwoot) {
        setChatwootConfig(JSON.parse(savedChatwoot));
      }

      // Actualizar estados de integración
      await updateIntegrationStatuses();
    } catch (error) {
      logError('Error cargando configuraciones:', error);
    }
  };

  /**
   * Actualizar estados de integración
   */
  const updateIntegrationStatuses = async () => {
    setIsLoading(true);
    try {
      const updatedIntegrations = [...integrations];

      // Verificar n8n
      if (n8nConfig.url && n8nConfig.apiKey) {
        const n8nStatus = await testN8nConnection();
        const n8nIndex = updatedIntegrations.findIndex(i => i.id === 'n8n');
        if (n8nIndex >= 0) {
          updatedIntegrations[n8nIndex].status = n8nStatus ? 'connected' : 'error';
          updatedIntegrations[n8nIndex].enabled = n8nStatus;
        }
      }

      // Verificar MCP
      const mcpStatus = mcpService.getStatus();
      const mcpIndex = updatedIntegrations.findIndex(i => i.id === 'mcp');
      if (mcpIndex >= 0) {
        updatedIntegrations[mcpIndex].status = mcpStatus.initialized ? 'connected' : 'disconnected';
        updatedIntegrations[mcpIndex].enabled = mcpStatus.initialized;
      }

      // Verificar Sellerchat
      if (sellerchatConfig.apiUrl && sellerchatConfig.apiKey) {
        const sellerchatStatus = await testSellerchatConnection();
        const sellerchatIndex = updatedIntegrations.findIndex(i => i.id === 'sellerchat');
        if (sellerchatIndex >= 0) {
          updatedIntegrations[sellerchatIndex].status = sellerchatStatus ? 'connected' : 'error';
          updatedIntegrations[sellerchatIndex].enabled = sellerchatStatus;
        }
      }

      // Verificar Chatwoot
      if (chatwootConfig.apiUrl && chatwootConfig.apiKey) {
        const chatwootStatus = await testChatwootConnection();
        const chatwootIndex = updatedIntegrations.findIndex(i => i.id === 'chatwoot');
        if (chatwootIndex >= 0) {
          updatedIntegrations[chatwootIndex].status = chatwootStatus ? 'connected' : 'error';
          updatedIntegrations[chatwootIndex].enabled = chatwootStatus;
        }
      }

      setIntegrations(updatedIntegrations);
    } catch (error) {
      logError('Error actualizando estados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Probar conexión n8n
   */
  const testN8nConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${n8nConfig.url}/rest/active-workflows`, {
        headers: {
          'X-N8N-API-KEY': n8nConfig.apiKey
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  /**
   * Probar conexión Sellerchat
   */
  const testSellerchatConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${sellerchatConfig.apiUrl}/api/health`, {
        headers: {
          'Authorization': `Bearer ${sellerchatConfig.apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  /**
   * Probar conexión Chatwoot
   */
  const testChatwootConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${chatwootConfig.apiUrl}/api/v1/accounts`, {
        headers: {
          'api_access_token': chatwootConfig.apiKey
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  /**
   * Guardar configuración n8n
   */
  const saveN8nConfig = async () => {
    try {
      localStorage.setItem('mais_n8n_config', JSON.stringify(n8nConfig));
      
      // Configurar en enhanced AI
      if (n8nConfig.enabled) {
        enhancedAI.configureN8n(n8nConfig.webhookBase);
      }

      await updateIntegrationStatuses();
      logInfo('✅ Configuración n8n guardada');
    } catch (error) {
      logError('Error guardando configuración n8n:', error);
    }
  };

  /**
   * Instalar workflows n8n
   */
  const installN8nWorkflows = async () => {
    if (!n8nConfig.url || !n8nConfig.apiKey) {
      alert('Configure primero la conexión n8n');
      return;
    }

    setIsLoading(true);
    try {
      for (const workflow of MAIS_N8N_WORKFLOWS) {
        const response = await fetch(`${n8nConfig.url}/rest/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': n8nConfig.apiKey
          },
          body: JSON.stringify({
            name: workflow.name,
            nodes: workflow.nodes,
            connections: workflow.connections,
            active: workflow.active,
            tags: workflow.tags
          })
        });

        if (response.ok) {
          logInfo(`✅ Workflow "${workflow.name}" instalado`);
        } else {
          logError(`❌ Error instalando workflow "${workflow.name}"`);
        }
      }

      alert('Workflows n8n instalados. Revise la consola para detalles.');
    } catch (error) {
      logError('Error instalando workflows:', error);
      alert('Error instalando workflows. Revise la configuración.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicializar MCP
   */
  const initializeMCP = async () => {
    try {
      setIsLoading(true);
      await mcpService.initialize();
      await updateIntegrationStatuses();
      logInfo('✅ MCP inicializado');
    } catch (error) {
      logError('Error inicializando MCP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtener color de estado
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'configuring': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  /**
   * Obtener icono de estado
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  /**
   * Copiar endpoint
   */
  const copyEndpoint = (endpoint: string) => {
    const fullUrl = `${n8nConfig.webhookBase || 'https://your-n8n-instance.com'}${endpoint}`;
    navigator.clipboard.writeText(fullUrl);
    alert(`Endpoint copiado: ${fullUrl}`);
  };

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: Settings },
    { id: 'n8n', label: 'n8n Workflows', icon: Zap },
    { id: 'mcp', label: 'Model Context Protocol', icon: Bot },
    { id: 'sellerchat', label: 'Sellerchat', icon: MessageSquare },
    { id: 'chatwoot', label: 'Chatwoot', icon: Users }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="w-6 h-6 text-blue-600 mr-3" />
              Centro de Integraciones MAIS
            </h2>
            <p className="text-gray-600 mt-1">
              Configuración y gestión de integraciones avanzadas para comunicación jerárquica
            </p>
          </div>
          
          <button
            onClick={updateIntegrationStatuses}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Estado de Integraciones</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <integration.icon className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{integration.name}</h4>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        <span className="capitalize">{integration.status}</span>
                      </div>
                    </div>
                    
                    {integration.endpoints.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <div className="font-medium mb-1">Endpoints:</div>
                        {integration.endpoints.map((endpoint, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <code className="bg-gray-100 px-1 py-0.5 rounded">{endpoint}</code>
                            <button
                              onClick={() => copyEndpoint(endpoint)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'n8n' && (
            <motion.div
              key="n8n"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Configuración n8n</h3>
                <button
                  onClick={installN8nWorkflows}
                  disabled={!n8nConfig.enabled || isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Instalar Workflows
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Instancia n8n
                    </label>
                    <input
                      type="url"
                      value={n8nConfig.url}
                      onChange={(e) => setN8nConfig(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://n8n.tudominio.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={n8nConfig.apiKey}
                      onChange={(e) => setN8nConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="n8n_api_key_aqui"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base URL Webhooks
                    </label>
                    <input
                      type="url"
                      value={n8nConfig.webhookBase}
                      onChange={(e) => setN8nConfig(prev => ({ ...prev, webhookBase: e.target.value }))}
                      placeholder="https://n8n.tudominio.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="n8n-enabled"
                      checked={n8nConfig.enabled}
                      onChange={(e) => setN8nConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="n8n-enabled" className="text-sm text-gray-700">
                      Habilitar integración n8n
                    </label>
                  </div>

                  <button
                    onClick={saveN8nConfig}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Configuración</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Workflows Disponibles</h4>
                  {MAIS_N8N_WORKFLOWS.map((workflow) => (
                    <div key={workflow.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{workflow.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs ${workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {workflow.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{workflow.description}</p>
                      {workflow.webhookPath && (
                        <div className="flex items-center justify-between">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{workflow.webhookPath}</code>
                          <button
                            onClick={() => copyEndpoint(workflow.webhookPath!)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'mcp' && (
            <motion.div
              key="mcp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Model Context Protocol</h3>
                <button
                  onClick={initializeMCP}
                  disabled={isLoading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Inicializar MCP
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900">Estado del Sistema MCP</h4>
                </div>
                <div className="text-sm text-purple-700">
                  {JSON.stringify(mcpService.getStatus(), null, 2)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Servidores MCP</h4>
                  <div className="space-y-2">
                    {['electoral-context', 'n8n-integration', 'communication-hub'].map((server) => (
                      <div key={server} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-sm font-medium">{server}</span>
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                          Preparado
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Herramientas Disponibles</h4>
                  <div className="space-y-2">
                    {['analyze-hierarchy', 'route-message', 'validate-electoral-action', 'generate-political-content'].map((tool) => (
                      <div key={tool} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-sm font-medium">{tool}</span>
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          Disponible
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sellerchat' && (
            <motion.div
              key="sellerchat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Configuración Sellerchat</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL API Sellerchat
                    </label>
                    <input
                      type="url"
                      value={sellerchatConfig.apiUrl}
                      onChange={(e) => setSellerchatConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                      placeholder="https://api.sellerchat.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={sellerchatConfig.apiKey}
                      onChange={(e) => setSellerchatConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="sellerchat_api_key"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sellerchat-enabled"
                      checked={sellerchatConfig.enabled}
                      onChange={(e) => setSellerchatConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="sellerchat-enabled" className="text-sm text-gray-700">
                      Habilitar integración Sellerchat
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem('mais_sellerchat_config', JSON.stringify(sellerchatConfig));
                      updateIntegrationStatuses();
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Configuración</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Mapeo de Canales</h4>
                  <div className="text-sm text-gray-600">
                    Configuración de mapeo entre canales Sellerchat y roles MAIS:
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Canal Alcaldes</span>
                      <span className="text-xs text-gray-500">→ candidato</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Canal Director</span>
                      <span className="text-xs text-gray-500">→ comite-departamental</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Canal General</span>
                      <span className="text-xs text-gray-500">→ ciudadano-base</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-1">Webhook URL</h5>
                    <code className="text-xs text-blue-700">
                      {n8nConfig.webhookBase}/webhook/sellerchat
                    </code>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chatwoot' && (
            <motion.div
              key="chatwoot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Configuración Chatwoot</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL API Chatwoot
                    </label>
                    <input
                      type="url"
                      value={chatwootConfig.apiUrl}
                      onChange={(e) => setChatwootConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                      placeholder="https://app.chatwoot.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Access Token
                    </label>
                    <input
                      type="password"
                      value={chatwootConfig.apiKey}
                      onChange={(e) => setChatwootConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="chatwoot_access_token"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inbox ID
                    </label>
                    <input
                      type="text"
                      value={chatwootConfig.inboxId}
                      onChange={(e) => setChatwootConfig(prev => ({ ...prev, inboxId: e.target.value }))}
                      placeholder="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="chatwoot-enabled"
                      checked={chatwootConfig.enabled}
                      onChange={(e) => setChatwootConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="chatwoot-enabled" className="text-sm text-gray-700">
                      Habilitar integración Chatwoot
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem('mais_chatwoot_config', JSON.stringify(chatwootConfig));
                      updateIntegrationStatuses();
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Configuración</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Clasificación Automática</h4>
                  <div className="text-sm text-gray-600 mb-4">
                    Los mensajes ciudadanos se clasifican automáticamente según contenido:
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-sm text-red-600 mb-1">Urgente</div>
                      <div className="text-xs text-gray-600">
                        Palabras clave: urgente, emergencia, denuncia
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        → Escalado a: Candidato/Alcalde
                      </div>
                    </div>

                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-sm text-blue-600 mb-1">Político</div>
                      <div className="text-xs text-gray-600">
                        Palabras clave: propuesta, proyecto, presupuesto
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        → Escalado a: Director Departamental
                      </div>
                    </div>

                    <div className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-sm text-green-600 mb-1">General</div>
                      <div className="text-xs text-gray-600">
                        Consultas generales y solicitudes de información
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        → Asignado a: Líder Comunitario
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-1">Webhook URL</h5>
                    <code className="text-xs text-green-700">
                      {n8nConfig.webhookBase}/webhook/chatwoot
                    </code>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};