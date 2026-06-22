'use client';

import { useState, useEffect } from 'react';
import { ProfileIcon, MailIcon, OrganizationIcon, GraduationCapIcon, SaveIcon, BellIcon, LockIcon, DownloadIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import { createClient } from '@/lib/supabase/browser';
import PageContainer from '@/components/layout/PageContainer';

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
    { id: 'profile' as const, label: 'Profile', icon: ProfileIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: BellIcon },
    { id: 'security' as const, label: 'Security', icon: LockIcon },
    { id: 'exports' as const, label: 'Exports & Payments', icon: DownloadIcon },
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
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <span>Settings</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-8">
        <aside className="w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  size="md"
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary dark:hover:text-white'
                  }`}
                  leftIcon={<Icon size={20} />}
                >
                  <span className="font-medium">{tab.label}</span>
                </Button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          {activeTab === 'profile' && (
            <Card className="p-8 animate-scale-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h2>

              <div className="space-y-6">
                  <Input
                    label="Full Name"
                    value={userData?.fullName || ''}
                    onChange={(e) => setUserData(prev => prev ? { ...prev, fullName: e.target.value } : { fullName: e.target.value, email: '', institution: '', faculty: '', department: '', currentLevel: '' })}
                    leftIcon={<ProfileIcon size={20} />}
                    fullWidth
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    leftIcon={<MailIcon size={20} />}
                    fullWidth
                  />

                  <Input
                    label="Institution"
                    value={userData?.institution || ''}
                    onChange={(e) => setUserData(prev => prev ? { ...prev, institution: e.target.value } : { fullName: '', email: '', institution: e.target.value, faculty: '', department: '', currentLevel: '' })}
                    leftIcon={<OrganizationIcon size={20} />}
                    fullWidth
                  />

                  <Input
                    label="Faculty"
                    value={userData?.faculty || ''}
                    onChange={(e) => setUserData(prev => prev ? { ...prev, faculty: e.target.value } : { fullName: '', email: '', institution: '', faculty: e.target.value, department: '', currentLevel: '' })}
                    leftIcon={<GraduationCapIcon size={20} />}
                    fullWidth
                  />

                  <Input
                    label="Department"
                    value={userData?.department || ''}
                    onChange={(e) => setUserData(prev => prev ? { ...prev, department: e.target.value } : { fullName: '', email: '', institution: '', faculty: '', department: e.target.value, currentLevel: '' })}
                    leftIcon={<GraduationCapIcon size={20} />}
                    fullWidth
                  />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Level
                  </label>
                  <select
                    value={userData?.currentLevel || ''}
                    onChange={(e) => setUserData(prev => prev ? { ...prev, currentLevel: e.target.value } : { fullName: '', email: '', institution: '', faculty: '', department: '', currentLevel: e.target.value })}
                    className="input-field"
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
                  leftIcon={<SaveIcon size={20} />}
                  size="md"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-8 animate-scale-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Notification Settings</h2>

              <div className="space-y-4">
                {[
                  'Email notifications for report generation',
                  'Email notifications for payment confirmations',
                  'Weekly progress updates',
                  'Product updates and new features',
                ].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-2xl hover:bg-primary/10 transition-colors">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </label>
                ))}
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                isLoading={isSaving}
                leftIcon={<SaveIcon size={20} />}
                size="md"
                className="mt-6"
              >
                Save Changes
              </Button>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-8 animate-scale-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Security Settings</h2>

              <div className="space-y-6">
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
                  leftIcon={<SaveIcon size={20} />}
                  size="md"
                >
                  Update Password
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'exports' && (
            <Card className="p-8 animate-scale-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Exports & Payments</h2>

              <div className="p-6 bg-primary/10 rounded-3xl mb-6 border-2 border-primary">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Export Pricing</h3>
                    <p className="text-muted-foreground">₦300 per page</p>
                  </div>
                  <Button 
                    size="md"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    View Pricing
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-4">Export History</h3>
              {exportHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No export history available</p>
                  <p className="text-sm mt-2">Your paid exports will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map((version) => (
                    <div key={version.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">
                          {version.report?.title || 'Unknown Report'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(version.generated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{version.page_count} pages</span>
                        <span>Version {version.version_number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </main>
      </div>
    </PageContainer>
  );
}
