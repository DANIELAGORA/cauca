// PANEL DE GESTIÓN DE EQUIPO - SISTEMA JERÁRQUICO MAIS
// Componente para creación y gestión de roles por parte de directores

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  // Plus, 
  UserPlus, 
  // Settings,
  MapPin,
  Phone,
  Mail,
  // Shield,
  TrendingUp,
  // MessageSquare,
  CheckCircle,
  // AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useOrganizationalStructure, RoleCreationRequest } from '../../hooks/useOrganizationalStructure';

interface TeamManagementPanelProps {
  className?: string;
}

export default function TeamManagementPanel({ className = '' }: TeamManagementPanelProps) {
  const { 
    currentMember, 
    directSubordinates, 
    allSubordinates,
    canCreateRoles,
    createRole,
    isLoading 
  } = useOrganizationalStructure();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  // const [selectedRole, setSelectedRole] = useState('');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // Estado del formulario de creación
  const [formData, setFormData] = useState<RoleCreationRequest>({
    fullName: '',
    email: '',
    phone: '',
    roleType: '',
    territory: {
      region: currentMember?.region || '',
      department: currentMember?.department || '',
      municipality: ''
    },
    responsibilities: [],
    permissions: {}
  });

  // Definición de roles disponibles con descripciones
  const roleDefinitions: Record<string, {
    name: string;
    description: string;
    level: string;
    responsibilities: string[];
    defaultPermissions: string[];
  }> = {
    'coordinador-municipal': {
      name: 'Coordinador Municipal',
      description: 'Responsable de la coordinación política a nivel municipal',
      level: 'Municipal',
      responsibilities: [
        'Coordinación de actividades municipales',
        'Gestión de líderes locales',
        'Reportes al nivel departamental',
        'Organización de eventos locales'
      ],
      defaultPermissions: ['create_local_leaders', 'manage_events', 'view_municipal_data']
    },
    'concejal-electo': {
      name: 'Concejal Electo',
      description: 'Representante electo en el concejo municipal',
      level: 'Municipal',
      responsibilities: [
        'Representación en el concejo municipal',
        'Atención ciudadana',
        'Presentación de proyectos',
        'Reportes de gestión'
      ],
      defaultPermissions: ['submit_projects', 'citizen_services', 'council_activities']
    },
    'lider-local': {
      name: 'Líder Local',
      description: 'Líder comunitario a nivel local',
      level: 'Local',
      responsibilities: [
        'Movilización comunitaria',
        'Organización de bases',
        'Conexión con ciudadanos',
        'Feedback territorial'
      ],
      defaultPermissions: ['community_engagement', 'organize_events', 'citizen_feedback']
    }
  };

  const handleCreateRole = async () => {
    if (!formData.fullName || !formData.email || !formData.roleType) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    setIsCreating(true);
    
    try {
      const result = await createRole({
        ...formData,
        responsibilities: roleDefinitions[formData.roleType]?.responsibilities || [],
        permissions: roleDefinitions[formData.roleType]?.defaultPermissions.reduce((acc, perm) => {
          acc[perm] = true;
          return acc;
        }, {} as Record<string, boolean>)
      });

      if (result.success) {
        alert('✅ Rol creado exitosamente');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          roleType: '',
          territory: {
            region: currentMember?.region || '',
            department: currentMember?.department || '',
            municipality: ''
          },
          responsibilities: [],
          permissions: {}
        });
        setShowCreateForm(false);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      alert('❌ Error interno del sistema');
      console.error('Error creating role:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con información del director */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{currentMember?.full_name}</h2>
            <p className="opacity-90">Director Departamental - {currentMember?.department}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {currentMember?.region}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {directSubordinates.length} directos
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {allSubordinates.length} total
              </span>
            </div>
          </div>
          <motion.button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="h-5 w-5" />
            Crear Rol
          </motion.button>
        </div>
      </div>

      {/* Formulario de creación de roles */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Crear Nuevo Rol en su Equipo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Información personal */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre completo de la persona"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="3XX XXX XXXX"
                />
              </div>
            </div>

            {/* Configuración del rol */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Rol *
                </label>
                <select
                  value={formData.roleType}
                  onChange={(e) => setFormData(prev => ({ ...prev, roleType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar rol...</option>
                  {canCreateRoles.map(role => (
                    <option key={role} value={role}>
                      {roleDefinitions[role]?.name || role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio
                </label>
                <input
                  type="text"
                  value={formData.territory.municipality}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    territory: { ...prev.territory, municipality: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Municipio de responsabilidad"
                />
              </div>

              {/* Descripción del rol seleccionado */}
              {formData.roleType && roleDefinitions[formData.roleType] && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">
                    {roleDefinitions[formData.roleType].name}
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    {roleDefinitions[formData.roleType].description}
                  </p>
                  <div className="text-xs text-blue-600">
                    <strong>Nivel:</strong> {roleDefinitions[formData.roleType].level}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              onClick={handleCreateRole}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Crear Rol
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Lista de equipo actual */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Mi Equipo Departamental ({directSubordinates.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {directSubordinates.map((member) => (
            <motion.div
              key={member.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{member.full_name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {roleDefinitions[member.role_type]?.name || member.role_type}
                      </span>
                      {member.municipality && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {member.municipality}
                        </span>
                      )}
                      {member.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Activo
                  </div>
                  <button
                    onClick={() => setExpandedMember(
                      expandedMember === member.id ? null : member.id
                    )}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {expandedMember === member.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Detalles expandidos */}
              {expandedMember === member.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Responsabilidades</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {(member.responsibilities as string[] || []).map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Información de Contacto</h5>
                      <div className="text-sm text-gray-600 space-y-2">
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {member.municipality || member.department}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {directSubordinates.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aún no has creado ningún rol en tu equipo</p>
              <p className="text-sm">Usa el botón "Crear Rol" para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}