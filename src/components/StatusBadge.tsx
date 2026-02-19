import { PackageStatus, STATUS_LABELS } from '@/data/mockData';
import { Circle, Building2, Bell, CheckCircle2 } from 'lucide-react';

const CONFIG: Record<PackageStatus, { bg: string; text: string; icon: typeof Circle }> = {
  portaria: { bg: 'bg-orange-100', text: 'text-status-portaria', icon: Circle },
  administracao: { bg: 'bg-blue-100', text: 'text-status-admin', icon: Building2 },
  aguardando_retirada: { bg: 'bg-purple-100', text: 'text-status-aguardando', icon: Bell },
  entregue: { bg: 'bg-green-100', text: 'text-status-entregue', icon: CheckCircle2 },
};

export default function StatusBadge({ status }: { status: PackageStatus }) {
  const c = CONFIG[status];
  const Icon = c.icon;
  return (
    <span className={`status-badge ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {STATUS_LABELS[status]}
    </span>
  );
}
