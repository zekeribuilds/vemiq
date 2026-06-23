'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { VemiqIcon } from '@/components/VemiqIcon';
import StudentIdentityCard from '@/components/dashboard/StudentIdentityCard';
import ActiveReportCard from '@/components/dashboard/ActiveReportCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import SkeletonLoader from '@/components/workspace/SkeletonLoader';
import { EmptyState } from '@/design-system/components/EmptyState';
import ErrorState from '@/components/workspace/ErrorState';
import { Stack, Container } from '@/design-system/layouts';
import { colors } from '@/design-system/tokens/index';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState<{
    userName: string;
    institution: string | null;
    faculty: string | null;
    department: string | null;
    currentLevel: string | null;
  } | null>(null);

  const [currentTraining, setCurrentTraining] = useState<{
    programType: string;
    institution: string | null;
    department: string | null;
    organization: string | null;
    startDate: string | null;
    endDate: string | null;
    currentChapter: string | null;
    overallProgress: number;
    status: string;
  } | null>(null);

  const [activities, setActivities] = useState<any[]>([]);

  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch user data from profiles table (sole source of truth)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`
              *,
              institution:institutions(name),
              faculty:faculties(name),
              department:departments(name)
            `)
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Profile must exist - if not, user needs to complete onboarding
            setUserData(null);
          } else if (profileData) {
            setUserData({
              userName: profileData.full_name || user.email?.split('@')[0] || 'Student',
              institution: typeof profileData.institution === 'string' ? profileData.institution : profileData.institution?.name || null,
              faculty: typeof profileData.faculty === 'string' ? profileData.faculty : profileData.faculty?.name || null,
              department: typeof profileData.department === 'string' ? profileData.department : profileData.department?.name || null,
              currentLevel: profileData.current_level || null,
            });
          }
        }

        // Fetch reports
        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!reportsError && reportsData) {
          setRecentReports(reportsData);
          
          // Set current training from active report (not most recent)
          const activeReport = reportsData.find(r => r.is_active === true);
          if (activeReport) {
            setCurrentTraining({
              programType: activeReport.report_type || 'SIWES',
              institution: activeReport.institution || null,
              department: activeReport.department || null,
              organization: activeReport.organization || null,
              startDate: activeReport.start_date || null,
              endDate: activeReport.end_date || null,
              currentChapter: activeReport.current_chapter || null,
              overallProgress: activeReport.progress || 0,
              status: activeReport.status || 'Draft',
            });
          }
        }

        // Fetch activities from activity_events table
        if (user) {
          const { data: activitiesData, error: activitiesError } = await supabase
            .from('activity_events')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (!activitiesError && activitiesData) {
            const mappedActivities = activitiesData.map((event: any) => ({
              id: event.id,
              type: event.event_type,
              title: event.event_title,
              description: event.event_description || '',
              time: new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: new Date(event.created_at).toLocaleDateString(),
            }));
            setActivities(mappedActivities);
          } else {
            setActivities([]);
          }
        } else {
          setActivities([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddLogbook = () => {
    router.push('/dashboard/logbook');
  };

  const handleContinueReport = () => {
    if (recentReports.length > 0) {
      router.push(`/dashboard/reports/${recentReports[0].id}`);
    } else {
      router.push('/dashboard/reports/create');
    }
  };

  const handleOpenAI = () => {
    router.push('/dashboard/chat');
  };

  const handleUploadImages = () => {
    // Open image upload modal or navigate to logbook with upload mode
    router.push('/dashboard/logbook');
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    // Refetch data
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <ErrorState
          title="Failed to load workspace"
          description="There was an error loading your student workspace. Please check your connection and try again."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const hasNoData = recentReports.length === 0 && activities.length === 0 && !currentTraining;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.base }}>
      {/* Main Content */}
      <div style={{ paddingBottom: '96px' }}>
        <Container size="lg">
          <Stack spacing="xl">
            {hasNoData ? (
              <EmptyState
                icon="no_reports"
                title="Start Your SIWES Journey"
                description="Create your first report to begin documenting your industrial training experience."
                actionLabel="Create Report"
                onAction={() => router.push('/dashboard/reports/create')}
              />
            ) : (
              <>
                {/* SECTION 1: What am I working on? */}
                {currentTraining && (
                  <ActiveReportCard
                    reportTitle={currentTraining.programType + ' Report'}
                    programType={currentTraining.programType as 'SIWES' | 'SWEP'}
                    currentChapter={currentTraining.currentChapter}
                    progress={currentTraining.overallProgress}
                    status={currentTraining.status}
                    onContinue={handleContinueReport}
                  />
                )}

                {/* SECTION 2: What should I do next? */}
                <QuickActionsCard
                  onAddLogbook={handleAddLogbook}
                  onContinueReport={handleContinueReport}
                  onOpenAI={handleOpenAI}
                  onUploadImages={handleUploadImages}
                />

                {/* SECTION 3: What did I do recently? */}
                <RecentActivityCard activities={activities} />

                {/* SECTION 4: Who am I? + What programme? + Where am I training? */}
                {userData && (
                  <StudentIdentityCard
                    userName={userData.userName}
                    institution={userData.institution}
                    faculty={userData.faculty}
                    department={userData.department}
                    currentLevel={userData.currentLevel}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </div>
    </div>
  );
}
