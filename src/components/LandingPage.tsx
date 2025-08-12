import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Map, 
  Shield, 
  Heart, 
  Lightbulb,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface LandingPageProps {
  onAccessClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAccessClick }) => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Organización Jerárquica",
      description: "Sistema estructurado desde nivel nacional hasta local, con José Luis Diago como Director Departamental del Cauca."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Gestión de Campañas",
      description: "Herramientas especializadas para candidatos y equipos de trabajo, con métricas en tiempo real."
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Cobertura Territorial",
      description: "Presencia activa en municipios del Cauca con concejales electos y estructura organizativa."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparencia",
      description: "Sistema de cuentas claras y reportes transparentes para toda la estructura del partido."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Compromiso Social",
      description: "Enfoque en políticas públicas que beneficien a las comunidades indígenas y sociales."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovación Política",
      description: "Uso de tecnología e inteligencia artificial para optimizar la gestión política."
    }
  ];

  const electosDestacados = [
    // ALCALDES MAIS
    {
      nombre: "Gelmis Chate Rivera",
      cargo: "Alcalde",
      municipio: "Inza",
      telefono: "3225382560",
      email: "chate08@gmail.com",
      tipo: "alcalde"
    },
    {
      nombre: "Jhon Jairo Fuentes Quinayas",
      cargo: "Alcalde", 
      municipio: "Patia (El Bordo)",
      telefono: "3227684684",
      email: "JHONFUENTES10599@GMAIL.COM",
      tipo: "alcalde"
    },
    {
      nombre: "Jaime Diaz Noscue",
      cargo: "Alcalde",
      municipio: "Toribio",
      telefono: "3214314309",
      email: "JAIMEDIAZ99@GMAIL.COM",
      tipo: "alcalde"
    },
    {
      nombre: "Oscar Yamit Guacheta Arrubla",
      cargo: "Alcalde",
      municipio: "Morales",
      telefono: "3125268424",
      email: "guachetafernandez@hotmail.com",
      tipo: "alcalde"
    },
    {
      nombre: "Lida Emilse Paz Labio",
      cargo: "Alcaldesa",
      municipio: "Jambalo",
      telefono: "3117086819",
      email: "liempala@gmail.com",
      tipo: "alcalde"
    },
    // DIPUTADOS ASAMBLEA
    {
      nombre: "Gilberto Muñoz Coronado",
      cargo: "Diputado Asamblea",
      municipio: "Departamental",
      telefono: "3103473660",
      email: "MUCORO@YAHOO.ES",
      tipo: "diputado"
    },
    {
      nombre: "Ferley Quintero Quinayas",
      cargo: "Diputado Asamblea",
      municipio: "Departamental",
      telefono: "3112198953",
      email: "ferqino7@gmail.com",
      tipo: "diputado"
    },
    // CONCEJALES PRINCIPALES
    {
      nombre: "Adexe Alejandro Hoyos Quiñonez",
      cargo: "Concejal",
      municipio: "Almaguer",
      telefono: "3218702256",
      email: "adexeyesina@gmail.com",
      tipo: "concejal"
    },
    {
      nombre: "Griceldino Chilo Menza",
      cargo: "Concejal",
      municipio: "Caldono",
      telefono: "3116392077",
      email: "griceldino.chilo@maiscauca.org",
      tipo: "concejal"
    },
    {
      nombre: "Carlos Alberto Sanchez",
      cargo: "Concejal",
      municipio: "Caloto",
      telefono: "3122387492",
      email: "scarlosalberto30@yahoo.es",
      tipo: "concejal"
    },
    {
      nombre: "Carlos Albeiro Huila Cometa",
      cargo: "Concejal",
      municipio: "Morales",
      telefono: "3177794172",
      email: "CALVEHUILA@GMAIL.COM",
      tipo: "concejal"
    },
    {
      nombre: "Abelino Campo Fisus",
      cargo: "Concejal",
      municipio: "Paez (Belalcazar)",
      telefono: "3234773564",
      email: "abelinocampof@gmail.com",
      tipo: "concejal"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="/icon-v2-192x192.png" alt="MAIS Logo" className="w-12 h-12 rounded-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MAIS Cauca</h1>
                <p className="text-sm text-gray-600">Movimiento Alternativo Indígena y Social</p>
              </div>
            </div>
            <button
              onClick={onAccessClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>Acceso Sistema</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Centro de Mando Político
              <span className="block text-blue-600 mt-2">MAIS Cauca</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plataforma tecnológica integral para la gestión política del Movimiento Alternativo 
              Indígena y Social en el departamento del Cauca. Liderado por José Luis Diago como 
              Director Departamental.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onAccessClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Acceder al Sistema
              </button>
              <a
                href="#concejales"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Ver Concejales Electos
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Qué es AgoraMais?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un sistema integral de gestión política que conecta toda la estructura del partido, 
              desde el nivel nacional hasta los líderes comunitarios locales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Electos Section */}
      <section id="concejales" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Representantes Electos MAIS Cauca
            </h3>
            <p className="text-lg text-gray-600">
              5 Alcaldes, 2 Diputados y 87 Concejales electos en 22 municipios del departamento
            </p>
            <div className="mt-4 flex justify-center space-x-8 text-sm">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-semibold">5 Alcaldías</span>
              </div>
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <span className="text-blue-800 font-semibold">2 Diputados</span>
              </div>
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <span className="text-purple-800 font-semibold">87 Concejales</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {electosDestacados.map((electo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white p-6 rounded-xl shadow-lg border-2 ${
                  electo.tipo === 'alcalde' ? 'border-green-200 bg-green-50' :
                  electo.tipo === 'diputado' ? 'border-blue-200 bg-blue-50' :
                  'border-purple-200 bg-purple-50'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    electo.tipo === 'alcalde' ? 'bg-gradient-to-r from-green-600 to-green-700' :
                    electo.tipo === 'diputado' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                    'bg-gradient-to-r from-purple-600 to-purple-700'
                  }`}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    electo.tipo === 'alcalde' ? 'bg-green-200 text-green-800' :
                    electo.tipo === 'diputado' ? 'bg-blue-200 text-blue-800' :
                    'bg-purple-200 text-purple-800'
                  }`}>
                    {electo.cargo}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{electo.nombre}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{electo.municipio}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{electo.telefono}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-xs">{electo.email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Cobertura Total MAIS Cauca</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Alcaldías</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-gray-600">Diputados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">87</div>
                  <div className="text-sm text-gray-600">Concejales</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">22</div>
                  <div className="text-sm text-gray-600">Municipios</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                MAIS es la fuerza política con mayor representación en el Cauca
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Liderazgo Departamental
            </h3>
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 rounded-2xl text-white max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12" />
              </div>
              <h4 className="text-2xl font-bold mb-2">José Luis Diago</h4>
              <p className="text-lg mb-4">Director Departamental - Cauca</p>
              <p className="text-blue-100">
                Líder de la estructura territorial del MAIS en el Cauca, coordinando 
                las actividades políticas y sociales en todos los municipios del departamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-6">
            ¿Eres militante o simpatizante del MAIS?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Únete a nuestra plataforma digital y sé parte activa del cambio político en el Cauca
          </p>
          <button
            onClick={onAccessClick}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center space-x-2"
          >
            <span>Acceder al Sistema AgoraMais</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img src="/icon-v2-192x192.png" alt="MAIS Logo" className="w-10 h-10 rounded-lg" />
                </div>
                <span className="text-xl font-bold">MAIS Cauca</span>
              </div>
              <p className="text-gray-400">
                Movimiento Alternativo Indígena y Social del departamento del Cauca
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <p>Director: José Luis Diago</p>
                <p>Email: joseluisdiago@maiscauca.com</p>
                <p>Cauca, Colombia</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Desarrollado por</h4>
              <p className="text-gray-400">
                Daniel Lopez "DSimnivaciones" Wramba fxiw
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Sistema político tecnológico integral
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MAIS Cauca. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};