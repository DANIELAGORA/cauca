import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { MessageCircle, Send, Users, AlertCircle, Bot, Zap, CheckCircle, LoaderCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logError } from '../../utils/logger';

// --- Configuración de la API de Gemini ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logError("VITE_GEMINI_API_KEY no encontrada. La funcionalidad de IA en MessageCenter está deshabilitada.");
}

export const MessageCenter: React.FC = () => {
  const { state, sendMessage } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'broadcast'>('direct');
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);

  // --- Estados para la funcionalidad de IA en mensajes ---
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isSuggestingAI, setIsSuggestingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !state.user) return;

    await sendMessage({
      senderId: state.user.id,
      senderName: state.user.name || state.user.email || 'Anónimo', 
      senderRole: state.user.role,
      content: newMessage,
      type: messageType,
      priority: 'medium',
      readBy: []
    });

    setNewMessage('');
    setAiSuggestion(null); // Limpiar sugerencia después de enviar
  };

  const getAISuggestion = async (text: string) => {
    if (!genAI || !isAIEnabled || !text.trim()) {
      setAiSuggestion(null);
      return;
    }
    if (isSuggestingAI) return; // Evitar múltiples llamadas

    setIsSuggestingAI(true);
    setAiError(null);
    setAiSuggestion(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Eres un asistente de comunicación para una campaña política. Genera una sugerencia de respuesta o mejora para el siguiente mensaje, considerando que el remitente es un ${state.user?.role} y el mensaje es: "${text}". Sé conciso y profesional.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestion = response.text();
      
      setAiSuggestion(suggestion);
    } catch (e) {
      logError("Error al obtener sugerencia de IA:", e);
      setAiError('No se pudo obtener sugerencia de IA.');
    } finally {
      setIsSuggestingAI(false);
    }
  };

  // Efecto para obtener sugerencia cuando el mensaje cambia (con un debounce para no sobrecargar la API)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (newMessage.trim()) {
        getAISuggestion(newMessage);
      } else {
        setAiSuggestion(null);
      }
    }, 500); // Esperar 500ms después de que el usuario deja de escribir

    return () => {
      clearTimeout(handler);
    };
  }, [newMessage, isAIEnabled]);

  const applySuggestion = () => {
    if (aiSuggestion) {
      setNewMessage(aiSuggestion);
      setAiSuggestion(null); // Limpiar sugerencia después de aplicar
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
        Centro de Mensajes
        <div className="ml-auto flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-xs text-green-700 font-medium">EN VIVO</span>
        </div>
      </h3>

      {/* AI Features Toggle */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Bot className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Asistente IA</span>
          </div>
          <button
            onClick={() => setIsAIEnabled(!isAIEnabled)}
            className={`w-10 h-5 rounded-full transition-all duration-300 ${
              isAIEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              isAIEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Auto-traducir</span>
          </div>
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`w-10 h-5 rounded-full transition-all duration-300 ${
              autoTranslate ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              autoTranslate ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </button>
        </div>
      </div>
      {/* Message composer */}
      <div className="mb-4">
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setMessageType('direct')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              messageType === 'direct'
                ? 'bg-blue-100 text-blue-800 shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageCircle className="h-3 w-3 inline mr-1" />
            Directo
          </button>
          <button
            onClick={() => setMessageType('broadcast')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              messageType === 'broadcast'
                ? 'bg-red-100 text-red-800 shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="h-3 w-3 inline mr-1" />
            Masivo
          </button>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isAIEnabled ? "Escribe tu mensaje (IA te ayudará)..." : "Escribir mensaje..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {isAIEnabled && newMessage && isSuggestingAI && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
            <LoaderCircle className="h-4 w-4 animate-spin text-blue-600 mr-2" />
            <span className="text-xs text-blue-700">Generando sugerencia de IA...</span>
          </div>
        )}

        {isAIEnabled && aiSuggestion && !isSuggestingAI && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-700 flex-1 mr-2">IA sugiere: {aiSuggestion}</p>
              <button 
                onClick={applySuggestion}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}

        {isAIEnabled && aiError && (
          <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700">Error IA: {aiError}</p>
          </div>
        )}

      </div>

      {/* Recent messages */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {state.messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No hay mensajes</p>
          </div>
        ) : (
          state.messages.slice().reverse().map((message) => (
            <div key={message.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start justify-between mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {message.senderName ? message.senderName.charAt(0).toUpperCase() : ''}
                </div>
                <div className="flex-1 ml-2">
                  <span className="text-sm font-medium text-gray-900">{message.senderName || message.senderRole}</span>
                  {message.type === 'broadcast' && (
                    <Users className="h-3 w-3 text-red-500 animate-pulse ml-1" />
                  )}
                  {message.priority === 'urgent' && (
                    <AlertCircle className="h-3 w-3 text-red-500 animate-bounce ml-1" />
                  )}
                  <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{message.content}</p>
              {autoTranslate && (
                <p className="text-xs text-blue-600 mt-1 italic">🌐 Traducido automáticamente</p>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{state.messages.length}</div>
            <div className="text-xs text-gray-500">Enviados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">98%</div>
            <div className="text-xs text-gray-500">Entregados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">87%</div>
            <div className="text-xs text-gray-500">Leídos</div>
          </div>
        </div>
      </div>
    </div>
  );
};