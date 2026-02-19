import { useState } from 'react';
import { TOWERS, APARTMENTS } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Phone, User } from 'lucide-react';

export default function Moradores() {
  const [search, setSearch] = useState('');
  const [towerFilter, setTowerFilter] = useState('all');

  const filtered = APARTMENTS.filter(a => {
    const matchTower = towerFilter === 'all' || a.towerId === towerFilter;
    const matchSearch = a.residentName.toLowerCase().includes(search.toLowerCase()) || a.number.includes(search);
    return matchTower && matchSearch;
  }).slice(0, 50);

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-5">Moradores</h2>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar morador ou apt..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={towerFilter} onValueChange={setTowerFilter}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Torres</SelectItem>
            {TOWERS.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Torre</th>
                <th className="pb-3 font-medium">Apartamento</th>
                <th className="pb-3 font-medium">Morador</th>
                <th className="pb-3 font-medium">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => {
                const tower = TOWERS.find(t => t.id === apt.towerId);
                return (
                  <tr key={apt.id} className="border-b last:border-0">
                    <td className="py-3 text-xs">{tower?.name}</td>
                    <td className="py-3 text-xs font-medium">{apt.number}</td>
                    <td className="py-3 text-xs flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                      {apt.residentName}
                    </td>
                    <td className="py-3 text-xs flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="w-3 h-3" /> {apt.residentPhone}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 50 && (
            <p className="text-xs text-muted-foreground text-center mt-3">Mostrando os primeiros 50 resultados. Use os filtros para refinar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
