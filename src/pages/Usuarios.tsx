import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, ShieldAlert, ShieldCheck, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ROLE_LABELS = { master: 'Master / Suporte', admin: 'Administração', portaria: 'Portaria' };
const ROLE_ICONS = { master: ShieldAlert, admin: ShieldCheck, portaria: Shield };

export default function Usuarios() {
  const { users, addUser, updateUser, currentUser } = useApp();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'portaria'>('portaria');

  const handleAdd = () => {
    if (!name || !email) return;
    addUser({ name, email, role, active: true });
    toast({ title: 'Usuário criado', description: name });
    setName(''); setEmail(''); setOpen(false);
  };

  const toggleActive = (id: string, active: boolean) => {
    updateUser(id, { active: !active });
    toast({ title: active ? 'Acesso revogado' : 'Acesso restaurado' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">Usuários</h2>
        {(currentUser.role === 'master' || currentUser.role === 'admin') && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Novo Usuário</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Criar Novo Usuário</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <Input placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} />
                <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <Select value={role} onValueChange={v => setRole(v as 'admin' | 'portaria')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portaria">Portaria</SelectItem>
                    <SelectItem value="admin">Administração</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAdd} className="w-full">Criar Usuário</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="space-y-3">
          {users.map(user => {
            const RoleIcon = ROLE_ICONS[user.role];
            return (
              <div key={user.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="gap-1.5">
                    <RoleIcon className="w-3 h-3" />
                    {ROLE_LABELS[user.role]}
                  </Badge>
                  {user.active ? (
                    <Badge variant="secondary" className="text-status-entregue">Ativo</Badge>
                  ) : (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                  {currentUser.role === 'master' && user.id !== currentUser.id && (
                    <Button size="sm" variant="outline" onClick={() => toggleActive(user.id, user.active)}>
                      {user.active ? 'Revogar' : 'Ativar'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
