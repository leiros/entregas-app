import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TOWERS, APARTMENTS, getApartmentLabel } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import { Package, CalendarDays, Building2, CheckCircle2, TrendingUp, Bell, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Administracao() {
  const { packages, updatePackageStatus, currentUser } = useApp();
  const { toast } = useToast();

  const adminPackages = packages.filter(p => p.status === 'administracao');
  const aguardandoPackages = packages.filter(p => p.status === 'aguardando_retirada');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const receivedToday = packages.filter(p => p.receivedAt.startsWith(todayStr)).length;
  const receivedWeek = packages.filter(p => new Date(p.receivedAt) >= weekAgo).length;
  const retainedAdmin = adminPackages.length + aguardandoPackages.length;
  const deliveredToday = packages.filter(p => p.status === 'entregue' && p.deliveredAt?.startsWith(todayStr)).length;
  const deliveredWeek = packages.filter(p => p.status === 'entregue' && p.deliveredAt && new Date(p.deliveredAt) >= weekAgo).length;

  const [notifyOpen, setNotifyOpen] = useState<string | null>(null);
  const [selectedTower, setSelectedTower] = useState('');
  const [selectedApt, setSelectedApt] = useState('');
  const filteredApts = APARTMENTS.filter(a => a.towerId === selectedTower);

  const notifyResident = (id: string) => {
    if (!selectedApt) return;
    const apt = APARTMENTS.find(a => a.id === selectedApt);
    updatePackageStatus(id, 'aguardando_retirada', {
      apartmentId: selectedApt,
      notifiedAt: new Date().toISOString(),
      notifiedBy: currentUser.name,
    });
    toast({
      title: 'Morador notificado!',
      description: `WhatsApp enviado para ${apt?.residentName} - ${apt?.residentPhone}`,
    });
    setNotifyOpen(null); setSelectedTower(''); setSelectedApt('');
  };

  const deliverToResident = (id: string) => {
    updatePackageStatus(id, 'entregue', {
      deliveredAt: new Date().toISOString(),
      deliveredBy: currentUser.name,
    });
    toast({ title: 'Encomenda entregue ao morador!' });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-5">Administração</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Recebidas Hoje" value={receivedToday} icon={<Package className="w-5 h-5" />} />
        <StatCard label="Recebidas na Semana" value={receivedWeek} icon={<CalendarDays className="w-5 h-5" />} />
        <StatCard label="Retidas na Adm." value={retainedAdmin} icon={<Building2 className="w-5 h-5" />} color="text-status-portaria" />
        <StatCard label="Entregues Hoje" value={deliveredToday} icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard label="Entregues na Semana" value={deliveredWeek} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Pending notification */}
      <div className="bg-card border rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Pendentes de Notificação ({adminPackages.length})</h3>
        {adminPackages.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma encomenda pendente</p>
        ) : (
          <div className="space-y-3">
            {adminPackages.map(pkg => (
              <div key={pkg.id} className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <p className="font-mono text-sm font-medium">{pkg.trackingCode}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{pkg.sender} · {getApartmentLabel(pkg.apartmentId)}</p>
                </div>
                <Dialog open={notifyOpen === pkg.id} onOpenChange={v => { setNotifyOpen(v ? pkg.id : null); if (!v) { setSelectedTower(''); setSelectedApt(''); } }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5 text-xs"><Bell className="w-3 h-3" /> Avisar Morador</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Notificar Morador via WhatsApp</DialogTitle></DialogHeader>
                    <div className="space-y-3 mt-2">
                      <Select value={selectedTower} onValueChange={v => { setSelectedTower(v); setSelectedApt(''); }}>
                        <SelectTrigger><SelectValue placeholder="Selecionar Torre" /></SelectTrigger>
                        <SelectContent>
                          {TOWERS.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {selectedTower && (
                        <Select value={selectedApt} onValueChange={setSelectedApt}>
                          <SelectTrigger><SelectValue placeholder="Selecionar Apartamento" /></SelectTrigger>
                          <SelectContent>
                            {filteredApts.map(a => <SelectItem key={a.id} value={a.id}>Apt {a.number} - {a.residentName}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                      {selectedApt && (
                        <div className="bg-secondary rounded-lg p-3 text-xs">
                          <p className="font-medium">Prévia da mensagem:</p>
                          <p className="mt-1 text-muted-foreground">
                            "Olá {APARTMENTS.find(a => a.id === selectedApt)?.residentName}, sua encomenda ({pkg.trackingCode}) de {pkg.sender} está disponível para retirada na administração do condomínio."
                          </p>
                        </div>
                      )}
                      <Button onClick={() => notifyResident(pkg.id)} className="w-full gap-2" disabled={!selectedApt}>
                        <Bell className="w-4 h-4" /> Enviar WhatsApp e Notificar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Awaiting pickup */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">Aguardando Retirada ({aguardandoPackages.length})</h3>
        {aguardandoPackages.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma encomenda aguardando retirada</p>
        ) : (
          <div className="space-y-3">
            {aguardandoPackages.map(pkg => (
              <div key={pkg.id} className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <p className="font-mono text-sm font-medium">{pkg.trackingCode}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{pkg.sender} · {getApartmentLabel(pkg.apartmentId)}</p>
                  <p className="text-xs text-muted-foreground">Notificado em {pkg.notifiedAt ? new Date(pkg.notifiedAt).toLocaleString('pt-BR') : '—'}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => deliverToResident(pkg.id)}>
                  <Truck className="w-3 h-3" /> Entregar ao Morador
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
