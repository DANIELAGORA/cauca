// HOOK DE AUTENTICACIÓN PARA SUPABASE
// Maneja el estado de autenticación del usuario actual

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../contexts/AppContext';

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user
  };
}