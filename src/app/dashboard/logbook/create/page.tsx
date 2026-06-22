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
    academicSession: '',
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

      // Create a report that serves as the logbook
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          title: formData.name,
          report_type: 'logbook',
          status: 'draft',
          progress_percentage: 0,
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Create report metadata
      const { error: metadataError } = await supabase
        .from('report_metadata')
        .insert({
          report_id: report.id,
          academic_session: formData.academicSession,
        });

      if (metadataError) throw metadataError;

      router.push(`/dashboard/logbook/${report.id}`);
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
              label="Academic Session"
              placeholder="e.g., 2023/2024"
              value={formData.academicSession}
              onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
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
