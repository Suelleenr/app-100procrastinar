'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Criar cliente Supabase no servidor
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUpAction(email: string, password: string, username: string) {
  try {
    // Criar conta no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Erro ao criar usuário' };
    }

    return { 
      success: true, 
      userId: data.user.id,
      email: email 
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao criar conta' };
  }
}

export async function signInAction(identifier: string, password: string) {
  try {
    let email = identifier;
    
    // Se não for email, buscar o email pelo username
    if (!identifier.includes('@')) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();

      if (profileError || !profiles) {
        return { 
          success: false, 
          error: 'Usuário não encontrado. Use seu email para fazer login.' 
        };
      }

      email = profiles.email;
    }

    // Fazer login com email
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { 
        success: false, 
        error: 'Email ou senha incorretos.' 
      };
    }

    return { 
      success: true,
      session: data.session 
    };
  } catch (error: any) {
    return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
  }
}
