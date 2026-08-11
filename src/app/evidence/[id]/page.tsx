'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

export default function EvidenceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [evidence, setEvidence] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedTranscript, setEditedTranscript] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadEvidence();
  }, [params.id]);

  const loadEvidence = async () => {
    try {
      const supabase = createClient();
      const { data: evidenceData } = await supabase
        .from('evidence')
        .select('*')
        .eq('id', params.id)
        .single();

      if (evidenceData) {
        setEvidence(evidenceData);
        setEditedTitle(evidenceData.title);
        setEditedTranscript(evidenceData.transcript || '');

        // Load program details
        const { data: programData } = await supabase
          .from('programs')
          .select('*')
          .eq('id', evidenceData.program_id)
          .single();

        setProgram(programData);
      }
    } catch (error) {
      console.error('Error loading evidence:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('evidence')
        .update({
          title: editedTitle,
          transcript: editedTranscript,
          summary: editedTranscript.substring(0, 200),
        })
        .eq('id', params.id);

      if (error) throw error;

      setIsEditing(false);
      loadEvidence();
    } catch (error) {
      console.error('Error saving evidence:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this evidence?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('evidence')
        .delete()
        .eq('id', params.id);

      if (error) throw error;

      router.push('/evidence');
    } catch (error) {
      console.error('Error deleting evidence:', error);
    }
  };

  if (!evidence) {
    return (
      <div className="min-h-screen bg-[#171717] pt-16">
        <ResponsiveHeader title="Evidence Detail" />
        <div className="max-w-7xl mx-auto p-4 md:p-8 text-center">
          <div className="w-16 h-16 bg-[#6C63FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <VemiqIcon category="status" name="loading" size={32} className="text-[#6C63FF] animate-spin" />
          </div>
          <p className="text-[#898989]">Loading evidence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <ResponsiveHeader title="Evidence Detail" />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-xl md:text-2xl font-semibold text-[#FFFFFF] bg-[#171717] border border-[#2A2A2A] rounded-lg px-4 py-2 focus:border-[#6C63FF] focus:outline-none"
                />
              ) : (
                <h1 className="text-xl md:text-2xl font-semibold text-[#FFFFFF] mb-2">{evidence.title}</h1>
              )}
              <div className="flex items-center gap-2 text-xs text-[#898989]">
                <span className="px-2 py-1 bg-[#6C63FF]/20 text-[#6C63FF] rounded-full font-medium">
                  Week {evidence.week_number}
                </span>
                <span>•</span>
                <span>{new Date(evidence.activity_date).toLocaleDateString()}</span>
                {program && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-[#2A2A2A] rounded-full">{program.title}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-lg px-4 py-2"
                    leftIcon={<VemiqIcon category="action" name="save" size={16} />}
                  >
                    <span className="text-sm font-medium">{isSaving ? 'Saving...' : 'Save'}</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-lg px-4 py-2"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTitle(evidence.title);
                      setEditedTranscript(evidence.transcript || '');
                    }}
                  >
                    <span className="text-sm font-medium">Cancel</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-lg px-3 py-2"
                    onClick={() => setIsEditing(true)}
                    leftIcon={<VemiqIcon category="action" name="edit" size={16} />}
                  />
                  <Button
                    variant="secondary"
                    className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500 rounded-lg px-3 py-2"
                    onClick={handleDelete}
                    leftIcon={<VemiqIcon category="action" name="delete" size={16} />}
                  />
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Content */}
        <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
          <h2 className="text-sm font-medium text-[#898989] mb-4 uppercase tracking-wide">Content</h2>
          
          {isEditing ? (
            <textarea
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              placeholder="Describe your activities, learnings, and achievements..."
              className="w-full min-h-[200px] px-4 py-3 bg-[#171717] border border-[#2A2A2A] rounded-lg text-[#FFFFFF] placeholder-[#898989] focus:border-[#6C63FF] focus:outline-none resize-none text-sm leading-relaxed"
            />
          ) : (
            <div className="space-y-4">
              {evidence.transcript ? (
                <p className="text-sm text-[#FFFFFF] leading-relaxed whitespace-pre-wrap">
                  {evidence.transcript}
                </p>
              ) : (
                <div className="text-center py-6">
                  <VemiqIcon category="empty" name="no_data" size={32} className="mx-auto mb-2 text-[#898989]" />
                  <p className="text-sm text-[#898989]">No content available</p>
                </div>
              )}
              
              {evidence.summary && (
                <div className="p-4 bg-[#171717] rounded-lg">
                  <p className="text-xs text-[#898989] mb-2 font-medium">AI Summary</p>
                  <p className="text-sm text-[#FFFFFF] leading-relaxed">{evidence.summary}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Details */}
        <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
          <h2 className="text-sm font-medium text-[#898989] mb-4 uppercase tracking-wide">Details</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-[#2A2A2A]">
              <span className="text-sm text-[#898989]">Created</span>
              <span className="text-sm text-[#FFFFFF] font-medium">{new Date(evidence.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#2A2A2A]">
              <span className="text-sm text-[#898989]">Activity Date</span>
              <span className="text-sm text-[#FFFFFF] font-medium">{new Date(evidence.activity_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[#898989]">Week</span>
              <span className="text-sm text-[#FFFFFF] font-medium">{evidence.week_number}</span>
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <Button
          fullWidth
          variant="secondary"
          className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-xl py-3"
          onClick={() => router.back()}
          leftIcon={<VemiqIcon category="nav" name="activity" size={16} />}
        >
          <span className="text-sm font-medium">Back to Timeline</span>
        </Button>
      </div>
    </div>
  );
}
