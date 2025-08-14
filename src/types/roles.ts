// CLEAN ARCHITECTURE: TIPOS DE ROLES MAIS CAUCA
// Sistema jerárquico territorial con control granular

/**
 * JERARQUÍA TERRITORIAL MAIS CAUCA
 * ================================
 * Nivel 1: Coordinador Departamental (1)
 * Nivel 2: Coordinadores Zonales (5 zonas)
 * Nivel 3: Líderes Municipales (por municipio)
 * Nivel 4: Concejales (por municipio)
 * Nivel 5: Líderes Comunitarios
 * Nivel 6: Colaboradores y Votantes
 */

// ZONAS GEOGRÁFICAS DEL CAUCA
export enum ZonaCauca {
  NORTE = 'norte',      // Santander, Villa Rica, etc.
  SUR = 'sur',          // La Sierra, Florencia, etc. 
  CENTRO = 'centro',    // Popayán, Timbío, etc.
  PACIFICO = 'pacifico', // Guapi, López de Micay, etc.
  MACIZO = 'macizo'     // Almaguer, San Sebastián, etc.
}

// MUNICIPIOS POR ZONA
export const MUNICIPIOS_POR_ZONA: Record<ZonaCauca, string[]> = {
  [ZonaCauca.NORTE]: [
    'Santander de Quilichao',
    'Villa Rica', 
    'Caldono',
    'Jambaló',
    'Toribío'
  ],
  [ZonaCauca.SUR]: [
    'La Sierra',
    'Florencia',
    'Bolívar',
    'Mercaderes',
    'Sucre'
  ],
  [ZonaCauca.CENTRO]: [
    'Popayán',
    'Timbío',
    'El Tambo',
    'Morales',
    'Cajibío'
  ],
  [ZonaCauca.PACIFICO]: [
    'Guapi',
    'López de Micay',
    'Timbiquí'
  ],
  [ZonaCauca.MACIZO]: [
    'Almaguer',
    'San Sebastián',
    'Santa Rosa',
    'La Vega',
    'Rosas'
  ]
};

// ROLES JERÁRQUICOS CON TERRITORIO
export type UserRoleHierarchical = 
  // NIVEL 1: DEPARTAMENTAL
  | 'coordinador-departamental'
  
  // NIVEL 2: ZONALES (5 zonas)
  | 'coordinador-zona-norte'
  | 'coordinador-zona-sur'
  | 'coordinador-zona-centro'
  | 'coordinador-zona-pacifico'
  | 'coordinador-zona-macizo'
  
  // NIVEL 3: MUNICIPALES (específicos por municipio)
  | 'lider-municipal'  // Generic, será específico por municipio
  
  // NIVEL 4: CONCEJALES (específicos por municipio)  
  | 'concejal'        // Generic, será específico por municipio
  
  // NIVEL 5: COMUNITARIOS
  | 'lider-comunitario'
  | 'influenciador-digital'
  
  // NIVEL 6: BASE
  | 'colaborador'
  | 'votante'
  | 'simpatizante';

// INTERFACE PARA USUARIO CON TERRITORIO
export interface UserTerritorial {
  id: string;
  email: string;
  name: string;
  role: UserRoleHierarchical;
  
  // UBICACIÓN TERRITORIAL
  department: 'Cauca';  // Siempre Cauca
  zona?: ZonaCauca;     // Zona específica del Cauca
  municipality?: string; // Municipio específico
  
  // JERARQUÍA
  hierarchyLevel: number;      // 1-6
  reportsTo?: string;          // ID del superior directo
  canCreateRoles: UserRoleHierarchical[];
  managedTerritories: string[]; // Territorios que maneja
  
  // METADATOS
  esRealElecto: boolean;        // Si es candidato real electo
  isActive: boolean;
  createdAt: Date;
  lastActive?: Date;
  permissions: string[];
  metadata?: Record<string, any>;
}

// PERMISOS JERÁRQUICOS POR NIVEL
export const HIERARCHY_LEVELS: Record<UserRoleHierarchical, number> = {
  // NIVEL 1: DEPARTAMENTAL
  'coordinador-departamental': 1,
  
  // NIVEL 2: ZONALES
  'coordinador-zona-norte': 2,
  'coordinador-zona-sur': 2, 
  'coordinador-zona-centro': 2,
  'coordinador-zona-pacifico': 2,
  'coordinador-zona-macizo': 2,
  
  // NIVEL 3: MUNICIPALES
  'lider-municipal': 3,
  
  // NIVEL 4: CONCEJALES
  'concejal': 4,
  
  // NIVEL 5: COMUNITARIOS
  'lider-comunitario': 5,
  'influenciador-digital': 5,
  
  // NIVEL 6: BASE
  'colaborador': 6,
  'votante': 6,
  'simpatizante': 6
};

