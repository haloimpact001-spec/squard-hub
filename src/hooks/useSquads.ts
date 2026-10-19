import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export interface Squad {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  members: {
    user_id: string;
    profiles: {
      username: string;
      coins: number;
    };
  }[];
}

export function useMySquad() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: squad, isLoading } = useQuery<Squad | null>({
    queryKey: ['mySquad', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // First, find if the user is in any squad
      const { data: membership, error: memError } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('user_id', user.id)
        .single();

      if (memError || !membership) return null;

      // Fetch the squad details and all members with their profiles
      const { data, error } = await supabase
        .from('squads')
        .select(`
          id, name, invite_code, created_by,
          members:squad_members!inner(
            user_id,
            profiles:profiles!inner(username, coins)
          )
        `)
        .eq('id', membership.squad_id)
        .single();

      if (error) throw error;
      return data as unknown as Squad;
    },
    enabled: !!user,
  });

  const createSquadMutation = useMutation({
    mutationFn: async (squadName: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: squad, error: squadError } = await supabase
        .from('squads')
        .insert({ name: squadName, invite_code: inviteCode, created_by: user.id })
        .select()
        .single();

      if (squadError) throw squadError;

      const { error: memberError } = await supabase
        .from('squad_members')
        .insert({ squad_id: squad.id, user_id: user.id });

      if (memberError) throw memberError;
      return squad;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySquad'] });
    },
  });

  const joinSquadMutation = useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data: squad, error: squadError } = await supabase
        .from('squads')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (squadError) throw new Error('Invalid invite code');

      const { error: memberError } = await supabase
        .from('squad_members')
        .insert({ squad_id: squad.id, user_id: user.id });

      if (memberError) {
        if (memberError.code === '23505') throw new Error('You are already in a squad');
        throw memberError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySquad'] });
    },
  });

  const leaveSquadMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('squad_members')
        .delete()
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySquad'] });
    },
  });

  return { squad, isLoading, createSquadMutation, joinSquadMutation, leaveSquadMutation };
}