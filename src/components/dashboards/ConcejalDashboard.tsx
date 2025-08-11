import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  MapPin,
  Phone,
  Mail,
  Settings,
  Bell,
  PlusCircle,
  Download,
  Share2,
  Megaphone,
  Building,
  Clock
} from 'lucide-react';
import { generateAIContent } from '../../utils/ai';

export const ConcejalDashboard: React.FC = () => {
  const { state } = useApp();
  const [aiSuggestions, setAISuggestions] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (state.user) {
      loadAISuggestions();
    }
  }, [state.user]);

  const loadAISuggestions = async () => {
    if (!state.user) return;
    
    setLoading(true);
    try {
      const prompt = `Como concejal electo del MAIS en ${state.user.department}, municipio ${state.user.region}, genera 3 sugerencias específicas de gestión municipal para esta semana, considerando:
      - Proyectos de ordenanza prioritarios
      - Iniciativas de participación ciudadana
      - Seguimiento a compromisos de campaña
      - Comunicación con la comunidad
      
      Responde en formato de lista con acciones concretas.`;
      
      const suggestions = await generateAIContent(prompt);
      setAISuggestions(suggestions);
    } catch (error) {
      setAISuggestions('Error cargando sugerencias. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const concejalStats = {
    sesiones: { total: 12, asistidas: 11, porcentaje: 92 },
    proyectos: { presentados: 3, aprobados: 2, pendientes: 1 },
    ciudadanos: { atendidos: 45, casos_resueltos: 38, pendientes: 7 },
    iniciativas: { activas: 4, completadas: 8, planificadas: 6 }
  };

  const proximasActividades = [
    { fecha: '2024-01-15', hora: '09:00', actividad: 'Sesión Ordinaria Concejo', lugar: 'Alcaldía Municipal' },
    { fecha: '2024-01-16', hora: '14:00', actividad: 'Reunión Comisión Primera', lugar: 'Sala de Comisiones' },
    { fecha: '2024-01-18', hora: '10:00', actividad: 'Audiencia Pública Presupuesto', lugar: 'Casa de la Cultura' },
    { fecha: '2024-01-20', hora: '08:00', actividad: 'Visita Obra Acueducto Rural', lugar: 'Vereda El Progreso' }
  ];

  if (!state.user) return null;

  return (
    <div className="space-y-6">
      {/* Header Personalizado */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">¡Bienvenido, {state.user.name}!</h1>
            <p className="text-red-100 mt-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              Concejal Municipal - {state.user.region}, {state.user.department}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span><Phone className="inline w-4 h-4 mr-1" />{state.user.metadata?.telefono}</span>
              <span><Mail className="inline w-4 h-4 mr-1" />{state.user.email}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-sm text-red-100">Periodo Electoral</p>
              <p className="font-bold">2024 - 2027</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navegación por Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'agenda', label: 'Agenda', icon: Calendar },
            { id: 'proyectos', label: 'Proyectos', icon: FileText },
            { id: 'ciudadanos', label: 'Atención Ciudadana', icon: Users },
            { id: 'comunicacion', label: 'Comunicación', icon: Megaphone }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido por Tab */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 rounded-lg p-6"
              >
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Asistencia</p>
                    <p className="text-2xl font-semibold text-gray-900">{concejalStats.sesiones.porcentaje}%</p>
                    <p className="text-xs text-gray-600">{concejalStats.sesiones.asistidas}/{concejalStats.sesiones.total} sesiones</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-green-50 rounded-lg p-6"
              >
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Proyectos</p>
                    <p className="text-2xl font-semibold text-gray-900">{concejalStats.proyectos.presentados}</p>
                    <p className="text-xs text-gray-600">{concejalStats.proyectos.aprobados} aprobados</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-purple-50 rounded-lg p-6"
              >
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Ciudadanos</p>
                    <p className="text-2xl font-semibold text-gray-900">{concejalStats.ciudadanos.atendidos}</p>
                    <p className="text-xs text-gray-600">{concejalStats.ciudadanos.casos_resueltos} casos resueltos</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-orange-50 rounded-lg p-6"
              >
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-orange-600">Iniciativas</p>
                    <p className="text-2xl font-semibold text-gray-900">{concejalStats.iniciativas.activas}</p>
                    <p className="text-xs text-gray-600">{concejalStats.iniciativas.completadas} completadas</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sugerencias IA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 text-blue-500 mr-2" />
                  Sugerencias Inteligentes IA
                </h3>
                <button
                  onClick={loadAISuggestions}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Generando...' : 'Actualizar'}
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700">{aiSuggestions}</pre>
                )}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'agenda' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Próximas Actividades</h3>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Agregar Actividad
              </button>
            </div>
            
            <div className="space-y-4">
              {proximasActividades.map((actividad, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-100 rounded-lg p-2">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{actividad.actividad}</h4>
                        <p className="text-sm text-gray-600">
                          {actividad.fecha} • {actividad.hora} • {actividad.lugar}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Otros tabs se implementarán según necesidades específicas */}
        {activeTab !== 'overview' && activeTab !== 'agenda' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <Building className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sección en Desarrollo
            </h3>
            <p className="text-gray-600">
              Esta funcionalidad será implementada próximamente con herramientas específicas para tu gestión como concejal.
            </p>
          </motion.div>
        )}
      </div>

      {/* Acceso Rápido */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nuevo Proyecto', icon: FileText, color: 'blue' },
            { label: 'Atender Ciudadano', icon: Users, color: 'green' },
            { label: 'Enviar Comunicado', icon: MessageSquare, color: 'purple' },
            { label: 'Generar Reporte', icon: Download, color: 'orange' }
          ].map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-700 flex flex-col items-center gap-2 transition-colors`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};