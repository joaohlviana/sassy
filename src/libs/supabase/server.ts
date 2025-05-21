import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as supabaseCreateClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseAnonKey || !supabaseSecretKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseServerClient = supabaseCreateClient(supabaseUrl, supabaseSecretKey)

export async function createClient() {
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: any) {
          await cookieStore.set(name, value, options)
        },
        async remove(name: string, options: any) {
          await cookieStore.delete(name)
        },
      },
    }
  )
}