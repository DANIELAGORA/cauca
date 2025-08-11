import React, { useState } from 'react';
import { 
  Instagram, 
  Youtube, 
  Play, 
  Facebook,
  MessageCircle,
  Heart,
  Share,
  Eye,
  BarChart3,
  Bot,
  LoaderCircle,
  Lightbulb,
  Smile
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuración de la API de Gemini ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logError("VITE_GEMINI_API_KEY no encontrada. La funcionalidad de IA en SocialMediaManager está deshabilitada.");
}

export const SocialMediaManager: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [showScheduler, setShowScheduler] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // --- Estados para la funcionalidad de IA ---
  const [postIdeaPrompt, setPostIdeaPrompt] = useState('');
  const [generatedPostIdea, setGeneratedPostIdea] = useState('');
  const [isGeneratingPostIdea, setIsGeneratingPostIdea] = useState(false);
  const [postIdeaError, setPostIdeaError] = useState<string | null>(null);

  const [sentimentText, setSentimentText] = useState('');
  const [sentimentAnalysis, setSentimentAnalysis] = useState<string | null>(null);
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const [sentimentError, setSentimentError] = useState<string | null>(null);

  // Estados para programar posts
  const [scheduledPost, setScheduledPost] = useState({
    content: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const handleGeneratePostIdea = async () => {
    if (!genAI) {
      setPostIdeaError('La configuración de la API de IA no es válida.');
      return;
    }
    if (!postIdeaPrompt.trim()) {
      setPostIdeaError('Por favor, introduce un tema para la idea de post.');
      return;
    }

    setIsGeneratingPostIdea(true);
    setPostIdeaError(null);
    setGeneratedPostIdea('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Genera una idea creativa y concisa para un post en redes sociales sobre el siguiente tema: "${postIdeaPrompt}". Incluye un título, una breve descripción y 2-3 hashtags relevantes.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const idea = response.text();
      
      setGeneratedPostIdea(idea);
    } catch (e) {
      logError("Error al generar idea de post con IA:", e);
      setPostIdeaError('Ocurrió un error al contactar la IA para la idea de post.');
    } finally {
      setIsGeneratingPostIdea(false);
    }
  };

  const handleAnalyzeSentiment = async () => {
    if (!genAI) {
      setSentimentError('La configuración de la API de IA no es válida.');
      return;
    }
    if (!sentimentText.trim()) {
      setSentimentError('Por favor, introduce texto para analizar el sentimiento.');
      return;
    }

    setIsAnalyzingSentiment(true);
    setSentimentError(null);
    setSentimentAnalysis(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analiza el sentimiento del siguiente texto y clasifícalo como Positivo, Negativo o Neutral. Explica brevemente por qué. Texto: "${sentimentText}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text();
      
      setSentimentAnalysis(analysis);
    } catch (e) {
      logError("Error al analizar sentimiento con IA:", e);
      setSentimentError('Ocurrió un error al contactar la IA para el análisis de sentimiento.');
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };

  // Función para programar un post
  const handleSchedulePost = () => {
    if (!scheduledPost.content || !scheduledPost.scheduledDate || !scheduledPost.scheduledTime) {
      alert('Por favor, complete todos los campos para programar el post.');
      return;
    }

    const scheduleDateTime = new Date(`${scheduledPost.scheduledDate}T${scheduledPost.scheduledTime}`);
    const now = new Date();

    if (scheduleDateTime <= now) {
      alert('La fecha y hora deben ser futuras.');
      return;
    }

    alert(`📅 ¡Post programado exitosamente para ${selectedPlatform.toUpperCase()}!\n\n📝 Contenido: "${scheduledPost.content}"\n🕒 Fecha: ${scheduleDateTime.toLocaleString()}`);
    
    // Limpiar formulario
    setScheduledPost({
      content: '',
      scheduledDate: '',
      scheduledTime: ''
    });
    setShowScheduler(false);
  };

  // Función para generar analytics con IA
  const generateAnalyticsInsights = async () => {
    if (!genAI) return;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analiza las métricas de redes sociales para la plataforma ${selectedPlatform} del partido MAIS. Proporciona insights sobre:
      
      1. Rendimiento actual vs competencia
      2. Mejores horarios para publicar
      3. Tipos de contenido más efectivos
      4. Estrategias de crecimiento
      5. Recomendaciones específicas
      
      Formato: Análisis conciso y práctico.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
      
    } catch (error) {
      logError('Error generando analytics:', error);
      return null;
    }
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
      followers: '425K',
      growth: '+8.2%',
      engagement: '9.1%',
      posts: 234
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Play,
      color: 'text-gray-900',
      bgColor: 'bg-gray-100',
      followers: '312K',
      growth: '+15.7%',
      engagement: '12.3%',
      posts: 156
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      followers: '89K',
      growth: '+12.3%',
      engagement: '6.8%',
      posts: 67
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      followers: '156K',
      growth: '+4.1%',
      engagement: '5.2%',
      posts: 189
    }
  ];

  const recentPosts = [
    {
      id: '1',
      platform: 'Instagram',
      content: 'Propuesta para mejorar la educación pública en Colombia 🎓',
      likes: 2847,
      comments: 156,
      shares: 89,
      views: 15420,
      time: '2 horas'
    },
    {
      id: '2',
      platform: 'TikTok',
      content: 'Explicando la reforma tributaria en 60 segundos ⏰',
      likes: 5632,
      comments: 234,
      shares: 445,
      views: 45230,
      time: '5 horas'
    },
    {
      id: '3',
      platform: 'YouTube',
      content: 'Conversatorio: El futuro de los jóvenes en Colombia',
      likes: 892,
      comments: 67,
      shares: 123,
      views: 8940,
      time: '1 día'
    }
  ];

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
        Gestión de Redes Sociales
      </h3>

      {/* Platform Selector */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedPlatform === platform.id
                  ? `border-purple-500 ${platform.bgColor} shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${platform.color} mx-auto mb-1`} />
              <div className="text-xs font-medium text-gray-700">{platform.name}</div>
              <div className="text-xs text-gray-500">{platform.followers}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Platform Stats */}
      {selectedPlatformData && (
        <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center mb-3">
            <selectedPlatformData.icon className={`h-6 w-6 ${selectedPlatformData.color} mr-2`} />
            <h4 className="font-semibold text-gray-900">{selectedPlatformData.name}</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{selectedPlatformData.followers}</div>
              <div className="text-xs text-gray-500">Seguidores</div>
              <div className="text-xs text-green-600">{selectedPlatformData.growth}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{selectedPlatformData.engagement}</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Post Idea Generation */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Lightbulb className="h-4 w-4 text-blue-600 mr-2" />
          Generador de Ideas de Post IA
        </h4>
        <div className="space-y-3">
          <textarea
            value={postIdeaPrompt}
            onChange={(e) => setPostIdeaPrompt(e.target.value)}
            placeholder="Ej: Tema para un post sobre participación ciudadana"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={2}
          />
          <button
            onClick={handleGeneratePostIdea}
            disabled={isGeneratingPostIdea || !apiKey || !postIdeaPrompt.trim()}
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-sm"
          >
            {isGeneratingPostIdea ? (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Bot className="h-4 w-4 mr-2" />
            )}
            {isGeneratingPostIdea ? 'Generando Idea...' : 'Generar Idea de Post'}
          </button>
          {postIdeaError && <p className="text-xs text-red-600 mt-2">Error IA: {postIdeaError}</p>}
          {generatedPostIdea && !isGeneratingPostIdea && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-800 whitespace-pre-wrap">{generatedPostIdea}</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Sentiment Analysis */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Smile className="h-4 w-4 text-green-600 mr-2" />
          Análisis de Sentimiento IA
        </h4>
        <div className="space-y-3">
          <textarea
            value={sentimentText}
            onChange={(e) => setSentimentText(e.target.value)}
            placeholder="Pega un comentario o texto para analizar su sentimiento..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            rows={2}
          />
          <button
            onClick={handleAnalyzeSentiment}
            disabled={isAnalyzingSentiment || !apiKey || !sentimentText.trim()}
            className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-sm"
          >
            {isAnalyzingSentiment ? (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Bot className="h-4 w-4 mr-2" />
            )}
            {isAnalyzingSentiment ? 'Analizando Sentimiento...' : 'Analizar Sentimiento'}
          </button>
          {sentimentError && <p className="text-xs text-red-600 mt-2">Error IA: {sentimentError}</p>}
          {sentimentAnalysis && !isAnalyzingSentiment && (
            <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-800 whitespace-pre-wrap">{sentimentAnalysis}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Publicaciones Recientes</h4>
        
        {recentPosts.slice(0, 3).map((post) => (
          <div key={post.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">{post.platform}</div>
                <div className="text-xs text-gray-600 line-clamp-2">{post.content}</div>
              </div>
              <div className="text-xs text-gray-500 ml-2">{post.time}</div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {post.likes.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {post.comments}
                </div>
                <div className="flex items-center">
                  <Share className="h-3 w-3 mr-1" />
                  {post.shares}
                </div>
              </div>
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {post.views.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Scheduler Interface */}
      {showScheduler && (
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            📅 Programar Post para {selectedPlatformData?.name}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenido del Post</label>
              <textarea
                value={scheduledPost.content}
                onChange={(e) => setScheduledPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Escribe el contenido de tu post aquí..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={scheduledPost.scheduledDate}
                  onChange={(e) => setScheduledPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                <input
                  type="time"
                  value={scheduledPost.scheduledTime}
                  onChange={(e) => setScheduledPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSchedulePost}
                className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center text-sm font-medium"
              >
                📅 Programar Post
              </button>
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Interface */}
      {showAnalytics && (
        <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            📊 Analytics IA para {selectedPlatformData?.name}
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">94.2%</div>
                <div className="text-xs text-gray-600">Sentimiento Positivo</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">2.8M</div>
                <div className="text-xs text-gray-600">Impresiones Totales</div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border">
              <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <Bot className="h-4 w-4 text-blue-600 mr-1" />
                🤖 Insights de IA
              </h5>
              <div className="text-sm text-gray-700 space-y-2">
                <p>• <strong>Mejor horario:</strong> 7:00 PM - 9:00 PM (engagement +45%)</p>
                <p>• <strong>Contenido top:</strong> Videos cortos sobre propuestas (+230% alcance)</p>
                <p>• <strong>Audiencia activa:</strong> 18-35 años, interesados en política y educación</p>
                <p>• <strong>Recomendación:</strong> Aumentar contenido visual y usar #MaisEsCambio</p>
              </div>
            </div>
            
            <button
              onClick={async () => {
                const insights = await generateAnalyticsInsights();
                if (insights) {
                  alert(`🤖 Nuevos Insights de IA:\n\n${insights}`);
                }
              }}
              className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center text-sm font-medium"
            >
              <Bot className="h-4 w-4 mr-2" />
              🔄 Generar Nuevos Insights IA
            </button>
            
            <button
              onClick={() => setShowAnalytics(false)}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cerrar Analytics
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setShowScheduler(!showScheduler)}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            📅 Programar Post
          </button>
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="p-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-xs font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            📊 Ver Analytics
          </button>
        </div>
      </div>
    </div>
  );
};