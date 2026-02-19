import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { LayoutDashboard, DoorOpen, Building2, Package, Users, UserCog, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/portaria', label: 'Portaria', icon: DoorOpen },
  { to: '/administracao', label: 'Administração', icon: Building2 },
  { to: '/encomendas', label: 'Encomendas', icon: Package },
  { to: '/moradores', label: 'Moradores', icon: Users },
  { to: '/usuarios', label: 'Usuários', icon: UserCog },
];

export default function AppSidebar() {
  const location = useLocation();
  const { currentUser } = useApp();

  return (
    <aside className="sidebar-gradient w-60 min-h-screen flex flex-col text-sidebar-foreground shrink-0">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Package className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-primary-foreground leading-tight">Entregas App</h1>
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/70">Para Condomínios</p>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-3 mx-3 rounded-lg bg-sidebar-accent/50 flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground">
          {currentUser.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">{currentUser.name}</p>
          <p className="text-[10px] text-sidebar-foreground/60 capitalize">{currentUser.role === 'master' ? 'Master / Suporte' : currentUser.role}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
