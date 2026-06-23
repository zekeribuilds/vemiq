'use client';

import { Card } from '@/design-system/components/Card';
import { colors, spacing } from '@/design-system/tokens/index';

interface StudentIdentityCardProps {
  userName: string;
  institution: string | null;
  faculty: string | null;
  department: string | null;
  currentLevel: string | null;
}

export default function StudentIdentityCard({
  userName,
  institution,
  faculty,
  department,
  currentLevel,
}: StudentIdentityCardProps) {
  return (
    <Card style={{ padding: spacing.lg }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <div>
          <h2 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: spacing.xs,
          }}>
            {userName}
          </h2>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text.secondary,
          }}>
            {institution || 'Not specified'}
          </p>
        </div>
        <div style={{
          padding: `${spacing.xs} ${spacing.sm}`,
          backgroundColor: `${colors.primary}1A`,
          border: `1px solid ${colors.primary}33`,
          borderRadius: '9999px',
        }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '500',
            color: colors.primary,
          }}>
            {currentLevel || 'Not specified'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing.md }}>
        <div>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '400',
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}>
            Faculty
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text.primary,
          }}>
            {faculty || 'Not specified'}
          </p>
        </div>
        <div>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '400',
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}>
            Department
          </p>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text.primary,
          }}>
            {department || 'Not specified'}
          </p>
        </div>
      </div>
    </Card>
  );
}
