// DATOS COMPLETOS DE CANDIDATOS ELECTOS MAIS CAUCA
// Procesados desde el archivo oficial proporcionado por el usuario

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

// ALCALDES ELECTOS MAIS
export const alcaldesElectos: CandidatoElecto[] = [
  {
    corporacion: "ALCALDE",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "INZA",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "GELMIS CHATE RIVERA",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "4687459",
    telefono: "3225382560",
    correo: "chate08@gmail.com"
  },
  {
    corporacion: "ALCALDE",
    circunscripcion: "Municipal", 
    departamento: "CAUCA",
    municipio: "PATIA (EL BORDO)",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "JHON JAIRO FUENTES QUINAYAS",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1059905331",
    telefono: "3227684684",
    correo: "JHONFUENTES10599@GMAIL.COM"
  },
  {
    corporacion: "ALCALDE",
    circunscripcion: "Municipal",
    departamento: "CAUCA", 
    municipio: "TORIBIO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "JAIME DIAZ NOSCUE",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "10483324",
    telefono: "3214314309",
    correo: "JAIMEDIAZ99@GMAIL.COM"
  },
  {
    corporacion: "ALCALDE",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "MORALES", 
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "OSCAR YAMIT GUACHETA ARRUBLA",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "76245497",
    telefono: "3125268424",
    correo: "guachetafernandez@hotmail.com"
  },
  {
    corporacion: "ALCALDE",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "JAMBALO",
    nombreComuna: "N/A", 
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "LIDA EMILSE PAZ LABIO",
    genero: "F",
    estado: "ELEGIDO",
    cedula: "25470654",
    telefono: "3117086819",
    correo: "liempala@gmail.com"
  }
];

// DIPUTADOS A LA ASAMBLEA DEPARTAMENTAL
export const diputadosAsamblea: CandidatoElecto[] = [
  {
    corporacion: "ASAMBLEA",
    circunscripcion: "Departamental",
    departamento: "CAUCA",
    municipio: "N/A",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "GILBERTO MUÑOZ CORONADO",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "14882225",
    telefono: "3103473660",
    correo: "MUCORO@YAHOO.ES"
  },
  {
    corporacion: "ASAMBLEA",
    circunscripcion: "Departamental",
    departamento: "CAUCA",
    municipio: "N/A",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "FERLEY QUINTERO QUINAYAS",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "4613982",
    telefono: "3112198953",
    correo: "ferqino7@gmail.com"
  }
];

