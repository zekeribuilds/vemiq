'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Skeleton, CardSkeleton, ListSkeleton } from '@/design-system/components/Skeleton';

export default function EvidencePage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [evidenceByWeek, setEvidenceByWeek] = useState<Record<number, any[]>>({});
  const [weeks, setWeeks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadEvidence();
      generateWeeks();
    }
  }, [selectedWorkspace]);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: workspacesData } = await supabase
          .from('workspaces')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setWorkspaces(workspacesData || []);
        if (workspacesData && workspacesData.length > 0) {
          setSelectedWorkspace(workspacesData[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvidence = async () => {
    if (!selectedWorkspace) return;

    try {
      const supabase = createClient();
      const { data: evidenceData } = await supabase
        .from('evidence_items')
        .select('*')
        .eq('workspace_id', selectedWorkspace)
        .order('evidence_date', { ascending: false });

      // Group evidence by week
      const grouped: Record<number, any[]> = {};
      evidenceData?.forEach((evidence) => {
        if (!grouped[evidence.week_number]) {
          grouped[evidence.week_number] = [];
        }
        grouped[evidence.week_number].push(evidence);
      });

      setEvidenceByWeek(grouped);
    } catch (error) {
      console.error('Error loading evidence:', error);
    }
  };

  const generateWeeks = () => {
    if (!selectedWorkspace) return;

    const workspace = workspaces.find((w) => w.id === selectedWorkspace);
    if (!workspace) return;

    const startDate = new Date(workspace.start_date);
    const endDate = new Date(workspace.end_date);
    const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

    const weekNumbers = Array.from({ length: totalWeeks }, (_, i) => i + 1);
    setWeeks(weekNumbers);
  };

  const getWeekDateRange = (weekNumber: number) => {
    const workspace = workspaces.find((w) => w.id === selectedWorkspace);
    if (!workspace) return '';

    const startDate = new Date(workspace.start_date);
    const weekStart = new Date(startDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  };

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <ResponsiveHeader title="Evidence" />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <ListSkeleton count={3} />
            </div>
          </div>
        ) : workspaces.length === 0 ? (
          <Card className="p-8 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl text-center">
            <VemiqIcon category="empty" name="no_data" size={40} className="mx-auto mb-3 text-[#898989]" />
            <h2 className="text-lg font-semibold text-[#FFFFFF] mb-2">No Workspaces Yet</h2>
            <p className="text-sm text-[#898989] mb-4">Create a workspace to start capturing evidence</p>
            <Button
              onClick={() => router.push('/evidence/create-program')}
              className="bg-[#6C63FF] hover:bg-[#5A52D5]"
            >
              Create Workspace
            </Button>
          </Card>
        ) : (
          <>
            {/* Workspaces Selector */}
            {workspaces.length > 1 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#898989]">Workspace:</label>
                <select
                  value={selectedWorkspace || ''}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                  className="px-3 py-2 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-[#FFFFFF] text-sm focus:border-[#6C63FF] focus:outline-none transition-all"
                >
                  {workspaces.map((workspace: any) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Timeline Header */}
            {selectedWorkspace && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#FFFFFF]">Timeline</h2>
                  <p className="text-xs text-[#898989] mt-0.5">
                    {weeks.length} weeks • {Object.values(evidenceByWeek).flat().length} items
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/evidence/create')}
                  className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-4 py-2"
                  leftIcon={<VemiqIcon category="action" name="create" size={16} />}
                >
                  <span className="text-sm font-medium">Add Evidence</span>
                </Button>
              </div>
            )}

            {/* Evidence Timeline */}
            {selectedWorkspace && (
              <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
                <div className="space-y-3">
                  {weeks.map((weekNumber) => {
                    const weekEvidence = evidenceByWeek[weekNumber] || [];
                    const hasEvidence = weekEvidence.length > 0;

                    return (
                      <div key={weekNumber}>
                        <button
                          onClick={() => {
                            if (hasEvidence) {
                              router.push(`/evidence/${weekEvidence[0].id}`);
                            } else {
                              router.push('/evidence/create');
                            }
                          }}
                          className="w-full text-left"
                        >
                          <div className="flex items-center gap-4 px-4 py-3 bg-[#171717] hover:bg-[#2A2A2A] rounded-xl transition-all group">
                            <div className="w-10 h-10 bg-[#2A2A2A] group-hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                              <span className="text-sm font-semibold text-[#FFFFFF]">W{weekNumber}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#FFFFFF]">Week {weekNumber}</span>
                                {hasEvidence && (
                                  <span className="text-xs text-[#6C63FF]">• {weekEvidence.length} items</span>
                                )}
                              </div>
                              <p className="text-xs text-[#898989] mt-0.5">{getWeekDateRange(weekNumber)}</p>
                            </div>
                            <VemiqIcon category="action" name="add" size={14} className="text-[#898989]" />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
