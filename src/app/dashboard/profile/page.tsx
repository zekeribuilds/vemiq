'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import PageContainer from '@/components/layout/PageContainer';
import { ProfileIcon, MailIcon, OrganizationIcon, GraduationCapIcon, CalendarIcon, SettingsIcon, CreditCardIcon, HeartIcon, HelpCircleIcon, LogOutIcon, ChevronRightIcon, CameraIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

export default function DashboardProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string | null;
    email: string | null;
    institution: string | null;
    faculty: string | null;
    department: string | null;
    currentLevel: string | null;
  } | null>(null);

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: ProfileIcon, label: 'Personal Information', color: 'text-primary', action: () => router.push('/dashboard/settings') },
        { icon: MailIcon, label: 'Email Settings', color: 'text-blue-500', action: () => router.push('/dashboard/settings') },
        { icon: CameraIcon, label: 'Change Avatar', color: 'text-purple-500', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircleIcon, label: 'Help Center', color: 'text-green-500', action: () => router.push('/dashboard/support') },
        { icon: HeartIcon, label: 'Rate Vemiq', color: 'text-red-500', action: () => {} },
      ],
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log('[PROFILE] Authenticated user ID:', user?.id);
        
        if (user) {
          // Query profiles table for user identity data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`
              full_name,
              institution:institutions(name),
              faculty:faculties(name),
              department:departments(name),
              current_level
            `)
            .eq('id', user.id)
            .maybeSingle();

          console.log('[PROFILE] Profile query result:', profileData);
          console.log('[PROFILE] Profile query error:', profileError);

          if (profileData) {
            const institutionName = (() => {
              const inst = profileData.institution as any;
              if (Array.isArray(inst) && inst.length > 0) return inst[0].name || null;
              if (inst && typeof inst === 'object' && 'name' in inst) return inst.name || null;
              return typeof inst === 'string' ? inst : null;
            })();
            const facultyName = (() => {
              const fac = profileData.faculty as any;
              if (Array.isArray(fac) && fac.length > 0) return fac[0].name || null;
              if (fac && typeof fac === 'object' && 'name' in fac) return fac.name || null;
              return typeof fac === 'string' ? fac : null;
            })();
            const departmentName = (() => {
              const dept = profileData.department as any;
              if (Array.isArray(dept) && dept.length > 0) return dept[0].name || null;
              if (dept && typeof dept === 'object' && 'name' in dept) return dept.name || null;
              return typeof dept === 'string' ? dept : null;
            })();

            setUserProfile({
              name: profileData.full_name || null,
              email: user.email || null,
              institution: institutionName,
              faculty: facultyName,
              department: departmentName,
              currentLevel: profileData.current_level || null,
            });
          } else {
            // Profile doesn't exist yet
            setUserProfile({
              name: null,
              email: user.email || null,
              institution: null,
              faculty: null,
              department: null,
              currentLevel: null,
            });
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Failed to load profile</p>
            <Button
              onClick={() => window.location.reload()}
              size="md"
              variant="primary"
            >
              Retry
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="rounded-24 p-8 mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <ProfileIcon size={40} className="text-muted-foreground" />
            </div>
            <Button
              className="absolute bottom-0 right-0 w-10 h-10 p-0 rounded-full border-4 border-card"
              size="sm"
              variant="primary"
              leftIcon={<CameraIcon size={18} />}
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">{userProfile?.name || 'User'}</h2>
            <p className="text-muted-foreground">{userProfile?.email || 'No email'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3">
            <OrganizationIcon size={20} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Institution</p>
              <p className="text-sm font-medium text-foreground">{userProfile?.institution || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCapIcon size={20} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Faculty</p>
              <p className="text-sm font-medium text-foreground">{userProfile?.faculty || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCapIcon size={20} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-medium text-foreground">{userProfile?.department || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarIcon size={20} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="text-sm font-medium text-foreground">{userProfile?.currentLevel || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Menu Sections */}
      <div className="space-y-8">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              {section.title}
            </h3>
            <Card className="rounded-24 overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.label}
                    onClick={item.action}
                    variant="ghost"
                    size="md"
                    fullWidth
                    className={`justify-start ${index !== section.items.length - 1 ? 'border-b border-border rounded-none' : ''}`}
                    leftIcon={
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Icon size={18} className={item.color} />
                      </div>
                    }
                    rightIcon={<ChevronRightIcon size={18} />}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Card>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <Button
          onClick={handleLogout}
          fullWidth
          size="md"
          variant="ghost"
          leftIcon={<LogOutIcon size={20} />}
        >
          Logout
        </Button>
      </div>

      {/* Version Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">Vemiq v1.0.0</p>
      </div>
    </PageContainer>
  );
}
