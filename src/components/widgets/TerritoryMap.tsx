import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { MapPin, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const TerritoryMap: React.FC = () => {
  const { state } = useApp();

  const territories = [
    { name: 'Bogotá D.C.', status: 'active', activity: 95, alert: false },
    { name: 'Antioquia', status: 'active', activity: 87, alert: false },
    { name: 'Valle del Cauca', status: 'active', activity: 78, alert: true },
    { name: 'Atlántico', status: 'active', activity: 72, alert: false },
    { name: 'Bolívar', status: 'warning', activity: 65, alert: false },
    { name: 'Santander', status: 'active', activity: 89, alert: false },
    { name: 'Cundinamarca', status: 'active', activity: 82, alert: false },
    { name: 'Norte de Santander', status: 'warning', activity: 58, alert: true },
  ];

  const getStatusIcon = (status: string, alert: boolean) => {
    if (alert) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (status === 'active') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getActivityColor = (activity: number) => {
    if (activity >= 80) return 'bg-green-500';
    if (activity >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <MapPin className="h-5 w-5 text-red-600 mr-2" />
        Monitor Territorial Nacional
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {territories.map((territory, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{territory.name}</h4>
              {getStatusIcon(territory.status, territory.alert)}
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Actividad</span>
                <span className="font-medium">{territory.activity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getActivityColor(territory.activity)}`}
                  style={{ width: `${territory.activity}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>
                {territory.activity >= 80 ? 'Muy alta' : 
                 territory.activity >= 60 ? 'Alta' : 'Necesita atención'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Óptimo (80%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Moderado (60-79%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Crítico ({'<60%'})</span>
          </div>
        </div>
        <div className="text-right">
          <span>Actualizado hace 5 min</span>
        </div>
      </div>
    </div>
  );
};