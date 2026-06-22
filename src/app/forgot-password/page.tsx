'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MailIcon, ArrowLeftIcon, SparklesIcon, SuccessIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="max-w-md w-full relative animate-fade-in-up">
        <div className="mb-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary dark:hover:text-white transition-colors">
            <ArrowLeftIcon size={20} />
            Back to login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <SparklesIcon size={16} />
            <span>Password Reset</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground">
            {isSubmitted
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        <Card className="p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                fullWidth
                leftIcon={<MailIcon size={20} />}
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
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[#22C55E] rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <SuccessIcon className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Email Sent!
              </h3>
              <p className="text-muted-foreground mb-6">
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
      </div>
    </div>
  );
}
