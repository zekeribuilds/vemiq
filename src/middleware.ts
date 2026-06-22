import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  const protectedRoutes = [
    '/dashboard',
    '/reports',
    '/chat',
    '/logbook',
    '/profile'
  ]

  const isProtected = protectedRoutes.some(r => path.startsWith(r))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if ((path === '/login' || path === '/signup') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/reports/:path*',
    '/chat/:path*',
    '/logbook/:path*',
    '/profile/:path*',
    '/login',
    '/signup'
  ]
}
