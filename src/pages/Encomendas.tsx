import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getApartmentLabel } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Encomendas() {
  const { packages } = useApp();
  const [search, setSearch] = useState('');

  const filtered = packages.filter(p =>
    p.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
    p.sender.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">Todas as Encomendas</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar código ou remetente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Código</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Destino</th>
                <th className="pb-3 font-medium">Remetente</th>
                <th className="pb-3 font-medium">Recebido por</th>
                <th className="pb-3 font-medium">Data Recebimento</th>
                <th className="pb-3 font-medium">Data Entrega</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(pkg => (
                <tr key={pkg.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{pkg.trackingCode}</td>
                  <td className="py-3"><StatusBadge status={pkg.status} /></td>
                  <td className="py-3 text-xs">{getApartmentLabel(pkg.apartmentId)}</td>
                  <td className="py-3 text-xs">{pkg.sender}</td>
                  <td className="py-3 text-xs">{pkg.receivedBy}</td>
                  <td className="py-3 text-xs text-muted-foreground">{new Date(pkg.receivedAt).toLocaleString('pt-BR')}</td>
                  <td className="py-3 text-xs text-muted-foreground">{pkg.deliveredAt ? new Date(pkg.deliveredAt).toLocaleString('pt-BR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
