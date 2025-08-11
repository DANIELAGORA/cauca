import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  Image, 
  Type,
  Palette,
  Sparkles,
  Upload,
  Download,
  Share,
  Eye,
  Edit3,
  Layers,
  LoaderCircle
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuración de la API de Gemini ---
// La clave se carga de forma segura desde las variables de entorno
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logError("VITE_GEMINI_API_KEY no encontrada. La funcionalidad de IA está deshabilitada.");
}

export const ContentCreator: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('video');
  
  // --- Estados para la funcionalidad de IA ---
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Estados para funciones adicionales de IA
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState('');
  const [aiContentType, setAiContentType] = useState('post'); // post, story, reel
  const [toneType, setToneType] = useState('inspirador'); // inspirador, informativo, llamada-accion

  const handleGenerateText = async () => {
    if (!genAI) {
      setError('La configuración de la API de IA no es válida.');
      return;
    }
    if (!prompt) {
      setError('Por favor, introduce un tema o idea.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedText('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const contentTypes = {
        'post': 'un post completo para redes sociales',
        'story': 'una historia corta e impactante para stories',
        'reel': 'un guión dinámico para video corto tipo reel'
      };
      
      const tones = {
        'inspirador': 'inspirador y motivacional',
        'informativo': 'informativo y educativo',
        'llamada-accion': 'directo con fuerte llamada a la acción'
      };

      const fullPrompt = `Eres un experto en comunicación política para el partido MAIS (Movimiento Alternativo Indígena y Social). 

Crea ${contentTypes[aiContentType]} con tono ${tones[toneType]} sobre: "${prompt}"

Requisitos:
- Longitud apropiada para ${aiContentType}
- Tono ${toneType}
- Incluye elementos visuales sugeridos
- Agrega hashtags estratégicos
- Llamada a la acción clara
- Lenguaje inclusivo y cercano

Formato de respuesta:
TÍTULO: [título llamativo]
CONTENIDO: [contenido principal]
HASHTAGS: [hashtags separados por espacios]
SUGERENCIA VISUAL: [descripción de imagen/video sugerido]`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Parsear la respuesta para separar título, contenido y hashtags
      const lines = text.split('\n');
      let title = '', content = '', hashtags = '';
      
      lines.forEach(line => {
        if (line.startsWith('TÍTULO:')) {
          title = line.replace('TÍTULO:', '').trim();
        } else if (line.startsWith('HASHTAGS:')) {
          hashtags = line.replace('HASHTAGS:', '').trim();
        } else if (line.startsWith('CONTENIDO:')) {
          content = line.replace('CONTENIDO:', '').trim();
        }
      });
      
      setGeneratedTitle(title);
      setGeneratedText(content || text);
      setGeneratedHashtags(hashtags);
      
    } catch (e) {
      logError("Error al generar contenido:", e);
      setError('Ocurrió un error al contactar la IA. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para generar solo hashtags
  const generateHashtags = async () => {
    if (!genAI || !prompt) return;
    
    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const hashtagPrompt = `Genera 5-8 hashtags estratégicos para una campaña política sobre "${prompt}" del partido MAIS. Incluye hashtags populares, específicos del tema y del partido. Formato: #hashtag1 #hashtag2 #hashtag3`;
      
      const result = await model.generateContent(hashtagPrompt);
      const response = await result.response;
      setGeneratedHashtags(response.text());
    } catch (e) {
      logError("Error generando hashtags:", e);
    } finally {
      setIsGenerating(false);
    }
  };


  const tools = [
    { id: 'video', name: 'Video', icon: Video, color: 'text-red-500' },
    { id: 'image', name: 'Imagen', icon: Image, color: 'text-green-500' },
    { id: 'carousel', name: 'Carrusel', icon: Layers, color: 'text-blue-500' },
    { id: 'story', name: 'Historia', icon: Camera, color: 'text-purple-500' }
  ];

  const templates = [
    {
      id: '1',
      name: 'Propuesta Política',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=300',
      duration: '30s',
      format: '16:9'
    },
    {
      id: '2',
      name: 'Estadística Impactante',
      type: 'image',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpg?auto=compress&cs=tinysrgb&w=300',
      format: '1:1'
    },
    {
      id: '3',
      name: 'Testimonio Ciudadano',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpg?auto=compress&cs=tinysrgb&w=300',
      duration: '60s',
      format: '9:16'
    },
    {
      id: '4',
      name: 'Infografía Educativa',
      type: 'carousel',
      thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=300',
      slides: 5,
      format: '1:1'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
        Creador de Contenido IA
      </h3>

      {/* AI Text Generation */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">🤖 Generador de Contenido IA Avanzado</h4>
        
        {/* Opciones de configuración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Contenido</label>
            <select
              value={aiContentType}
              onChange={(e) => setAiContentType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="post">📱 Post Redes Sociales</option>
              <option value="story">📸 Historia/Story</option>
              <option value="reel">🎥 Video/Reel</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tono</label>
            <select
              value={toneType}
              onChange={(e) => setToneType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="inspirador">✨ Inspirador</option>
              <option value="informativo">📊 Informativo</option>
              <option value="llamada-accion">🔥 Llamada a la Acción</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Un plan para mejorar la seguridad en los barrios"
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            rows={2}
          />
          
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateText}
              disabled={isGenerating || !apiKey}
              className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Type className="h-5 w-5 mr-2" />
              )}
              {isGenerating ? 'Generando...' : '🚀 Generar Contenido'}
            </button>
            
            <button
              onClick={generateHashtags}
              disabled={isGenerating || !apiKey || !prompt}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generar solo hashtags"
            >
              #️⃣
            </button>
          </div>
          
          {error && <p className="text-xs text-red-600">{error}</p>}
          {!apiKey && <p className="text-xs text-yellow-600">La clave de API de IA no está configurada. La función está deshabilitada.</p>}
        </div>
      </div>

      {(generatedText || generatedTitle || generatedHashtags) && (
        <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Sparkles className="h-4 w-4 text-purple-600 mr-1" />
            ✨ Resultado de la IA
          </h5>
          
          {generatedTitle && (
            <div className="mb-3">
              <h6 className="text-xs font-semibold text-purple-700 mb-1">📝 TÍTULO:</h6>
              <p className="text-sm font-semibold text-gray-800 bg-white p-2 rounded border">{generatedTitle}</p>
            </div>
          )}
          
          {generatedText && (
            <div className="mb-3">
              <h6 className="text-xs font-semibold text-purple-700 mb-1">📄 CONTENIDO:</h6>
              <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border">{generatedText}</p>
            </div>
          )}
          
          {generatedHashtags && (
            <div className="mb-3">
              <h6 className="text-xs font-semibold text-purple-700 mb-1">🏷️ HASHTAGS:</h6>
              <p className="text-sm text-blue-600 font-medium bg-white p-2 rounded border">{generatedHashtags}</p>
            </div>
          )}
          
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => navigator.clipboard.writeText(`${generatedTitle ? generatedTitle + '\n\n' : ''}${generatedText}\n\n${generatedHashtags}`)}
              className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              📋 Copiar Todo
            </button>
            <button
              onClick={() => {
                setGeneratedText('');
                setGeneratedTitle('');
                setGeneratedHashtags('');
              }}
              className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              🗑️ Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Content Type Selector */}
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setAiContentType('post')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              aiContentType === 'post'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📱 Post
          </button>
          <button
            onClick={() => setAiContentType('story')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              aiContentType === 'story'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📸 Historia
          </button>
          <button
            onClick={() => setAiContentType('reel')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              aiContentType === 'reel'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎥 Reel
          </button>
        </div>

        {/* Tool Selector */}
        <div className="grid grid-cols-4 gap-2">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedTool === tool.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <IconComponent className={`h-5 w-5 ${tool.color} mx-auto mb-1`} />
                <div className="text-xs font-medium text-gray-700">{tool.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Plantillas Sugeridas</h4>
        <div className="grid grid-cols-2 gap-3">
          {templates.slice(0, 4).map((template) => {
            return (
            <div key={template.id} className="relative group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                      Usar Plantilla
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-500">
                  {template.duration && `${template.duration} • `}
                  {template.format}
                  {template.slides && ` • ${template.slides} slides`}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <button 
          onClick={() => alert('📤 Función de subida activada! Selecciona tus archivos...')}
          className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          📤 Subir Contenido
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => alert('💾 Descargando contenido...')}
            className="p-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            💾 Descargar
          </button>
          <button 
            onClick={() => alert('🔗 Compartiendo contenido en redes sociales...')}
            className="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center text-sm"
          >
            <Share className="h-4 w-4 mr-1" />
            🔗 Compartir
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => alert('👁️ Vista previa del contenido activada!')}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            👁️ Vista
          </button>
          <button 
            onClick={() => alert('✏️ Editor avanzado abierto!')}
            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center text-xs"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            ✏️ Editar
          </button>
          <button 
            onClick={() => alert('🎨 Paleta de colores activada!')}
            className="p-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors flex items-center justify-center text-xs"
          >
            <Palette className="h-3 w-3 mr-1" />
            🎨 Color
          </button>
        </div>
      </div>
    </div>
  );
};
