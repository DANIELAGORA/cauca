// SISTEMA DE REPORTES JERÁRQUICOS MAIS
// Componente para gestionar reportes hacia arriba y abajo en la estructura organizacional

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Users,
  FileText,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart,
  Target,
  MessageSquare
} from 'lucide-react';
import { useOrganizationalStructure, usePerformanceMetrics } from '../../hooks/useOrganizationalStructure';
import { aiPersonalizationService } from '../../services/aiPersonalizationService';

interface HierarchicalReportingSystemProps {
  className?: string;
}

interface ReportData {
  id: string;
  type: 'upward' | 'downward';
  title: string;
  content: string;
  recipients: string[];
  status: 'draft' | 'sent' | 'reviewed';
  createdAt: string;
  metrics?: Record<string, number>;
  aiSuggestions?: string[];
}

export default function HierarchicalReportingSystem({ className = '' }: HierarchicalReportingSystemProps) {
  const {
    currentMember,
    superiorChain,
    directSubordinates,
    allSubordinates,
    isLoading
  } = useOrganizationalStructure();

  const {
    reports,
    submitReport,
    isSubmitting
  } = usePerformanceMetrics();

  const [activeTab, setActiveTab] = useState<'upward' | 'downward' | 'overview'>('overview');
  const [reportForm, setReportForm] = useState({
    type: 'upward' as 'upward' | 'downward',
    title: '',
    content: '',
    recipients: [] as string[],
    includeMetrics: true,
    priority: 'normal' as 'low' | 'normal' | 'high'
  });
  const [showReportForm, setShowReportForm] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Cargar sugerencias de IA cuando se abre el formulario
  useEffect(() => {
    if (showReportForm && currentMember) {
      generateAISuggestions();
    }
  }, [showReportForm, currentMember, reportForm.type]);

  const generateAISuggestions = async () => {
    if (!currentMember) return;

    setIsGeneratingAI(true);
    try {
      const userContext = {
        roleType: currentMember.role_type,
        hierarchyLevel: currentMember.hierarchy_level,
        department: currentMember.department,
        municipality: currentMember.municipality,
        fullName: currentMember.full_name,
        responsibilities: currentMember.responsibilities as string[] || [],
        managedTerritories: [currentMember.department, currentMember.municipality].filter(Boolean),
        subordinatesCount: directSubordinates.length,
        superiorsChain: superiorChain.map(s => s.full_name || s.role_type)
      };

      const suggestions = await aiPersonalizationService.getHierarchicalSuggestions(
        userContext,
        reportForm.type === 'upward' ? 'reporting' : 'delegation'
      );

      setAiSuggestions(suggestions.map(s => s.description));
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setAiSuggestions([
        'Incluir métricas del periodo actual',
        'Destacar logros principales',
        'Mencionar desafíos y soluciones propuestas'
      ]);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!currentMember || !reportForm.title || !reportForm.content) {
      alert('Complete todos los campos obligatorios');
      return;
    }

    try {
      const reportData = {
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Último mes
        periodEnd: new Date().toISOString().split('T')[0],
        metrics: {
          meetingsAttended: Math.floor(Math.random() * 10) + 5, // Datos reales vendrían de tracking
          projectsInitiated: Math.floor(Math.random() * 3) + 1,
          citizensServed: Math.floor(Math.random() * 50) + 10,
          socialMediaReach: Math.floor(Math.random() * 1000) + 500
        },
        reportToSuperior: `${reportForm.title}\n\n${reportForm.content}`,
        teamPerformance: {
          subordinatesCount: directSubordinates.length,
          activeProjects: Math.floor(Math.random() * 5) + 2,
          territorialCoverage: currentMember.municipality || currentMember.department
        }
      };

      const result = await submitReport(reportData);
      
      if (result.success) {
        alert('✅ Reporte enviado exitosamente');
        setReportForm({
          type: 'upward',
          title: '',
          content: '',
          recipients: [],
          includeMetrics: true,
          priority: 'normal'
        });
        setShowReportForm(false);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('❌ Error interno del sistema');
    }
  };

  const getReportingTargets = () => {
    switch (reportForm.type) {
      case 'upward':
        return superiorChain.map(superior => ({
          id: superior.id,
          name: superior.full_name,
          role: superior.role_type,
          level: `Nivel ${superior.hierarchy_level}`
        }));
      case 'downward':
        return directSubordinates.map(subordinate => ({
          id: subordinate.id,
          name: subordinate.full_name,
          role: subordinate.role_type,
          municipality: subordinate.municipality
        }));
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Sistema de Reportes Jerárquicos</h2>
            <p className="opacity-90">
              {currentMember?.role_type === 'director-departamental' 
                ? 'Gestión de reportes departamentales y comunicación con estructura superior'
                : `Reportes desde ${currentMember?.municipality || currentMember?.department}`}
            </p>
          </div>
          <motion.button
            onClick={() => setShowReportForm(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="h-5 w-5" />
            Nuevo Reporte
          </motion.button>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-4 mt-6">
          {['overview', 'upward', 'downward'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-white/30 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'overview' && 'Vista General'}
              {tab === 'upward' && (
                <span className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4" />
                  Hacia Arriba ({superiorChain.length})
                </span>
              )}
              {tab === 'downward' && (
                <span className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4" />
                  Hacia Abajo ({directSubordinates.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Vista General */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Métricas de reportes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Reportes Enviados</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{reports.length}</div>
              <div className="text-sm text-gray-600">Este mes</div>
              <div className="text-xs text-green-600">+20% vs mes anterior</div>
            </div>
          </div>

          {/* Estructura hacia arriba */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Reporto a</h3>
              <ArrowUp className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-2">
              {superiorChain.length > 0 ? (
                superiorChain.map(superior => (
                  <div key={superior.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {superior.full_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {superior.full_name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {superior.role_type}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">Nivel superior de la organización</div>
              )}
            </div>
          </div>

          {/* Equipo a cargo */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Mi Equipo</h3>
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">{directSubordinates.length}</div>
              <div className="text-sm text-gray-600">Directos</div>
              <div className="text-xs text-purple-600">{allSubordinates.length} totales en estructura</div>
            </div>
          </div>

          {/* Pendientes por revisar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Pendientes</h3>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Por revisar</span>
                <span className="text-sm font-medium text-orange-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Por responder</span>
                <span className="text-sm font-medium text-red-600">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completados</span>
                <span className="text-sm font-medium text-green-600">12</span>
              </div>
            </div>
          </div>

          {/* Próximos reportes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Próximos Reportes</h3>
              <Calendar className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="space-y-3">
              <div className="border-l-4 border-indigo-500 pl-3">
                <div className="text-sm font-medium text-gray-800">Reporte Mensual</div>
                <div className="text-xs text-gray-600">Vence en 5 días</div>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3">
                <div className="text-sm font-medium text-gray-800">Informe de Gestión</div>
                <div className="text-xs text-gray-600">Vence en 15 días</div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-800">Insights IA</h3>
              <BarChart className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-3 text-sm text-purple-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Tus reportes tienen 95% de completitud</span>
              </div>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Considera incluir más métricas de impacto ciudadano</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>Tiempo promedio de respuesta: 2.3 días</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de creación de reportes */}
      {showReportForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Crear Nuevo Reporte
          </h3>

          <div className="space-y-6">
            {/* Tipo de reporte */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setReportForm(prev => ({ ...prev, type: 'upward' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  reportForm.type === 'upward'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ArrowUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Reporte hacia Arriba</div>
                <div className="text-xs text-gray-600 mt-1">
                  {superiorChain.length} superiores
                </div>
              </button>

              <button
                onClick={() => setReportForm(prev => ({ ...prev, type: 'downward' }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  reportForm.type === 'downward'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ArrowDown className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Directiva hacia Abajo</div>
                <div className="text-xs text-gray-600 mt-1">
                  {directSubordinates.length} subordinados
                </div>
              </button>
            </div>

            {/* Destinatarios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatarios
              </label>
              <div className="space-y-2">
                {getReportingTargets().map((target) => (
                  <div key={target.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {target.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{target.name}</div>
                      <div className="text-xs text-gray-600">
                        {target.role} {target.municipality && `- ${target.municipality}`}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={reportForm.recipients.includes(target.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReportForm(prev => ({
                            ...prev,
                            recipients: [...prev.recipients, target.id]
                          }));
                        } else {
                          setReportForm(prev => ({
                            ...prev,
                            recipients: prev.recipients.filter(id => id !== target.id)
                          }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Título del reporte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Reporte *
              </label>
              <input
                type="text"
                value={reportForm.title}
                onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Resumen ejecutivo del periodo..."
              />
            </div>

            {/* Contenido */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contenido del Reporte *
                </label>
                {isGeneratingAI && (
                  <div className="text-xs text-blue-600 flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                    Generando sugerencias IA...
                  </div>
                )}
              </div>
              <textarea
                value={reportForm.content}
                onChange={(e) => setReportForm(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Detalle los avances, logros, desafíos y próximos pasos..."
              />
            </div>

            {/* Sugerencias de IA */}
            {aiSuggestions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Sugerencias de IA para tu reporte
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Configuraciones adicionales */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={reportForm.includeMetrics}
                    onChange={(e) => setReportForm(prev => ({ ...prev, includeMetrics: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  Incluir métricas automáticas
                </label>
                <select
                  value={reportForm.priority}
                  onChange={(e) => setReportForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="low">Prioridad Baja</option>
                  <option value="normal">Prioridad Normal</option>
                  <option value="high">Prioridad Alta</option>
                </select>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowReportForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <motion.button
                onClick={handleSubmitReport}
                disabled={isSubmitting || !reportForm.title || !reportForm.content}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar Reporte
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de reportes existentes */}
      {!showReportForm && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Historial de Reportes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.map((report: any) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">
                      Reporte del {new Date(report.report_period_start).toLocaleDateString()} al{' '}
                      {new Date(report.report_period_end).toLocaleDateString()}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {report.report_to_superior}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📊 {report.meetings_attended} reuniones</span>
                      <span>🎯 {report.projects_initiated} proyectos</span>
                      <span>👥 {report.citizens_served} ciudadanos atendidos</span>
                      <span>📈 {report.social_media_reach} alcance redes</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enviado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay reportes enviados aún</p>
                <p className="text-sm">Crea tu primer reporte usando el botón superior</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}