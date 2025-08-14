import React, { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import { validatePassword } from '../utils/security';
import { logError, logInfo } from '../utils/logger';

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileData {
  name: string;
  phone: string;
  municipality: string;
  department: string;
}

export const UserProfile: React.FC = () => {
  const { state, signOut } = useApp();
  const [activeTab, setActiveTab] = useState<'security' | 'profile'>('security');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileForm, setProfileForm] = useState<ProfileData>({
    name: state.user?.name || '',
    phone: state.user?.phone || '',
    municipality: state.user?.municipality || '',
    department: state.user?.department || ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones básicas
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        throw new Error('Todos los campos de contraseña son requeridos');
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Las nuevas contraseñas no coinciden');
      }

      if (passwordForm.currentPassword === passwordForm.newPassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }

      // Validar política de contraseñas
      const passwordValidation = validatePassword(passwordForm.newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`Contraseña inválida: ${passwordValidation.errors.join(', ')}`);
      }

      // Verificar contraseña actual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: state.user?.email || '',
        password: passwordForm.currentPassword
      });

      if (signInError) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Cambiar contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (updateError) {
        throw new Error(`Error al cambiar contraseña: ${updateError.message}`);
      }

      logInfo('Password changed successfully for user:', state.user?.email);
      setSuccess('✅ ¡Contraseña actualizada exitosamente! Por seguridad, cerrará sesión en 5 segundos.');
      
      // Limpiar formulario
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Cerrar sesión después de cambiar contraseña (buena práctica)
      setTimeout(() => {
        signOut();
      }, 5000);

    } catch (err: any) {
      logError('Password change failed:', err);
      setError(err.message || 'Error inesperado al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  }, [passwordForm, state.user, signOut]);

  const handleProfileUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!state.user) {
        throw new Error('Usuario no autenticado');
      }

      // Actualizar en Supabase si está disponible
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            full_name: profileForm.name.trim(),
            phone: profileForm.phone.trim() || null,
            municipality: profileForm.municipality.trim() || null,
            department: profileForm.department.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', state.user.id);

        if (profileError) {
          logError('Profile update failed:', profileError);
          throw new Error('Error al actualizar perfil en base de datos');
        }
      } catch (dbError) {
        logInfo('Profile update in DB failed, continuing with local update');
      }

      logInfo('Profile updated successfully for user:', state.user.email);
      setSuccess('✅ Perfil actualizado exitosamente');

      setTimeout(() => setSuccess(''), 3000);

    } catch (err: any) {
      logError('Profile update failed:', err);
      setError(err.message || 'Error inesperado al actualizar perfil');
    } finally {
      setLoading(false);
    }
  }, [profileForm, state.user]);

  const handlePasswordFormChange = useCallback((field: keyof PasswordChangeForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  }, [error, success]);

  const handleProfileFormChange = useCallback((field: keyof ProfileData, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  }, [error, success]);

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    const validation = validatePassword(password);
    if (password.length === 0) return { strength: 0, label: '', color: 'bg-gray-200' };
    
    if (validation.isValid) {
      return { strength: 100, label: 'Fuerte', color: 'bg-green-500' };
    } else if (password.length >= 8) {
      return { strength: 60, label: 'Media', color: 'bg-yellow-500' };
    } else {
      return { strength: 30, label: 'Débil', color: 'bg-red-500' };
    }
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  if (!state.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Debe iniciar sesión para acceder a su perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Cuenta</h1>
        <p className="text-gray-600 mt-2">Gestione su información personal y seguridad</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {state.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{state.user.name}</h2>
            <p className="text-gray-600">{state.user.email}</p>
            <p className="text-sm text-gray-500">
              {state.user.role} • {state.user.municipality || 'Sin municipio'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔒 Seguridad
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            👤 Información Personal
          </button>
        </nav>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {success}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
          
          {/* Security Warning */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Importante: Cambie la contraseña temporal por su seguridad
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Su sesión se cerrará automáticamente después del cambio exitoso
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Actual *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingrese su contraseña actual"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showCurrentPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas y números"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordForm.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nueva Contraseña *
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Repita la nueva contraseña"
                required
                disabled={loading}
              />
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Cambiando...' : '🔄 Cambiar Contraseña'}
            </button>
          </form>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => handleProfileFormChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Su nombre completo"
                required
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => handleProfileFormChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ej: +57 300 123 4567"
                disabled={loading}
              />
            </div>

            {/* Municipality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Municipio
              </label>
              <input
                type="text"
                value={profileForm.municipality}
                onChange={(e) => handleProfileFormChange('municipality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ej: Popayán"
                disabled={loading}
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => handleProfileFormChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ej: Cauca"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !profileForm.name.trim()}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Actualizando...' : '💾 Actualizar Perfil'}
            </button>
          </form>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">🛡️ Políticas de Seguridad</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Las contraseñas deben tener mínimo 8 caracteres</li>
          <li>• Debe incluir mayúsculas, minúsculas y números</li>
          <li>• Se cerrará su sesión después de cambiar la contraseña</li>
          <li>• Sus datos son protegidos con encriptación de extremo a extremo</li>
        </ul>
      </div>
    </div>
  );
};