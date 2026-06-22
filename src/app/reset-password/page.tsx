'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockIcon, ArrowLeftIcon, SparklesIcon, SuccessIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="max-w-md w-full relative animate-fade-in-up">
        <div className="mb-8">
          <a href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary dark:hover:text-white transition-colors">
            <ArrowLeftIcon size={20} />
            Back to login
          </a>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <SparklesIcon size={16} />
            <span>New Password</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Set New Password</h1>
          <p className="text-muted-foreground">
            {isSuccess
              ? 'Password updated successfully'
              : 'Enter your new password below'}
          </p>
        </div>

        <Card className="p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[#22C55E] rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <SuccessIcon className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Password Updated!
              </h3>
              <p className="text-muted-foreground mb-6">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                fullWidth
                leftIcon={<LockIcon size={20} />}
              />
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>

              <Input
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                fullWidth
                leftIcon={<LockIcon size={20} />}
              />

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm animate-fade-in">
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
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
