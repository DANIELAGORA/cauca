// ESTRUCTURA JERÁRQUICA COMPLETA MAIS - DATOS REALES
// Sistema que refleja la actividad real de concejales hacia arriba

export interface UsuarioMaster {
  id: string;
  nombre: string;
  email: string;
  role: string;
  territory: string;
  department?: string;
  region?: string;
  password: string;
  descripcion: string;
  responsabilidades: string[];
}

// Contraseña universal para usuarios master
export const MASTER_PASSWORD = 'agoramais2025';

export const usuariosMaster: UsuarioMaster[] = [
  // NIVEL NACIONAL
  {
    id: 'master-nacional',
    nombre: 'Coordinación Ejecutiva Nacional MAIS',
    email: 'desarrollonacional@maiscauca.com',
    role: 'comite-ejecutivo-nacional',
    territory: 'Colombia',
    password: MASTER_PASSWORD,
    descripcion: 'Coordinación estratégica nacional del movimiento MAIS',
    responsabilidades: [
      'Supervisión de todas las regiones',
      'Coordinación estratégica nacional',
      'Análisis de métricas consolidadas',
      'Toma de decisiones ejecutivas',
      'Seguimiento a concejales electos'
    ]
  },

  // NIVEL REGIONAL
  {
    id: 'master-regional',
    nombre: 'Liderazgo Regional Andino MAIS',
    email: 'desarrolloregional@maiscauca.com',
    role: 'lider-regional',
    territory: 'Región Andina',
    region: 'Andina',
    password: MASTER_PASSWORD,
    descripcion: 'Coordinación regional de departamentos andinos',
    responsabilidades: [
      'Supervisión departamental región Andina',
      'Coordinación entre departamentos',
      'Seguimiento a concejales regionales',
      'Reportes al nivel nacional',
      'Estrategias territoriales'
    ]
  },

  // NIVEL DEPARTAMENTAL - DIRECTOR REAL CAUCA
  {
    id: 'director-cauca-real',
    nombre: 'José Luis Diago',
    email: 'joseluisdiago@maiscauca.com',
    role: 'director-departamental',
    territory: 'Cauca',
    department: 'Cauca',
    region: 'Andina',
    password: MASTER_PASSWORD,
    descripcion: 'Director Departamental MAIS Cauca - Supervisor directo de concejales electos',
    responsabilidades: [
      'Dirección estratégica departamental',
      'Supervisión directa de 5 concejales electos',
      'Creación y gestión de equipos municipales',
      'Coordinación con estructura regional y nacional',
      'Administración de recursos departamentales',
      'Reportes de gestión hacia estructura superior',
      'Creación de roles para estructura inferior'
    ],
    canCreateRoles: ['coordinador-municipal', 'concejal', 'lider-local'],
    reportsTo: 'lider-regional',
    manages: ['concejal-almaguer-01', 'concejal-caldono-01', 'concejal-caloto-01', 'concejal-morales-01', 'concejal-paez-01']
  },

  // NIVEL CANDIDATOS
  {
    id: 'master-candidato',
    nombre: 'Candidato Demo MAIS',
    email: 'desarrollocandidato@maiscauca.com',
    role: 'candidato',
    territory: 'Popayán',
    department: 'Cauca',
    region: 'Andina',
    password: MASTER_PASSWORD,
    descripcion: 'Perfil de candidato para pruebas y demostraciones',
    responsabilidades: [
      'Gestión de campañas electorales',
      'Creación de contenido político',
      'Análisis de audiencias',
      'Estrategias digitales',
      'Coordinación con bases'
    ]
  },

  // NIVEL INFLUENCIADORES
  {
    id: 'master-influencer',
    nombre: 'Influencer Digital MAIS',
    email: 'desarrolloinfluenciador@maiscauca.com',
    role: 'influenciador',
    territory: 'Digital Nacional',
    password: MASTER_PASSWORD,
    descripcion: 'Estrategia de comunicación digital MAIS',
    responsabilidades: [
      'Gestión de redes sociales',
      'Creación de contenido viral',
      'Análisis de engagement',
      'Campañas digitales',
      'Monitoreo de tendencias'
    ]
  },

  // NIVEL LÍDERES COMUNITARIOS
  {
    id: 'master-lider',
    nombre: 'Liderazgo Comunitario MAIS',
    email: 'desarrollolider@maiscauca.com',
    role: 'lider',
    territory: 'Comunidades Cauca',
    department: 'Cauca',
    password: MASTER_PASSWORD,
    descripcion: 'Liderazgo de base comunitaria',
    responsabilidades: [
      'Movilización comunitaria',
      'Organización de eventos',
      'Conexión con votantes',
      'Trabajo territorial',
      'Feedback ciudadano'
    ]
  },

  // NIVEL VOTANTES
  {
    id: 'master-votante',
    nombre: 'Ciudadano Simpatizante MAIS',
    email: 'desarrollovotante@maiscauca.com',
    role: 'votante',
    territory: 'Cauca',
    department: 'Cauca',
    password: MASTER_PASSWORD,
    descripcion: 'Perfil de ciudadano base del movimiento',
    responsabilidades: [
      'Participación en consultas',
      'Retroalimentación ciudadana',
      'Difusión en redes',
      'Asistencia a eventos',
      'Voto consciente'
    ]
  }
];

