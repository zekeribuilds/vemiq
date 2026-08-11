'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MailIcon, LockIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import { createClient } from '@/lib/supabase/browser';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError('');

    try {
      console.log('[LOGIN] Starting signInWithPassword for email:', email);
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[LOGIN RESULT]', {
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        sessionExpires: data?.session?.expires_at,
        error
      });

      if (error) throw error;

      const sessionResult = await supabase.auth.getSession();
      console.log('[SESSION AFTER LOGIN]', {
        hasSession: !!sessionResult.data.session,
        userEmail: sessionResult.data.session?.user?.email
      });

      // Redirect to home - middleware will validate session
      router.push('/home');
    } catch (err: any) {
      console.error('[LOGIN] Sign in error:', err);
      if (err.message.includes('Missing Supabase environment variables')) {
        setError('Supabase configuration is missing. Please check your .env.local file.');
      } else if (err.message.includes('must start with https://')) {
        setError('Supabase URL must start with https://. Please check your .env.local file.');
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to connect to Supabase. Please check your internet connection and Supabase project status.');
      } else if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please check your credentials or sign up for an account.');
      } else {
        setError(err.message || 'An error occurred during sign in');
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.message.includes('Provider is not enabled')) {
        setError('Google sign-in is not enabled. Please contact the administrator.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to Google. Please check your internet connection.');
      } else {
        setError(err.message || 'An error occurred during Google sign in');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-8 pt-24 flex-1">
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <img src="/images/logo.svg" alt="Vemiq" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-[#FFFFFF] mb-2">Sign in to Vemiq</h1>
          <p className="text-sm text-[#898989]">Continue your academic writing journey</p>
        </div>

        <Card className="p-6 bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              fullWidth
              leftIcon={<MailIcon size={16} />}
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              fullWidth
              leftIcon={<LockIcon size={16} />}
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isEmailLoading}
              isLoading={isEmailLoading}
              fullWidth
              size="md"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2A2A]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1F1F1F] text-[#898989]">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
              fullWidth
              size="md"
              variant="secondary"
              className="mt-4"
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-[#898989]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#6C63FF] hover:opacity-80 font-medium transition-opacity">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  );
}
