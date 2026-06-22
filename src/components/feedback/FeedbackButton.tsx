'use client';

import { useState } from 'react';
import { MessageSquareIcon, XIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Input } from '@/design-system/components/Input';
import { createClient } from '@/lib/supabase/browser';
import { trackEvent } from '@/lib/analytics';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'bug_report' | 'feature_request' | 'general_feedback'>('general_feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        type,
        message,
        page: window.location.pathname,
        status: 'open',
      });

      if (error) throw error;

      await trackEvent({
        eventType: 'report_edited' as any,
        category: 'usage',
        properties: {
          feedback_type: type,
          feedback_length: message.length,
        },
        page: window.location.pathname,
      });

      setSubmitted(true);
      setMessage('');

      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/80 transition-all duration-200 hover:scale-105"
        aria-label="Give feedback"
      >
        <MessageSquareIcon size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Send Feedback</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-foreground font-medium">Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="general_feedback">General Feedback</option>
                <option value="bug_report">Bug Report</option>
                <option value="feature_request">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                rows={4}
                className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              isLoading={isSubmitting}
              fullWidth
              size="md"
            >
              Submit Feedback
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
