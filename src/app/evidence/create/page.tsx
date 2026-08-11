'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

type EvidenceMethod = 'voice' | 'photo' | 'text';

export default function CreateEvidencePage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [method, setMethod] = useState<EvidenceMethod>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textEvidence, setTextEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const loadPrograms = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: programsData } = await supabase
          .from('programs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setPrograms(programsData || []);
        if (programsData && programsData.length > 0) {
          setSelectedProgram(programsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // In a real implementation, this would start the MediaRecorder API
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real implementation, this would stop recording and upload the audio
  };

  const handleSubmit = async () => {
    if (!selectedProgram) {
      setError('Please select a program');
      return;
    }

    if (method === 'text' && !textEvidence.trim()) {
      setError('Please enter your evidence');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Calculate week number based on program start date
      const program = programs.find((p) => p.id === selectedProgram);
      const startDate = new Date(program.start_date);
      const today = new Date();
      const weekNumber = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

      const { error: insertError } = await supabase
        .from('evidence')
        .insert({
          user_id: user.id,
          program_id: selectedProgram,
          title: method === 'voice' ? 'Voice Recording' : method === 'photo' ? 'Photo Evidence' : 'Text Note',
          transcript: method === 'text' ? textEvidence : null,
          summary: method === 'text' ? textEvidence.substring(0, 200) : null,
          activity_date: today.toISOString().split('T')[0],
          week_number: Math.max(1, weekNumber),
        });

      if (insertError) throw insertError;

      router.push('/evidence');
    } catch (err: any) {
      console.error('Error creating evidence:', err);
      setError(err.message || 'Failed to create evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <ResponsiveHeader title="Create Evidence" />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-[#FFFFFF]">Create Evidence</h1>
        </div>

        {/* Workspace Selection */}
        {programs.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#898989]">Workspace:</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-3 py-2 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg text-[#FFFFFF] text-sm focus:border-[#6C63FF] focus:outline-none transition-all"
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Method Selection */}
        <Card className="p-4 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
          <div className="flex gap-2">
            <button
              onClick={() => setMethod('voice')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                method === 'voice'
                  ? 'bg-[#6C63FF] text-white'
                  : 'bg-[#171717] text-[#898989] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]'
              }`}
            >
              <VemiqIcon category="content" name="voice" size={18} />
              <span className="text-sm font-medium">Voice</span>
            </button>
            <button
              onClick={() => setMethod('photo')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                method === 'photo'
                  ? 'bg-[#6C63FF] text-white'
                  : 'bg-[#171717] text-[#898989] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]'
              }`}
            >
              <VemiqIcon category="content" name="image" size={18} />
              <span className="text-sm font-medium">Photo</span>
            </button>
            <button
              onClick={() => setMethod('text')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                method === 'text'
                  ? 'bg-[#6C63FF] text-white'
                  : 'bg-[#171717] text-[#898989] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]'
              }`}
            >
              <VemiqIcon category="content" name="text" size={18} />
              <span className="text-sm font-medium">Text</span>
            </button>
          </div>
        </Card>

        {/* Evidence Input */}
        <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
          {method === 'voice' && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                <VemiqIcon category="content" name="voice" size={40} className="text-[#6C63FF]" />
              </div>
              
              {isRecording ? (
                <div className="space-y-4">
                  <p className="text-3xl font-bold text-[#6C63FF]">{formatTime(recordingTime)}</p>
                  <Button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 rounded-lg px-6 py-3"
                    leftIcon={<VemiqIcon category="status" name="error" size={16} />}
                  >
                    <span className="text-sm font-medium">Stop</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={startRecording}
                  className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-lg px-6 py-3"
                  leftIcon={<VemiqIcon category="action" name="create" size={16} />}
                >
                  <span className="text-sm font-medium">Start Recording</span>
                </Button>
              )}
            </div>
          )}

          {method === 'photo' && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#2A2A2A] flex items-center justify-center border-2 border-dashed border-[#898989]">
                <VemiqIcon category="content" name="image" size={40} className="text-[#898989]" />
              </div>
              <Button
                variant="secondary"
                className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-lg px-6 py-3"
                leftIcon={<VemiqIcon category="action" name="upload" size={16} />}
              >
                <span className="text-sm font-medium">Upload Photo</span>
              </Button>
            </div>
          )}

          {method === 'text' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#898989] mb-2">Your Evidence</label>
              <textarea
                value={textEvidence}
                onChange={(e) => setTextEvidence(e.target.value)}
                placeholder="What did you do today?"
                className="w-full min-h-[150px] px-4 py-3 bg-[#171717] border border-[#2A2A2A] rounded-lg text-[#FFFFFF] placeholder-[#898989] focus:border-[#6C63FF] focus:outline-none resize-none text-sm leading-relaxed"
              />
              <p className="text-xs text-[#898989]">{textEvidence.length} characters</p>
            </div>
          )}
        </Card>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs flex items-center gap-2">
            <VemiqIcon category="status" name="error" size={16} />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-lg py-3 flex-1"
          >
            <span className="text-sm font-medium">Cancel</span>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-lg py-3 flex-1"
            leftIcon={<VemiqIcon category="action" name="save" size={16} />}
          >
            <span className="text-sm font-medium">{isSubmitting ? 'Saving...' : 'Save'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
