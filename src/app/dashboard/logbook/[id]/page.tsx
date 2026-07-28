'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { ChevronLeftIcon, CreateIcon, CalendarIcon, EditIcon, DeleteIcon } from '@/design-system';

export default function LogbookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logbook, setLogbook] = useState<any>(null);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [showAddWeek, setShowAddWeek] = useState(false);
  const [newWeekNumber, setNewWeekNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        const { data: logbookData, error: logbookError } = await supabase
          .from('logbooks')
          .select(`
            *,
            institution:institutions(name),
            training_organization:training_organizations(name)
          `)
          .eq('id', params.id)
          .single();

        if (logbookError) throw logbookError;
        setLogbook(logbookData);

        const { data: entriesData, error: entriesError } = await supabase
          .from('logbook_entries')
          .select('*')
          .eq('logbook_id', params.id)
          .order('week_number', { ascending: true });

        if (entriesError) throw entriesError;

        const groupedWeeks = Object.values(
          (entriesData || []).reduce((acc: Record<string, any>, entry: any) => {
            const weekNumber = entry.week_number || 1;
            const key = String(weekNumber);
            if (!acc[key]) {
              acc[key] = {
                id: key,
                week_number: weekNumber,
                title: `Week ${weekNumber}`,
                status: 'active',
                description: entry.activity_description,
                entryCount: 0,
              };
            }
            acc[key].entryCount += 1;
            return acc;
          }, {})
        );

        setWeeks(groupedWeeks);
      } catch (error) {
        console.error('Error fetching logbook:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddWeek = async () => {
    if (!newWeekNumber) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('logbook_entries')
        .insert({
          logbook_id: params.id,
          user_id: user.id,
          entry_date: new Date().toISOString().slice(0, 10),
          week_number: parseInt(newWeekNumber),
          title: `Week ${newWeekNumber}`,
          activity_description: '',
          source_type: 'text',
        });

      if (error) throw error;

      // Refresh weeks
      const { data: weeksData } = await supabase
        .from('logbook_entries')
        .select('*')
        .eq('logbook_id', params.id)
        .order('week_number', { ascending: true });

      const groupedWeeks = Object.values(
        (weeksData || []).reduce((acc: Record<string, any>, entry: any) => {
          const weekNumber = entry.week_number || 1;
          const key = String(weekNumber);
          if (!acc[key]) {
            acc[key] = {
              id: key,
              week_number: weekNumber,
              title: `Week ${weekNumber}`,
              status: 'active',
              description: entry.activity_description,
              entryCount: 0,
            };
          }
          acc[key].entryCount += 1;
          return acc;
        }, {})
      );
      setWeeks(groupedWeeks);
      setNewWeekNumber('');
      setShowAddWeek(false);
    } catch (error) {
      console.error('Error adding week:', error);
      alert('Failed to add week. Please try again.');
    }
  };

  const handleDeleteWeek = async (weekId: string) => {
    if (!confirm('Are you sure you want to delete this week?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('logbook_entries')
        .delete()
        .eq('logbook_id', params.id)
        .eq('week_number', Number(weekId));

      if (error) throw error;

      setWeeks(weeks.filter(w => w.id !== weekId));
    } catch (error) {
      console.error('Error deleting week:', error);
      alert('Failed to delete week. Please try again.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
          leftIcon={<ChevronLeftIcon size={20} />}
        >
          Back to Logbooks
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">{logbook?.title || 'Logbook'}</h1>
        <p className="text-muted-foreground">
          {logbook?.program_type || 'No program type set'}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Weeks</h2>
          <Button
            onClick={() => setShowAddWeek(!showAddWeek)}
            size="sm"
            leftIcon={<CreateIcon size={20} />}
          >
            Add Week
          </Button>
        </div>

        {showAddWeek && (
          <Card className="p-4 mb-4">
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Week number"
                value={newWeekNumber}
                onChange={(e: any) => setNewWeekNumber(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <Button onClick={handleAddWeek} size="md">
                Add
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowAddWeek(false)}
                size="md"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {weeks.length === 0 ? (
          <Card className="p-8 text-center">
            <CalendarIcon size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No weeks added yet</p>
            <Button
              onClick={() => setShowAddWeek(true)}
              size="md"
            >
              Add Your First Week
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeks.map((week) => (
              <Card key={week.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {week.title || `Week ${week.week_number}`}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      week.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {week.entryCount} {week.entryCount === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/logbook/${params.id}/week/${week.id}`);
                      }}
                    >
                      <EditIcon size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWeek(week.id);
                      }}
                    >
                      <DeleteIcon size={16} />
                    </Button>
                  </div>
                </div>
                {week.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {week.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
