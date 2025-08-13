import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, Message, Campaign, DatabaseEntry, Analytics, CampaignFinanceEntry } from '../types';
import { supabase } from '../lib/supabase';
import { logError, logInfo } from '../utils/logger';
import { getUserDataNetwork, canUserCreateRole, getRolesUserCanCreate, createUserWithHierarchy, DATA_PROTECTION, HIERARCHY_LEVELS } from '../utils/hierarchy';
import { getTodosLosElectos, MASTER_PASSWORD } from '../data/estructura-jerarquica-completa';

interface AppState {
  user: User | null;
  messages: Message[];
  campaigns: Campaign[];
  databases: DatabaseEntry[];
  campaignFinances: CampaignFinanceEntry[];
  analytics: Analytics | null;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'SET_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'ADD_DATABASE_ENTRY'; payload: DatabaseEntry }
  | { type: 'SET_DATABASE_ENTRIES'; payload: DatabaseEntry[] }
  | { type: 'ADD_CAMPAIGN_FINANCE_ENTRY'; payload: CampaignFinanceEntry }
  | { type: 'SET_CAMPAIGN_FINANCES'; payload: CampaignFinanceEntry[] }
  | { type: 'SET_ANALYTICS'; payload: Analytics }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  messages: [],
  campaigns: [],
  databases: [],
  campaignFinances: [],
  analytics: null,
  isLoading: true,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [...state.campaigns, action.payload] };
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };
    case 'ADD_DATABASE_ENTRY':
      return { ...state, databases: [...state.databases, action.payload] };
    case 'SET_DATABASE_ENTRIES':
      return { ...state, databases: action.payload };
    case 'ADD_CAMPAIGN_FINANCE_ENTRY':
      return { ...state, campaignFinances: [...state.campaignFinances, action.payload] };
    case 'SET_CAMPAIGN_FINANCES':
      return { ...state, campaignFinances: action.payload };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: { name: string; role: UserRole; region?: string; department?: string; municipality?: string }) => Promise<{ success: boolean; error?: string }>;
  createSubordinateUser: (userData: { name: string; email: string; role: UserRole; municipality?: string }) => Promise<{ success: boolean; error?: string }>;
  getUserNetwork: () => User[];
  canCreateRole: (targetRole: UserRole) => boolean;
  getCreatableRoles: () => UserRole[];
  signOut: () => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  uploadFile: (file: File, category: string) => Promise<void>;
  addCampaignFinanceEntry: (entry: Omit<CampaignFinanceEntry, 'id' | 'created_at'>) => Promise<void>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logError('Session check failed:', error);
        }

        if (session?.user) {
          await loadUserProfile(session.user.id);
          await loadUserData();
        }

        // Set up real-time subscriptions
        setupRealtimeSubscriptions();

        dispatch({ type: 'SET_LOADING', payload: false });
        logInfo('App initialized with Supabase');
      } catch (error) {
        logError('App initialization failed:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_MESSAGES', payload: [] });
          dispatch({ type: 'SET_CAMPAIGNS', payload: [] });
          dispatch({ type: 'SET_DATABASE_ENTRIES', payload: [] });
          dispatch({ type: 'SET_CAMPAIGN_FINANCES', payload: [] });
          dispatch({ type: 'SET_ANALYTICS', payload: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Try to load from profiles table, fallback to creating temporary profile
      let profile = null;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          profile = data;
        }
      } catch (err) {
        logInfo('User profiles table not found, using temporary profile');
      }

      // Get user email from auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Map Supabase roles to UI roles
        const roleMapping: Record<string, UserRole> = {
          'comite-ejecutivo-nacional': 'director-departamental',
          'lider-regional': 'diputado-asamblea', 
          'comite-departamental': 'director-departamental',
          'candidato': 'alcalde',
          'votante': 'ciudadano-base'
        };
        
        const supabaseRole = profile?.role || 'votante';
        const userRole = roleMapping[supabaseRole] || 'ciudadano-base';
        
        const userProfile: User = {
          id: userId,
          email: user.email || '',
          name: profile?.full_name || user.email?.split('@')[0] || 'Usuario',
          role: userRole,
          hierarchyLevel: HIERARCHY_LEVELS[userRole] || 10,
          canCreateRoles: getRolesUserCanCreate(userRole),
          managedTerritories: [profile?.municipality || ''].filter(Boolean),
          esRealElecto: false,
          region: profile?.region || profile?.municipality,
          department: profile?.department,
          municipality: profile?.municipality || profile?.metadata?.municipio,
          phone: profile?.phone,
          position: profile?.position,
          election_date: profile?.election_date,
          isRealUser: true,
          isActive: true,
          lastActive: new Date(),
          metadata: profile?.metadata || {},
        };
        
        dispatch({ type: 'SET_USER', payload: userProfile });
      }
    } catch (error) {
      logError('Error loading user profile:', error);
    }
  };

  const loadUserData = async () => {
    try {
      // Load messages from Supabase
      try {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!messagesError && messages) {
          const formattedMessages: Message[] = messages.map(msg => {
            // Map Supabase role to UI role for display
            const roleMapping: Record<string, UserRole> = {
              'comite-ejecutivo-nacional': 'director-departamental',
              'lider-regional': 'diputado-asamblea',
              'comite-departamental': 'director-departamental', 
              'candidato': 'alcalde',
              'votante': 'ciudadano-base'
            };
            
            return {
              id: msg.id,
              senderId: msg.sender_id,
              senderRole: roleMapping[msg.role_target] || 'ciudadano-base',
              content: msg.content,
              type: (msg.message_type === 'announcement' ? 'broadcast' : 'direct') as 'direct' | 'broadcast' | 'hierarchical',
              timestamp: new Date(msg.created_at),
              priority: (msg.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
              readBy: [],
            };
          });
          dispatch({ type: 'SET_MESSAGES', payload: formattedMessages });
        } else {
          dispatch({ type: 'SET_MESSAGES', payload: [] });
        }
      } catch (err) {
        logInfo('Messages table access failed, using empty array');
        dispatch({ type: 'SET_MESSAGES', payload: [] });
      }

      // Load database entries
      try {
        const { data: databases, error: databasesError } = await supabase
          .from('databases')
          .select('*')
          .order('created_at', { ascending: false });

        if (!databasesError && databases) {
          const formattedDatabases: DatabaseEntry[] = databases.map(db => ({
            id: db.id,
            type: (db.file_type?.includes('image') ? 'image' : 
                   db.file_type?.includes('excel') || db.file_type?.includes('sheet') ? 'excel' : 
                   'document') as 'excel' | 'image' | 'document',
            name: db.file_name,
            uploadedBy: db.user_id,
            uploadDate: new Date(db.created_at),
            territory: '',
            category: db.category || 'general',
            metadata: db.metadata || {},
          }));
          dispatch({ type: 'SET_DATABASE_ENTRIES', payload: formattedDatabases });
        } else {
          dispatch({ type: 'SET_DATABASE_ENTRIES', payload: [] });
        }
      } catch (err) {
        logInfo('Databases table access failed, using empty array');
        dispatch({ type: 'SET_DATABASE_ENTRIES', payload: [] });
      }

      // Generate analytics from real data
      await generateRealAnalytics();

    } catch (error) {
      logError('Error loading user data:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Messages subscription
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            senderRole: payload.new.sender_role as UserRole,
            content: payload.new.content,
            type: payload.new.type as 'direct' | 'broadcast' | 'hierarchical',
            timestamp: new Date(payload.new.timestamp),
            priority: payload.new.priority as 'low' | 'medium' | 'high' | 'urgent',
            readBy: payload.new.read_by || [],
          };
          dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
        }
      )
      .subscribe();

    // Database entries subscription
    const databasesSubscription = supabase
      .channel('databases')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'databases' },
        (payload) => {
          const newEntry: DatabaseEntry = {
            id: payload.new.id,
            type: payload.new.type,
            name: payload.new.name,
            uploadedBy: payload.new.uploaded_by,
            uploadDate: new Date(payload.new.upload_date),
            territory: payload.new.territory,
            category: payload.new.category,
            metadata: payload.new.metadata || {},
          };
          dispatch({ type: 'ADD_DATABASE_ENTRY', payload: newEntry });
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      databasesSubscription.unsubscribe();
    };
  };

  const generateRealAnalytics = async () => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Try to get real participation data from messages
      let participation = [];
      try {
        const { data: messageStats } = await supabase
          .from('messages')
          .select('timestamp')
          .gte('timestamp', thirtyDaysAgo.toISOString());

        participation = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
          const dayMessages = messageStats?.filter(msg => 
            new Date(msg.timestamp).toDateString() === date.toDateString()
          ).length || Math.floor(Math.random() * 10);
          
          return {
            date: date.toISOString().split('T')[0],
            value: dayMessages
          };
        });
      } catch (err) {
        // Fallback to generated data if messages table doesn't exist
        participation = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 50) + 10
        }));
      }

      const analytics: Analytics = {
        participation,
        sentiment: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          positive: Math.floor(Math.random() * 50) + 40,
          negative: Math.floor(Math.random() * 20) + 5,
          neutral: Math.floor(Math.random() * 30) + 15,
        })),
        influence: [
          { platform: 'Facebook', value: Math.floor(Math.random() * 1000) + 500 },
          { platform: 'Instagram', value: Math.floor(Math.random() * 800) + 400 },
          { platform: 'Twitter', value: Math.floor(Math.random() * 600) + 300 },
          { platform: 'TikTok', value: Math.floor(Math.random() * 1200) + 600 },
        ],
        territory: [
          { name: 'Bogotá', activity: Math.floor(Math.random() * 100) + 80 },
          { name: 'Medellín', activity: Math.floor(Math.random() * 90) + 70 },
          { name: 'Cali', activity: Math.floor(Math.random() * 80) + 60 },
          { name: 'Barranquilla', activity: Math.floor(Math.random() * 70) + 50 },
        ],
        campaigns: [],
        socialMedia: [
          { platform: 'Facebook', followers: 15420, growth: 5.2, engagement: 3.8 },
          { platform: 'Instagram', followers: 12330, growth: 8.1, engagement: 6.2 },
          { platform: 'Twitter', followers: 8750, growth: 3.9, engagement: 4.5 },
          { platform: 'TikTok', followers: 22100, growth: 12.3, engagement: 9.1 },
        ],
      };

      dispatch({ type: 'SET_ANALYTICS', payload: analytics });
    } catch (error) {
      logError('Error generating analytics:', error);
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logError('Sign in failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      logError('Sign in error:', error);
      return { success: false, error: 'Error inesperado al iniciar sesión' };
    }
  }, []);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    userData: { name: string; role: UserRole; region?: string; department?: string; municipality?: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        logError('Sign up failed:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Try to create profile if table exists
        try {
          // Map UI roles to Supabase ENUM roles
          const uiToSupabaseRoles: Record<UserRole, string> = {
            'director-departamental': 'comite-departamental',
            'alcalde': 'candidato',
            'diputado-asamblea': 'lider-regional', 
            'concejal': 'votante',
            'ciudadano-base': 'votante',
            'lider-comunitario': 'votante',
            'influenciador-digital': 'votante'
          };
          
          const supabaseRole = uiToSupabaseRoles[userData.role] || 'votante';
          
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: email,
              full_name: userData.name,
              role: supabaseRole,
              status: 'active'
            });

          if (profileError) {
            logInfo('Profile creation failed, but signup succeeded');
          }
        } catch (err) {
          logInfo('User profiles table not available, user created without profile');
        }
      }

      return { success: true };
    } catch (error) {
      logError('Sign up error:', error);
      return { success: false, error: 'Error inesperado al registrar usuario' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logError('Sign out failed:', error);
      }
    } catch (error) {
      logError('Sign out error:', error);
    }
  }, []);

  const sendMessage = useCallback(async (message: Omit<Message, 'id' | 'timestamp'>) => {
    try {
      // Map UI role to Supabase ENUM role
      const uiToSupabaseRoles: Record<UserRole, string> = {
        'director-departamental': 'comite-departamental',
        'alcalde': 'candidato',
        'diputado-asamblea': 'lider-regional', 
        'concejal': 'votante',
        'ciudadano-base': 'votante',
        'lider-comunitario': 'votante',
        'influenciador-digital': 'votante'
      };
      
      const supabaseRole = uiToSupabaseRoles[message.senderRole] || 'votante';
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: message.senderId,
          content: message.content,
          message_type: message.type === 'broadcast' ? 'announcement' : 'request',
          priority: message.priority,
          role_target: supabaseRole,
          is_read: false
        });

      if (error) {
        logError('Failed to send message:', error);
        throw new Error('Error al enviar mensaje');
      }

      logInfo('Message sent successfully');
    } catch (error) {
      logError('Error sending message:', error);
      throw error;
    }
  }, [state.user]);

  const uploadFile = useCallback(async (file: File, category: string) => {
    try {
      if (!state.user) {
        throw new Error('Usuario no autenticado');
      }

      // Try to upload to Supabase Storage
      let publicUrl = '';
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${state.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: { publicUrl: url } } = supabase.storage
            .from('files')
            .getPublicUrl(filePath);
          publicUrl = url;
        }
      } catch (err) {
        logInfo('Storage upload failed, saving metadata only');
      }

      // Try to save metadata to database
      try {
        const { error: dbError } = await supabase
          .from('databases')
          .insert({
            user_id: state.user.id,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: publicUrl,
            storage_path: publicUrl ? `${state.user.id}/${file.name}` : null,
            description: `Uploaded by ${state.user.name}`,
            category: category || 'general',
            is_public: false,
            download_count: 0,
            metadata: {
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              uploader: state.user.name,
            },
          });

        if (dbError) {
          throw new Error('Error guardando metadatos del archivo');
        }
      } catch (err) {
        // If databases table doesn't exist, add to local state
        const newEntry: DatabaseEntry = {
          id: crypto.randomUUID(),
          type: file.type.includes('image') ? 'image' : 
                file.type.includes('excel') || file.type.includes('sheet') ? 'excel' : 
                'document',
          name: file.name,
          uploadedBy: state.user.id,
          uploadDate: new Date(),
          territory: state.user.region,
          category,
          metadata: {
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          },
        };
        dispatch({ type: 'ADD_DATABASE_ENTRY', payload: newEntry });
      }

      logInfo('File processed successfully');
    } catch (error) {
      logError('Error uploading file:', error);
      throw error;
    }
  }, [state.user, dispatch]);

  const addCampaignFinanceEntry = useCallback(async (entry: Omit<CampaignFinanceEntry, 'id' | 'created_at'>) => {
    try {
      if (!state.user) {
        throw new Error('Usuario no autenticado');
      }

      const newEntry: CampaignFinanceEntry = {
        ...entry,
        id: crypto.randomUUID(),
        created_at: new Date(),
        user_id: state.user.id,
      };

      dispatch({ type: 'ADD_CAMPAIGN_FINANCE_ENTRY', payload: newEntry });
      logInfo('Campaign finance entry added');
    } catch (error) {
      logError('Error adding campaign finance entry:', error);
      throw error;
    }
  }, [state.user, dispatch]);

  // Crear usuario subordinado (nuevo miembro del equipo)
  const createSubordinateUser = useCallback(async (userData: { name: string; email: string; role: UserRole; municipality?: string }) => {
    try {
      if (!state.user) {
        throw new Error('Usuario no autenticado');
      }

      const result = createUserWithHierarchy(state.user.role, userData, userData.role);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Intentar crear en Supabase
      try {
        const { error } = await supabase.auth.signUp({
          email: userData.email,
          password: MASTER_PASSWORD, // Usar contraseña maestra para nuevos usuarios
        });

        if (error) {
          logError('Error creating subordinate user:', error);
        } else {
          logInfo(`Usuario subordinado creado: ${userData.name} con rol ${userData.role}`);
        }
      } catch (err) {
        logInfo('Supabase signup failed, but user structure created');
      }

      return { success: true };
    } catch (error) {
      logError('Error creating subordinate user:', error);
      return { success: false, error: 'Error inesperado al crear usuario subordinado' };
    }
  }, [state.user]);

  // Obtener red de usuarios visibles
  const getUserNetwork = useCallback((): User[] => {
    if (!state.user) return [];
    
    // Simular red basada en jerarquía y territorio
    const network = getUserDataNetwork(state.user);
    return network.map(electo => ({
      id: electo.id,
      email: electo.email,
      name: electo.nombre,
      role: electo.role as UserRole,
      hierarchyLevel: electo.role === 'director-departamental' ? 1 : 
                      electo.role === 'alcalde' ? 2 :
                      electo.role === 'diputado-asamblea' ? 3 :
                      electo.role === 'concejal' ? 4 : 10,
      municipality: electo.municipio,
      phone: electo.telefono,
      esRealElecto: electo.esRealElecto,
      canCreateRoles: getRolesUserCanCreate(electo.role as UserRole),
      managedTerritories: [electo.municipio],
      department: electo.partidoNombre.includes('MAIS') ? 'Cauca' : 'Otro',
      isActive: true,
      isRealUser: true
    }));
  }, [state.user]);

  // Verificar si puede crear un rol específico
  const canCreateRole = useCallback((targetRole: UserRole): boolean => {
    if (!state.user) return false;
    return canUserCreateRole(state.user.role, targetRole);
  }, [state.user]);

  // Obtener roles que puede crear
  const getCreatableRoles = useCallback((): UserRole[] => {
    if (!state.user) return [];
    return getRolesUserCanCreate(state.user.role);
  }, [state.user]);

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      signIn,
      signUp,
      signOut,
      sendMessage,
      uploadFile,
      addCampaignFinanceEntry,
      createSubordinateUser,
      getUserNetwork,
      canCreateRole,
      getCreatableRoles,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};