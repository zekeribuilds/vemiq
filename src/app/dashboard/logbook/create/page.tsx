'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';

export default function CreateLogbookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    programType: 'SIWES' as 'SIWES' | 'SWEP',
    organization: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: logbook, error: logbookError } = await supabase
        .from('logbooks')
        .insert({
          user_id: user.id,
          title: formData.name,
          program_type: formData.programType,
          department_name: formData.organization || null,
        })
        .select()
        .single();

      if (logbookError) throw logbookError;

      router.push(`/dashboard/logbook/${logbook.id}`);
    } catch (error) {
      console.error('Error creating logbook:', error);
      alert('Failed to create logbook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Logbook</h1>
          <p className="text-muted-foreground">Start documenting your SIWES/SWEP activities</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Logbook Name"
              placeholder="e.g., SIWES 2024 Logbook"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />

            <Input
              label="Program Type"
              placeholder="SIWES or SWEP"
              value={formData.programType}
              onChange={(e) => setFormData({ ...formData, programType: e.target.value.toUpperCase() === 'SWEP' ? 'SWEP' : 'SIWES' })}
              required
              fullWidth
            />

            <Input
              label="Training Organization"
              placeholder="e.g., Google Nigeria"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              fullWidth
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                className="flex-1"
              >
                Create Logbook
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
