import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  color?: string;
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color || 'text-foreground'}`}>{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  );
}
