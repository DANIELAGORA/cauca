import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MAISEffects } from './effects/MAISParticles';
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
  MapPin,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowDown,
  Play,
  Download
} from 'lucide-react';

interface LandingPageNewProps {
  onAccessClick: () => void;
}

// Componente de fuente de agua 3D con logo
const MaisFountain: React.FC = () => {
  const [droplets, setDroplets] = useState<Array<{id: number, x: number, delay: number}>>([]);
  
  useEffect(() => {
    const newDroplets = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      delay: Math.random() * 2
    }));
    setDroplets(newDroplets);
  }, []);

  return (
    <div className="relative h-96 w-full overflow-hidden flex items-center justify-center">
      {/* Fuente base */}
      <div className="absolute bottom-0 w-80 h-20 bg-gradient-to-t from-blue-600 via-blue-400 to-blue-300 rounded-full opacity-70 shadow-2xl"></div>
      
      {/* Logo central con efecto 3D */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          className="w-24 h-24 rounded-2xl shadow-2xl relative overflow-hidden"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(239, 68, 68, 0.5)",
              "0 0 40px rgba(251, 191, 36, 0.5)",
              "0 0 20px rgba(34, 197, 94, 0.5)",
              "0 0 40px rgba(239, 68, 68, 0.5)"
            ],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <img 
            src="/app.ico" 
            alt="MAIS Logo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-500/20 to-green-500/20"></div>
        </motion.div>
      </motion.div>

      {/* Gotas de agua animadas */}
      {droplets.map((droplet) => (
        <motion.div
          key={droplet.id}
          className="absolute w-2 h-8 bg-gradient-to-b from-blue-300 to-blue-600 rounded-full opacity-60"
          style={{ left: `calc(50% + ${droplet.x}px)` }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: [-50, 200],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: droplet.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Ondas de agua */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-full h-32 border-4 border-blue-400 rounded-full opacity-30"
          animate={{
            scale: [0.5, 2, 0.5],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1
          }}
        />
      ))}

      {/* Partículas mágicas */}
      {Array.from({length: 15}).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export const LandingPageNew: React.FC<LandingPageNewProps> = ({ onAccessClick }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const controls = useAnimation();

  const testimonials = [
    {
      text: "MAIS representa la voz auténtica de los pueblos originarios en la política colombiana.",
      author: "José Luis Diago Franco",
      role: "Presidente Departamental Encargado - Cauca"
    },
    {
      text: "Un movimiento que defiende la Madre Tierra y los derechos fundamentales.",
      author: "Gelmis Chate Rivera",
      role: "Alcalde de Inza"
    },
    {
      text: "Tecnología al servicio de la participación democrática y la transparencia.",
      author: "Equipo Técnico",
      role: "Desarrolladores MAIS Digital"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const electosCount = {
    alcaldes: 5,
    diputados: 7,
    concejales: 83,
    municipios: 22
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-yellow-800 to-green-900 relative overflow-hidden">
      {/* Efectos visuales MAIS */}
      <MAISEffects />
      
      {/* Fondo animado con patrones indígenas */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({length: 50}).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            🌽
          </motion.div>
        ))}
      </div>

      {/* Header Impactante */}
      <header className="relative z-20 bg-black/40 backdrop-blur-md border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="relative">
                <motion.div
                  className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(239, 68, 68, 0.8)",
                      "0 0 30px rgba(251, 191, 36, 0.8)",
                      "0 0 20px rgba(34, 197, 94, 0.8)",
                      "0 0 30px rgba(239, 68, 68, 0.8)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <img src="/app.ico" alt="MAIS Logo" className="w-full h-full object-cover" />
                </motion.div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-400 to-green-400 bg-clip-text text-transparent">
                  MAIS Cauca
                </h1>
                <p className="text-yellow-200 text-sm font-medium">Movimiento Alternativo Indígena y Social</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-yellow-300">Resolución 026-1 de 2025</span>
                </div>
              </div>
            </motion.div>
            
            <motion.button
              onClick={onAccessClick}
              className="relative group"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 p-[2px] rounded-xl">
                <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center space-x-3 group-hover:bg-black/30 transition-all">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold">Acceso Sistema</span>
                  <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-all"></div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section Espectacular */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido principal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="inline-block mb-6"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-green-400 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>¡SISTEMA 100% OPERACIONAL!</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </motion.div>

              <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
                <span className="block">Centro de</span>
                <span className="block bg-gradient-to-r from-yellow-400 via-red-400 to-green-400 bg-clip-text text-transparent">
                  Mando Político
                </span>
                <span className="block text-4xl text-yellow-300">MAIS Cauca</span>
              </h2>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                La plataforma tecnológica más avanzada para la gestión política indígena y social. 
                Liderada por <strong className="text-yellow-400">José Luis Diago Franco</strong>, 
                Presidente Departamental Encargado bajo la Resolución 026-1 de 2025.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={onAccessClick}
                  className="group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 p-[3px] rounded-xl">
                    <div className="bg-black px-8 py-4 rounded-xl flex items-center justify-center space-x-3 group-hover:bg-gray-900 transition-all">
                      <Play className="w-6 h-6 text-white" />
                      <span className="text-white font-bold text-lg">Ingresar Ahora</span>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-3 group"
                  whileHover={{ scale: 1.05 }}
                >
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Instalar PWA</span>
                </motion.button>
              </div>

              {/* Estadísticas impactantes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { number: electosCount.alcaldes, label: "Alcaldes", color: "text-green-400" },
                  { number: electosCount.diputados, label: "Diputados", color: "text-blue-400" },
                  { number: electosCount.concejales, label: "Concejales", color: "text-purple-400" },
                  { number: electosCount.municipios, label: "Municipios", color: "text-yellow-400" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Fuente mágica */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="relative"
            >
              <MaisFountain />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-8 h-8 text-yellow-400" />
        </motion.div>
      </section>

      {/* Sección de testimonios dinámicos */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 italic">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <div className="text-yellow-400 font-bold text-lg">
              {testimonials[currentTestimonial].author}
            </div>
            <div className="text-gray-300 text-sm">
              {testimonials[currentTestimonial].role}
            </div>
          </motion.div>
          
          {/* Indicadores */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonial ? 'bg-yellow-400 scale-125' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
              Únete a la Revolución Digital
            </h3>
            <p className="text-xl text-gray-200 mb-8">
              Forma parte del cambio político que Colombia necesita
            </p>
            <motion.button
              onClick={onAccessClick}
              className="group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 p-[4px] rounded-2xl">
                <div className="bg-black px-12 py-6 rounded-2xl flex items-center space-x-4 group-hover:bg-gray-900 transition-all">
                  <img src="/app.ico" alt="MAIS" className="w-8 h-8 rounded-lg" />
                  <span className="text-white font-black text-xl">Acceder al Sistema MAIS</span>
                  <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all"></div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer minimalista pero elegante */}
      <footer className="bg-black/50 backdrop-blur-sm py-8 border-t border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src="/app.ico" alt="MAIS" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-bold text-lg">MAIS Cauca</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Movimiento Alternativo Indígena y Social - Cauca | 
            Desarrollado por Daniel Lopez "DSimnivaciones"
          </p>
        </div>
      </footer>
    </div>
  );
};