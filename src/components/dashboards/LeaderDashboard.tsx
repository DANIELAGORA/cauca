import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { MessageCenter } from '../widgets/MessageCenter';
import { 
  Users, 
  Heart, 
  MessageCircle,
  Calendar
} from 'lucide-react';

export const LeaderDashboard: React.FC = () => {
  const { state } = useApp();

  const leaderMetrics = [
    {
      title: 'Comunidad',
      value: '234',
      change: 'Personas conectadas',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Engagement',
      value: '85%',
      change: 'Participación activa',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Mensajes',
      value: '47',
      change: 'Esta semana',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            Liderazgo Comunitario
          </h1>
          <p className="text-gray-600 mt-2">Gestión y movilización comunitaria</p>
        </div>
      </div>

      <MetricsGrid metrics={leaderMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              Actividades Comunitarias
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Asamblea Vecinal', date: 'Mañana 19:00', participants: 45 },
                { title: 'Jornada de Salud', date: 'Viernes 10:00', participants: 120 },
                { title: 'Taller Juventud', date: 'Sábado 15:00', participants: 30 }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-500">{activity.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{activity.participants}</div>
                    <div className="text-xs text-gray-500">participantes</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <MessageCenter />
        </div>
      </div>
    </div>
  );
};