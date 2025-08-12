import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Home, 
  BarChart3, 
  MessageCircle, 
  Users, 
  Settings,
  Megaphone,
  Calendar,
  Database,
  Heart
} from 'lucide-react';

interface MobileBottomNavProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate, activeSection }) => {
  const { state } = useApp();
  const userRole = state.user?.role;

  // Configurar navegación según el rol del usuario
  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', icon: Home, label: 'Inicio' },
      { id: 'analytics', icon: BarChart3, label: 'Análisis' },
      { id: 'messages', icon: MessageCircle, label: 'Mensajes' },
    ];

    // Navegación específica por rol
    switch (userRole) {
      case 'comite-ejecutivo-nacional':
        return [
          ...baseItems,
          { id: 'campaigns', icon: Megaphone, label: 'Campañas' },
          { id: 'settings', icon: Settings, label: 'Config' }
        ];
      
      case 'lider-regional':
      case 'comite-departamental':
        return [
          ...baseItems,
          { id: 'territory', icon: Users, label: 'Territorio' },
          { id: 'calendar', icon: Calendar, label: 'Agenda' }
        ];
      
      case 'candidato':
        return [
          ...baseItems,
          { id: 'campaign-tools', icon: Megaphone, label: 'Campaña' },
          { id: 'schedule', icon: Calendar, label: 'Agenda' }
        ];
      
      case 'influenciador':
        return [
          ...baseItems,
          { id: 'content', icon: Megaphone, label: 'Contenido' },
          { id: 'social', icon: Heart, label: 'Social' }
        ];
      
      case 'lider':
        return [
          ...baseItems,
          { id: 'community', icon: Users, label: 'Comunidad' },
          { id: 'events', icon: Calendar, label: 'Eventos' }
        ];
      
      case 'ciudadano-base':
        return [
          ...baseItems,
          { id: 'participation', icon: Heart, label: 'Participar' },
          { id: 'info', icon: Database, label: 'Info' }
        ];
      
      default:
        return baseItems.slice(0, 4);
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-40 md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-white' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Indicador de conexión */}
      <div className="absolute top-1 right-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>
    </div>
  );
};