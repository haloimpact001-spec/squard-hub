import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { trackEvent } from '../lib/analytics';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  video_link: string | null;
  created_at: string;
  profiles: {
    username: string;
  };
}

export function useFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch posts
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          content,
          video_link,
          created_at,
          profiles:profiles(username)
        `)
        .order('created_at', { ascending: false })
        .limit(50); // Keep it fast and light

      if (error) throw error;
      return data as Post[];
    },
  });

  // Create a new post
  const createPostMutation = useMutation({
    mutationFn: async ({ content, videoLink }: { content: string; videoLink: string }) => {
      if (!user) throw new Error('You must be logged in to post');
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          video_link: videoLink.trim() || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      trackEvent('post_created');
    },
  });

  return { posts, isLoading, createPostMutation };
}