import React from 'react';
import { X, Shield, Lock, Eye, Database, Globe } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Política de Privacidad</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MAIS - Centro de Mando Político
            </h1>
            <p className="text-gray-600">
              <strong>Desarrollado por:</strong> Daniel Lopez "DSimnivaciones" Wramba fxiw
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Última actualización: 31 de Julio de 2025
            </p>
          </div>

          {/* Introducción */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">1. Introducción</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              En MAIS (Movimiento Alternativo Indígena y Social), valoramos tu privacidad y nos comprometemos 
              a proteger tus datos personales. Esta política describe cómo recopilamos, utilizamos y protegemos 
              tu información cuando usas nuestra plataforma de gestión política.
            </p>
          </section>

          {/* Información que recopilamos */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">2. Información que Recopilamos</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">2.1 Información Personal</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nombre completo y datos de contacto</li>
                  <li>Correo electrónico y número de teléfono</li>
                  <li>Rol político y afiliación territorial</li>
                  <li>Fotografía de perfil (opcional)</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">2.2 Información de Uso</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Actividad en la plataforma y logs de acceso</li>
                  <li>Métricas de campaña y análisis políticos</li>
                  <li>Preferencias de usuario y configuración</li>
                  <li>Datos de geolocalización (solo si se autoriza)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cómo usamos la información */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">3. Cómo Usamos tu Información</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🎯 Gestión Política</h4>
                <p className="text-blue-800 text-sm">
                  Facilitar la coordinación de campañas, análisis de datos electorales 
                  y comunicación entre miembros del partido.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">📊 Analytics</h4>
                <p className="text-green-800 text-sm">
                  Generar métricas de rendimiento, análisis de sentimiento 
                  y reportes estratégicos para optimizar campañas.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">🤖 IA Generativa</h4>
                <p className="text-yellow-800 text-sm">
                  Crear contenido político, sugerencias de campaña y análisis 
                  inteligente usando modelos de IA (Gemini, OpenAI).
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">🔒 Seguridad</h4>
                <p className="text-red-800 text-sm">
                  Proteger la plataforma contra accesos no autorizados 
                  y mantener la integridad de los datos políticos.
                </p>
              </div>
            </div>
          </section>

          {/* Protección de datos */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">4. Protección de Datos</h3>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">🛡️ Medidas Técnicas</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Encriptación AES-256-GCM</li>
                    <li>• Headers de seguridad CSP</li>
                    <li>• Autenticación de dos factores</li>
                    <li>• Backups encriptados diarios</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">👥 Medidas Organizativas</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Acceso basado en roles (RBAC)</li>
                    <li>• Auditorías de seguridad regulares</li>
                    <li>• Capacitación en privacidad</li>
                    <li>• Políticas de retención de datos</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Compartir información */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Compartir Información</h3>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-800">
                <strong>Importante:</strong> No vendemos, alquilamos ni compartimos tu información personal 
                con terceros para fines comerciales. Solo compartimos datos cuando:
              </p>
              <ul className="list-disc list-inside mt-2 text-yellow-700">
                <li>Es necesario para el funcionamiento del partido político</li>
                <li>Lo requiere la ley colombiana o autoridades competentes</li>
                <li>Has dado tu consentimiento explícito</li>
                <li>Es necesario para proteger derechos legales</li>
              </ul>
            </div>
          </section>

          {/* Tus derechos */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Tus Derechos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">📋 Derecho de Acceso</h4>
                <p className="text-sm text-gray-700">Solicitar información sobre qué datos tenemos sobre ti.</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">✏️ Derecho de Rectificación</h4>
                <p className="text-sm text-gray-700">Corregir información incorrecta o incompleta.</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">🗑️ Derecho de Eliminación</h4>
                <p className="text-sm text-gray-700">Solicitar la eliminación de tus datos personales.</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">📦 Derecho de Portabilidad</h4>
                <p className="text-sm text-gray-700">Recibir tus datos en formato estructurado.</p>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Contacto</h3>
            <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 p-1 rounded-xl">
              <div className="bg-white p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📧 Oficial de Protección de Datos</h4>
                    <p className="text-gray-700">Email: privacy@mais.gov.co</p>
                    <p className="text-gray-700">Teléfono: +57 1 234-5678</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">👨‍💻 Desarrollador</h4>
                    <p className="text-gray-700">Daniel Lopez "DSimnivaciones"</p>
                    <p className="text-gray-700">Email: dalopez56740@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>Esta política cumple con la Ley 1581 de 2012 de Colombia sobre Protección de Datos Personales</p>
            <p className="mt-1">y el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.</p>
          </div>
        </div>
      </div>
    </div>
  );
};