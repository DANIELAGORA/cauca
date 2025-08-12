// DATOS COMPLETOS DE CANDIDATOS ELECTOS MAIS CAUCA
// Versión optimizada sin errores de escape - Sistema MAIS

export interface CandidatoElecto {
  corporacion: string;
  circunscripcion: string;
  departamento: string;
  municipio: string;
  nombreComuna: string;
  opcionVoto: string;
  codigoPartido: string;
  nombrePartido: string;
  nombreCandidato: string;
  genero: 'M' | 'F';
  estado: 'ELEGIDO' | 'ACEPTO CURUL';
  cedula: string;
  telefono: string;
  correo: string;
}

// Constante para evitar repetición
const PARTY_NAME = 'MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL MAIS';
const PARTY_CODE = '00012';
const DEPARTMENT = 'CAUCA';

// ALCALDES ELECTOS MAIS
export const alcaldesElectos: CandidatoElecto[] = [
  {
    corporacion: 'ALCALDE',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'INZA',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'GELMIS CHATE RIVERA',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '4687459',
    telefono: '3225382560',
    correo: 'chate08@gmail.com'
  },
  {
    corporacion: 'ALCALDE',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'PATIA (EL BORDO)',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'JHON JAIRO FUENTES QUINAYAS',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '98545846',
    telefono: '3208594732',
    correo: 'johnfuentesquinayas@gmail.com'
  },
  {
    corporacion: 'ALCALDE',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'PAEZ (BELALCAZAR)',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'MARIO FERNANDO VANEGAS RAMOS',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '7712899',
    telefono: '3104459987',
    correo: 'mafevara@hotmail.com'
  },
  {
    corporacion: 'ALCALDE',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'SANTANDER DE QUILICHAO',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'JHON FERNANDO MARTINEZ ANGULO',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '94359688',
    telefono: '3104959638',
    correo: 'jhonfernandomartinez@gmail.com'
  }
];

// DIPUTADOS ASAMBLEA ELECTOS MAIS
export const diputadosElectos: CandidatoElecto[] = [
  {
    corporacion: 'ASAMBLEA DEPARTAMENTAL',
    circunscripcion: 'Departamental',
    departamento: DEPARTMENT,
    municipio: 'N/A',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'GENTIL GUEVARA DAGUA',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '16829264',
    telefono: '3146987453',
    correo: 'gentilguevara@gmail.com'
  },
  {
    corporacion: 'ASAMBLEA DEPARTAMENTAL',
    circunscripcion: 'Departamental',
    departamento: DEPARTMENT,
    municipio: 'N/A',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'DELFIN CAMPO TROCHEZ',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '7709234',
    telefono: '3175648932',
    correo: 'delfincampo@mais.org'
  },
  {
    corporacion: 'ASAMBLEA DEPARTAMENTAL',
    circunscripcion: 'Departamental',
    departamento: DEPARTMENT,
    municipio: 'N/A',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'CLAUDIA PIAMBA TULANDE',
    genero: 'F',
    estado: 'ELEGIDO',
    cedula: '25165284',
    telefono: '3209847563',
    correo: 'claudiapiamba@outlook.com'
  }
];

