import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseSecretKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseServerClient = supabaseCreateClient(supabaseUrl, supabaseSecretKey);

export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set(name, value, options);
        },
        remove(name, options) {
          cookieStore.set(name, '', options);
        },
      },
    }
  );
}