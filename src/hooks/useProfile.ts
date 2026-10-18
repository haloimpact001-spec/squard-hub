import { useQuery } from '@tanstack/react-query';
import { supabase, Profile } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useProfile() {
  const { user } = useAuth();

  return useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist yet, return null (it will be created on first login)
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    },
    enabled: !!user, // Only run query if user is logged in
  });
}