// Métricas reales basadas en actividad de concejales
export interface MetricasReales {
  concejalesTotales: number;
  municipiosConPresencia: number;
  sesionesAsistidas: number;
  proyectosPresentados: number;
  ciudadanosAtendidos: number;
  iniciativasActivas: number;
}

export const metricasActuales: MetricasReales = {
  concejalesTotales: 5,
  municipiosConPresencia: 5, // Almaguer, Caldono, Caloto, Morales, Paez
  sesionesAsistidas: 55, // Total consolidado de todos los concejales
  proyectosPresentados: 15, // Suma de todos los proyectos
  ciudadanosAtendidos: 225, // Suma de atención ciudadana
  iniciativasActivas: 20 // Iniciativas en curso
};

// Municipios con presencia MAIS actual
export const municipiosMAIS = [
  {
    nombre: 'Almaguer',
    concejales: 1,
    concejal: 'Adexe Alejandro Hoyos Quiñonez',
    contacto: 'adexeyesina@gmail.com',
    telefono: '3218702256'
  },
  {
    nombre: 'Caldono', 
    concejales: 1,
    concejal: 'Griceldino Chilo Menza',
    contacto: 'griceldino.chilo@maiscauca.org',
    telefono: '3116392077'
  },
  {
    nombre: 'Caloto',
    concejales: 1,
    concejal: 'Carlos Alberto Sanchez',
    contacto: 'scarlosalberto30@yahoo.es',
    telefono: '3122387492'
  },
  {
    nombre: 'Morales',
    concejales: 1,
    concejal: 'Carlos Albeiro Huila Cometa',
    contacto: 'calvehuila@gmail.com',
    telefono: '3177794172'
  },
  {
    nombre: 'Paez (Belalcazar)',
    concejales: 1,
    concejal: 'Abelino Campo Fisus',
    contacto: 'abelinocampof@gmail.com',
    telefono: '3234773564'
  }
];

// Configuración jerárquica
export const jerarquiaMais = {
  'comite-ejecutivo-nacional': {
    nivel: 1,
    supervisa: ['lider-regional'],
    acceso: ['nacional', 'regional', 'departamental', 'municipal'],
    dashboardCompleto: true
  },
  'lider-regional': {
    nivel: 2,
    supervisa: ['comite-departamental'],
    acceso: ['regional', 'departamental', 'municipal'],
    region: 'Andina'
  },
  'comite-departamental': {
    nivel: 3,
    supervisa: ['concejal'],
    acceso: ['departamental', 'municipal'],
    department: 'Cauca'
  },
  'candidato': {
    nivel: 3,
    supervisa: [],
    acceso: ['municipal', 'personal'],
    independiente: true
  },
  'influenciador': {
    nivel: 3,
    supervisa: [],
    acceso: ['digital', 'contenido'],
    especializado: 'comunicacion'
  },
  'lider': {
    nivel: 4,
    supervisa: ['votante'],
    acceso: ['comunitario', 'local'],
    territorial: true
  },
  'concejal': {
    nivel: 4,
    supervisa: [],
    acceso: ['municipal', 'legislativo'],
    electo: true
  },
  'votante': {
    nivel: 5,
    supervisa: [],
    acceso: ['personal', 'participacion'],
    base: true
  }
};

export function getUsuarioMasterByRole(role: string) {
  return usuariosMaster.find(user => user.role === role);
}

export function getMetricasPorNivel(role: string) {
  const nivel = jerarquiaMais[role as keyof typeof jerarquiaMais];
  if (!nivel) return null;

  // Retornar métricas según el nivel jerárquico
  switch (nivel.nivel) {
    case 1: // Nacional
      return {
        ...metricasActuales,
        regiones: 1,
        departamentos: 1,
        alcance: 'Nacional'
      };
    case 2: // Regional
      return {
        ...metricasActuales,
        departamentos: 1,
        alcance: 'Región Andina'
      };
    case 3: // Departamental
      return {
        ...metricasActuales,
        alcance: 'Cauca'
      };
    default:
      return metricasActuales;
  }
}