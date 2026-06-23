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

      router.push('/dashboard');
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
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.base, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${spacing.md} ${spacing.md} ${spacing.xl} ${spacing.md}`, paddingTop: spacing['3xl'], flex: 1 }}>
        <Container size="sm">
          <div style={{ textAlign: 'center', marginBottom: spacing.lg, marginTop: spacing.xl }}>
            <img src="/images/logo.svg" alt="Vemiq" style={{ width: '64px', height: '64px', margin: '0 auto', marginBottom: spacing.md }} />
            <h1 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '30px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Sign in to Vemiq
            </h1>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              color: colors.text.secondary,
            }}>
              Continue your academic writing journey
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

                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  fullWidth
                />

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
                  Sign In
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
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: colors.primary, textDecoration: 'none', fontWeight: '500', transition: 'opacity 0.2s' }}>
                Sign up
              </Link>
            </p>
          </Card>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
