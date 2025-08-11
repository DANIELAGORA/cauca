import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, LoaderCircle, Lightbulb } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuración de la API de Gemini ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logError("VITE_GEMINI_API_KEY no encontrada. La funcionalidad de IA en MetricCardWithAI está deshabilitada.");
}

interface Metric {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface MetricCardWithAIProps {
  metric: Metric;
  index: number; // Para staggerChildren
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const MetricCardWithAI: React.FC<MetricCardWithAIProps> = ({ metric, index }) => {
  const IconComponent = metric.icon;

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAnalyzeMetric = async () => {
    if (!genAI) {
      setAiError('La configuración de la API de IA no es válida.');
      return;
    }

    setIsAnalyzingAI(true);
    setAiError(null);
    setAiAnalysis(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analiza la siguiente métrica de campaña política: Título: "${metric.title}", Valor: "${metric.value}", Cambio: "${metric.change}". Proporciona un breve análisis de la tendencia y una posible implicación para la campaña. Sé conciso.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text();
      
      setAiAnalysis(analysis);
    } catch (e) {
      logError("Error al analizar métrica con IA:", e);
      setAiError('Ocurrió un error al contactar la IA para el análisis.');
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
          <p className="text-sm text-gray-500">{metric.change}</p>
        </div>
        <div className={`p-3 ${metric.bgColor} rounded-lg`}>
          <IconComponent className={`h-6 w-6 ${metric.color}`} />
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {!apiKey && (
          <p className="text-xs text-yellow-600">La clave de API de IA no está configurada. La función está deshabilitada.</p>
        )}
        <button
          onClick={handleAnalyzeMetric}
          disabled={isAnalyzingAI || !apiKey}
          className="w-full p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-sm"
        >
          {isAnalyzingAI ? (
            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Lightbulb className="h-4 w-4 mr-2" />
          )}
          {isAnalyzingAI ? 'Analizando...' : 'Análisis IA'}
        </button>

        {aiError && <p className="text-xs text-red-600 mt-2">Error IA: {aiError}</p>}
        {aiAnalysis && !isAnalyzingAI && (
          <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-800 whitespace-pre-wrap">{aiAnalysis}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};