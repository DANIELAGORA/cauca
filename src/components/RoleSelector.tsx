import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Crown, 
  MapPin, 
  Building, 
  Megaphone, 
  Users, 
  Vote,
  ArrowRight,
  ArrowLeft,
  Shield,
  Star,
  Heart,
  UserCheck
} from 'lucide-react';

const roles: { 
  key: UserRole; 
  name: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string; }>;
  color: string;
}[] = [
  {
    key: 'director-departamental',
    name: 'Director Departamental',
    description: 'Máxima autoridad departamental, gestión de todos los electos MAIS',
    icon: Crown,
    color: 'from-purple-600 to-purple-700'
  },
  {
    key: 'alcalde',
    name: 'Alcalde',
    description: 'Autoridad municipal, gestión del territorio y equipo local',
    icon: Building,
    color: 'from-red-600 to-red-700'
  },
  {
    key: 'diputado-asamblea',
    name: 'Diputado Asamblea',
    description: 'Representación departamental, legislación y coordinación regional',
    icon: Shield,
    color: 'from-blue-600 to-blue-700'
  },
  {
    key: 'concejal',
    name: 'Concejal',
    description: 'Representación municipal, ordenanzas y gestión local',
    icon: Vote,
    color: 'from-green-600 to-green-700'
  },
  {
    key: 'jal-local',
    name: 'JAL Local',
    description: 'Junta Administradora Local, gestión de corregimiento',
    icon: MapPin,
    color: 'from-yellow-600 to-yellow-700'
  },
  {
    key: 'coordinador-municipal',
    name: 'Coordinador Municipal',
    description: 'Coordinación de actividades municipales y apoyo a electos',
    icon: UserCheck,
    color: 'from-orange-500 to-orange-600'
  },
  {
    key: 'lider-comunitario',
    name: 'Líder Comunitario',
    description: 'Liderazgo territorial, organización comunitaria',
    icon: Users,
    color: 'from-teal-500 to-teal-600'
  },
  {
    key: 'influenciador-digital',
    name: 'Influenciador Digital',
    description: 'Gestión de redes sociales y comunicación digital',
    icon: Megaphone,
    color: 'from-pink-500 to-pink-600'
  },
  {
    key: 'colaborador',
    name: 'Colaborador',
    description: 'Apoyo operativo y asistencia en actividades partidarias',
    icon: Star,
    color: 'from-gray-500 to-gray-600'
  },
  {
    key: 'ciudadano-base',
    name: 'Ciudadano Base',
    description: 'Participación ciudadana y apoyo a iniciativas MAIS',
    icon: Heart,
    color: 'from-gray-400 to-gray-500'
  }
];

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  title?: string;
  showDescription?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
  title = "Selecciona tu rol en MAIS",
  showDescription = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    roles.findIndex(role => role.key === selectedRole) || 0
  );

  const currentRole = roles[currentIndex];

  const nextRole = () => {
    const newIndex = (currentIndex + 1) % roles.length;
    setCurrentIndex(newIndex);
    onRoleSelect(roles[newIndex].key);
  };

  const prevRole = () => {
    const newIndex = currentIndex === 0 ? roles.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onRoleSelect(roles[newIndex].key);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-center text-gray-900 mb-6">
        {title}
      </h3>
      
      <div className="relative">
        <div className={`bg-gradient-to-r ${currentRole.color} rounded-lg p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevRole}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center flex-1">
              <currentRole.icon className="w-12 h-12 mx-auto mb-2" />
              <h4 className="text-xl font-bold">{currentRole.name}</h4>
            </div>
            
            <button
              onClick={nextRole}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              type="button"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          {showDescription && (
            <p className="text-center text-sm opacity-90 leading-relaxed">
              {currentRole.description}
            </p>
          )}
        </div>
        
        {/* Indicadores */}
        <div className="flex justify-center mt-4 space-x-2">
          {roles.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                onRoleSelect(roles[index].key);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-red-600' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};