'use client';

import { useReportStore } from '@/store/reportStore';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

export default function Step3ReportStructure() {
  const { reportStructure, setReportStructure, setStep } = useReportStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4">Report Structure</h2>
      <p className="text-muted-foreground mb-8">Customize the sections you want in your report.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8">
          <label className="block text-sm font-medium text-foreground mb-2">
            Number of Chapters
          </label>
          <select
            value={reportStructure.numberOfChapters}
            onChange={(e) => setReportStructure({ numberOfChapters: parseInt(e.target.value) })}
            className="input-field"
          >
            <option value={3}>3 Chapters</option>
            <option value={4}>4 Chapters</option>
            <option value={5}>5 Chapters</option>
            <option value={6}>6 Chapters</option>
          </select>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Include Sections</h3>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-2xl hover:bg-primary/10 transition-colors">
            <input
              type="checkbox"
              checked={reportStructure.includeDedication}
              onChange={(e) => setReportStructure({ includeDedication: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-muted-foreground">Dedication</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-2xl hover:bg-primary/10 transition-colors">
            <input
              type="checkbox"
              checked={reportStructure.includeAcknowledgement}
              onChange={(e) => setReportStructure({ includeAcknowledgement: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-muted-foreground">Acknowledgement</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-2xl hover:bg-primary/10 transition-colors">
            <input
              type="checkbox"
              checked={reportStructure.includeAbstract}
              onChange={(e) => setReportStructure({ includeAbstract: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-muted-foreground">Abstract</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-2xl hover:bg-primary/10 transition-colors">
            <input
              type="checkbox"
              checked={reportStructure.includeTableOfContents}
              onChange={(e) => setReportStructure({ includeTableOfContents: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-muted-foreground">Table of Contents</span>
          </label>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => setStep(2)}
            variant="ghost"
            size="md"
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
      </form>
    </div>
  );
}
