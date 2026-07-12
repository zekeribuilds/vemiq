'use client';

import { Card } from '@/design-system/components/Card';

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
    <Card className="rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">{userName}</h2>
          <p className="text-sm text-muted-foreground">{institution || 'Not specified'}</p>
        </div>
        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-xs font-medium text-primary">{currentLevel || 'Not specified'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Faculty</p>
          <p className="text-sm text-foreground">{faculty || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Department</p>
          <p className="text-sm text-foreground">{department || 'Not specified'}</p>
        </div>
      </div>
    </Card>
  );
}
