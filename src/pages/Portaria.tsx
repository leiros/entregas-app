import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TOWERS, APARTMENTS, getApartmentLabel } from '@/data/mockData';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import { Package, CalendarDays, Building2, CheckCircle2, TrendingUp, Plus, Send, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Portaria() {
  const { packages, addPackage, updatePackageStatus, currentUser } = useApp();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [sender, setSender] = useState('');

  const portariaPackages = packages.filter(p => p.status === 'portaria');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const receivedToday = packages.filter(p => p.receivedAt.startsWith(todayStr)).length;
  const receivedWeek = packages.filter(p => new Date(p.receivedAt) >= weekAgo).length;
  const retainedAdmin = packages.filter(p => p.status === 'administracao' || p.status === 'aguardando_retirada').length;
  const deliveredToday = packages.filter(p => p.status === 'entregue' && p.deliveredAt?.startsWith(todayStr)).length;
  const deliveredWeek = packages.filter(p => p.status === 'entregue' && p.deliveredAt && new Date(p.deliveredAt) >= weekAgo).length;

  const handleReceive = () => {
    if (!code || !sender) return;
    addPackage({
      trackingCode: code,
      sender,
      status: 'portaria',
      apartmentId: null,
      receivedAt: new Date().toISOString(),
      receivedBy: currentUser.name,
      sentToAdminAt: null, sentToAdminBy: null,
      notifiedAt: null, notifiedBy: null,
      deliveredAt: null, deliveredBy: null,
    });
    toast({ title: 'Encomenda recebida', description: `Código: ${code}` });
    setCode(''); setSender(''); setOpen(false);
  };

  const sendToAdmin = (id: string) => {
    updatePackageStatus(id, 'administracao', {
      sentToAdminAt: new Date().toISOString(),
      sentToAdminBy: currentUser.name,
    });
    toast({ title: 'Encaminhada para Administração' });
  };

  const [deliverOpen, setDeliverOpen] = useState<string | null>(null);
  const [selectedTower, setSelectedTower] = useState('');
  const [selectedApt, setSelectedApt] = useState('');
  const filteredApts = APARTMENTS.filter(a => a.towerId === selectedTower);

  const deliverDirect = (id: string) => {
    if (!selectedApt) return;
    updatePackageStatus(id, 'entregue', {
      apartmentId: selectedApt,
      sentToAdminAt: new Date().toISOString(),
      sentToAdminBy: currentUser.name,
      deliveredAt: new Date().toISOString(),
      deliveredBy: currentUser.name,
    });
    toast({ title: 'Entregue ao morador', description: getApartmentLabel(selectedApt) });
    setDeliverOpen(null); setSelectedTower(''); setSelectedApt('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">Portaria</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Receber Encomenda</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Receber Nova Encomenda</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Código de rastreio / barras" value={code} onChange={e => setCode(e.target.value)} />
              <Input placeholder="Remetente (ex: Shopee, Amazon)" value={sender} onChange={e => setSender(e.target.value)} />
              <Button onClick={handleReceive} className="w-full">Registrar Recebimento</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Recebidas Hoje" value={receivedToday} icon={<Package className="w-5 h-5" />} />
        <StatCard label="Recebidas na Semana" value={receivedWeek} icon={<CalendarDays className="w-5 h-5" />} />
        <StatCard label="Retidas na Adm." value={retainedAdmin} icon={<Building2 className="w-5 h-5" />} color="text-status-portaria" />
        <StatCard label="Entregues Hoje" value={deliveredToday} icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard label="Entregues na Semana" value={deliveredWeek} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-4">Encomendas na Portaria ({portariaPackages.length})</h3>
        {portariaPackages.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma encomenda na portaria</p>
        ) : (
          <div className="space-y-3">
            {portariaPackages.map(pkg => (
              <div key={pkg.id} className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <p className="font-mono text-sm font-medium">{pkg.trackingCode}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{pkg.sender} · Recebido por {pkg.receivedBy}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(pkg.receivedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => sendToAdmin(pkg.id)}>
                    <Send className="w-3 h-3" /> Enviar p/ Adm
                  </Button>
                  <Dialog open={deliverOpen === pkg.id} onOpenChange={v => { setDeliverOpen(v ? pkg.id : null); if (!v) { setSelectedTower(''); setSelectedApt(''); } }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1.5 text-xs"><Truck className="w-3 h-3" /> Entregar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Entregar ao Morador</DialogTitle></DialogHeader>
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
                        <Button onClick={() => deliverDirect(pkg.id)} className="w-full" disabled={!selectedApt}>Confirmar Entrega</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
