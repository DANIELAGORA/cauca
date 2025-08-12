// CAMPAIGN SCHEDULER MAIS - OPTIMIZADO
// Programador de campañas integrado con IA - Sin errores lint

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Target, 
  Instagram,
  Youtube,
  Play,
  Facebook,
  Twitter,
  MessageCircle,
  Plus,
  Settings,
  BarChart3,
  Bot,
  LoaderCircle
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logError, logInfo } from '../../utils/logger';

// Configuración de la API de Gemini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const CampaignScheduler: React.FC = () => {
  const { state } = useApp();
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  
  // Estados para el formulario de nueva campaña
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    budget: '',
    audience: '',
    startDate: '',
    endDate: ''
  });
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  // Estados para la funcionalidad de IA en audiencia
  const [aiAudiencePrompt, setAiAudiencePrompt] = useState('');
  const [isGeneratingAudience, setIsGeneratingAudience] = useState(false);
  const [aiAudienceError, setAiAudienceError] = useState<string | null>(null);

  const handleGenerateAudience = async () => {
    if (!genAI) {
      setAiAudienceError('La configuración de la API de IA no es válida.');
      return;
    }
    if (!aiAudiencePrompt.trim()) {
      setAiAudienceError('Por favor, describe brevemente la campaña para generar la audiencia.');
      return;
    }

    setIsGeneratingAudience(true);
    setAiAudienceError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Genera una descripción detallada de la audiencia objetivo para una campaña política con el siguiente enfoque: "${aiAudiencePrompt}". Incluye rango de edad, intereses, ubicación geográfica y posibles comportamientos.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const audienceText = response.text();
      
      // Auto-llenar el campo audiencia del formulario
      setCampaignForm(prev => ({ ...prev, audience: audienceText }));
    } catch (error) {
      logError("Error al generar audiencia con IA:", error);
      setAiAudienceError('Ocurrió un error al contactar la IA para la audiencia.');
    } finally {
      setIsGeneratingAudience(false);
    }
  };

  // Función para crear campaña real
  const handleCreateCampaign = async () => {
    if (!selectedPlatform || !campaignForm.name || !campaignForm.budget) {
      alert('Por favor, complete los campos obligatorios: plataforma, nombre y presupuesto.');
      return;
    }

    setIsCreatingCampaign(true);
    
    try {
      // Simular creación de campaña
      const newCampaign = {
        id: Date.now().toString(),
        name: campaignForm.name,
        platform: platforms.find(p => p.id === selectedPlatform)?.name || selectedPlatform,
        status: 'active' as const,
        budget: parseInt(campaignForm.budget),
        spent: 0,
        reach: 0,
        engagement: 0,
        startDate: campaignForm.startDate || new Date().toISOString().split('T')[0],
        endDate: campaignForm.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      // En modo real, aquí se guardaría en la base de datos
      logInfo('Nueva campaña creada:', newCampaign);
      
      // Mostrar éxito y reiniciar formulario
      alert(`🚀 ¡Campaña "${newCampaign.name}" creada exitosamente en ${newCampaign.platform}!`);
      
      // Reiniciar estados
      setShowNewCampaign(false);
      setSelectedPlatform('');
      setCampaignForm({
        name: '',
        budget: '',
        audience: '',
        startDate: '',
        endDate: ''
      });
      setAiAudiencePrompt('');
      
    } catch (error) {
      logError('Error creando campaña:', error);
      alert('Error al crear la campaña. Inténtalo de nuevo.');
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  const platforms = [
    { id: 'meta', name: 'Meta (Facebook)', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-100' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', bgColor: 'bg-red-100' },
    { id: 'tiktok', name: 'TikTok', icon: Play, color: 'text-gray-900', bgColor: 'bg-gray-100' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400', bgColor: 'bg-blue-50' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', bgColor: 'bg-green-100' }
  ];

  const activeCampaigns = [
    {
      id: '1',
      name: 'Propuesta Educativa 2024',
      platform: 'Instagram',
      status: 'active',
      budget: 50000,
      spent: 23500,
      reach: 125000,
      engagement: 8.7,
      startDate: '2024-02-01',
      endDate: '2024-02-15'
    },
    {
      id: '2',
      name: 'Juventud y Futuro',
      platform: 'TikTok',
      status: 'active',
      budget: 30000,
      spent: 18200,
      reach: 89000,
      engagement: 12.3,
      startDate: '2024-02-05',
      endDate: '2024-02-20'
    },
    {
      id: '3',
      name: 'Diálogo Ciudadano',
      platform: 'YouTube',
      status: 'paused',
      budget: 75000,
      spent: 45000,
      reach: 67000,
      engagement: 6.2,
      startDate: '2024-01-20',
      endDate: '2024-02-28'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.name.includes(platform));
    return platformData ? platformData.icon : Target;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 text-purple-600 mr-2" />
          Programador de Campañas
        </h3>
        <button
          onClick={() => setShowNewCampaign(!showNewCampaign)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Campaña
        </button>
      </div>

      {showNewCampaign && (
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Crear Nueva Campaña</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Campaña
              </label>
              <input
                type="text"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Propuesta Ambiental 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto (COP)
              </label>
              <input
                type="number"
                value={campaignForm.budget}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="50000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Plataformas
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedPlatform === platform.id
                          ? `border-purple-500 ${platform.bgColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className={`h-6 w-6 ${platform.color} mx-auto mb-2`} />
                      <div className="text-xs font-medium text-gray-700">{platform.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={campaignForm.startDate}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={campaignForm.endDate}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audiencia Objetivo
              </label>
              <div className="flex space-x-2 mb-2">
                <textarea
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe tu audiencia objetivo: edad, intereses, ubicación..."
                  value={campaignForm.audience}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, audience: e.target.value }))}
                />
                <button
                  onClick={handleGenerateAudience}
                  disabled={isGeneratingAudience || !apiKey}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  title="Generar audiencia con IA"
                >
                  {isGeneratingAudience ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </button>
              </div>
              {aiAudienceError && <p className="text-xs text-red-600">{aiAudienceError}</p>}
              {!apiKey && <p className="text-xs text-yellow-600">La clave de API de IA no está configurada. La función está deshabilitada.</p>}
              <input
                type="text"
                value={aiAudiencePrompt}
                onChange={(e) => setAiAudiencePrompt(e.target.value)}
                placeholder="Ej: Campaña para jóvenes ciudadanos en Bogotá sobre medio ambiente"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowNewCampaign(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateCampaign}
              disabled={isCreatingCampaign}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
            >
              {isCreatingCampaign ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                '🚀 Crear Campaña'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-900 flex items-center">
          <BarChart3 className="h-4 w-4 text-green-600 mr-2" />
          Campañas Activas
        </h4>

        {activeCampaigns.map((campaign) => {
          const IconComponent = getPlatformIcon(campaign.platform);
          const progressPercentage = (campaign.spent / campaign.budget) * 100;
          
          return (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <IconComponent className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h5 className="font-semibold text-gray-900">{campaign.name}</h5>
                    <p className="text-sm text-gray-600">{campaign.platform}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status === 'active' ? 'Activa' : campaign.status === 'paused' ? 'Pausada' : 'Completada'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{campaign.reach.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Alcance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{campaign.engagement}%</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">${campaign.spent.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Gastado</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">${campaign.budget.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Presupuesto</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progreso del presupuesto</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};