// PERMISOS DE CREACIÓN JERÁRQUICOS
export const ROLE_CREATION_MATRIX: Record<UserRoleHierarchical, UserRoleHierarchical[]> = {
  // COORDINADOR DEPARTAMENTAL: puede crear zonales
  'coordinador-departamental': [
    'coordinador-zona-norte',
    'coordinador-zona-sur', 
    'coordinador-zona-centro',
    'coordinador-zona-pacifico',
    'coordinador-zona-macizo'
  ],
  
  // COORDINADORES ZONALES: pueden crear líderes municipales de su zona
  'coordinador-zona-norte': [
    'lider-municipal',  // Específico de municipios de zona norte
    'lider-comunitario',
    'colaborador',
    'votante'
  ],
  'coordinador-zona-sur': [
    'lider-municipal',  // Específico de municipios de zona sur
    'lider-comunitario', 
    'colaborador',
    'votante'
  ],
  'coordinador-zona-centro': [
    'lider-municipal',  // Específico de municipios de zona centro
    'lider-comunitario',
    'colaborador', 
    'votante'
  ],
  'coordinador-zona-pacifico': [
    'lider-municipal',  // Específico de municipios de zona pacífico
    'lider-comunitario',
    'colaborador',
    'votante'
  ],
  'coordinador-zona-macizo': [
    'lider-municipal',  // Específico de municipios de zona macizo
    'lider-comunitario',
    'colaborador',
    'votante'
  ],
  
  // LÍDERES MUNICIPALES: pueden crear concejales de su municipio
  'lider-municipal': [
    'concejal',         // Concejales específicos del municipio
    'lider-comunitario',
    'influenciador-digital',
    'colaborador',
    'votante',
    'simpatizante'
  ],
  
  // CONCEJALES: pueden crear líderes comunitarios y colaboradores
  'concejal': [
    'lider-comunitario',
    'colaborador', 
    'votante',
    'simpatizante'
  ],
  
  // LÍDERES COMUNITARIOS: pueden crear colaboradores
  'lider-comunitario': [
    'colaborador',
    'votante',
    'simpatizante'
  ],
  
  // INFLUENCIADORES: pueden crear colaboradores
  'influenciador-digital': [
    'colaborador',
    'votante'
  ],
  
  // COLABORADORES: pueden invitar votantes
  'colaborador': [
    'votante',
    'simpatizante'
  ],
  
  // VOTANTES Y SIMPATIZANTES: no pueden crear roles
  'votante': [],
  'simpatizante': []
};

// FACTORY PARA CREAR ROLES ESPECÍFICOS POR MUNICIPIO
export function createMunicipalRole(
  baseRole: 'lider-municipal' | 'concejal',
  municipality: string,
  zona: ZonaCauca
): string {
  const sanitizedMunicipality = municipality
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[áéíóú]/g, (match) => {
      const replacements = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };
      return replacements[match] || match;
    });
    
  return `${baseRole}-${sanitizedMunicipality}`;
}

// VALIDACIONES TERRITORIALES
export function canCreateInTerritory(
  creatorRole: UserRoleHierarchical,
  creatorZona: ZonaCauca | undefined,
  creatorMunicipality: string | undefined,
  targetRole: UserRoleHierarchical,
  targetZona: ZonaCauca | undefined,
  targetMunicipality: string | undefined
): boolean {
  const creatorLevel = HIERARCHY_LEVELS[creatorRole];
  const targetLevel = HIERARCHY_LEVELS[targetRole];
  
  // Los superiores pueden crear inferiores
  if (creatorLevel >= targetLevel) return false;
  
  // Validaciones territoriales específicas
  switch (creatorRole) {
    case 'coordinador-departamental':
      // Puede crear en todo el departamento
      return true;
      
    case 'coordinador-zona-norte':
    case 'coordinador-zona-sur':
    case 'coordinador-zona-centro':
    case 'coordinador-zona-pacifico':
    case 'coordinador-zona-macizo':
      // Solo puede crear en su zona
      return creatorZona === targetZona;
      
    case 'lider-municipal':
      // Solo puede crear en su municipio
      return creatorMunicipality === targetMunicipality;
      
    case 'concejal':
      // Solo puede crear en su municipio
      return creatorMunicipality === targetMunicipality;
      
    default:
      return false;
  }
}

// OBTENER ZONA POR MUNICIPIO
export function getZonaByMunicipality(municipality: string): ZonaCauca | undefined {
  for (const [zona, municipios] of Object.entries(MUNICIPIOS_POR_ZONA)) {
    if (municipios.includes(municipality)) {
      return zona as ZonaCauca;
    }
  }
  return undefined;
}

// ESTADÍSTICAS DE ESTRUCTURA
export const ESTRUCTURA_STATS = {
  TOTAL_ZONAS: 5,
  TOTAL_MUNICIPIOS: Object.values(MUNICIPIOS_POR_ZONA).flat().length,
  MUNICIPIOS_POR_ZONA: Object.fromEntries(
    Object.entries(MUNICIPIOS_POR_ZONA).map(([zona, municipios]) => [zona, municipios.length])
  )
};

export default {
  ZonaCauca,
  MUNICIPIOS_POR_ZONA,
  HIERARCHY_LEVELS,
  ROLE_CREATION_MATRIX,
  createMunicipalRole,
  canCreateInTerritory,
  getZonaByMunicipality,
  ESTRUCTURA_STATS
};