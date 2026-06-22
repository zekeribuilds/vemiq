import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[BROWSER CLIENT] Supabase init:', { url: !!url, key: !!key })

  // Safeguard: Fail early with clear error if env vars are missing
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file or Vercel environment variables.')
  }

  return createBrowserClient(url, key)
}
