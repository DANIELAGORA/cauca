import React, { useState, useCallback, useMemo } from 'react';
import { UserRole } from '../types';
import { useApp } from '../contexts/AppContext';
import { logError, logInfo } from '../utils/logger';

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { signIn, signUp } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'ciudadano-base' as UserRole,
    region: '',
    department: '',
    municipality: '',
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validaciones básicas
      if (!formData.email || !formData.password) {
        setError('Email y contraseña son requeridos');
        return;
      }

      if (!isLogin && !formData.name.trim()) {
        setError('El nombre es requerido para registro');
        return;
      }

      let result;
      
      if (isLogin) {
        logInfo('Iniciando sesión para usuario:', formData.email);
        result = await signIn(formData.email, formData.password);
      } else {
        logInfo('Registrando nuevo usuario:', formData.email, 'con rol:', formData.role);
        result = await signUp(formData.email, formData.password, {
          name: formData.name.trim(),
          role: formData.role,
          region: formData.region.trim() || undefined,
          department: formData.department.trim() || undefined,
          municipality: formData.municipality.trim() || undefined,
        });
      }

      if (result.success) {
        logInfo('Autenticación exitosa');
        onSuccess?.();
      } else {
        setError(result.error || 'Error desconocido en la autenticación');
      }
    } catch (err) {
      logError('Error en formulario de autenticación:', err);
      setError('Error de conexión. Verifica tu internet e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [formData, isLogin, signIn, signUp, onSuccess]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al cambiar campos
    if (error) setError('');
  }, [error]);

  const roleOptions = useMemo(() => [
    { value: 'ciudadano-base', label: 'Ciudadano Base' },
    { value: 'lider-comunitario', label: 'Líder Comunitario' },
    { value: 'influenciador-digital', label: 'Influenciador Digital' },
    { value: 'candidato', label: 'Candidato' },
    { value: 'concejal', label: 'Concejal Municipal' },
    { value: 'diputado-asamblea', label: 'Diputado a la Asamblea' },
    { value: 'alcalde', label: 'Alcalde' },
    { value: 'director-departamental', label: 'Director Departamental' },
  ], []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="text-gray-600">
          {isLogin ? 'Accede a tu cuenta MAIS' : 'Únete al movimiento MAIS'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol en MAIS
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Región
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ej: Cauca"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ej: Cauca"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio
                </label>
                <input
                  type="text"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ej: Popayán"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            logInfo('Cambiando modo de autenticación a:', !isLogin ? 'login' : 'registro');
          }}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
        >
          {isLogin 
            ? '¿No tienes cuenta? Regístrate aquí' 
            : '¿Ya tienes cuenta? Inicia sesión'
          }
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Al continuar, aceptas los términos y condiciones del</p>
        <p><strong>Movimiento Alternativo Indígena y Social</strong></p>
        <p className="mt-1">Protegemos tus datos con las mejores prácticas de seguridad</p>
      </div>
    </div>
  );
};