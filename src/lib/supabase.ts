import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Profile {
  id: string;
  username?: string;
  email?: string;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserInfo {
  id: string;
  work_hours?: string;
  house_chores?: string[];
  studies?: string;
  gender?: string;
  wake_time?: string;
  sleep_time?: string;
  likes_movies_series?: boolean;
  age?: number;
  weight?: number;
  height?: number;
  daily_water_intake?: number;
  daily_foods?: string[];
  free_hours_per_day?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VerificationCode {
  id: string;
  user_id: string;
  code: string;
  expires_at: string;
  verified: boolean;
  created_at: string;
}
