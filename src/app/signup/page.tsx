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

export default function SignupPage() {
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
      console.log('[SIGNUP] Starting signUp for email:', email);
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('[SIGNUP] signUp response:', { 
        hasUser: !!data.user, 
        hasSession: !!data.session, 
        error: error?.message,
        user: data.user?.email,
        sessionExpires: data.session?.expires_at
      });

      if (error) throw error;

      // Check session immediately
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('[SIGNUP] getSession() after signUp:', {
        hasSession: !!sessionData.session,
        sessionUser: sessionData.session?.user?.email
      });

      // Redirect to onboarding page
      router.push('/onboarding');
    } catch (err: any) {
      console.error('[SIGNUP] Sign up error:', err);
      if (err.message.includes('Missing Supabase environment variables')) {
        setError('Supabase configuration is missing. Please check your .env.local file.');
      } else if (err.message.includes('must start with https://')) {
        setError('Supabase URL must start with https://. Please check your .env.local file.');
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to connect to Supabase. Please check your internet connection and Supabase project status.');
      } else if (err.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.message.includes('Password should be at least')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError(err.message || 'An error occurred during sign up');
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
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <img src="/images/logo.svg" alt="Vemiq" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-semibold text-[#FFFFFF] mb-2">Create Account</h1>
          <p className="text-sm text-[#898989]">Start creating professional reports today</p>
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

            <div>
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                fullWidth
                leftIcon={<LockIcon size={16} />}
              />
              <p className="text-xs text-[#898989] mt-1">Must be at least 6 characters</p>
            </div>

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
              Create Account
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
            Already have an account?{' '}
            <Link href="/login" className="text-[#6C63FF] hover:opacity-80 font-medium transition-opacity">
              Sign in
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center text-xs text-[#898989]">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-[#6C63FF] hover:opacity-80 transition-opacity">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-[#6C63FF] hover:opacity-80 transition-opacity">
            Privacy Policy
          </Link>
        </p>
      </div>
      </div>
      <Footer />
    </div>
  );
}
