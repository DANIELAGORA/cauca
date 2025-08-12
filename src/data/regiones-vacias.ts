// CONFIGURACIÓN DE REGIONES VACÍAS - PRODUCCIÓN
// Todas las regiones excepto Cauca están en 0 hasta que el comité nacional las configure

export interface RegionConfig {
  departamento: string;
  region: string;
  alcaldes: number;
  diputados: number;
  concejales: number;
  coordinadores: number;
  activado: boolean;
  fechaActivacion?: string;
}

// REGIONES CONFIGURADAS COMO VACÍAS (0 VALORES)
export const regionesVacias: RegionConfig[] = [
  // REGIÓN ANDINA (sin Cauca)
  {
    departamento: 'Antioquia',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0, 
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Boyacá',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Caldas',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Cundinamarca',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Huila',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Nariño',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Norte de Santander',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Quindío',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Risaralda',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Santander',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Tolima',
    region: 'Andina',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },

  // REGIÓN CARIBE
  {
    departamento: 'Atlántico',
    region: 'Caribe',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Bolívar',
    region: 'Caribe',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Cesar',
    region: 'Caribe',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Córdoba',
    region: 'Caribe',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'La Guajira',
    region: 'Caribe',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Magdalena',
    region: 'Caribe',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Sucre',
    region: 'Caribe',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },

  // REGIÓN PACÍFICO
  {
    departamento: 'Chocó',
    region: 'Pacífico',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Valle del Cauca',
    region: 'Pacífico',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },

  // REGIÓN ORINOQUÍA
  {
    departamento: 'Arauca',
    region: 'Orinoquía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Casanare',
    region: 'Orinoquía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Meta',
    region: 'Orinoquía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Vichada',
    region: 'Orinoquía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },

  // REGIÓN AMAZONÍA
  {
    departamento: 'Amazonas',
    region: 'Amazonía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Caquetá',
    region: 'Amazonía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Guainía',
    region: 'Amazonía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Guaviare',
    region: 'Amazonía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Putumayo',
    region: 'Amazonía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  },
  {
    departamento: 'Vaupés',
    region: 'Amazonía',
    alcaldes: 0,
    diputados: 0,
    concejales: 0,
    coordinadores: 0,
    activado: false
  }
];

// CAUCA - ÚNICA REGIÓN ACTIVA CON DATOS REALES
export const caucaConfig: RegionConfig = {
  departamento: 'Cauca',
  region: 'Andina',
  alcaldes: 5,
  diputados: 7,
  concejales: 83,
  coordinadores: 1, // Director Departamental
  activado: true,
  fechaActivacion: '2024-01-01'
};

// FUNCIÓN PARA OBTENER CONFIGURACIÓN POR DEPARTAMENTO
export function getRegionConfig(departamento: string): RegionConfig | null {
  if (departamento === 'Cauca') {
    return caucaConfig;
  }
  
  return regionesVacias.find(r => r.departamento === departamento) || null;
}

// FUNCIÓN PARA OBTENER MÉTRICAS NACIONALES
export function getMetricasNacionales() {
  const totalRegiones = regionesVacias.length + 1; // +1 por Cauca
  const regionesActivas = 1; // Solo Cauca
  const regionesInactivas = regionesVacias.length;
  
  return {
    totalDepartamentos: totalRegiones,
    departamentosActivos: regionesActivas,
    departamentosInactivos: regionesInactivas,
    porcentajeActivacion: ((regionesActivas / totalRegiones) * 100).toFixed(1),
    
    // Solo datos de Cauca
    totalAlcaldes: caucaConfig.alcaldes,
    totalDiputados: caucaConfig.diputados,
    totalConcejales: caucaConfig.concejales,
    totalCoordinadores: caucaConfig.coordinadores,
    
    // Potencial cuando se activen todas las regiones
    potencialExpansion: {
      estimadoAlcaldesPorDpto: 5,
      estimadoDiputadosPorDpto: 7,
      estimadoConcejalesPorDpto: 80,
      totalPotencialAlcaldes: regionesVacias.length * 5,
      totalPotencialDiputados: regionesVacias.length * 7,
      totalPotencialConcejales: regionesVacias.length * 80
    }
  };
}

export default { regionesVacias, caucaConfig, getRegionConfig, getMetricasNacionales };