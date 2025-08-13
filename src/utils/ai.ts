/**
 * Sistema de IA centralizado para MAIS - Producción con Google Gemini
 * Requiere API keys válidas para funcionamiento completo
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { logError, logInfo, logWarn } from './logger';

// Configuración de IA
interface AIConfig {
  geminiApiKey?: string;
  openaiApiKey?: string;
  maxRetries: number;
  timeout: number;
}

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider?: string;
}

class AIManager {
  private static instance: AIManager;
  private config: AIConfig;
  private geminiClient: GoogleGenerativeAI | null = null;
  private isInitialized = false;

  private constructor() {
    this.config = {
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
      openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
      maxRetries: 3,
      timeout: 15000
    };
    
    // Validate required API keys in production
    if (!this.config.geminiApiKey && import.meta.env.NODE_ENV === 'production') {
      logError('GEMINI_API_KEY is required for production deployment');
    }
  }

  static getInstance(): AIManager {
    if (!AIManager.instance) {
      AIManager.instance = new AIManager();
    }
    return AIManager.instance;
  }

  /**
   * Inicializar el manager de IA
   */
  init(): void {
    if (this.isInitialized) return;

    try {
      if (this.config.geminiApiKey) {
        this.geminiClient = new GoogleGenerativeAI(this.config.geminiApiKey);
        logInfo('✅ Gemini AI inicializado correctamente');
      } else {
        logError('❌ VITE_GEMINI_API_KEY requerida para producción');
        throw new Error('API key de Gemini requerida para funcionamiento completo');
      }
      
      this.isInitialized = true;
    } catch (error) {
      logError('❌ Error inicializando IA:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Verificar si la IA está disponible
   */
  isAvailable(): boolean {
    return this.isInitialized && !!this.geminiClient;
  }

  /**
   * Verificar si se requiere configuración
   */
  requiresSetup(): boolean {
    return !this.config.geminiApiKey;
  }

  /**
   * Generar contenido con IA usando el mejor proveedor disponible
   */
  async generateContent(prompt: string, context?: string): Promise<AIResponse> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'IA no disponible. Configure VITE_GEMINI_API_KEY.',
        provider: 'none'
      };
    }

    try {
      if (this.geminiClient) {
        return await this.generateWithGemini(prompt, context);
      }
      
      return {
        success: false,
        error: 'No hay proveedores de IA configurados',
        provider: 'none'
      };
    } catch (error) {
      logError('Error generando contenido:', error);
      return {
        success: false,
        error: `Error de IA: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        provider: 'gemini'
      };
    }
  }

  /**
   * Analizar texto con IA
   */
  async analyzeText(text: string, analysisType: 'sentiment' | 'keywords' | 'summary' = 'sentiment'): Promise<AIResponse> {
    if (!this.isAvailable()) {
      return this.getOfflineResponse('analyze', text, analysisType);
    }

    try {
      if (this.geminiClient) {
        return await this.analyzeWithGemini(text, analysisType);
      }
      
      return this.getOfflineResponse('analyze', text, analysisType);
    } catch (error) {
      logError('Error analizando texto:', error);
      return this.getOfflineResponse('analyze', text, analysisType);
    }
  }

  /**
   * Generar sugerencias inteligentes
   */
  async generateSuggestions(context: string, type: 'post' | 'campaign' | 'response' = 'post'): Promise<AIResponse> {
    if (!this.isAvailable()) {
      return this.getOfflineResponse('suggest', context, type);
    }

    try {
      if (this.geminiClient) {
        return await this.suggestWithGemini(context, type);
      }
      
      return this.getOfflineResponse('suggest', context, type);
    } catch (error) {
      logError('Error generando sugerencias:', error);
      return this.getOfflineResponse('suggest', context, type);
    }
  }

  /**
   * Generar contenido con Gemini AI
   */
  private async generateWithGemini(prompt: string, context?: string): Promise<AIResponse> {
    try {
      const model = this.geminiClient!.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const fullPrompt = context 
        ? `Contexto: ${context}\n\nPregunta: ${prompt}`
        : prompt;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      logInfo('✅ Contenido generado con Gemini AI');
      
      return {
        success: true,
        data: text,
        provider: 'gemini'
      };
    } catch (error) {
      logError('Error con Gemini AI:', error);
      throw error;
    }
  }

  /**
   * Analizar texto con Gemini AI
   */
  private async analyzeWithGemini(text: string, analysisType: string): Promise<AIResponse> {
    try {
      const model = this.geminiClient!.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      let prompt = '';
      switch (analysisType) {
        case 'sentiment':
          prompt = `Analiza el sentimiento del siguiente texto y devuelve un objeto JSON con: {\"sentiment\": \"positive|negative|neutral\", \"confidence\": 0-100, \"keywords\": [\"palabra1\", \"palabra2\"], \"summary\": \"breve resumen\"}:\n\n${text}`;
          break;
        case 'keywords':
          prompt = `Extrae las palabras clave más importantes del siguiente texto en formato JSON: {\"keywords\": [\"palabra1\", \"palabra2\"], \"themes\": [\"tema1\", \"tema2\"]}:\n\n${text}`;
          break;
        case 'summary':
          prompt = `Resume el siguiente texto en 2-3 oraciones manteniendo los puntos clave:\n\n${text}`;
          break;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisResult = response.text();

      let parsedData = analysisResult;
      try {
        parsedData = JSON.parse(analysisResult);
      } catch {
        // Si no es JSON válido, devolver como texto
      }

      return {
        success: true,
        data: parsedData,
        provider: 'gemini'
      };
    } catch (error) {
      logError('Error analizando con Gemini:', error);
      throw error;
    }
  }

  /**
   * Generar sugerencias con Gemini AI
   */
  private async suggestWithGemini(context: string, type: string): Promise<AIResponse> {
    try {
      const model = this.geminiClient!.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      let prompt = '';
      switch (type) {
        case 'post':
          prompt = `Basándote en este contexto político: "${context}", genera 3 ideas creativas para posts de redes sociales que sean engaging y apropiados para una campaña política. Devuelve un array JSON: [{\"title\": \"título\", \"content\": \"contenido\", \"hashtags\": [\"#hashtag1\", \"#hashtag2\"], \"platform\": \"mejor plataforma\"}]`;
          break;
        case 'campaign':
          prompt = `Analiza este contexto de campaña: "${context}" y sugiere 3 estrategias específicas en formato JSON: [{\"strategy\": \"nombre\", \"description\": \"descripción\", \"target\": \"audiencia objetivo\", \"budget\": \"rango presupuestal\"}]`;
          break;
        case 'response':
          prompt = `Basándote en este mensaje: "${context}", genera 3 respuestas apropiadas para un contexto político profesional en JSON: [{\"tone\": \"formal|casual|diplomatic\", \"response\": \"respuesta\", \"reasoning\": \"por qué es apropiada\"}]`;
          break;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text();

      let parsedData = suggestions;
      try {
        parsedData = JSON.parse(suggestions);
      } catch {
        // Si no es JSON válido, devolver como texto
      }

      return {
        success: true,
        data: parsedData,
        provider: 'gemini'
      };
    } catch (error) {
      logError('Error generando sugerencias con Gemini:', error);
      throw error;
    }
  }

  /**
   * Respuestas offline para cuando la IA no está disponible
   */
  private getOfflineResponse(action: string, input: string, type?: string): AIResponse {
    const offlineResponses = {
      generate: {
        post: [
          "🌟 Construyamos juntos el futuro que Colombia merece. Cada voto cuenta, cada voz importa. #VotaConsciente #FuturoDeColombia",
          "💪 La fuerza de nuestro movimiento está en la unidad del pueblo. Juntos somos imparables. #UnidadPopular #CambioReal",
          "🇨🇴 Colombia necesita líderes que escuchen, que actúen y que cumplan. Ese compromiso es nuestro. #LiderazgoReal #Colombia2024"
        ][Math.floor(Math.random() * 3)],
        campaign: "📊 Estrategia recomendada: Enfoque en redes sociales con contenido auténtico, eventos comunitarios presenciales, y alianzas estratégicas con líderes locales. Presupuesto sugerido: $2-5M COP por región.",
        response: "Agradecemos su interés en nuestras propuestas. Estaremos encantados de profundizar en este tema en nuestros próximos encuentros ciudadanos. 🤝"
      },
      analyze: {
        sentiment: {
          sentiment: "positive",
          confidence: 85,
          keywords: ["cambio", "futuro", "unidad", "progreso"],
          summary: "Mensaje positivo orientado al progreso y la unidad ciudadana"
        },
        keywords: {
          keywords: ["política", "campaña", "ciudadanos", "cambio", "democracia"],
          themes: ["participación ciudadana", "transformación social", "liderazgo político"]
        },
        summary: "El mensaje refleja un enfoque progresista centrado en la participación ciudadana y el cambio social constructivo."
      },
      suggest: {
        post: [
          {
            title: "Llamado a la Participación",
            content: "🗳️ Tu voz es el motor del cambio. Participa, opina, construye. #ParticipaciónCiudadana",
            hashtags: ["#ParticipaciónCiudadana", "#VozDelPueblo", "#DemocraciaActiva"],
            platform: "Instagram"
          },
          {
            title: "Compromiso con el Territorio",
            content: "🌱 Conocemos cada rincón de Colombia porque caminamos cada territorio. #CompromisoTerritorial",
            hashtags: ["#CompromisoTerritorial", "#ColombiaUnida", "#LiderazgoLocal"],
            platform: "Facebook"
          },
          {
            title: "Futuro Sostenible",
            content: "🌍 El medio ambiente no es un tema político, es nuestro futuro común. #SostenibilidadYa",
            hashtags: ["#SostenibilidadYa", "#MedioAmbiente", "#FuturoVerde"],
            platform: "Twitter"
          }
        ],
        campaign: [
          {
            strategy: "Engagement Digital",
            description: "Campaña multimedia con contenido interactivo y storytelling auténtico",
            target: "Jóvenes 18-35 años, profesionales urbanos",
            budget: "3-7M COP"
          },
          {
            strategy: "Proximidad Territorial",
            description: "Eventos comunitarios y diálogos ciudadanos en territorios clave",
            target: "Líderes comunitarios, adultos mayores",
            budget: "5-10M COP"
          },
          {
            strategy: "Alianzas Estratégicas",
            description: "Coaliciones con organizaciones sociales y sector privado responsable",
            target: "Organizaciones civiles, empresarios locales",
            budget: "2-5M COP"
          }
        ],
        response: [
          {
            tone: "formal",
            response: "Agradecemos profundamente su mensaje y el interés en nuestras propuestas. Estaremos encantados de ampliar esta conversación en espacios de diálogo ciudadano.",
            reasoning: "Respuesta diplomática apropiada para comunicación oficial"
          },
          {
            tone: "casual",
            response: "¡Gracias por escribirnos! 😊 Nos encanta conectar con ciudadanos comprometidos como usted. ¿Le parece si coordinamos una charla?",
            reasoning: "Tono accesible para redes sociales y comunicación directa"
          },
          {
            tone: "diplomatic",
            response: "Valoramos enormemente su participación en este proceso democrático. Su aporte enriquece el debate público y fortalece nuestra democracia.",
            reasoning: "Enfoque institucional para contextos formales o mediáticos"
          }
        ]
      }
    };

    const response = offlineResponses[action as keyof typeof offlineResponses];
    const data = type ? response[type as keyof typeof response] : response;

    logWarn(`🔌 Respuesta offline generada para: ${action} (${type || 'general'})`);
    
    return {
      success: true,
      data,
      provider: 'offline'
    };
  }

  /**
   * Configurar API key dinámicamente (BYOK pattern)
   */
  setApiKey(provider: 'gemini' | 'openai', apiKey: string): void {
    if (provider === 'gemini') {
      this.config.geminiApiKey = apiKey;
      this.geminiClient = new GoogleGenerativeAI(apiKey);
      logInfo('✅ Gemini API key actualizada');
    } else if (provider === 'openai') {
      this.config.openaiApiKey = apiKey;
      logInfo('✅ OpenAI API key actualizada');
    }
  }

  /**
   * Obtener estado de la configuración
   */
  getStatus(): { gemini: boolean; openai: boolean; offline: boolean } {
    return {
      gemini: !!this.geminiClient,
      openai: !!this.config.openaiApiKey,
      offline: !this.isAvailable()
    };
  }
}

// Instancia singleton
export const aiManager = AIManager.getInstance();

// Shorthand exports para facilitar uso
export const generateAIContent = (prompt: string, context?: string) => aiManager.generateContent(prompt, context);
export const analyzeWithAI = (text: string, type?: 'sentiment' | 'keywords' | 'summary') => aiManager.analyzeText(text, type);
export const getAISuggestions = (context: string, type?: 'post' | 'campaign' | 'response') => aiManager.generateSuggestions(context, type);

// Inicializar automáticamente
aiManager.init();

export default aiManager;