// CONCEJALES ELECTOS MAIS POR MUNICIPIO
export const concejalesElectos: CandidatoElecto[] = [
  // INZA
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'INZA',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'FABIO NELSON CHATE RIVERA',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '1061683245',
    telefono: '3186741329',
    correo: 'fabiochate@gmail.com'
  },
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'INZA',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'MARIA YOLANDA GUEGIA COICUE',
    genero: 'F',
    estado: 'ELEGIDO',
    cedula: '25168732',
    telefono: '3147892456',
    correo: 'mariayolanda@mais.org'
  },
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'INZA',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'ELISEO CHATE VASA',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '7658934',
    telefono: '3208745639',
    correo: 'eliseochate@gmail.com'
  },
  // PATIA (EL BORDO)
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'PATIA (EL BORDO)',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'LUIS ANTONIO CRIOLLO ANACONA',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '16847539',
    telefono: '3157894123',
    correo: 'luiscriollo@gmail.com'
  },
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'PATIA (EL BORDO)',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'MIRIAN ANACONA TROCHEZ',
    genero: 'F',
    estado: 'ELEGIDO',
    cedula: '55674821',
    telefono: '3186472958',
    correo: 'mirianacancona@outlook.com'
  },
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'PATIA (EL BORDO)',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'BELARMINO QUINAYAS JAJOY',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '16758394',
    telefono: '3209687412',
    correo: 'belarminoquinayas@gmail.com'
  },
  // PAEZ (BELALCAZAR)
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'PAEZ (BELALCAZAR)',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'CRISTOBAL VELASCO TAQUINAS',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '7658923',
    telefono: '3147859632',
    correo: 'cristobalvelasco@gmail.com'
  },
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'PAEZ (BELALCAZAR)',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'EVARISTO YONDA CASSO',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '7634892',
    telefono: '3206847592',
    correo: 'evaristoyonda@mais.org'
  },
  // SANTANDER DE QUILICHAO
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'SANTANDER DE QUILICHAO',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'MILER OSNEY MEDINA VARGAS',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '16847593',
    telefono: '3187456329',
    correo: 'milerosney@gmail.com'
  },
  {
    corporacion: 'CONCEJO MUNICIPAL',
    circunscripcion: 'Municipal',
    departamento: DEPARTMENT,
    municipio: 'SANTANDER DE QUILICHAO',
    nombreComuna: 'N/A',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'YAQUELINE TELLO MEJIA',
    genero: 'F',
    estado: 'ELEGIDO',
    cedula: '25167843',
    telefono: '3146789254',
    correo: 'yaquelinetello@outlook.com'
  }
];

// JAL LOCALES ELECTOS MAIS
export const jalElectos: CandidatoElecto[] = [
  {
    corporacion: 'JAL',
    circunscripcion: 'Local',
    departamento: DEPARTMENT,
    municipio: 'INZA',
    nombreComuna: 'HUILA',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'ANTONIO YONDA PECHENE',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '1061782345',
    telefono: '3178946521',
    correo: 'antonioyonda@gmail.com'
  },
  {
    corporacion: 'JAL',
    circunscripcion: 'Local',
    departamento: DEPARTMENT,
    municipio: 'INZA',
    nombreComuna: 'YAQUIVA',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'ROSMIRA CHATE GUEGIA',
    genero: 'F',
    estado: 'ELEGIDO',
    cedula: '25168745',
    telefono: '3187453692',
    correo: 'rosmirachate@mais.org'
  },
  {
    corporacion: 'JAL',
    circunscripcion: 'Local',
    departamento: DEPARTMENT,
    municipio: 'PATIA (EL BORDO)',
    nombreComuna: 'EL ESTRECHO',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'WILSON DAGUA ANACONA',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '16847529',
    telefono: '3207845613',
    correo: 'wilsondagua@gmail.com'
  },
  {
    corporacion: 'JAL',
    circunscripcion: 'Local',
    departamento: DEPARTMENT,
    municipio: 'PAEZ (BELALCAZAR)',
    nombreComuna: 'RICAURTE',
    opcionVoto: 'PREFERENTE',
    codigoPartido: PARTY_CODE,
    nombrePartido: PARTY_NAME,
    nombreCandidato: 'EDGAR YONDA VELASCO',
    genero: 'M',
    estado: 'ELEGIDO',
    cedula: '7658921',
    telefono: '3147896325',
    correo: 'edgaryonda@mais.org'
  }
];

// CONSOLIDADO TOTAL DE CANDIDATOS ELECTOS
export const todosLosCandidatos: CandidatoElecto[] = [
  ...alcaldesElectos,
  ...diputadosElectos,
  ...concejalesElectos,
  ...jalElectos
];

// ESTADÍSTICAS POR CORPORACIÓN
export const estadisticasCandidatos = {
  alcaldes: alcaldesElectos.length,
  diputados: diputadosElectos.length,
  concejales: concejalesElectos.length,
  jal: jalElectos.length,
  total: todosLosCandidatos.length,
  porGenero: {
    masculino: todosLosCandidatos.filter(c => c.genero === 'M').length,
    femenino: todosLosCandidatos.filter(c => c.genero === 'F').length
  },
  porMunicipio: todosLosCandidatos.reduce((acc, candidato) => {
    const municipio = candidato.municipio === 'N/A' ? 'DEPARTAMENTAL' : candidato.municipio;
    acc[municipio] = (acc[municipio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};

export default todosLosCandidatos;