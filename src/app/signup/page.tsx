'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import { Container, Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
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

      const { data: sessionData } = await supabase.auth.getSession();
      console.log('[SIGNUP] getSession() after signUp:', {
        hasSession: !!sessionData.session,
        sessionUser: sessionData.session?.user?.email
      });

      router.push('/dashboard/profile');
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
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.base, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${spacing.md} ${spacing.md} ${spacing.xl} ${spacing.md}`, paddingTop: spacing['3xl'], flex: 1 }}>
        <Container size="sm">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: spacing.lg, marginTop: spacing.xl }}>
            <img src="/images/logo.svg" alt="Vemiq" style={{ width: '64px', height: '64px', marginBottom: spacing.md }} />
            <h1 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '30px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Create Account
            </h1>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: colors.text.secondary,
            }}>
              Start creating professional reports today
            </p>
          </div>

          <Card style={{ padding: spacing.lg }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing="lg">
                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  fullWidth
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
                  />
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    color: colors.text.secondary,
                    marginTop: spacing.xs,
                  }}>
                    Must be at least 6 characters
                  </p>
                </div>

                {error && (
                  <div style={{
                    padding: spacing.md,
                    backgroundColor: `${colors.danger}1A`,
                    border: `1px solid ${colors.danger}33`,
                    borderRadius: '8px',
                    color: colors.danger,
                    fontSize: '14px',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
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
              </Stack>
            </form>

            <div style={{ marginTop: spacing.lg }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100%', borderTop: `1px solid ${colors.border}` }} />
                </div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <span style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    backgroundColor: colors.background.surface,
                    color: colors.text.secondary,
                    fontSize: '14px',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                isLoading={isGoogleLoading}
                fullWidth
                size="md"
                variant="secondary"
                style={{ marginTop: spacing.md }}
                icon="upload"
                iconPosition="left"
              >
                Google
              </Button>
            </div>

            <p style={{
              marginTop: spacing.lg,
              textAlign: 'center',
              fontSize: '14px',
              color: colors.text.secondary,
              fontFamily: 'system-ui, sans-serif',
            }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500', transition: 'opacity 0.2s' }}>
                Sign in
              </Link>
            </p>
          </Card>

          <p style={{
            marginTop: spacing.lg,
            textAlign: 'center',
            fontSize: '12px',
            color: colors.text.secondary,
            fontFamily: 'system-ui, sans-serif',
          }}>
            By creating an account, you agree to our{' '}
            <Link href="/terms" style={{ color: colors.primary, textDecoration: 'none', transition: 'opacity 0.2s' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" style={{ color: colors.primary, textDecoration: 'none', transition: 'opacity 0.2s' }}>
              Privacy Policy
            </Link>
          </p>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
