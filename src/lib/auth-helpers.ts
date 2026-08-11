import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Verifies that the user is authenticated and returns the user ID.
 * Throws an error if authentication fails.
 */
export async function requireAuth(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  return user.id;
}

/**
 * Middleware helper for API routes that require authentication.
 * Returns an error response if not authenticated, or continues with the user ID.
 */
export async function withAuth(handler: (userId: string, request: Request) => Promise<Response>): Promise<Response> {
  try {
    const userId = await requireAuth();
    return await handler(userId, new Request('', {}));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication required' },
      { status: 401 }
    );
  }
}