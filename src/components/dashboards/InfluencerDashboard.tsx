import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { ChartWidget } from '../widgets/ChartWidget';
import { MessageCenter } from '../widgets/MessageCenter';
import { CampaignScheduler } from '../widgets/CampaignScheduler';
import { SocialMediaManager } from '../widgets/SocialMediaManager';
import { ContentCreator } from '../widgets/ContentCreator';
import { 
  Users, 
  TrendingUp, 
  Heart,
  Play,
  Instagram,
  Youtube,
  Zap,
  Target,
  DollarSign
} from 'lucide-react';

export const InfluencerDashboard: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'content' | 'analytics'>('overview');

  const influencerMetrics = [
    {
      title: 'Seguidores Totales',
      value: '847K',
      change: '+12.5% este mes',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Engagement Rate',
      value: '8.7%',
      change: '+2.1% vs promedio',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Reach Mensual',
      value: '2.3M',
      change: '+18% vs mes anterior',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'ROI Campañas',
      value: '340%',
      change: 'Retorno promedio',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: TrendingUp },
    { id: 'campaigns', label: 'Campañas', icon: Target },
    { id: 'content', label: 'Contenido', icon: Play },
    { id: 'analytics', label: 'Analytics', icon: Zap }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            Centro de Influencia Digital
          </h1>
          <p className="text-gray-600 mt-2">Gestión integral de contenido y campañas digitales</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Influenciador</p>
          <p className="text-lg font-semibold text-gray-900">{state.user?.name}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricsGrid metrics={influencerMetrics} />

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ChartWidget
                title="Crecimiento de Seguidores"
                type="area"
                data={state.analytics?.participation || []}
                height={300}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartWidget
                  title="Engagement por Plataforma"
                  type="bar"
                  data={state.analytics?.socialMedia || []}
                  height={250}
                />
                
                <ChartWidget
                  title="ROI de Campañas"
                  type="donut"
                  data={state.analytics?.campaigns?.[0] || {}}
                  height={250}
                />
              </div>
            </div>

            <div className="space-y-6">
              <MessageCenter />
              <SocialMediaManager />
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CampaignScheduler />
            </div>
            <div className="space-y-6">
              <MessageCenter />
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContentCreator />
            </div>
            <div className="space-y-6">
              <MessageCenter />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ChartWidget
                title="Análisis de Rendimiento por Plataforma"
                type="bar"
                data={state.analytics?.campaigns || []}
                height={300}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartWidget
                  title="Distribución de Audiencia"
                  type="donut"
                  data={{ 'Instagram': 45, 'TikTok': 30, 'YouTube': 15, 'Meta': 10 }}
                  height={250}
                />
                
                <ChartWidget
                  title="Tendencia de Engagement"
                  type="line"
                  data={state.analytics?.participation || []}
                  height={250}
                />
              </div>
            </div>

            <div className="space-y-6">
              <MessageCenter />
              
              {/* Performance Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Rendimiento</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Instagram className="h-5 w-5 text-pink-500 mr-2" />
                      <span className="text-sm font-medium">Instagram</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">425K</div>
                      <div className="text-xs text-green-600">+8.2%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Play className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm font-medium">TikTok</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">312K</div>
                      <div className="text-xs text-green-600">+15.7%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Youtube className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-sm font-medium">YouTube</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">89K</div>
                      <div className="text-xs text-green-600">+12.3%</div>
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