'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { getBetaStatus, requestBetaAccess, trackOnboardingEvent } from '@/lib/beta-access';
import { trackEvent } from '@/lib/analytics';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { ArrowRightIcon, CheckIcon, LoaderIcon } from '@/design-system';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<'check' | 'pending' | 'approved' | 'profile' | 'logbook'>('check');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: '',
    matric_number: '',
    institution_id: '',
    faculty_id: '',
    department_id: '',
    current_level: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkBetaStatus();
  }, []);

  const checkBetaStatus = async () => {
    try {
      const status = await getBetaStatus();
      
      if (status === 'approved') {
        // Check if profile is complete
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (userProfile?.full_name && userProfile?.matric_number && userProfile?.institution_id) {
            // Check if user has a logbook
            const { data: logbooks } = await supabase
              .from('logbooks')
              .select('*')
              .eq('user_id', user.id)
              .limit(1);

            if (logbooks && logbooks.length > 0) {
              router.push('/dashboard');
            } else {
              setStep('logbook');
            }
          } else {
            setProfile({
              full_name: userProfile?.full_name || '',
              matric_number: userProfile?.matric_number || '',
              institution_id: userProfile?.institution_id || '',
              faculty_id: userProfile?.faculty_id || '',
              department_id: userProfile?.department_id || '',
              current_level: userProfile?.current_level || '',
            });
            setStep('profile');
          }
        }
      } else if (status === 'pending') {
        setStep('pending');
      } else if (status === null) {
        // User not in beta system, request access
        await requestBetaAccess();
        setStep('pending');
      } else {
        setStep('pending');
      }
    } catch (error) {
      console.error('Error checking beta status:', error);
      setStep('pending');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          matric_number: profile.matric_number,
          institution_id: profile.institution_id,
          faculty_id: profile.faculty_id,
          department_id: profile.department_id,
          current_level: profile.current_level,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await trackEvent({
        eventType: 'profile_completed' as any,
        category: 'acquisition',
        properties: {},
        page: '/onboarding',
      });

      await trackOnboardingEvent('profile_completed');

      setStep('logbook');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipLogbook = async () => {
    await trackEvent({
      eventType: 'first_logbook_created' as any,
      category: 'activation',
      properties: { skipped: true },
      page: '/onboarding',
    });
    router.push('/dashboard');
  };

  const handleCreateLogbook = async () => {
    await trackOnboardingEvent('first_logbook_created');
    router.push('/dashboard/logbook/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoaderIcon className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (step === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-6">
            <LoaderIcon className="animate-spin text-white" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're on the Waitlist</h1>
          <p className="text-muted-foreground mb-6">
            Your request for beta access has been received. We'll review your application and get back to you soon.
          </p>
          <Button onClick={() => router.push('/')} variant="ghost">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground mb-6">
            Tell us a bit about yourself to get started with Vemiq.
          </p>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Matric Number"
              value={profile.matric_number}
              onChange={(e) => setProfile({ ...profile, matric_number: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Institution ID"
              value={profile.institution_id}
              onChange={(e) => setProfile({ ...profile, institution_id: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Faculty ID"
              value={profile.faculty_id}
              onChange={(e) => setProfile({ ...profile, faculty_id: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Department ID"
              value={profile.department_id}
              onChange={(e) => setProfile({ ...profile, department_id: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Current Level"
              value={profile.current_level}
              onChange={(e) => setProfile({ ...profile, current_level: e.target.value })}
              required
              fullWidth
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              fullWidth
              size="md"
            >
              Continue
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (step === 'logbook') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Your First Logbook</h1>
          <p className="text-muted-foreground mb-6">
            Start capturing your SIWES/SWEP activities with a logbook.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckIcon size={16} className="text-primary" />
              </div>
              <span>Capture daily activities</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckIcon size={16} className="text-primary" />
              </div>
              <span>Upload evidence and photos</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckIcon size={16} className="text-primary" />
              </div>
              <span>Generate AI-powered summaries</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCreateLogbook}
              fullWidth
              size="md"
            >
              Create Logbook
              <ArrowRightIcon size={20} className="ml-2" />
            </Button>
            <Button
              onClick={handleSkipLogbook}
              variant="ghost"
              fullWidth
              size="md"
            >
              Skip for Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
