import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { MessageCenter } from '../widgets/MessageCenter';
import { 
  Vote, 
  Users, 
  Calendar,
  BookOpen,
  Heart
} from 'lucide-react';

export const VoterDashboard: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Vote className="h-8 w-8 text-green-600 mr-3" />
            Espacio Ciudadano
          </h1>
          <p className="text-gray-600 mt-2">Participación y comunicación con el movimiento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Agora MAIS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 text-red-600 mr-2" />
              Agora MAIS - Participación Ciudadana
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">💬 Foro Abierto: Propuestas Educativas</h4>
                <p className="text-sm text-red-700 mb-3">Comparte tus ideas sobre el futuro de la educación en Colombia</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-600">234 participaciones</span>
                  <button className="text-sm bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700 transition-colors">
                    Participar
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">📊 Consulta Ciudadana: Prioridades Locales</h4>
                <p className="text-sm text-green-700 mb-3">Ayúdanos a priorizar las necesidades de tu comunidad</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600">1,847 votos</span>
                  <button className="text-sm bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition-colors">
                    Votar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Eventos y Actividades */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              Próximos Eventos
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Cabildo Abierto - Reforma Tributaria',
                  date: '15 de Febrero, 2024',
                  time: '18:00',
                  location: 'Plaza de Bolívar',
                  type: 'presencial'
                },
                {
                  title: 'Conversatorio Virtual - Jóvenes y Política',
                  date: '20 de Febrero, 2024',
                  time: '20:00',
                  location: 'Plataforma Virtual',
                  type: 'virtual'
                },
                {
                  title: 'Asamblea Regional - Pacífico',
                  date: '25 de Febrero, 2024',
                  time: '16:00',
                  location: 'Buenaventura, Valle',
                  type: 'presencial'
                }
              ].map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.date} a las {event.time}
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${event.type === 'virtual' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 text-sm bg-gradient-to-r from-red-600 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-yellow-700 transition-all">
                      Inscribirse
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <MessageCenter />
          
          {/* Recursos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              Recursos y Propuestas
            </h3>
            <div className="space-y-3">
              <a href="#" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-900">Plan de Gobierno 2024</div>
                <div className="text-sm text-blue-600">Propuestas completas del movimiento</div>
              </a>
              <a href="#" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">Cartilla Ciudadana</div>
                <div className="text-sm text-green-600">Derechos y participación</div>
              </a>
              <a href="#" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                <div className="font-medium text-yellow-900">Agenda Territorial</div>
                <div className="text-sm text-yellow-600">Compromisos por región</div>
              </a>
            </div>
          </div>

          {/* Impacto Personal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 text-pink-600 mr-2" />
              Tu Participación
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">15</div>
                <div className="text-sm text-gray-600">Propuestas apoyadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Eventos asistidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-sm text-gray-600">Días conectado</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};