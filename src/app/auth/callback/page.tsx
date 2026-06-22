'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      try {
        console.log('[CALLBACK] Starting OAuth callback flow...');
        const supabase = createClient();

        // Exchange code for session - OAuth stability pattern
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.search
        );

        if (error) {
          console.error('[CALLBACK] exchangeCodeForSession error:', error);
          router.replace('/login');
          return;
        }

        console.log('[CALLBACK] Session exchanged successfully:', {
          hasSession: !!data.session,
          userEmail: data.session?.user?.email
        });

        // Let middleware handle redirect naturally
        // This prevents race conditions
        router.replace('/dashboard');
      } catch (error) {
        console.error('[CALLBACK] Auth callback error:', error);
        router.replace('/login');
      }
    };

    finishLogin();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
