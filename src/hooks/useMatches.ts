import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase, Match } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useMatches() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch matches
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .in('status', ['open', 'active'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // 2. REALTIME SUBSCRIPTION (The Magic)
  useEffect(() => {
    const channel = supabase
      .channel('realtime-matches')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          console.log('Realtime update:', payload);
          // Invalidate query to fetch fresh data from DB
          queryClient.invalidateQueries({ queryKey: ['matches'] });
          queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user?.id]);

  // 3. Create Match
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

  // 4. Cancel Match
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

  // 5. Accept Match
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

  // 6. Settle Match
  const settleMatchMutation = useMutation({
    mutationFn: async ({ matchId, winnerIsHost }: { matchId: string; winnerIsHost: boolean }) => {
      const { data, error } = await supabase.rpc('settle_match_secure', { 
        p_match_id: matchId, 
        p_winner_is_host: winnerIsHost 
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
    matches, 
    isLoading, 
    createMatchMutation, 
    cancelMatchMutation, 
    acceptMatchMutation,
    settleMatchMutation 
  };
}