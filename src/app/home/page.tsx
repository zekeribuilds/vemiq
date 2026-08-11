'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Skeleton, CardSkeleton, ButtonSkeleton, ListSkeleton } from '@/design-system/components/Skeleton';

export default function HomePage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [recentEvidence, setRecentEvidence] = useState<any[]>([]);
  const [reportProgress, setReportProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile?.full_name) {
          setUserName(profile.full_name.split(' ')[0]); // Use first name
        }

        // Get recent evidence
        const { data: evidence } = await supabase
          .from('evidence')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentEvidence(evidence || []);

        // Get programs for report progress
        const { data: programs } = await supabase
          .from('programs')
          .select('*')
          .eq('user_id', user.id);

        if (programs && programs.length > 0) {
          const progress = programs.map((program: any) => ({
            title: program.title,
            progress: calculateReportProgress(program.id, user.id),
          }));
          setReportProgress(progress);
        }
      }

      // Set greeting based on time
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateReportProgress = async (programId: string, userId: string) => {
    // Simple calculation based on evidence count
    // In a real implementation, this would be more sophisticated
    const supabase = createClient();
    const { count } = await supabase
      .from('evidence')
      .select('*', { count: 'exact', head: true })
      .eq('program_id', programId)
      .eq('user_id', userId);

    // Assume 12 weeks of evidence needed for a complete report
    const progress = Math.min(Math.round(((count || 0) / 12) * 100), 100);
    return progress;
  };

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <ResponsiveHeader title="Home" />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        {/* Greeting Section - Minimalist */}
        <div className="space-y-1">
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <h1 className="text-2xl md:text-3xl font-semibold text-[#FFFFFF]">
              {greeting}, {userName || 'Student'}
            </h1>
          )}
        </div>

        {/* Primary Actions - Minimalist Card */}
        <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
          <h2 className="text-sm font-medium text-[#898989] mb-4 uppercase tracking-wide">Quick Capture</h2>
          
          {isLoading ? (
            <div className="space-y-3">
              <ButtonSkeleton />
              <div className="grid grid-cols-2 gap-3">
                <ButtonSkeleton />
                <ButtonSkeleton />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/evidence/create')}
                className="w-full flex items-center gap-4 px-5 py-4 bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <VemiqIcon category="content" name="voice" size={20} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-white font-medium">Voice Capture</span>
                </div>
                <VemiqIcon category="action" name="add" size={16} className="text-white/60" />
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push('/evidence/create')}
                  className="flex items-center gap-3 px-4 py-3 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                    <VemiqIcon category="content" name="image" size={18} className="text-[#898989] group-hover:text-[#FFFFFF]" />
                  </div>
                  <span className="text-[#FFFFFF] font-medium text-sm">Photo</span>
                </button>
                <button
                  onClick={() => router.push('/evidence/create')}
                  className="flex items-center gap-3 px-4 py-3 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                    <VemiqIcon category="content" name="text" size={18} className="text-[#898989] group-hover:text-[#FFFFFF]" />
                  </div>
                  <span className="text-[#FFFFFF] font-medium text-sm">Note</span>
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Content Grid - Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Evidence */}
          <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[#898989] uppercase tracking-wide">Recent Evidence</h2>
              {recentEvidence.length > 0 && !isLoading && (
                <button
                  onClick={() => router.push('/evidence')}
                  className="text-xs text-[#6C63FF] hover:text-[#8B85FF] font-medium transition-colors"
                >
                  View All
                </button>
              )}
            </div>
            
            {isLoading ? (
              <ListSkeleton count={3} />
            ) : recentEvidence.length === 0 ? (
              <div className="text-center py-8">
                <VemiqIcon category="empty" name="no_data" size={40} className="mx-auto mb-3 text-[#898989]" />
                <p className="text-sm text-[#898989]">No evidence yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentEvidence.map((evidence) => (
                  <button
                    key={evidence.id}
                    onClick={() => router.push(`/evidence/${evidence.id}`)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group">
                      <div className="w-8 h-8 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                        <VemiqIcon category="content" name="voice" size={16} className="text-[#898989] group-hover:text-[#FFFFFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#FFFFFF] truncate">{evidence.title}</p>
                        <p className="text-xs text-[#898989] mt-0.5">Week {evidence.week_number}</p>
                      </div>
                      <VemiqIcon category="action" name="add" size={14} className="text-[#898989]" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Report Progress */}
          <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[#898989] uppercase tracking-wide">Workspace Progress</h2>
              {reportProgress.length > 0 && !isLoading && (
                <button
                  onClick={() => router.push('/reports')}
                  className="text-xs text-[#6C63FF] hover:text-[#8B85FF] font-medium transition-colors"
                >
                  View All
                </button>
              )}
            </div>
            
            {isLoading ? (
              <ListSkeleton count={2} />
            ) : reportProgress.length === 0 ? (
              <div className="text-center py-8">
                <VemiqIcon category="empty" name="no_data" size={40} className="mx-auto mb-3 text-[#898989]" />
                <p className="text-sm text-[#898989]">No workspaces yet</p>
                <button
                  onClick={() => router.push('/evidence/create-program')}
                  className="mt-3 text-xs text-[#6C63FF] hover:text-[#8B85FF] font-medium transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reportProgress.map((report, index) => (
                  <button
                    key={index}
                    onClick={() => router.push('/reports')}
                    className="w-full text-left"
                  >
                    <div className="px-4 py-3 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#FFFFFF]">{report.title}</span>
                        <span className="text-xs font-bold text-[#6C63FF]">{report.progress}%</span>
                      </div>
                      <div className="w-full bg-[#2A2A2A] rounded-full h-1.5">
                        <div
                          className="bg-[#6C63FF] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${report.progress}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
