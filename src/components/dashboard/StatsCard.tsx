import { EditIcon } from '@/design-system';
import { Card } from '@/design-system/components/Card';

interface StatsCardProps {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  trend?: number;
}

export default function StatsCard({ icon: Icon, label, value, color, trend }: StatsCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${color} rounded-lg flex items-center justify-center shadow-sm`}>
          <Icon className="text-white" size={28} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? 'text-success' : 'text-destructive'}`}>
            <EditIcon size={16} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </Card>
  );
}
