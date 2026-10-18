import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useRewards() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const claimDailyRewardMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('claim_daily_reward_secure');
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return { claimDailyRewardMutation };
}