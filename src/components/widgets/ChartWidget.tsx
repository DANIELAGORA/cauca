import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Bot, LoaderCircle, Lightbulb } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuración de la API de Gemini ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logError("VITE_GEMINI_API_KEY no encontrada. La funcionalidad de IA en ChartWidget está deshabilitada.");
}

interface ChartWidgetProps {
  title: string;
  type: 'line' | 'area' | 'bar' | 'donut';
  data: any[];
  height?: number;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ title, type, data, height = 300 }) => {
  const colors = ['#DC2626', '#F59E0B', '#16A34A', '#3B82F6', '#8B5CF6'];

  const [aiChartAnalysis, setAiChartAnalysis] = useState<string | null>(null);
  const [isAnalyzingChartAI, setIsAnalyzingChartAI] = useState(false);
  const [aiChartError, setAiChartError] = useState<string | null>(null);

  const handleAnalyzeChart = async () => {
    if (!genAI) {
      setAiChartError('La configuración de la API de IA no es válida.');
      return;
    }
    if (!data || data.length === 0) {
      setAiChartError('No hay datos para analizar.');
      return;
    }

    setIsAnalyzingChartAI(true);
    setAiChartError(null);
    setAiChartAnalysis(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analiza los siguientes datos de un gráfico de tipo ${type} con título "${title}". Identifica tendencias, puntos clave y posibles implicaciones para una campaña política. Los datos son: ${JSON.stringify(data)}. Sé conciso.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text();
      
      setAiChartAnalysis(analysis);
    } catch (e) {
      logError("Error al analizar gráfico con IA:", e);
      setAiChartError('Ocurrió un error al contactar la IA para el análisis del gráfico.');
    } finally {
      setIsAnalyzingChartAI(false);
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#DC2626" fill="#FEE2E2" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'donut':
        const pieData = Object.entries(data).map(([key, value], index) => ({
          name: key,
          value: value as number,
          color: colors[index % colors.length]
        }));

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Tipo de gráfico no soportado</div>;
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {renderChart()}

      {/* AI Analysis Section */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {!apiKey && (
          <p className="text-xs text-yellow-600">La clave de API de IA no está configurada. La función está deshabilitada.</p>
        )}
        <button
          onClick={handleAnalyzeChart}
          disabled={isAnalyzingChartAI || !apiKey || !data || data.length === 0}
          className="w-full p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-sm"
        >
          {isAnalyzingChartAI ? (
            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Lightbulb className="h-4 w-4 mr-2" />
          )}
          {isAnalyzingChartAI ? 'Analizando...' : 'Análisis IA del Gráfico'}
        </button>

        {aiChartError && <p className="text-xs text-red-600 mt-2">Error IA: {aiChartError}</p>}
        {aiChartAnalysis && !isAnalyzingChartAI && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-800 whitespace-pre-wrap">{aiChartAnalysis}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};