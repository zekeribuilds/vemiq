import { VemiqIcon } from '@/components/VemiqIcon';
import { colors, spacing } from '@/design-system/tokens/index';

interface ReportCardProps {
  title: string;
  type: 'SWEP' | 'SIWES';
  progress: number;
  lastEdited: string;
}

export default function ReportCard({ title, type, progress, lastEdited }: ReportCardProps) {
  const getProgressColor = () => {
    if (progress >= 75) return colors.success;
    if (progress >= 50) return colors.success;
    if (progress >= 25) return colors.warning;
    return colors.danger;
  };

  return (
    <div style={{
      padding: spacing.lg,
      cursor: 'pointer',
      backgroundColor: colors.background.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = colors.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = colors.border;
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <div style={{
          width: '56px',
          height: '56px',
          backgroundColor: colors.primary,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ color: colors.text.primary }}>
            <VemiqIcon category="nav" name="reports" size={28} />
          </div>
        </div>
        <span style={{
          padding: `${spacing.xs} ${spacing.sm}`,
          backgroundColor: `${colors.primary}1A`,
          color: colors.primary,
          borderRadius: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
          fontWeight: '500',
        }}>
          {type}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.sm,
      }}>
        {title}
      </h3>

      <div style={{ marginBottom: spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text.secondary,
          }}>
            Progress
          </span>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            color: colors.text.secondary,
          }}>
            {progress}%
          </span>
        </div>
        <div style={{ width: '100%', backgroundColor: colors.background.elevated, borderRadius: '9999px', height: '8px' }}>
          <div
            style={{
              backgroundColor: getProgressColor(),
              height: '8px',
              borderRadius: '9999px',
              transition: 'all 0.5s ease',
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{ color: colors.text.secondary }}>
            <VemiqIcon category="action" name="edit" size={16} />
          </div>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text.secondary,
          }}>
            {lastEdited}
          </span>
        </div>
        <div style={{ color: colors.text.secondary }}>
          <VemiqIcon category="action" name="edit" size={20} />
        </div>
      </div>
    </div>
  );
}
