import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
