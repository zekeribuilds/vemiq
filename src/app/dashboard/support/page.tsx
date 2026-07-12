'use client';

import { useState } from 'react';
import { MessageSquareIcon, MailIcon, BookOpenIcon, SearchIcon, SendIcon, SuccessIcon, SparklesIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Textarea } from '@/design-system/components/Textarea';
import { Card } from '@/design-system/components/Card';
import PageContainer from '@/components/layout/PageContainer';

export default function SupportPage() {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const faqs = [
    {
      q: 'How do I create a new report?',
      a: 'Navigate to the Reports page and click "Create Report". Follow the 7-step wizard to complete your report.',
    },
    {
      q: 'Can I edit my report after generating it?',
      a: 'Yes, you can edit any section using the AI chat panel in the report editor.',
    },
    {
      q: 'How do I export my report as PDF?',
      a: 'In the report editor, click the "Export PDF" button to download your report.',
    },
    {
      q: 'What file formats are supported for images?',
      a: 'We support JPG, PNG, and PDF files up to 10MB in size.',
    },
    {
      q: 'How do I cancel my subscription?',
      a: 'Go to Settings > Billing and click "Cancel Subscription". You can cancel anytime.',
    },
  ];

  return (
    <PageContainer>
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary rounded-full text-sm font-medium mb-4">
          <SparklesIcon size={16} />
          <span>Support</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Support</h1>
        <p className="text-text-secondary">Get help with Vemiq</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-8 mb-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Contact Us</h2>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <Textarea
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  required
                  fullWidth
                />

                <Button
                  type="submit"
                  leftIcon={<SendIcon size={20} />}
                  size="md"
                >
                  Send Message
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-success to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <SuccessIcon className="text-white" size={36} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Message Sent!
                </h3>
                <p className="text-text-secondary mb-6">
                  We'll get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="ghost"
                  size="md"
                >
                  Send another message
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Links</h2>
            
            <div className="space-y-4">
              <a href="/docs" className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl hover:bg-primary-50 transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <BookOpenIcon className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Documentation</p>
                  <p className="text-sm text-text-muted">Learn how to use Vemiq</p>
                </div>
              </a>

              <a href="/community" className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl hover:bg-primary-50 transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-emerald-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MessageSquareIcon className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Community Forum</p>
                  <p className="text-sm text-text-muted">Connect with other users</p>
                </div>
              </a>

              <a href="mailto:support@vemiq.com" className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl hover:bg-primary-50 transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-warning to-orange-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MailIcon className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Email Support</p>
                  <p className="text-sm text-text-muted">support@vemiq.com</p>
                </div>
              </a>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-neutral-200 pb-4 last:border-0">
                  <h3 className="font-semibold text-text-primary mb-2">{faq.q}</h3>
                  <p className="text-text-secondary">{faq.a}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 mt-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Search Help</h2>
            
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for help articles..."
                leftIcon={<SearchIcon size={20} />}
                fullWidth
              />
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
