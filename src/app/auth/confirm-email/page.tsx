'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MailIcon, SuccessIcon, ArrowRightIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { createClient } from '@/lib/supabase/browser';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResending(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      setMessage('Confirmation email sent successfully! Please check your inbox.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to resend confirmation email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12 pt-24 flex-1">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Check your email
            </h1>
            <p className="text-muted-foreground">
              We've sent a confirmation link to your email address
            </p>
          </div>

          <div className="card p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <SuccessIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What's next?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Check your email inbox</li>
                    <li>• Click the confirmation link</li>
                    <li>• Start using Vemiq</li>
                  </ul>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Didn't receive the email?</p>
                <form onSubmit={handleResendConfirmation} className="mt-2 flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isResending}
                    size="md"
                    isLoading={isResending}
                  >
                    {isResending ? 'Sending...' : 'Resend'}
                  </Button>
                </form>
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('successfully') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-primary hover:opacity-80 transition-opacity font-medium"
                >
                  Go to login
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
