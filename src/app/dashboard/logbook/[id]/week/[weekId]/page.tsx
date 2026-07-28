'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { ChevronLeftIcon, SaveIcon, MicIcon, CameraIcon, UploadIcon, SparklesIcon } from '@/design-system';
import { FileUpload } from '@/components/upload/FileUpload';
import { AttachmentViewer } from '@/components/upload/AttachmentViewer';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeekDetailPage({ params }: { params: { id: string; weekId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [week, setWeek] = useState<any>(null);
  const [dailyEntries, setDailyEntries] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        const weekNumber = Number(params.weekId);

        const { data: logbookData, error: logbookError } = await supabase
          .from('logbooks')
          .select('*')
          .eq('id', params.id)
          .single();

        if (logbookError) throw logbookError;
        setWeek({
          id: params.weekId,
          title: `Week ${weekNumber}`,
          week_number: weekNumber,
          status: logbookData.status,
        });

        const { data: entriesData, error: entriesError } = await supabase
          .from('logbook_entries')
          .select('*')
          .eq('logbook_id', params.id)
          .eq('week_number', weekNumber)
          .order('entry_date', { ascending: true });

        if (entriesError) throw entriesError;

        const entriesByDay = (entriesData || []).reduce((acc: Record<string, string>, entry: any) => {
          const day = DAYS.includes(entry.title) ? entry.title : DAYS[0];
          acc[day] = entry.activity_description || '';
          return acc;
        }, {});

        setDailyEntries(entriesByDay);

        // Fetch attachments
        const { data: uploadsData } = await supabase
          .from('uploads')
          .select('*')
          .eq('linked_to', `${params.id}:week:${params.weekId}`)
          .order('created_at', { ascending: false });

        setAttachments(uploadsData || []);
      } catch (error) {
        console.error('Error fetching week:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.weekId, params.id]);

  const handleDayChange = (day: string, content: string) => {
    setDailyEntries((prev: Record<string, string>) => ({ ...prev, [day]: content }));
    setSaveStatus('unsaved');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const weekNumber = Number(params.weekId);

      const { error } = await supabase
        .from('logbook_entries')
        .delete()
        .eq('logbook_id', params.id)
        .eq('week_number', weekNumber);

      if (error) throw error;

      const entries = Object.entries(dailyEntries)
        .filter(([, content]) => content.trim().length > 0)
        .map(([day, content], index) => ({
          logbook_id: params.id,
          user_id: user.id,
          entry_date: new Date(Date.now() + index * 86400000).toISOString().slice(0, 10),
          week_number: weekNumber,
          title: day,
          activity_description: content,
          source_type: 'text' as const,
        }));

      if (entries.length > 0) {
        const { error: insertError } = await supabase
          .from('logbook_entries')
          .insert(entries);

        if (insertError) throw insertError;
      }

      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving entries:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Autosave every 5 seconds if unsaved
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (saveStatus === 'unsaved' && !isSaving) {
      interval = setTimeout(() => {
        handleSave();
      }, 5000);
    }
    return () => clearTimeout(interval);
  }, [saveStatus, isSaving]);

  const handleGenerateSummary = async () => {
    try {
      const response = await fetch('/api/ai/summarize-logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekId: params.weekId,
          logbookId: params.id,
          dailyEntries,
        }),
      });

      const data = await response.json();
      
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      formData.append('linkedTo', `${params.id}:week:${params.weekId}`);
      formData.append('fileType', file.type);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAttachments(prev => [data.upload, ...prev]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const response = await fetch(`/api/uploads?uploadId=${attachmentId}&userId=${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setAttachments(prev => prev.filter(a => a.id !== attachmentId));
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const handleDownloadAttachment = (attachment: any) => {
    window.open(attachment.file_url, '_blank');
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
          Back to Logbook
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {week?.title || `Week ${week?.week_number}`}
        </h1>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            week?.status === 'completed' ? 'bg-green-100 text-green-700' :
            week?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {week?.status}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${saveStatus === 'saved' ? 'text-green-600' : saveStatus === 'saving' ? 'text-yellow-600' : 'text-gray-500'}`}>
              {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
            </span>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              size="sm"
              variant="secondary"
              leftIcon={<SaveIcon size={16} />}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {DAYS.map((day) => (
            <Card key={day} className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{day}</h3>
              <textarea
                value={dailyEntries[day] || ''}
                onChange={(e) => handleDayChange(day, e.target.value)}
                placeholder={`Describe your activities for ${day.toLowerCase()}...`}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<MicIcon size={16} />}
                  onClick={() => setSelectedDay(day)}
                >
                  Voice
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<CameraIcon size={16} />}
                  onClick={() => setSelectedDay(day)}
                >
                  Image
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<UploadIcon size={16} />}
                  onClick={() => setSelectedDay(day)}
                >
                  Upload
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">AI Summary</h3>
            {summary ? (
              <p className="text-sm text-muted-foreground">{summary}</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No summary generated yet</p>
            )}
            <Button
              onClick={handleGenerateSummary}
              size="sm"
              leftIcon={<SparklesIcon size={16} />}
              fullWidth
            >
              Generate Summary
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Attachments</h3>
            <div className="mb-4">
              <FileUpload
                onUpload={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,audio/*"
                label="Add Attachment"
              />
            </div>
            <AttachmentViewer
              attachments={attachments}
              onDelete={handleDeleteAttachment}
              onDownload={handleDownloadAttachment}
            />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
