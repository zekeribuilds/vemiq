'use client';

import { useReportStore } from '@/store/reportStore';
import { OrganizationIcon, ProfileIcon, SparklesIcon, ArrowLeftIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';

export default function Step2StudentInfo() {
  const { studentInfo, setStudentInfo, setStep } = useReportStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <SparklesIcon size={16} />
          <span>Step 2 of 7</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Report Details</h2>
        <p className="text-muted-foreground">Provide the industrial training details for this report.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <OrganizationIcon className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Academic Session</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              label="Academic Session"
              required
              value={studentInfo.academicSession}
              onChange={(e) => setStudentInfo({ academicSession: e.target.value })}
              placeholder="2024/2025"
              fullWidth
            />
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <OrganizationIcon className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Training Organization</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <ProfileIcon className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Supervision</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <ProfileIcon className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Training Period</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            onClick={() => setStep(1)}
            variant="ghost"
            size="md"
            leftIcon={<ArrowLeftIcon size={20} />}
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
