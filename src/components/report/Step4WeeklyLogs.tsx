'use client';

import { useState } from 'react';
import { CreateIcon, DeleteIcon, SaveIcon, ImagesIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Textarea } from '@/design-system/components/Textarea';
import { Card } from '@/design-system/components/Card';
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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4">Weekly Logs</h2>
      <p className="text-muted-foreground mb-8">Add your weekly activities, descriptions, and supporting images during industrial training.</p>

      <Card className="mb-8 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add Week {currentWeek}</h3>

        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-foreground mb-2">
              Images (Optional)
            </label>
            <ImageUpload onImagesChange={setImages} />
          </div>

          <Button
            type="button"
            onClick={handleAddLog}
            disabled={!title.trim() || !description.trim()}
            leftIcon={<CreateIcon size={20} />}
            size="md"
          >
            Add Week
          </Button>
        </div>
      </Card>

      {weeklyLogs.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-foreground">Added Weeks</h3>

          {weeklyLogs.map((log) => (
            <Card
              key={log.week}
              className="p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-foreground">Week {log.week}: {log.title}</h4>
                <Button
                  onClick={() => handleDeleteLog(log.week)}
                  variant="ghost"
                  size="sm"
                  leftIcon={<DeleteIcon size={18} />}
                >
                  Delete
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mb-3">{log.description}</p>
              {log.images && log.images.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImagesIcon size={16} />
                  <span>{log.images.length} image{log.images.length > 1 ? 's' : ''} attached</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" onClick={() => setStep(3)} variant="ghost" size="md">
          Back
        </Button>
        <Button onClick={handleSubmit} leftIcon={<SaveIcon size={20} />} size="md">
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
