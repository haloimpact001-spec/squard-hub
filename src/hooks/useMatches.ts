import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase, Match } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useMatches() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .in('status', ['open', 'active', 'pending_confirmation'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('realtime-matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        queryClient.invalidateQueries({ queryKey: ['matches'] });
        queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient, user?.id]);

  const createMatchMutation = useMutation({
    mutationFn: async ({ game, wager }: { game: string; wager: number }) => {
      const { data, error } = await supabase.rpc('create_match_secure', { p_game: game, p_wager: wager });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const cancelMatchMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase.rpc('cancel_match_secure', { p_match_id: matchId });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const acceptMatchMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase.rpc('accept_match_secure', { p_match_id: matchId });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  // NEW: Host declares they won
  const declareWinnerMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase.rpc('declare_winner_secure', { 
        p_match_id: matchId, 
        p_winner_is_host: true 
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });

  // NEW: Challenger confirms or disputes
  const resolveMatchMutation = useMutation({
    mutationFn: async ({ matchId, action }: { matchId: string; action: 'confirm' | 'dispute' }) => {
      const { data, error } = await supabase.rpc('resolve_match_secure', { 
        p_match_id: matchId, 
        p_action: action 
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return { 
    matches, isLoading, createMatchMutation, cancelMatchMutation, 
    acceptMatchMutation, declareWinnerMutation, resolveMatchMutation 
  };
}