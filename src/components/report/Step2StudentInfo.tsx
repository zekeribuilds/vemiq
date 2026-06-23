'use client';

import { useReportStore } from '@/store/reportStore';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import { Stack, Grid } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';

export default function Step2StudentInfo() {
  const { studentInfo, setStudentInfo, setStep } = useReportStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: `${colors.primary}1A`,
          color: colors.primary,
          borderRadius: '9999px',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: spacing.lg,
        }}>
          <div style={{ color: colors.primary }}>
            <VemiqIcon category="status" name="sparkles" size={16} />
          </div>
          <span>Step 2 of 7</span>
        </div>
        <h2 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '30px',
          fontWeight: '700',
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}>
          Report Details
        </h2>
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          color: colors.text.secondary,
        }}>
          Provide the industrial training details for this report.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Stack spacing="lg">
          <Card style={{ padding: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.info})`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ color: colors.text.primary }}>
                  <VemiqIcon category="data" name="database" size={20} />
                </div>
              </div>
              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '20px',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Academic Session
              </h3>
            </div>

            <Grid columns={2} gap="lg">
              <Input
                type="text"
                label="Academic Session"
                required
                value={studentInfo.academicSession}
                onChange={(e) => setStudentInfo({ academicSession: e.target.value })}
                placeholder="2024/2025"
                fullWidth
              />
            </Grid>
          </Card>

          <Card style={{ padding: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.info})`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ color: colors.text.primary }}>
                  <VemiqIcon category="data" name="database" size={20} />
                </div>
              </div>
              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '20px',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Training Organization
              </h3>
            </div>

            <Grid columns={2} gap="lg">
              <Input
                type="text"
                label="Training Organization"
                required
                value={studentInfo.companyName}
                onChange={(e) => setStudentInfo({ companyName: e.target.value })}
                placeholder="Tech Solutions Ltd"
                fullWidth
              />

              <Input
                type="text"
                label="Organization Department"
                required
                value={studentInfo.organizationDepartment}
                onChange={(e) => setStudentInfo({ organizationDepartment: e.target.value })}
                placeholder="Software Engineering"
                fullWidth
              />
            </Grid>
          </Card>

          <Card style={{ padding: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.info})`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ color: colors.text.primary }}>
                  <VemiqIcon category="nav" name="profile" size={20} />
                </div>
              </div>
              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '20px',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Supervision
              </h3>
            </div>

            <Grid columns={2} gap="lg">
              <Input
                type="text"
                label="Supervisor Name"
                required
                value={studentInfo.supervisorName}
                onChange={(e) => setStudentInfo({ supervisorName: e.target.value })}
                placeholder="Engr. Smith"
                fullWidth
              />

              <Input
                type="text"
                label="Coordinator Name"
                required
                value={studentInfo.coordinatorName}
                onChange={(e) => setStudentInfo({ coordinatorName: e.target.value })}
                placeholder="Dr. Johnson"
                fullWidth
              />
            </Grid>
          </Card>

          <Card style={{ padding: spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.info})`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ color: colors.text.primary }}>
                  <VemiqIcon category="nav" name="profile" size={20} />
                </div>
              </div>
              <h3 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '20px',
                fontWeight: '600',
                color: colors.text.primary,
              }}>
                Training Period
              </h3>
            </div>

            <Grid columns={2} gap="lg">
              <Input
                type="date"
                label="Start Date"
                required
                value={studentInfo.startDate}
                onChange={(e) => setStudentInfo({ startDate: e.target.value })}
                fullWidth
              />

              <Input
                type="date"
                label="End Date"
                required
                value={studentInfo.endDate}
                onChange={(e) => setStudentInfo({ endDate: e.target.value })}
                fullWidth
              />
            </Grid>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="button"
              onClick={() => setStep(1)}
              variant="ghost"
              size="md"
              icon="close"
              iconPosition="left"
            >
              Back
            </Button>
            <Button
              type="submit"
              size="md"
            >
              Continue
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}
