import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  squad_id: string;
  user_id: string;
  content: string;
  is_reported: boolean;
  created_at: string;
  profiles: { username: string };
}

export function useSquadChat(squadId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['chat', squadId],
    queryFn: async () => {
      if (!squadId) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles:profiles(username)')
        .eq('squad_id', squadId)
        .eq('is_reported', false)
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!squadId,
  });

  // Realtime Subscription
  useEffect(() => {
    if (!squadId) return;
    
    const channel = supabase
      .channel(`chat:${squadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `squad_id=eq.${squadId}` },
        () => {
          // Refetch to ensure joined 'profiles' data is included for all users
          queryClient.invalidateQueries({ queryKey: ['chat', squadId] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `squad_id=eq.${squadId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat', squadId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [squadId, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !squadId) throw new Error('Not authenticated');
      const { error } = await supabase.from('messages').insert({
        squad_id: squadId,
        user_id: user.id,
        content: content.trim()
      });
      if (error) throw error;
    },
    // Optimistic update: Makes the message appear instantly for the sender
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ['chat', squadId] });
      const previousMessages = queryClient.getQueryData<Message[]>(['chat', squadId]) || [];
      
      const optimisticMessage: Message = {
        id: 'temp-' + Date.now(),
        squad_id: squadId!,
        user_id: user!.id,
        content: content.trim(),
        is_reported: false,
        created_at: new Date().toISOString(),
        profiles: { username: 'You' } // Temporary display name
      };

      queryClient.setQueryData(['chat', squadId], [...previousMessages, optimisticMessage]);
      return { previousMessages };
    },
    onError: (err, content, context) => {
      // Rollback on error
      queryClient.setQueryData(['chat', squadId], context?.previousMessages);
    },
    onSettled: () => {
      // Ensure UI is perfectly synced with server after send
      queryClient.invalidateQueries({ queryKey: ['chat', squadId] });
    }
  });

  const reportMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase.from('messages').update({ is_reported: true }).eq('id', messageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', squadId] });
    }
  });

  return { messages, isLoading, sendMessageMutation, reportMessageMutation };
}