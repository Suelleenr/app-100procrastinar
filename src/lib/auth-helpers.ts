import { supabase } from './supabase';

// Gerar código de verificação de 6 dígitos
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Enviar e-mail de verificação
export async function sendVerificationEmail(email: string, code: string) {
  // Aqui você pode integrar com um serviço de e-mail como Resend, SendGrid, etc.
  // Por enquanto, vamos usar a função de e-mail do Supabase
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        verification_code: code,
      },
    },
  });

  if (error) throw error;
}

// Criar código de verificação no banco
export async function createVerificationCode(userId: string, code: string) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expira em 10 minutos

  const { data, error } = await supabase
    .from('verification_codes')
    .insert({
      user_id: userId,
      code,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Verificar código
export async function verifyCode(userId: string, code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('user_id', userId)
    .eq('code', code)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return false;

  // Marcar como verificado
  await supabase
    .from('verification_codes')
    .update({ verified: true })
    .eq('id', data.id);

  return true;
}

// Reenviar código
export async function resendVerificationCode(userId: string, email: string) {
  const code = generateVerificationCode();
  await createVerificationCode(userId, code);
  await sendVerificationEmail(email, code);
  return code;
}
