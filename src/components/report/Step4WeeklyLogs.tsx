'use client';

import { useState } from 'react';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Textarea } from '@/design-system/components/Textarea';
import { Card } from '@/design-system/components/Card';
import { Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import { useReportStore } from '@/store/reportStore';
import ImageUpload from './ImageUpload';

export default function Step4WeeklyLogs() {
  const { weeklyLogs, addWeeklyLog, updateWeeklyLog, setStep } = useReportStore();
  const [currentWeek, setCurrentWeek] = useState(weeklyLogs.length + 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleAddLog = () => {
    if (title.trim() && description.trim()) {
      addWeeklyLog({ week: currentWeek, title, description, images });
      setTitle('');
      setDescription('');
      setImages([]);
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleDeleteLog = (week: number) => {
    const updatedLogs = weeklyLogs.filter((log) => log.week !== week);
    const renumberedLogs = updatedLogs.map((log, index) => ({
      ...log,
      week: index + 1,
    }));
    renumberedLogs.forEach((log) => {
      if (!weeklyLogs.find((l) => l.week === log.week)) {
        addWeeklyLog(log);
      }
    });
    setCurrentWeek(renumberedLogs.length + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(5);
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <h2 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        Weekly Logs
      </h2>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        color: colors.text.secondary,
        marginBottom: spacing.xl,
      }}>
        Add your weekly activities, descriptions, and supporting images during industrial training.
      </p>

      <Card style={{ marginBottom: spacing.xl, padding: spacing.xl }}>
        <h3 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '18px',
          fontWeight: '600',
          color: colors.text.primary,
          marginBottom: spacing.lg,
        }}>
          Add Week {currentWeek}
        </h3>

        <Stack spacing="lg">
          <Input
            type="text"
            label="Week Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Introduction to Company Operations"
            fullWidth
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you learned and did this week..."
            fullWidth
          />

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}>
              Images (Optional)
            </label>
            <ImageUpload onImagesChange={setImages} />
          </div>

          <Button
            type="button"
            onClick={handleAddLog}
            disabled={!title.trim() || !description.trim()}
            icon="add"
            iconPosition="left"
            size="md"
          >
            Add Week
          </Button>
        </Stack>
      </Card>

      {weeklyLogs.length > 0 && (
        <div style={{ marginBottom: spacing.xl }}>
          <h3 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: spacing.lg,
          }}>
            Added Weeks
          </h3>

          <Stack spacing="lg">
            {weeklyLogs.map((log) => (
              <Card
                key={log.week}
                style={{ padding: spacing.xl }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
                  <h4 style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.text.primary,
                  }}>
                    Week {log.week}: {log.title}
                  </h4>
                  <Button
                    onClick={() => handleDeleteLog(log.week)}
                    variant="ghost"
                    size="sm"
                    icon="remove"
                    iconPosition="left"
                  >
                    Delete
                  </Button>
                </div>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                  marginBottom: spacing.md,
                }}>
                  {log.description}
                </p>
                {log.images && log.images.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{ color: colors.text.secondary }}>
                      <VemiqIcon category="content" name="image" size={16} />
                    </div>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      color: colors.text.secondary,
                    }}>
                      {log.images.length} image{log.images.length > 1 ? 's' : ''} attached
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </Stack>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button type="button" onClick={() => setStep(3)} variant="ghost" size="md">
          Back
        </Button>
        <Button onClick={handleSubmit} icon="save" iconPosition="left" size="md">
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
