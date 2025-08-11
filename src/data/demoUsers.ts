import { User, UserRole } from '../types';

// Usuarios Reales Nacionales (Administradores)
export const realAdminUsers: User[] = [
  {
    id: 'real-admin-001',
    email: 'dalopez56740@gmail.com',
    name: 'Diego Alexander López',
    role: 'comite-ejecutivo-nacional' as UserRole,
    region: 'Nacional',
    department: 'Administración Central',
    joinedAt: new Date('2024-01-01'),
    lastActive: new Date(),
    isActive: true,
    isRealUser: true,
    canCreateRoles: true
  },
  {
    id: 'real-admin-002',
    email: 'bastianvalenciago@gmail.com',
    name: 'Bastián Valencia Gómez',
    role: 'comite-ejecutivo-nacional' as UserRole,
    region: 'Nacional',
    department: 'Administración Central',
    joinedAt: new Date('2024-01-01'),
    lastActive: new Date(),
    isActive: true,
    isRealUser: true,
    canCreateRoles: true
  }
];

export const demoUsers: User[] = [
  // 1. Comité Ejecutivo Nacional (Máximo nivel)
  {
    id: 'demo-cen-001',
    email: 'presidente@mais.com',
    name: 'Ana María Rodríguez',
    role: 'comite-ejecutivo-nacional' as UserRole,
    region: 'Nacional',
    department: 'Todo el país',
    joinedAt: new Date('2024-01-15'),
    lastActive: new Date(),
    isActive: true
  },
  
  // 2. Líder Regional
  {
    id: 'demo-lr-001',
    email: 'region.pacifico@mais.com',
    name: 'Carlos Eduardo Vargas',
    role: 'lider-regional' as UserRole,
    region: 'Región Pacífico',
    department: 'Valle del Cauca',
    joinedAt: new Date('2024-02-01'),
    lastActive: new Date(),
    isActive: true
  },
  
  // 3. Comité Departamental
  {
    id: 'demo-cd-001',
    email: 'cundinamarca@mais.com',
    name: 'María Fernanda López',
    role: 'comite-departamental' as UserRole,
    region: 'Región Central',
    department: 'Cundinamarca',
    joinedAt: new Date('2024-02-10'),
    lastActive: new Date(),
    isActive: true
  },
  
  // 4. Candidato
  {
    id: 'demo-cand-001',
    email: 'candidato.alcalde@mais.com',
    name: 'Roberto Alejandro Herrera',
    role: 'candidato' as UserRole,
    region: 'Región Central',
    department: 'Cundinamarca',
    joinedAt: new Date('2024-03-01'),
    lastActive: new Date(),
    isActive: true
  },
  
  // 5. Influenciador Digital
  {
    id: 'demo-inf-001',
    email: 'social.media@mais.com',
    name: 'Valentina García Morales',
    role: 'influenciador' as UserRole,
    region: 'Región Andina',
    department: 'Antioquia',
    joinedAt: new Date('2024-03-15'),
    lastActive: new Date(),
    isActive: true
  },
  
  // 6. Líder Comunitario
  {
    id: 'demo-lc-001',
    email: 'lider.comunidad@mais.com',
    name: 'José Manuel Torres',
    role: 'lider' as UserRole,
    region: 'Región Caribe',
    department: 'Bolívar',
    joinedAt: new Date('2024-04-01'),
    lastActive: new Date(),
    isActive: true
  },
  
  // 7. Votante/Simpatizante
  {
    id: 'demo-vot-001',
    email: 'ciudadano@mais.com',
    name: 'Lucía Isabel Martínez',
    role: 'votante' as UserRole,
    region: 'Región Amazónica',
    department: 'Caquetá',
    joinedAt: new Date('2024-04-15'),
    lastActive: new Date(),
    isActive: true
  }
];

export const getDemoUserByRole = (role: UserRole): User => {
  const user = demoUsers.find(u => u.role === role);
  if (!user) {
    return demoUsers[demoUsers.length - 1]; // Default to votante
  }
  return user;
};

export const getRealAdminCredentials = () => {
  return [
    {
      role: 'comite-ejecutivo-nacional' as UserRole,
      name: 'Diego Alexander López',
      email: 'dalopez56740@gmail.com',
      password: 'MAIS2024!Admin',
      description: '🏛️ Administrador Nacional - Acceso Real Completo',
      isRealUser: true
    },
    {
      role: 'comite-ejecutivo-nacional' as UserRole,
      name: 'Bastián Valencia Gómez',
      email: 'bastianvalenciago@gmail.com',
      password: 'MAIS2024!Admin',
      description: '🏛️ Administrador Nacional - Acceso Real Completo',
      isRealUser: true
    }
  ];
};

export const getDemoCredentials = () => {
  return [
    {
      role: 'comite-ejecutivo-nacional' as UserRole,
      name: 'Ana María Rodríguez',
      email: 'presidente@mais.com',
      password: 'demo123',
      description: '🏛️ Comité Ejecutivo Nacional - Control total del sistema'
    },
    {
      role: 'lider-regional' as UserRole,
      name: 'Carlos Eduardo Vargas',
      email: 'region.pacifico@mais.com',
      password: 'demo123',
      description: '🗺️ Líder Regional - Gestión territorial múltiple'
    },
    {
      role: 'comite-departamental' as UserRole,
      name: 'María Fernanda López',
      email: 'cundinamarca@mais.com',
      password: 'demo123',
      description: '🏢 Comité Departamental - Operaciones locales'
    },
    {
      role: 'candidato' as UserRole,
      name: 'Roberto Alejandro Herrera',
      email: 'candidato.alcalde@mais.com',
      password: 'demo123',
      description: '📢 Candidato - Gestión de campaña personal'
    },
    {
      role: 'influenciador' as UserRole,
      name: 'Valentina García Morales',
      email: 'social.media@mais.com',
      password: 'demo123',
      description: '📱 Influenciador Digital - Redes sociales y contenido'
    },
    {
      role: 'lider' as UserRole,
      name: 'José Manuel Torres',
      email: 'lider.comunidad@mais.com',
      password: 'demo123',
      description: '👥 Líder Comunitario - Movilización local'
    },
    {
      role: 'votante' as UserRole,
      name: 'Lucía Isabel Martínez',
      email: 'ciudadano@mais.com',
      password: 'demo123',
      description: '🗳️ Votante/Simpatizante - Participación ciudadana'
    }
  ];
};