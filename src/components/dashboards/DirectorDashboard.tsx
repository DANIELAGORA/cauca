import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { motion } from 'framer-motion';
import { 
  Crown,
  Users, 
  Building,
  TrendingUp,
  Megaphone,
  MapPin,
  Phone,
  Mail,
  Settings,
  Bell,
  PlusCircle,
  Target,
  BarChart3,
  Calendar,
  MessageSquare,
  Zap,
  Star,
  Award,
  Shield,
  Globe,
  Sparkles
} from 'lucide-react';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { ChartWidget } from '../widgets/ChartWidget';
import { MessageCenter } from '../widgets/MessageCenter';
import { TerritoryMap } from '../widgets/TerritoryMap';
import { CuentasClaras } from '../widgets/CuentasClaras';
import { generateAIContent } from '../../utils/ai';

export const DirectorDashboard: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAIRecommendations();
  }, []);

  const loadAIRecommendations = async () => {
    setLoading(true);
    try {
      const prompt = `Como Presidente Departamental Encargado del MAIS en Cauca (Resolución 026-1 de 2025), José Luis Diago Franco necesita recomendaciones estratégicas para:

1. Coordinación efectiva con 5 alcaldes MAIS electos
2. Fortalecimiento de la estructura con 83 concejales en 22 municipios
3. Implementación de políticas indígenas y sociales
4. Preparación para la próxima Convención Departamental

Genera 5 recomendaciones estratégicas específicas y accionables.`;

      const recommendations = await generateAIContent(prompt);
      setAiRecommendations(recommendations);
    } catch (error) {
      setAiRecommendations('Error cargando recomendaciones IA. Sistema funcionando en modo local.');
    } finally {
      setLoading(false);
    }
  };

  const directorMetrics = [
    {
      title: 'Resolución Oficial',
      value: '026-1',
      change: 'Comité Ejecutivo Nacional',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Alcaldes MAIS',
      value: '5',
      change: 'Municipios dirigidos',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Concejales Electos',
      value: '83',
      change: 'En 22 municipios',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Diputados Asamblea',
      value: '7',
      change: 'Departamental Cauca',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  const alcaldesMAIS = [
    { nombre: 'Gelmis Chate Rivera', municipio: 'Inza', telefono: '3225382560' },
    { nombre: 'Jhon Jairo Fuentes Quinayas', municipio: 'Patia (El Bordo)', telefono: '3227684684' },
    { nombre: 'Jaime Diaz Noscue', municipio: 'Toribio', telefono: '3214314309' },
    { nombre: 'Oscar Yamit Guacheta Arrubla', municipio: 'Morales', telefono: '3125268424' },
    { nombre: 'Lida Emilse Paz Labio', municipio: 'Jambalo', telefono: '3117086819' }
  ];

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: BarChart3 },
    { id: 'structure', label: 'Estructura MAIS', icon: Users },
    { id: 'coordination', label: 'Coordinación', icon: Target },
    { id: 'reports', label: 'Reportes', icon: TrendingUp },
    { id: 'ai-assistant', label: 'Asistente IA', icon: Zap }
  ];

  return (
    <div className="space-y-8">
      {/* Header Director Departamental */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-600 via-yellow-600 to-green-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({length: 20}).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, delay: i }}
            >
              🌽
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <motion.div
                className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30"
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(255,255,255,0.5)",
                    "0 0 50px rgba(255,255,255,0.8)",
                    "0 0 30px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src="/app.ico" alt="MAIS Logo" className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black mb-2">José Luis Diago Franco</h1>
                <p className="text-2xl text-yellow-200 font-bold">Presidente Departamental Encargado</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="flex items-center"><Shield className="w-4 h-4 mr-1" />C.C. 10.535.839</span>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />Popayán, Cauca</span>
                  <span className="flex items-center"><Award className="w-4 h-4 mr-1" />Resolución 026-1 de 2025</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">96+</div>
                <div className="text-sm opacity-90">Electos MAIS</div>
                <div className="text-xs opacity-75">Bajo supervisión</div>
              </div>
            </div>
          </div>

          {/* Navegación de tabs */}
          <div className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all font-medium ${
                  activeTab === tab.id
                    ? 'bg-white text-red-600 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Métricas principales */}
      <MetricsGrid metrics={directorMetrics} />

      {/* Contenido por tab */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ChartWidget
                title="Participación MAIS Departamental"
                type="area"
                data={state.analytics?.participation || []}
                height={300}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartWidget
                  title="Distribución Territorial"
                  type="donut"
                  data={{
                    'Alcaldías': 5,
                    'Concejos': 22,
                    'Asamblea': 7,
                    'Directivos': 1
                  }}
                  height={250}
                />
                
                <ChartWidget
                  title="Crecimiento MAIS"
                  type="bar"
                  data={[
                    { name: '2020', value: 45 },
                    { name: '2021', value: 62 },
                    { name: '2022', value: 78 },
                    { name: '2023', value: 96 }
                  ]}
                  height={250}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <MessageCenter />
              <CuentasClaras />
              
              {/* Resolución oficial */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-red-600 mr-2" />
                  Resolución 026-1 de 2025
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="font-bold text-red-900">Emisor:</div>
                    <div className="text-red-700">Comité Ejecutivo Nacional MAIS</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="font-bold text-yellow-900">Fecha:</div>
                    <div className="text-yellow-700">31 de julio de 2025</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="font-bold text-green-900">Carácter:</div>
                    <div className="text-green-700">Transitorio hasta Convención</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Estructura MAIS Cauca</h3>
            
            {/* Alcaldes MAIS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Crown className="w-6 h-6 text-yellow-600 mr-2" />
                Alcaldes MAIS Electos (5)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alcaldesMAIS.map((alcalde, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-yellow-50 to-green-50 p-4 rounded-xl border border-yellow-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Crown className="w-8 h-8 text-yellow-600" />
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                        ALCALDE
                      </span>
                    </div>
                    <h5 className="font-bold text-gray-900 mb-1">{alcalde.nombre}</h5>
                    <p className="text-sm text-gray-700 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {alcalde.municipio}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {alcalde.telefono}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Estructura organizacional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-600">83</div>
                <div className="text-gray-700 font-medium">Concejales</div>
                <div className="text-sm text-gray-500">22 municipios</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Building className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-600">7</div>
                <div className="text-gray-700 font-medium">Diputados</div>
                <div className="text-sm text-gray-500">Asamblea Departamental</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-600">100%</div>
                <div className="text-gray-700 font-medium">Cobertura</div>
                <div className="text-sm text-gray-500">Departamento Cauca</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-assistant' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Zap className="w-6 h-6 text-blue-600 mr-2" />
                Asistente IA para Director Departamental
              </h3>
              <button
                onClick={loadAIRecommendations}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generar Recomendaciones</span>
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <pre className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
                    {aiRecommendations || 'Haga clic en "Generar Recomendaciones" para obtener estrategias personalizadas para su gestión como Presidente Departamental.'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Territorio Map para otros tabs */}
        {(activeTab === 'coordination' || activeTab === 'reports') && (
          <div className="space-y-6">
            <TerritoryMap />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4">Próximas Reuniones</h4>
                <div className="space-y-3">
                  {[
                    'Reunión con Alcaldes MAIS - Viernes 10:00',
                    'Asamblea Departamental - Lunes 14:00',
                    'Convocatoria Nacional - Miércoles 16:00'
                  ].map((reunion, i) => (
                    <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-sm">{reunion}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4">Contactos Directos</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-sm">Comité Nacional</div>
                      <div className="text-xs text-gray-600">Línea directa</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-sm">joseluisdiago@maiscauca.com</div>
                      <div className="text-xs text-gray-600">Email oficial</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};