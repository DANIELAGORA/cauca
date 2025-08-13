import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  symbol: string;
}

export const MAISParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Crear partículas MAIS
    const symbols = ['🌽', '🌿', '⭐', '✨', '🔥', '💚', '💛', '❤️'];
    const colors = ['#DC2626', '#EAB308', '#16A34A', '#2563EB', '#7C3AED'];

    const createParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 20 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          symbol: symbols[Math.floor(Math.random() * symbols.length)]
        });
      }
      particlesRef.current = particles;
    };

    createParticles();

    // Animar partículas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Mover partícula
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebotar en los bordes
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Dibujar partícula
        ctx.font = `${particle.size}px Arial`;
        ctx.fillText(particle.symbol, particle.x, particle.y);

        // Efecto de brillo
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

// Componente de logo flotante 3D
export const FloatingLogo3D: React.FC = () => {
  return (
    <motion.div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
      initial={{ scale: 0, rotate: 0 }}
      animate={{ 
        scale: [0.5, 1, 0.5],
        rotate: [0, 360, 0],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{ 
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="relative">
        <img 
          src="/app.ico" 
          alt="MAIS Background" 
          className="w-96 h-96 opacity-5"
          style={{
            filter: 'blur(2px)',
            transform: 'perspective(1000px) rotateX(45deg) rotateY(45deg)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-yellow-500/10 to-green-500/10 rounded-full"></div>
      </div>
    </motion.div>
  );
};

// Componente de ondas MAIS
export const MAISWaves: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute w-full h-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 4, 0],
            opacity: [0, 0.2, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 1.6,
            ease: "easeOut"
          }}
        >
          <div 
            className="w-40 h-40 rounded-full border-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              borderColor: i % 2 === 0 ? '#DC2626' : i % 3 === 0 ? '#EAB308' : '#16A34A',
              borderStyle: 'dashed'
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Efectos completos MAIS
export const MAISEffects: React.FC = () => {
  return (
    <>
      <MAISParticles />
      <FloatingLogo3D />
      <MAISWaves />
    </>
  );
};