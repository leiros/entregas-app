import { useApp } from '@/context/AppContext';
import { getApartmentLabel } from '@/data/mockData';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Package, CalendarDays, Building2, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { packages } = useApp();

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const receivedToday = packages.filter(p => p.receivedAt.startsWith(todayStr)).length;
  const receivedWeek = packages.filter(p => new Date(p.receivedAt) >= weekAgo).length;
  const retainedAdmin = packages.filter(p => p.status === 'administracao' || p.status === 'aguardando_retirada').length;
  const deliveredToday = packages.filter(p => p.status === 'entregue' && p.deliveredAt?.startsWith(todayStr)).length;
  const deliveredWeek = packages.filter(p => p.status === 'entregue' && p.deliveredAt && new Date(p.deliveredAt) >= weekAgo).length;

  const atPortaria = packages.filter(p => p.status === 'portaria').length;
  const aguardando = packages.filter(p => p.status === 'aguardando_retirada').length;

  const recent = [...packages].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()).slice(0, 8);

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-5">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Recebidas Hoje" value={receivedToday} icon={<Package className="w-5 h-5" />} />
        <StatCard label="Recebidas na Semana" value={receivedWeek} icon={<CalendarDays className="w-5 h-5" />} />
        <StatCard label="Retidas na Adm." value={retainedAdmin} icon={<Building2 className="w-5 h-5" />} color="text-status-portaria" />
        <StatCard label="Entregues Hoje" value={deliveredToday} icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard label="Entregues na Semana" value={deliveredWeek} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-status-portaria" />
            <h3 className="font-semibold text-foreground">Na Portaria</h3>
          </div>
          <p className="text-3xl font-bold text-status-portaria mt-2">{atPortaria}</p>
          <p className="text-xs text-muted-foreground mt-1">encomendas aguardando encaminhamento</p>
          <Link to="/portaria" className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3 hover:underline">
            Ir para Portaria <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-status-aguardando" />
            <h3 className="font-semibold text-foreground">Aguardando Retirada</h3>
          </div>
          <p className="text-3xl font-bold text-status-aguardando mt-2">{aguardando}</p>
          <p className="text-xs text-muted-foreground mt-1">moradores já notificados</p>
          <Link to="/administracao" className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3 hover:underline">
            Ir para Administração <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent Table */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">Últimas Encomendas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Código</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Destino</th>
                <th className="pb-3 font-medium">Remetente</th>
                <th className="pb-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(pkg => (
                <tr key={pkg.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{pkg.trackingCode}</td>
                  <td className="py-3"><StatusBadge status={pkg.status} /></td>
                  <td className="py-3 text-xs">{getApartmentLabel(pkg.apartmentId)}</td>
                  <td className="py-3 text-xs">{pkg.sender}</td>
                  <td className="py-3 text-xs text-muted-foreground">
                    {new Date(pkg.receivedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}{' '}
                    {new Date(pkg.receivedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
