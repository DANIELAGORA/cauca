import React from 'react';
import { useApp } from '../contexts/AppContext';
import { logInfo } from '../utils/logger';
import { NationalDashboard } from './dashboards/NationalDashboard';
import { RegionalDashboard } from './dashboards/RegionalDashboard';
import { DepartmentalDashboard } from './dashboards/DepartmentalDashboard';
import { CandidateDashboard } from './dashboards/CandidateDashboard';
import { InfluencerDashboard } from './dashboards/InfluencerDashboard';
import { LeaderDashboard } from './dashboards/LeaderDashboard';
import { VoterDashboard } from './dashboards/VoterDashboard';
import { ConcejalDashboard } from './dashboards/ConcejalDashboard';

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

  switch (state.user?.role) {
    case 'comite-ejecutivo-nacional':
      return <NationalDashboard />;
    case 'lider-regional':
      return <RegionalDashboard />;
    case 'comite-departamental':
      return <DepartmentalDashboard />;
    case 'candidato':
      return <CandidateDashboard />;
    case 'influenciador':
      return <InfluencerDashboard />;
    case 'lider':
      return <LeaderDashboard />;
    case 'concejal':
      return <ConcejalDashboard />;
    case 'votante':
      return <VoterDashboard />;
    default:
      return <div>Rol no reconocido</div>;
  }
};