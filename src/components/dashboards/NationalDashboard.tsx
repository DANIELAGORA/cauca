import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { ChartWidget } from '../widgets/ChartWidget';
import { MessageCenter } from '../widgets/MessageCenter';
import { FileUpload } from '../widgets/FileUpload';
import { TerritoryMap } from '../widgets/TerritoryMap';
import { CuentasClaras } from '../widgets/CuentasClaras';
import { 
  Crown, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  MapPin,
  Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: {
      staggerChildren: 0.1 // Retraso entre la animación de los hijos
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const NationalDashboard: React.FC = () => {
  const { state } = useApp();

  const nationalMetrics = [
    {
      title: 'Regiones Activas',
      value: state.analytics?.territory?.length.toString() || '0',
      change: '+X esta semana', 
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Departamentos',
      value: state.analytics?.territory?.length.toString() || '0', 
      change: 'Cobertura 100%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Candidatos Activos',
      value: state.analytics?.campaigns?.length.toString() || '0', 
      change: '+X% vs mes anterior', 
      icon: Megaphone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Alertas Críticas',
      value: '0', 
      change: 'Requieren atención',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Crown className="h-8 w-8 text-red-600 mr-3" />
            Panel Nacional MAIS
          </h1>
          <p className="text-gray-600 mt-2">Control central y monitoreo estratégico</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Última actualización</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleTimeString('es-CO')}
          </p>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants}>
        <MetricsGrid metrics={nationalMetrics} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <ChartWidget
            title="Participación Nacional"
            type="area"
            data={state.analytics?.participation || []}
            height={300}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartWidget
              title="Sentimiento Público"
              type="donut"
              data={state.analytics?.sentiment?.[state.analytics.sentiment.length - 1] || {}}
              height={250}
            />
            
            <ChartWidget
              title="Influencia por Plataforma"
              type="bar"
              data={state.analytics?.influence || []}
              height={250}
            />
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <MessageCenter />
          <FileUpload />
          <CuentasClaras />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                <div className="font-medium text-red-900">Mensaje Nacional</div>
                <div className="text-sm text-red-600">Comunicar a todas las regiones</div>
              </button>
              <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                <div className="font-medium text-yellow-900">Convocar Reunión</div>
                <div className="text-sm text-yellow-600">Líderes regionales</div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">Generar Reporte</div>
                <div className="text-sm text-green-600">Análisis completo</div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Territory Overview */}
      <motion.div variants={itemVariants}>
        <TerritoryMap />
      </motion.div>
    </motion.div>
  );
};