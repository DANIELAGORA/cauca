import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  metricasActuales, 
  municipiosMAIS, 
  getMetricasPorNivel,
  getTodosLosElectos,
  alcaldesElectos,
  diputadosAsamblea,
  concejalesElectos,
  directorDepartamental 
} from '../../data/estructura-jerarquica-completa';
import { MetricsGrid } from '../widgets/MetricsGrid';
import { ChartWidget } from '../widgets/ChartWidget';
import { MessageCenter } from '../widgets/MessageCenter';
import { DepartmentalMessaging } from '../widgets/DepartmentalMessaging';
import { UserManagement } from '../widgets/UserManagement';
import TeamManagementPanel from '../organization/TeamManagementPanel';
import HierarchicalReportingSystem from '../reporting/HierarchicalReportingSystem';
import { useOrganizationalStructure, useRoleSpecificData } from '../../hooks/useOrganizationalStructure';
import { 
  Building, 
  Users, 
  TrendingUp,
  Megaphone,
  UserPlus,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';

export const DepartmentalDashboard: React.FC = () => {
  const { state } = useApp();
  const [metricas, setMetricas] = useState(metricasActuales);
  const [activeSection, setActiveSection] = useState<'overview' | 'team' | 'reports' | 'analytics'>('overview');
  
  const { 
    currentMember, 
    directSubordinates, 
    allSubordinates,
    isLoading 
  } = useOrganizationalStructure();
  
  const { roleSpecificWidgets, territorialScope } = useRoleSpecificData();

  useEffect(() => {
    // Cargar métricas reales del nivel departamental
    const metricasDept = getMetricasPorNivel('director-departamental');
    if (metricasDept) {
      setMetricas(metricasDept);
    }
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const departmentalMetrics = [
    {
      title: 'Total Electos Cauca',
      value: getTodosLosElectos().length.toString(),
      change: 'Concejales + Alcaldes + Diputados',
      icon: Building,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Alcaldes MAIS',
      value: alcaldesElectos.length.toString(),
      change: 'Municipios dirigidos',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Concejales Electos',
      value: concejalesElectos.length.toString(),
      change: 'En concejos municipales',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Diputados Asamblea',
      value: diputadosAsamblea.length.toString(),
      change: 'Asamblea Departamental',
      icon: Megaphone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header con información del director y navegación */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Building className="h-8 w-8 mr-3" />
              Dashboard Director Departamental
            </h1>
            <p className="opacity-90 mt-2">
              {currentMember?.full_name || 'Director'} - {territorialScope.department || 'Cauca'}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {directSubordinates.length} directos
              </span>
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {metricas.municipiosConPresencia} municipios
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {metricas.concejalesTotales} concejales electos
              </span>
            </div>
          </div>
        </div>
        
        {/* Navegación de secciones */}
        <div className="flex gap-4 mt-6">
          {[
            { key: 'overview', label: 'Vista General', icon: BarChart3 },
            { key: 'team', label: 'Mi Equipo', icon: UserPlus },
            { key: 'reports', label: 'Reportes', icon: FileText },
            { key: 'analytics', label: 'Análisis', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as any)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeSection === key
                  ? 'bg-white/30 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas departamentales */}
      <MetricsGrid metrics={departmentalMetrics} />

      {/* Contenido según sección activa */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ChartWidget
              title="Actividad Departamental - Concejales MAIS Cauca"
              type="area"
              data={state.analytics?.participation || []}
              height={300}
            />
            
            {/* Panel de municipios con todos los electos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Municipios con Presencia MAIS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {municipiosMAIS.map((municipio) => (
                  <div key={municipio.nombre} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{municipio.nombre}</h4>
                      <div className="flex gap-1">
                        {municipio.concejales > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {municipio.concejales} concejal{municipio.concejales > 1 ? 'es' : ''}
                          </span>
                        )}
                        {municipio.alcalde !== 'Sin alcalde MAIS' && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Alcalde
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Información del alcalde */}
                    {municipio.alcalde !== 'Sin alcalde MAIS' && (
                      <div className="text-sm text-gray-600 mb-2 p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-800">🏛️ Alcalde: {municipio.alcalde}</div>
                        <div className="text-xs mt-1">
                          📧 {municipio.alcaldeContacto}<br />
                          📱 {municipio.alcaldeTelefono}
                        </div>
                      </div>
                    )}
                    
                    {/* Información de concejales */}
                    {municipio.concejales > 0 && (
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">👥 Concejal: {municipio.concejal}</div>
                        <div className="text-xs mt-1">
                          📧 {municipio.contacto}<br />
                          📱 {municipio.telefono}
                        </div>
                      </div>
                    )}
                    
                    {/* Métricas municipales */}
                    <div className="flex justify-between text-xs text-gray-500 mt-3 pt-2 border-t">
                      <span>👥 {municipio.totalElectos} electos</span>
                      <span>🎯 {municipio.proyectosActivos} proyectos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <DepartmentalMessaging />
            
            {/* Resumen de estructura jerárquica */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Mi Estructura Organizacional</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-gray-800 mb-2">Subordinados Directos ({directSubordinates.length})</div>
                  {directSubordinates.slice(0, 5).map(sub => (
                    <div key={sub.id} className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                        {sub.full_name?.charAt(0)}
                      </div>
                      <span className="text-xs">
                        {sub.full_name} - {sub.municipality}
                      </span>
                    </div>
                  ))}
                  {directSubordinates.length > 5 && (
                    <div className="text-xs text-blue-600 mt-2">
                      +{directSubordinates.length - 5} más...
                    </div>
                  )}
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-800">Total en Estructura</div>
                    <div className="text-xs">{allSubordinates.length} personas bajo supervisión</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección de gestión de equipo */}
      {activeSection === 'team' && (
        <div className="space-y-6">
          <UserManagement />
          <TeamManagementPanel className="" />
        </div>
      )}

      {/* Sistema de reportes */}
      {activeSection === 'reports' && (
        <HierarchicalReportingSystem className="" />
      )}

      {/* Análisis avanzado */}
      {activeSection === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Análisis de Gestión Departamental</h3>
            <ChartWidget
              title="Electos MAIS por Municipio"
              type="bar"
              data={municipiosMAIS.map(m => ({
                name: m.nombre,
                value: m.totalElectos
              }))}
              height={300}
            />
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Métricas de Liderazgo</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Subordinados Directos</span>
                <span className="text-lg font-bold text-blue-600">{directSubordinates.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Municipios con MAIS</span>
                <span className="text-lg font-bold text-green-600">{municipiosMAIS.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">Total Electos Supervisados</span>
                <span className="text-lg font-bold text-purple-600">{getTodosLosElectos().length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Proyectos Activos</span>
                <span className="text-lg font-bold text-yellow-600">{municipiosMAIS.reduce((sum, m) => sum + m.proyectosActivos, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};