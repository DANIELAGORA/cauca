import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { ChartWidget } from '../widgets/ChartWidget';
import { MessageCenter } from '../widgets/MessageCenter';
import { CampaignTools } from '../widgets/CampaignTools';
import { CuentasClaras } from '../widgets/CuentasClaras';
import { 
  Megaphone, 
  Users, 
  TrendingUp, 
  Heart,
  Calendar,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: {
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const CandidateDashboard: React.FC = () => {
  const { state } = useApp();

  const campaignMetrics = [
    {
      title: 'Seguidores',
      value: state.analytics?.socialMedia?.[0]?.followers.toLocaleString() || '0',
      change: `+${state.analytics?.socialMedia?.[0]?.growth || 0}% esta semana`, 
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Engagement',
      value: `${state.analytics?.socialMedia?.[0]?.engagement || 0}%`,
      change: '+5.1% vs promedio', 
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Reach Semanal',
      value: state.analytics?.campaigns?.[0]?.reach.toLocaleString() || '0',
      change: '+12% vs semana anterior', 
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Eventos Programados',
      value: '0', 
      change: '0 esta semana',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
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
            <Megaphone className="h-8 w-8 text-red-600 mr-3" />
            Centro de Campaña
          </h1>
          <p className="text-gray-600 mt-2">Gestión integral de su campaña política</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Candidato</p>
          <p className="text-lg font-semibold text-gray-900">{state.user?.name}</p>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants}>
        <MetricsGrid metrics={campaignMetrics} />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <ChartWidget
            title="Evolución de Seguidores"
            type="area"
            data={state.analytics?.participation || []}
            height={300}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartWidget
              title="Sentimiento de Campaña"
              type="donut"
              data={state.analytics?.sentiment?.[state.analytics.sentiment.length - 1] || {}}
              height={250}
            />
            
            <ChartWidget
              title="Influencia Digital"
              type="bar"
              data={state.analytics?.influence || []}
              height={250}
            />
          </div>

          {/* Campaign Schedule (Hardcoded - needs real data) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              Agenda de Campaña
            </h3>
            <div className="space-y-4">
              {[
                { time: '09:00', title: 'Reunión con líderes locales', location: 'Centro Comunitario' },
                { time: '14:30', title: 'Entrevista Caracol Radio', location: 'Estudios Caracol' },
                { time: '18:00', title: 'Foro público - Educación', location: 'Universidad Nacional' }
              ].map((event, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                    {event.time}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.location}</div>
                  </div>
                  <Target className="h-4 w-4 text-red-600" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tools Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <MessageCenter />
          <CampaignTools />
          <CuentasClaras />
          
          {/* Team Status (Hardcoded - needs real data) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipo de Campaña</h3>
            <div className="space-y-3">
              {[
                { name: 'Ana Rodríguez', role: 'Coordinadora', status: 'online' },
                { name: 'Carlos Mendez', role: 'Comunicaciones', status: 'busy' },
                { name: 'María López', role: 'Logística', status: 'online' }
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};