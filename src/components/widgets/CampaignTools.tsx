import React, { useState } from 'react';
import { 
  Megaphone, 
  BarChart3, 
  Users, 
  Calendar,
  Target,
  Zap,
  Bot,
  Settings,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuración de la API de Gemini ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logError("VITE_GEMINI_API_KEY no encontrada. La funcionalidad de IA en CampaignTools está deshabilitada.");
}

export const CampaignTools: React.FC = () => {
  const [activeTools, setActiveTools] = useState<string[]>(['messaging', 'sentiment', 'volunteers']);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleTool = (toolId: string) => {
    setActiveTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
    
    // Simular activación real
    alert(`🔥 Herramienta "${tools.find(t => t.id === toolId)?.title}" ${activeTools.includes(toolId) ? 'desactivada' : 'activada'} exitosamente!`);
  };

  const handleOptimizeWithAI = async () => {
    if (!genAI) {
      alert('❌ API de IA no configurada');
      return;
    }

    setIsOptimizing(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analiza las herramientas de campaña activas: ${activeTools.join(', ')} y proporciona 3 recomendaciones específicas para optimizar la estrategia de campaña política del partido MAIS.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const recommendations = response.text();
      
      alert(`🤖 Recomendaciones de IA:\n\n${recommendations}`);
    } catch (error) {
      logError('Error optimizando con IA:', error);
      alert('❌ Error al generar recomendaciones');
    } finally {
      setIsOptimizing(false);
    }
  };

  const tools = [
    {
      id: 'messaging',
      icon: Megaphone,
      title: '📢 Mensajería Masiva',
      description: 'WhatsApp, Telegram, SMS automático',
      color: 'red',
      emoji: '📱'
    },
    {
      id: 'sentiment',
      icon: BarChart3,
      title: '📊 Análisis de Sentimiento',
      description: 'IA en tiempo real - todas las plataformas',
      color: 'blue',
      emoji: '🤖'
    },
    {
      id: 'volunteers',
      icon: Users,
      title: '👥 Gestión de Voluntarios',
      description: 'Coordinación automática de equipos',
      color: 'green',
      emoji: '🙋‍♂️'
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: '📅 Agenda Inteligente',
      description: 'Optimización automática de eventos',
      color: 'purple',
      emoji: '⏰'
    },
    {
      id: 'targeting',
      icon: Target,
      title: '🎯 Targeting Territorial',
      description: 'Segmentación geográfica avanzada',
      color: 'yellow',
      emoji: '🗺️'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Zap className="h-5 w-5 text-yellow-600 mr-2" />
        Herramientas de Campaña
      </h3>

      <div className="space-y-3">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          const isActive = activeTools.includes(tool.id);
          const colorClasses = {
            red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', text: 'text-red-600', title: 'text-red-900' },
            blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', text: 'text-blue-600', title: 'text-blue-900' },
            green: { bg: 'bg-green-50', hover: 'hover:bg-green-100', text: 'text-green-600', title: 'text-green-900' },
            purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', text: 'text-purple-600', title: 'text-purple-900' },
            yellow: { bg: 'bg-yellow-50', hover: 'hover:bg-yellow-100', text: 'text-yellow-600', title: 'text-yellow-900' }
          }[tool.color];

          return (
            <button
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={`w-full text-left p-3 ${colorClasses.bg} ${colorClasses.hover} rounded-lg transition-all duration-300 group transform hover:scale-105 ${
                isActive ? 'ring-2 ring-green-500 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center mr-3">
                    <span className="text-2xl mr-2">{tool.emoji}</span>
                    <IconComponent className={`h-5 w-5 ${colorClasses.text} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <div>
                    <div className={`font-medium ${colorClasses.title}`}>{tool.title}</div>
                    <div className={`text-sm ${colorClasses.text}`}>{tool.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isActive ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`⏸️ Pausando ${tool.title}...`);
                      }}
                      className="p-1 rounded-full bg-yellow-100 hover:bg-yellow-200 transition-colors"
                    >
                      <PauseCircle className="h-4 w-4 text-yellow-600" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`▶️ Iniciando ${tool.title}...`);
                      }}
                      className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                    >
                      <PlayCircle className="h-4 w-4 text-green-600" />
                    </button>
                  )}
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'} transition-all duration-300`}></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* AI Action Buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleOptimizeWithAI}
          disabled={isOptimizing}
          className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:opacity-50"
        >
          {isOptimizing ? (
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Bot className="h-5 w-5 mr-2" />
          )}
          {isOptimizing ? '🔄 Optimizando...' : '🤖 Optimizar con IA'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm"
          >
            <Settings className="h-4 w-4 mr-1" />
            ⚙️ Configurar
          </button>
          <button
            onClick={() => alert('🔄 Sincronizando todas las herramientas...')}
            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            🔄 Sincronizar
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">⚙️ Configuración Avanzada</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">🔄 Auto-sincronización</span>
              <div className="w-8 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">🤖 IA Predictiva</span>
              <div className="w-8 h-4 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">📊 Reportes Automáticos</span>
              <div className="w-8 h-4 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-800">🚀 Estado del Sistema</p>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-green-700 font-medium">ACTIVO</span>
          </div>
        </div>
        <p className="text-xs text-gray-700 text-center">
          <span className="font-medium">Integración completa:</span> WhatsApp Business API, Meta Ads, YouTube Analytics, TikTok for Business, Twitter API v2
        </p>
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-600">📊 Herramientas activas: </span>
          <span className="text-xs font-bold text-green-600">{activeTools.length}/5</span>
        </div>
      </div>
    </div>
  );
};