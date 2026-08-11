'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { ResponsiveHeader } from '@/components/layout/ResponsiveHeader';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';

export default function CreateProgramPage() {
  const router = useRouter();
  const [program, setProgram] = useState({
    title: '',
    type: 'SIWES',
    organization_name: '',
    supervisor_name: '',
    start_date: '',
    end_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { error: insertError } = await supabase
        .from('programs')
        .insert({
          user_id: user.id,
          title: program.title,
          type: program.type,
          organization_name: program.organization_name,
          supervisor_name: program.supervisor_name,
          start_date: program.start_date,
          end_date: program.end_date,
        });

      if (insertError) throw insertError;

      router.push('/evidence');
    } catch (err: any) {
      console.error('Error creating program:', err);
      setError(err.message || 'Failed to create program');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <ResponsiveHeader title="Create Workspace" />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-[#FFFFFF]">Create Workspace</h1>
        </div>

        <Card className="p-6 bg-[#1F1F1F] border-[#2A2A2A] rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Program Type Selection */}
            <div>
              <label className="block text-sm font-medium text-[#898989] mb-3">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setProgram({ ...program, type: 'SIWES' })}
                  className={`flex-1 px-4 py-3 rounded-lg transition-all ${
                    program.type === 'SIWES'
                      ? 'bg-[#6C63FF] text-white'
                      : 'bg-[#171717] text-[#898989] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]'
                  }`}
                >
                  <span className="text-sm font-medium">SIWES</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProgram({ ...program, type: 'SWEP' })}
                  className={`flex-1 px-4 py-3 rounded-lg transition-all ${
                    program.type === 'SWEP'
                      ? 'bg-[#6C63FF] text-white'
                      : 'bg-[#171717] text-[#898989] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]'
                  }`}
                >
                  <span className="text-sm font-medium">SWEP</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label="Title"
                value={program.title}
                onChange={(e) => setProgram({ ...program, title: e.target.value })}
                placeholder="e.g., SIWES 2026"
                required
                fullWidth
                className="rounded-lg"
              />

              <Input
                label="Organization"
                value={program.organization_name}
                onChange={(e) => setProgram({ ...program, organization_name: e.target.value })}
                placeholder="e.g., Tech Company Ltd"
                required
                fullWidth
                className="rounded-lg"
              />

              <Input
                label="Supervisor"
                value={program.supervisor_name}
                onChange={(e) => setProgram({ ...program, supervisor_name: e.target.value })}
                placeholder="e.g., Dr. John Doe"
                required
                fullWidth
                className="rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#898989] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={program.start_date}
                    onChange={(e) => setProgram({ ...program, start_date: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#171717] border border-[#2A2A2A] rounded-lg text-[#FFFFFF] text-sm focus:border-[#6C63FF] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#898989] mb-2">End Date</label>
                  <input
                    type="date"
                    value={program.end_date}
                    onChange={(e) => setProgram({ ...program, end_date: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#171717] border border-[#2A2A2A] rounded-lg text-[#FFFFFF] text-sm focus:border-[#6C63FF] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs flex items-center gap-2">
                <VemiqIcon category="status" name="error" size={16} />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="secondary"
                className="bg-[#2A2A2A] hover:bg-[#3A3A3A] border-[#2A2A2A] rounded-lg py-3 flex-1"
              >
                <span className="text-sm font-medium">Cancel</span>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-lg py-3 flex-1"
                leftIcon={<VemiqIcon category="action" name="create" size={16} />}
              >
                <span className="text-sm font-medium">{isSubmitting ? 'Creating...' : 'Create'}</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
