import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { logInfo } from '../utils/logger';
import { RegionalDashboard } from './dashboards/RegionalDashboard';
import { DepartmentalDashboard } from './dashboards/DepartmentalDashboard';
import { DirectorDashboard } from './dashboards/DirectorDashboard';
import { NationalDashboard } from './dashboards/NationalDashboard';
import { CandidateDashboard } from './dashboards/CandidateDashboard';
import { InfluencerDashboard } from './dashboards/InfluencerDashboard';
import { LeaderDashboard } from './dashboards/LeaderDashboard';
import { VoterDashboard } from './dashboards/VoterDashboard';
import { ConcejalDashboard } from './dashboards/ConcejalDashboard';
import { UserRole } from '../types';

export const Dashboard: React.FC = () => {
  const { state } = useApp();

  logInfo('🔍 Dashboard - Estado actual:', state);
  logInfo('🔍 Dashboard - Usuario actual:', state.user);
  logInfo('🔍 Dashboard - Rol del usuario:', state.user?.role);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Detectar si es José Luis Diago (Director especial)
  const isJoseLuisDiago = state.user?.name?.toLowerCase().includes('josé luis diago') || 
                         state.user?.name?.toLowerCase().includes('jose luis diago') ||
                         state.user?.email?.includes('joseluisdiago');

  switch (state.user?.role) {
    case 'director-departamental':
      // Si es José Luis Diago, usar el dashboard especial
      return isJoseLuisDiago ? <DirectorDashboard /> : <DepartmentalDashboard />;
    case 'alcalde':
      return <CandidateDashboard />; // Los alcaldes usan el dashboard de candidato
    case 'diputado-asamblea':
      return <RegionalDashboard />; // Los diputados ven nivel regional/departamental
    case 'concejal':
      return <ConcejalDashboard />;
    case 'jal-local':
      return <LeaderDashboard />; // JAL usa dashboard de líder
    case 'coordinador-municipal':
      return <LeaderDashboard />;
    case 'lider-comunitario':
      return <LeaderDashboard />;
    case 'influenciador-digital':
      return <InfluencerDashboard />;
    case 'colaborador':
      return <VoterDashboard />; // Colaboradores usan dashboard básico
    case 'ciudadano-base':
      return <VoterDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Rol no reconocido: {state.user?.role || 'Sin rol'}
            </h2>
            <p className="text-gray-600">
              Por favor contacta al administrador del sistema.
            </p>
          </div>
        </div>
      );
  }
};