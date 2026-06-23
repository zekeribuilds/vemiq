'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import { Container, Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import { createClient } from '@/lib/supabase/browser';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    if (!accessToken) {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const accessToken = searchParams.get('access_token');

      if (!accessToken) {
        throw new Error('Invalid reset link');
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setIsSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.message.includes('Invalid JWT')) {
        setError('Invalid or expired reset link. Please request a new password reset.');
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to connect to Supabase. Please check your internet connection.');
      } else {
        setError(err.message || 'An error occurred resetting password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.base, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: spacing.md, position: 'relative', overflow: 'hidden' }}>
      <Container size="sm">
        <div style={{ marginBottom: spacing.xl }}>
          <a href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, textDecoration: 'none', transition: 'color 0.2s' }}>
            <div style={{ color: colors.text.secondary }}>
              <VemiqIcon category="action" name="close" size={20} />
            </div>
            Back to login
          </a>
        </div>

        <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: `${colors.primary}1A`,
            color: colors.primary,
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: spacing.lg,
          }}>
            <div style={{ color: colors.primary }}>
              <VemiqIcon category="status" name="sparkles" size={16} />
            </div>
            <span>New Password</span>
          </div>
          <h1 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '36px',
            fontWeight: '700',
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}>
            Set New Password
          </h1>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            color: colors.text.secondary,
          }}>
            {isSuccess
              ? 'Password updated successfully'
              : 'Enter your new password below'}
          </p>
        </div>

        <Card style={{ padding: spacing.xl }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: `${spacing.xl} 0` }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: colors.success,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.lg,
              }}>
                <div style={{ color: colors.text.primary }}>
                  <VemiqIcon category="status" name="success" size={36} />
                </div>
              </div>
              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '20px',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.sm,
              }}>
                Password Updated!
              </h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                color: colors.text.secondary,
                marginBottom: spacing.lg,
              }}>
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing="lg">
                <div>
                  <Input
                    type="password"
                    label="New Password"
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

                <Input
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
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
                  disabled={isLoading}
                  isLoading={isLoading}
                  fullWidth
                  size="md"
                >
                  Update Password
                </Button>
              </Stack>
            </form>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: colors.background.base, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
