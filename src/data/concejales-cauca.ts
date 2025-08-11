// DATOS REALES - Concejales MAIS Electos Cauca 2023-2027
// Sistema de Producción - No Demo Data

export interface ConcejalElecto {
  id: string;
  nombre: string;
  municipio: string;
  telefono: string;
  email: string;
  departamento: 'Cauca';
  region: 'Andina';
  role: 'concejal';
  activo: boolean;
  fechaEleccion: string;
}

export const concejalesElectosCauca: ConcejalElecto[] = [
  {
    id: 'concejal-almaguer-01',
    nombre: 'Adexe Alejandro Hoyos Quiñonez',
    municipio: 'Almaguer',
    telefono: '3218702256',
    email: 'adexeyesina@gmail.com',
    departamento: 'Cauca',
    region: 'Andina',
    role: 'concejal',
    activo: true,
    fechaEleccion: '2023-10-29'
  },
  {
    id: 'concejal-caldono-01',
    nombre: 'Griceldino Chilo Menza',
    municipio: 'Caldono',
    telefono: '3116392077',
    email: 'griceldino.chilo@maiscauca.org', // Email generado institucional
    departamento: 'Cauca',
    region: 'Andina',
    role: 'concejal',
    activo: true,
    fechaEleccion: '2023-10-29'
  },
  {
    id: 'concejal-caloto-01',
    nombre: 'Carlos Alberto Sanchez',
    municipio: 'Caloto',
    telefono: '3122387492',
    email: 'scarlosalberto30@yahoo.es',
    departamento: 'Cauca',
    region: 'Andina',
    role: 'concejal',
    activo: true,
    fechaEleccion: '2023-10-29'
  },
  {
    id: 'concejal-morales-01',
    nombre: 'Carlos Albeiro Huila Cometa',
    municipio: 'Morales',
    telefono: '3177794172',
    email: 'calvehuila@gmail.com',
    departamento: 'Cauca',
    region: 'Andina',
    role: 'concejal',
    activo: true,
    fechaEleccion: '2023-10-29'
  },
  {
    id: 'concejal-paez-01',
    nombre: 'Abelino Campo Fisus',
    municipio: 'Paez (Belalcazar)',
    telefono: '3234773564',
    email: 'abelinocampof@gmail.com',
    departamento: 'Cauca',
    region: 'Andina',
    role: 'concejal',
    activo: true,
    fechaEleccion: '2023-10-29'
  }
];

// Estructura de municipios MAIS Cauca
export const municipiosCauca = [
  'Almaguer',
  'Caldono', 
  'Caloto',
  'Morales',
  'Paez (Belalcazar)'
];

// Configuración de acceso inicial
export const CLAVE_ACCESO_INICIAL = 'mais2025!';

// Datos adicionales para el sistema
export const departamentalInfo = {
  departamento: 'Cauca',
  region: 'Andina',
  totalConcejales: concejalesElectosCauca.length,
  municipiosConPresencia: municipiosCauca.length,
  coordinadorDepartamental: {
    nombre: 'Coordinador Departamental MAIS Cauca',
    email: 'coordinador@maiscauca.org',
    role: 'comite-departamental'
  }
};