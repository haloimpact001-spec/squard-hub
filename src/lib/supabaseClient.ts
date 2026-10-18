import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// TypeScript interfaces for our Database Tables
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          is_pro: boolean;
          coins: number;
          streak: number;
          last_login_date: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          is_pro?: boolean;
          coins?: number;
          streak?: number;
          last_login_date?: string | null;
        };
        Update: {
          username?: string;
          is_pro?: boolean;
          coins?: number;
          streak?: number;
          last_login_date?: string | null;
        };
      };
      matches: {
        Row: {
          id: string;
          host_id: string;
          host_username: string;
          game: string;
          wager: number;
          status: 'open' | 'completed' | 'cancelled';
          winner_id: string | null;
          created_at: string;
        };
        Insert: {
          host_id: string;
          host_username: string;
          game: string;
          wager: number;
          status?: 'open' | 'completed' | 'cancelled';
          winner_id?: string | null;
        };
        Update: {
          status?: 'open' | 'completed' | 'cancelled';
          winner_id?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'deposit' | 'wager_lock' | 'payout' | 'reward';
          description: string | null;
          created_at: string;
        };
      };
    };
  };
}

export type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type Match = Tables['matches']['Row'];