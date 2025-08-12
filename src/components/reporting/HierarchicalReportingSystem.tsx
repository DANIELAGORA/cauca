// SISTEMA DE REPORTES JERÁRQUICO MAIS - VERSIÓN OPTIMIZADA
// Sistema limpio sin errores de linting

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, TrendingUp, Users, AlertCircle, CheckCircle, Send, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ReportMetrics {
  totalReports: number;
  pendingReports: number;
  completedReports: number;
  teamPerformance: number;
}

interface HierarchicalReport {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedBy: string;
  assignedTo?: string;
  createdAt: Date;
  dueDate?: Date;
  tags: string[];
}

interface HierarchicalReportingSystemProps {
  className?: string;
}

const HierarchicalReportingSystem: React.FC<HierarchicalReportingSystemProps> = ({ className = '' }) => {
  const [reports, setReports] = useState<HierarchicalReport[]>([]);
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    teamPerformance: 85
  });
  const [newReport, setNewReport] = useState({
    title: '',
    content: '',
    priority: 'medium' as const,
    tags: [] as string[]
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAISuggestions = useCallback(async () => {
    if (!newReport.title || !newReport.content) return;
    
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) return;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analiza este reporte y sugiere mejoras para un sistema político:
Título: ${newReport.title}
Contenido: ${newReport.content}

Proporciona sugerencias constructivas y profesionales.`;

      const result = await model.generateContent(prompt);
      setAiSuggestion(result.response.text());
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [newReport.title, newReport.content]);

  useEffect(() => {
    if (newReport.title && newReport.content) {
      const timeoutId = setTimeout(generateAISuggestions, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [generateAISuggestions]);

  const handleSubmitReport = () => {
    if (!newReport.title || !newReport.content) return;

    const report: HierarchicalReport = {
      id: `report-${Date.now()}`,
      title: newReport.title,
      content: newReport.content,
      status: 'pending',
      priority: newReport.priority,
      submittedBy: 'Usuario Actual',
      createdAt: new Date(),
      tags: newReport.tags
    };

    setReports(prev => [report, ...prev]);
    setMetrics(prev => ({
      ...prev,
      totalReports: prev.totalReports + 1,
      pendingReports: prev.pendingReports + 1
    }));

    setNewReport({ title: '', content: '', priority: 'medium', tags: [] });
    setShowCreateForm(false);
    setAiSuggestion('');
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100', 
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reportes</p>
              <p className="text-2xl font-bold">{metrics.totalReports}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.pendingReports}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-green-600">{metrics.completedReports}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Performance</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.teamPerformance}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Botón crear reporte */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sistema de Reportes Jerárquico</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Crear Reporte
        </button>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Nuevo Reporte</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título del Reporte</label>
              <input
                type="text"
                value={newReport.title}
                onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Título descriptivo del reporte"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contenido</label>
              <textarea
                value={newReport.content}
                onChange={(e) => setNewReport(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Describe el contenido del reporte..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Prioridad</label>
              <select
                value={newReport.priority}
                onChange={(e) => setNewReport(prev => ({ ...prev, priority: e.target.value as typeof prev.priority }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Sugerencia AI */}
            {aiSuggestion && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Sugerencia IA</span>
                </div>
                <p className="text-sm text-blue-700">{aiSuggestion}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={handleSubmitReport}
                disabled={!newReport.title || !newReport.content || loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Procesando...' : 'Enviar Reporte'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewReport({ title: '', content: '', priority: 'medium', tags: [] });
                  setAiSuggestion('');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de reportes */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay reportes aún</p>
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  <h3 className="font-medium">{report.title}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(report.priority)}`}>
                  {report.priority}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{report.content}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span>Por: {report.submittedBy}</span>
                </div>
                <span>{report.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HierarchicalReportingSystem;