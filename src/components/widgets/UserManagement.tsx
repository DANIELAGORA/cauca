// GESTIÓN DE USUARIOS JERÁRQUICA - Sistema Factory
// Permite a cada electo crear y gestionar su red de colaboradores

import React, { useState } from 'react';
import { Plus, Users, Shield, Eye, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { UserRole } from '../../types';

export const UserManagement: React.FC = () => {
  const { state, createSubordinateUser, getUserNetwork, canCreateRole, getCreatableRoles } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'colaborador' as UserRole,
    municipality: state.user?.municipality || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const network = getUserNetwork();
  const creatableRoles = getCreatableRoles();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await createSubordinateUser(newUserData);
      
      if (result.success) {
        setMessage({ type: 'success', text: `Usuario ${newUserData.name} creado exitosamente` });
        setNewUserData({ name: '', email: '', role: 'colaborador', municipality: state.user?.municipality || '' });
        setShowCreateForm(false);
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al crear usuario' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error inesperado al crear usuario' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      'director-departamental': 'Director Departamental',
      'alcalde': 'Alcalde',
      'diputado-asamblea': 'Diputado Asamblea',
      'concejal': 'Concejal',
      'jal-local': 'JAL Local',
      'coordinador-municipal': 'Coordinador Municipal',
      'lider-comunitario': 'Líder Comunitario',
      'influenciador-digital': 'Influenciador Digital',
      'colaborador': 'Colaborador',
      'ciudadano-base': 'Ciudadano Base'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: UserRole): string => {
    const colors: Record<string, string> = {
      'director-departamental': 'bg-purple-100 text-purple-800',
      'alcalde': 'bg-red-100 text-red-800',
      'diputado-asamblea': 'bg-blue-100 text-blue-800',
      'concejal': 'bg-green-100 text-green-800',
      'jal-local': 'bg-yellow-100 text-yellow-800',
      'coordinador-municipal': 'bg-orange-100 text-orange-800',
      'lider-comunitario': 'bg-teal-100 text-teal-800',
      'influenciador-digital': 'bg-pink-100 text-pink-800',
      'colaborador': 'bg-gray-100 text-gray-800',
      'ciudadano-base': 'bg-gray-100 text-gray-600'
    };
    return colors[role] || 'bg-gray-100 text-gray-600';
  };

  if (!state.user) {
    return <div className="text-center text-gray-500">No autenticado</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Mi Red MAIS
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tu equipo de trabajo y colaboradores
          </p>
        </div>
        
        {creatableRoles.length > 0 && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Usuario
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Formulario de Creación */}
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Crear Nuevo Usuario</h3>
          
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  {creatableRoles.map(role => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Municipio
                </label>
                <input
                  type="text"
                  value={newUserData.municipality}
                  onChange={(e) => setNewUserData({ ...newUserData, municipality: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Municipio de trabajo"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Red de Usuarios */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          Usuarios visibles en tu red: {network.length}
        </div>
        
        {network.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay usuarios en tu red aún</p>
            <p className="text-sm mt-1">
              {creatableRoles.length > 0 
                ? 'Comienza creando colaboradores para tu equipo'
                : 'Tu rol actual no permite crear nuevos usuarios'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {network.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        {user.esRealElecto && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Electo Real
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                        {user.municipality && (
                          <span className="text-xs text-gray-500">
                            {user.municipality}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.phone && (
                    <a
                      href={`tel:${user.phone}`}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      📞 {user.phone}
                    </a>
                  )}
                  
                  {/* Solo mostrar botón de eliminar si no es electo real y el usuario actual tiene permisos */}
                  {!user.esRealElecto && canCreateRole(user.role) && (
                    <button
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};