import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { ChartWidget } from '../widgets/ChartWidget';
import { MessageCenter } from '../widgets/MessageCenter';
import { 
  MapPin, 
  Building, 
  Users, 
  TrendingUp
} from 'lucide-react';

export const RegionalDashboard: React.FC = () => {
  const { state } = useApp();

  const regionalMetrics = [
    {
      title: 'Departamentos',
      value: '8',
      change: 'En la región',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Líderes Activos',
      value: '156',
      change: '+12 este mes',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Participación',
      value: '78%',
      change: '+5% vs promedio nacional',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MapPin className="h-8 w-8 text-yellow-600 mr-3" />
            Panel Regional
          </h1>
          <p className="text-gray-600 mt-2">
            Gestión regional - {state.user?.region || 'Región'}
          </p>
        </div>
      </div>

      <MetricsGrid metrics={regionalMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ChartWidget
            title="Actividad Regional"
            type="area"
            data={state.analytics?.participation || []}
            height={300}
          />
        </div>
        
        <div className="space-y-6">
          <MessageCenter />
        </div>
      </div>
    </div>
  );
};