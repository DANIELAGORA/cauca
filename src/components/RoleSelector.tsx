import React, { useState } from 'react';
import { UserRole } from '../types';
import { useApp } from '../contexts/AppContext';
import { 
  Crown, 
  MapPin, 
  Building, 
  Megaphone, 
  Users, 
  Vote,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const roles: { 
  key: UserRole; 
  name: string; 
  description: string; 
  icon: React.ComponentType<any>;
  color: string;
}[] = [
  {
    key: 'comite-ejecutivo-nacional',
    name: 'Comité Ejecutivo Nacional',
    description: 'Control total, gestión nacional y toma de decisiones estratégicas',
    icon: Crown,
    color: 'from-red-600 to-red-700'
  },
  {
    key: 'lider-regional',
    name: 'Líder Regional',
    description: 'Coordinación de múltiples departamentos y gestión territorial',
    icon: MapPin,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    key: 'comite-departamental',
    name: 'Comité Departamental',
    description: 'Gestión departamental, candidatos y operaciones locales',
    icon: Building,
    color: 'from-green-600 to-green-700'
  },
  {
    key: 'candidato',
    name: 'Candidato',
    description: 'Gestión de campaña, métricas de influencia y comunicación',
    icon: Megaphone,
    color: 'from-red-500 to-yellow-500'
  },
  {
    key: 'influenciador',
    name: 'Influenciador Digital',
    description: 'Creación de contenido, gestión de redes sociales y campañas digitales',
    icon: Users,
    color: 'from-purple-500 to-pink-500'
  },
  {
    key: 'lider',
    name: 'Líder Comunitario',
    description: 'Liderazgo local, movilización y gestión comunitaria',
    icon: Users,
    color: 'from-green-500 to-yellow-500'
  },
  {
    key: 'votante',
    name: 'Votante/Simpatizante',
    description: 'Participación ciudadana, comunicación y apoyo al movimiento',
    icon: Vote,
    color: 'from-yellow-500 to-green-500'
  }
];

export const RoleSelector: React.FC = () => {
  const { loginWithRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setUserName('');
    setError(null);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      setError('Por favor, seleccione un rol.');
      return;
    }
    
    if (!userName.trim()) {
      setError('Por favor, introduce tu nombre.');
      return;
    }

    setError(null);
    
    try {
      await loginWithRole(
        selectedRole,
        userName.trim(),
        'Región Demo',
        'Departamento Demo'
      );
    } catch (error) {
      logError('Error al acceder:', error);
      setError('Error al acceder. Inténtalo de nuevo.');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setUserName('');
    setError(null);
  };

  if (selectedRole) {
    const roleData = roles.find(r => r.key === selectedRole);
    const IconComponent = roleData?.icon || Crown;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${roleData?.color} mb-4`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {roleData?.name}
            </h2>
            <p className="text-gray-600 text-sm">
              {roleData?.description}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu nombre
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Introduce tu nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </button>
              <button
                onClick={handleContinue}
                disabled={!userName.trim()}
                className={`flex-1 py-3 px-4 bg-gradient-to-r ${roleData?.color} text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full mb-4">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Centro de Mando MAIS
          </h1>
          <p className="text-gray-600">
            Selecciona tu rol para acceder al sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.key}
                onClick={() => handleRoleSelect(role.key)}
                className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-transparent hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-left"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${role.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                  {role.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {role.description}
                </p>
                <div className="mt-4 flex items-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Seleccionar</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};