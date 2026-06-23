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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.message.includes('Missing Supabase environment variables')) {
        setError('Supabase configuration is missing. Please check your .env.local file.');
      } else if (err.message === 'Failed to fetch') {
        setError('Unable to connect to Supabase. Please check your internet connection.');
      } else {
        setError(err.message || 'An error occurred sending reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.base, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: spacing.md, position: 'relative', overflow: 'hidden' }}>
      <Container size="sm">
        <div style={{ marginBottom: spacing.xl }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary, textDecoration: 'none', transition: 'color 0.2s' }}>
            <div style={{ color: colors.text.secondary }}>
              <VemiqIcon category="action" name="close" size={20} />
            </div>
            Back to login
          </Link>
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
            <span>Password Reset</span>
          </div>
          <h1 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '36px',
            fontWeight: '700',
            color: colors.text.primary,
            marginBottom: spacing.sm,
          }}>
            Reset Password
          </h1>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            color: colors.text.secondary,
          }}>
            {isSubmitted
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        <Card style={{ padding: spacing.xl }}>
          {!isSubmitted ? (
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
                  Send Reset Link
                </Button>
              </Stack>
            </form>
          ) : (
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
                Email Sent!
              </h3>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                color: colors.text.secondary,
                marginBottom: spacing.lg,
              }}>
                We've sent password reset instructions to {email}
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="ghost"
                size="md"
              >
                Send again
              </Button>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}
