import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { ChartWidget } from '../widgets/ChartWidget';
import { MessageCenter } from '../widgets/MessageCenter';
import { 
  Building, 
  Users, 
  TrendingUp,
  Megaphone
} from 'lucide-react';

export const DepartmentalDashboard: React.FC = () => {
  const { state } = useApp();

  const departmentalMetrics = [
    {
      title: 'Candidatos',
      value: '23',
      change: 'En el departamento',
      icon: Megaphone,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Líderes',
      value: '89',
      change: '+7 este mes',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Actividad',
      value: '92%',
      change: 'Nivel alto',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building className="h-8 w-8 text-green-600 mr-3" />
            Panel Departamental
          </h1>
          <p className="text-gray-600 mt-2">
            Gestión departamental - {state.user?.department || 'Departamento'}
          </p>
        </div>
      </div>

      <MetricsGrid metrics={departmentalMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ChartWidget
            title="Actividad Departamental"
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