'use client';

import { useState, useEffect } from 'react';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import { Container, Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import { createClient } from '@/lib/supabase/browser';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'exports'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    institution: string;
    faculty: string;
    department: string;
    currentLevel: string;
  } | null>(null);
  const [exportHistory, setExportHistory] = useState<any[]>([]);

  const tabs = [
    { id: 'profile' as const, label: 'Profile', iconKey: 'profile' },
    { id: 'notifications' as const, label: 'Notifications', iconKey: 'notifications' },
    { id: 'security' as const, label: 'Security', iconKey: 'settings' },
    { id: 'exports' as const, label: 'Exports & Payments', iconKey: 'download' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Query profiles table for user identity data
          const { data: profileData } = await supabase
            .from('profiles')
            .select(`
              full_name,
              institution:institutions(name),
              faculty:faculties(name),
              department:departments(name),
              current_level
            `)
            .eq('id', user.id)
            .single();

          if (profileData) {
            const inst = profileData.institution as unknown;
            const institutionName = Array.isArray(inst) ? (inst[0] as any)?.name || '' : (inst as any)?.name || (inst as string) || '';
            
            const fac = profileData.faculty as unknown;
            const facultyName = Array.isArray(fac) ? (fac[0] as any)?.name || '' : (fac as any)?.name || (fac as string) || '';
            
            const dept = profileData.department as unknown;
            const departmentName = Array.isArray(dept) ? (dept[0] as any)?.name || '' : (dept as any)?.name || (dept as string) || '';

            setUserData({
              fullName: profileData.full_name || '',
              email: user.email || '',
              institution: institutionName,
              faculty: facultyName,
              department: departmentName,
              currentLevel: profileData.current_level || '',
            });

            // Fetch export history
            const { data: versionsData } = await supabase
              .from('report_versions')
              .select(`
                *,
                report:reports(title, report_type)
              `)
              .order('generated_at', { ascending: false })
              .limit(10);

            setExportHistory(versionsData || []);
          } else {
            // Profile doesn't exist yet
            setUserData({
              fullName: '',
              email: user.email || '',
              institution: '',
              faculty: '',
              department: '',
              currentLevel: '',
            });
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && userData) {
        // Update profiles table with identity data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: userData.fullName,
            current_level: userData.currentLevel,
          })
          .eq('id', user.id);

        // Note: Institution, Faculty, and Department are managed through separate tables
        // and should be updated through their respective management interfaces
        
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  if (loading) {
    return (
      <Container size="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `4px solid ${colors.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <div style={{ marginBottom: spacing.xl }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: `${colors.primary}1A`,
          color: colors.primary,
          borderRadius: '9999px',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: spacing.md,
        }}>
          <span>Settings</span>
        </div>
        <h1 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '30px',
          fontWeight: '700',
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}>
          Settings
        </h1>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          fontWeight: '400',
          color: colors.text.secondary,
        }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div style={{ display: 'flex', gap: spacing.xl }}>
        <aside style={{ width: '256px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                size="md"
                icon={tab.iconKey}
                iconPosition="left"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  width: '100%',
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeTab === tab.id ? `linear-gradient(to right, ${colors.primary}, ${colors.primary})` : 'transparent',
                  color: activeTab === tab.id ? colors.text.primary : colors.text.secondary,
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = `${colors.primary}1A`;
                    e.currentTarget.style.color = colors.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.text.secondary;
                  }
                }}
              >
                <span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: '500' }}>{tab.label}</span>
              </Button>
            ))}
          </nav>
        </aside>

        <main style={{ flex: 1 }}>
          {activeTab === 'profile' && (
            <Card style={{ padding: spacing.xl }}>
              <h2 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '24px',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}>
                Profile Settings
              </h2>

              <Stack spacing="lg">
                <Input
                  label="Full Name"
                  value={userData?.fullName || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, fullName: e.target.value } : { fullName: e.target.value, email: '', institution: '', faculty: '', department: '', currentLevel: '' })}
                  fullWidth
                />

                <Input
                  label="Email"
                  type="email"
                  value={userData?.email || ''}
                  disabled
                  fullWidth
                />

                <Input
                  label="Institution"
                  value={userData?.institution || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, institution: e.target.value } : { fullName: '', email: '', institution: e.target.value, faculty: '', department: '', currentLevel: '' })}
                  fullWidth
                />

                <Input
                  label="Faculty"
                  value={userData?.faculty || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, faculty: e.target.value } : { fullName: '', email: '', institution: '', faculty: e.target.value, department: '', currentLevel: '' })}
                  fullWidth
                />

                <Input
                  label="Department"
                  value={userData?.department || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, department: e.target.value } : { fullName: '', email: '', institution: '', faculty: '', department: e.target.value, currentLevel: '' })}
                  fullWidth
                />

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}>
                    Current Level
                  </label>
                  <select
                    value={userData?.currentLevel || ''}
                    onChange={(e) => setUserData(prev => prev ? { ...prev, currentLevel: e.target.value } : { fullName: '', email: '', institution: '', faculty: '', department: '', currentLevel: e.target.value })}
                    style={{
                      width: '100%',
                      padding: `${spacing.sm} ${spacing.md}`,
                      backgroundColor: colors.background.elevated,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      color: colors.text.primary,
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '16px',
                    }}
                  >
                    <option value="">Select your level</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                  </select>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  isLoading={isSaving}
                  icon="save"
                  iconPosition="left"
                  size="md"
                >
                  Save Changes
                </Button>
              </Stack>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card style={{ padding: spacing.xl }}>
              <h2 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '24px',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}>
                Notification Settings
              </h2>

              <Stack spacing="md">
                {[
                  'Email notifications for report generation',
                  'Email notifications for payment confirmations',
                  'Weekly progress updates',
                  'Product updates and new features',
                ].map((item) => (
                  <label key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    cursor: 'pointer',
                    padding: spacing.sm,
                    backgroundColor: colors.background.elevated,
                    borderRadius: '16px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primary}1A`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.elevated;
                  }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <div style={{ color: colors.text.primary }}>
                        <VemiqIcon category="status" name="completed" size={12} />
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: '400',
                      color: colors.text.secondary,
                    }}>
                      {item}
                    </span>
                  </label>
                ))}
              </Stack>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                isLoading={isSaving}
                icon="save"
                iconPosition="left"
                size="md"
                style={{ marginTop: spacing.lg }}
              >
                Save Changes
              </Button>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card style={{ padding: spacing.xl }}>
              <h2 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '24px',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}>
                Security Settings
              </h2>

              <Stack spacing="lg">
                  <Input
                    label="Current Password"
                    type="password"
                    fullWidth
                  />

                  <Input
                    label="New Password"
                    type="password"
                    fullWidth
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                  />

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  isLoading={isSaving}
                  icon="save"
                  iconPosition="left"
                  size="md"
                >
                  Update Password
                </Button>
              </Stack>
            </Card>
          )}

          {activeTab === 'exports' && (
            <Card style={{ padding: spacing.xl }}>
              <h2 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '24px',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}>
                Exports & Payments
              </h2>

              <div style={{
                padding: spacing.lg,
                backgroundColor: `${colors.primary}1A`,
                borderRadius: '24px',
                marginBottom: spacing.lg,
                border: `2px solid ${colors.primary}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: colors.text.primary,
                    }}>
                      Export Pricing
                    </h3>
                    <p style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      fontWeight: '400',
                      color: colors.text.secondary,
                    }}>
                      ₦300 per page
                    </p>
                  </div>
                  <Button 
                    size="md"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    View Pricing
                  </Button>
                </div>
              </div>

              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}>
                Export History
              </h3>
              {exportHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: spacing.xl }}>
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: '400',
                    color: colors.text.secondary,
                  }}>
                    No export history available
                  </p>
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: colors.text.secondary,
                    marginTop: spacing.sm,
                  }}>
                    Your paid exports will appear here
                  </p>
                </div>
              ) : (
                <Stack spacing="md">
                  {exportHistory.map((version) => (
                    <div key={version.id} style={{
                      padding: spacing.md,
                      backgroundColor: colors.background.elevated,
                      borderRadius: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                        <span style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: colors.text.primary,
                        }}>
                          {version.report?.title || 'Unknown Report'}
                        </span>
                        <span style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '14px',
                          fontWeight: '400',
                          color: colors.text.secondary,
                        }}>
                          {new Date(version.generated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                        <span style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '14px',
                          fontWeight: '400',
                          color: colors.text.secondary,
                        }}>
                          {version.page_count} pages
                        </span>
                        <span style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '14px',
                          fontWeight: '400',
                          color: colors.text.secondary,
                        }}>
                          Version {version.version_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </Stack>
              )}
            </Card>
          )}
        </main>
      </div>
    </Container>
  );
}
