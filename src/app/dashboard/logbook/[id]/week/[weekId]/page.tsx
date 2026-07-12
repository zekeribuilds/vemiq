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
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch week data
        const { data: weekData, error: weekError } = await supabase
          .from('weekly_logs')
          .select('*')
          .eq('id', params.weekId)
          .single();

        if (weekError) throw weekError;
        setWeek(weekData);

        // Initialize daily entries from description (stored as JSON)
        if (weekData.description) {
          try {
            const entries = JSON.parse(weekData.description);
            setDailyEntries(entries);
          } catch {
            setDailyEntries({});
          }
        }

        // Fetch attachments
        const { data: uploadsData } = await supabase
          .from('uploads')
          .select('*')
          .eq('report_id', params.id) // Using report_id to link to this logbook
          .order('uploaded_at', { ascending: false });

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
      const { error } = await supabase
        .from('weekly_logs')
        .update({ 
          description: JSON.stringify(dailyEntries),
          updated_at: new Date().toISOString()
        })
        .eq('id', params.weekId);

      if (error) throw error;
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
          dailyEntries,
        }),
      });

      const data = await response.json();
      
      if (data.summary) {
        const supabase = createClient();
        await supabase
          .from('weekly_logs')
          .update({ summary: data.summary })
          .eq('id', params.weekId);
        
        setWeek((prev: any) => ({ ...prev, summary: data.summary }));
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
      formData.append('reportId', params.id);
      formData.append('weeklyLogId', params.weekId);
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
            {week?.summary ? (
              <p className="text-sm text-muted-foreground">{week.summary}</p>
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