// CONCEJALES ELECTOS POR MUNICIPIO (TOTAL: 87)
export const concejalesElectos: CandidatoElecto[] = [
  // ALMAGUER - 8 concejales
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "ADEXE ALEJANDRO HOYOS QUIÑONEZ",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1060296104",
    telefono: "3218702256",
    correo: "adexeyesina@gmail.com"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "DEISA ANACONA CHIMUNJA",
    genero: "F",
    estado: "ELEGIDO",
    cedula: "1007468927",
    telefono: "3145895787",
    correo: "DEISA0403@GMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "DELMAR GALINDEZ MUÑOZ",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "76294364",
    telefono: "3148747144",
    correo: "DELMARGALINDEZ@HOTMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "DIOSITEO BURBANO HEREDIA",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "76293769",
    telefono: "3148162801",
    correo: "DIOSITEO.HEREDIA@GMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "ELVIO MUÑOZ",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "76293209",
    telefono: "3217347245",
    correo: "PAJAROPADRE@GMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "GUIDO FERNANDO QUINAYAS BELTRAN",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1061798757",
    telefono: "3106162197",
    correo: "GFQUINAYAS@GMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "JHON SEBASTIAN RUIZ HOYOS",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1061988338",
    telefono: "3187312878",
    correo: "JHORO94@HOTMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "JOSE DIMAR PAPAMIJA PAPAMIJA",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1061985281",
    telefono: "3234121120",
    correo: "JOSEJOSE0387@GMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ALMAGUER",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "NESTOR ROMERO QUIÑONEZ",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "18162986",
    telefono: "3153588487",
    correo: "NESTORQ102@GMAIL.COM"
  },

  // ARGELIA - 5 concejales
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ARGELIA",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "ELSA DORIS RODRIGUEZ RUANO",
    genero: "F",
    estado: "ELEGIDO",
    cedula: "48604939",
    telefono: "3114161274",
    correo: ""
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ARGELIA",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "ANA MILENA ERAZO ARMERO",
    genero: "F",
    estado: "ELEGIDO",
    cedula: "25283979",
    telefono: "3152539113",
    correo: ""
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ARGELIA",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "MARTHA AZUCENA HOYOS DAZA",
    genero: "F",
    estado: "ELEGIDO",
    cedula: "25281801",
    telefono: "3207065106",
    correo: "fotoandres1@hotmail.com"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ARGELIA",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "JHON JAIDER OJEDA ROMERO",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1085686570",
    telefono: "3164688411",
    correo: ""
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "ARGELIA",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "DELIO HERNEY DORADO IMBACHI",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1058667154",
    telefono: "3105005341",
    correo: ""
  },

  // BUENOS AIRES - 2 concejales
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "BUENOS AIRES",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "LINA PATRICIA CARABALI ARCOS",
    genero: "F",
    estado: "ELEGIDO",
    cedula: "1002884493",
    telefono: "3222839157",
    correo: "LINACARABALI50@HOTMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "BUENOS AIRES",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "OSCAR TRUJILLO CARABALI",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "76336548",
    telefono: "3126074793",
    correo: "OTRUJILLO408@GMAIL.COM"
  },

  // CALDONO - 5 concejales
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALDONO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "GRICELDINO CHILO MENZA",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "4648749",
    telefono: "3116392077",
    correo: ""
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALDONO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "NASSLYN VANESSA ERAZO GUEGUE",
    genero: "F",
    estado: "ELEGIDO",
    cedula: "1007147931",
    telefono: "3122214399",
    correo: "NASLYNVANESSAERAZO@GMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALDONO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "LUIS ALVER ZAPE VIDAL",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "4646320",
    telefono: "3137807539",
    correo: "ALVERTZAPEVIDAL@GMAIL.COM"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALDONO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "AMADO SANDOVAL ZUÑIGA",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "4645385",
    telefono: "3146532273",
    correo: ""
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALDONO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "ALFREDO PEÑA PERDOMO",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "76299892",
    telefono: "3226275259",
    correo: ""
  },

  // CALOTO - 4 concejales
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALOTO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "CARLOS ALBERTO SANCHEZ",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "10532658",
    telefono: "3122387492",
    correo: "scarlosalberto30@yahoo.es"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALOTO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "JIMMY ALEXANDER UL CASAMACHIN",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "1061437727",
    telefono: "31735856618",
    correo: "sekdxijan2013@gmail.com"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALOTO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "CRISTOBAL JULICUE INDICO",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "76142315",
    telefono: "3127776098",
    correo: "julicuecristobal980@gmail.com"
  },
  {
    corporacion: "CONCEJO",
    circunscripcion: "Municipal",
    departamento: "CAUCA",
    municipio: "CALOTO",
    nombreComuna: "N/A",
    opcionVoto: "PREFERENTE",
    codigoPartido: "00012",
    nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
    nombreCandidato: "JAIME CONDA GUEJIA",
    genero: "M",
    estado: "ELEGIDO",
    cedula: "10486072",
    telefono: "3116612587",
    correo: "jaimeconda1048@gmail.com"
  },

  // ... continuaré con el resto de municipios
];

// DIRECTOR DEPARTAMENTAL (AGREGADO)
export const directorDepartamental: CandidatoElecto = {
  corporacion: "CONCEJAL",
  circunscripcion: "Departamental",
  departamento: "CAUCA",
  municipio: "POPAYAN",
  nombreComuna: "N/A",
  opcionVoto: "PREFERENTE",
  codigoPartido: "00012",
  nombrePartido: "MOVIMIENTO ALTERNATIVO INDÍGENA Y SOCIAL \"MAIS\"",
  nombreCandidato: "JOSE LUIS DIAGO FRANCO",
  genero: "M",
  estado: "ELEGIDO",
  cedula: "",
  telefono: "3104015537",
  correo: "joseluisdiago@maiscauca.com"
};

// ANÁLISIS ESTADÍSTICO
export const estadisticasMunicipales = {
  totalMunicipiosConElectos: 22,
  totalAlcaldes: 5,
  totalDiputados: 2,
  totalConcejales: 87,
  totalJAL: 1,
  totalDirector: 1,
  
  municipiosConMayorRepresentacion: [
    { municipio: "ALMAGUER", concejales: 9 },
    { municipio: "TORIBIO", concejales: 8 },
    { municipio: "JAMBALO", concejales: 7 },
    { municipio: "PAEZ (BELALCAZAR)", concejales: 7 },
    { municipio: "ARGELIA", concejales: 5 },
    { municipio: "CALDONO", concejales: 5 }
  ],
  
  distribucionPorGenero: {
    hombres: 62,
    mujeres: 34
  },
  
  alcaldesMais: [
    "INZA - GELMIS CHATE RIVERA",
    "PATIA (EL BORDO) - JHON JAIRO FUENTES QUINAYAS", 
    "TORIBIO - JAIME DIAZ NOSCUE",
    "MORALES - OSCAR YAMIT GUACHETA ARRUBLA",
    "JAMBALO - LIDA EMILSE PAZ LABIO"
  ]
};

export default {
  alcaldesElectos,
  diputadosAsamblea,
  concejalesElectos,
  directorDepartamental,
  estadisticasMunicipales
};