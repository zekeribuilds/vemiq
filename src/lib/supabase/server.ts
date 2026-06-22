import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[SERVER CLIENT] Supabase init:', { url: !!url, key: !!key })

  // Safeguard: Fail early with clear error if env vars are missing
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file or Vercel environment variables.')
  }

  const cookieStore = cookies()

  return createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          const store = cookieStore as any
          // Handle both Next.js 14 (sync) and 15 (async) cookies
          if (store && typeof store.get === 'function') {
            return store.get(name)?.value
          }
          return undefined
        },

        set() {
          // NOOP — middleware owns persistence
        },

        remove() {
          // NOOP — middleware owns persistence
        }
      }
    }
  )
}
