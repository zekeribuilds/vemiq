import { ReportsIcon, EditIcon } from '@/design-system';

interface ReportCardProps {
  title: string;
  type: 'SWEP' | 'SIWES';
  progress: number;
  lastEdited: string;
}

export default function ReportCard({ title, type, progress, lastEdited }: ReportCardProps) {
  const getProgressColor = () => {
    if (progress >= 75) return 'bg-[#22C55E]';
    if (progress >= 50) return 'bg-[#22C55E]';
    if (progress >= 25) return 'bg-[#F59E0B]';
    return 'bg-[#EF4444]';
  };

  return (
    <div className="card-hover p-6 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center shadow-sm">
          <ReportsIcon className="text-primary-foreground" size={28} />
        </div>
        <span className="badge-primary">
          {type}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary dark:group-hover:text-white transition-colors">{title}</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`${getProgressColor()} h-2 rounded-full transition-all duration-500 shadow-sm`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <EditIcon size={16} />
          <span>{lastEdited}</span>
        </div>
        <EditIcon className="text-muted-foreground group-hover:text-primary dark:group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
      </div>
    </div>
  );
}
