import React from 'react';
import { MetricCardWithAI } from './MetricCardWithAI';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Metric {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}

const containerVariants = {
  visible: { 
    transition: {
      staggerChildren: 0.1 // Retraso entre la animación de los hijos
    }
  }
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden" // Se inicializa como hidden, pero el padre (Dashboard) lo animará a visible
      animate="visible"
    >
      {metrics.map((metric, index) => (
        <MetricCardWithAI key={index} metric={metric} index={index} />
      ))}
    </motion.div>
  );
};