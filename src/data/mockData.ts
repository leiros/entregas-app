export type PackageStatus = 'portaria' | 'administracao' | 'aguardando_retirada' | 'entregue';

export interface Tower {
  id: string;
  name: string;
  code: string;
}

export interface Apartment {
  id: string;
  towerId: string;
  number: string;
  floor: number;
  residentName: string;
  residentPhone: string;
}

export interface Package {
  id: string;
  trackingCode: string;
  sender: string;
  status: PackageStatus;
  apartmentId: string | null;
  receivedAt: string;
  receivedBy: string;
  sentToAdminAt: string | null;
  sentToAdminBy: string | null;
  notifiedAt: string | null;
  notifiedBy: string | null;
  deliveredAt: string | null;
  deliveredBy: string | null;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'master' | 'admin' | 'portaria';
  active: boolean;
}

export const TOWERS: Tower[] = [
  { id: 't1', name: 'Torre A - Ipê', code: 'A' },
  { id: 't2', name: 'Torre B - Jatobá', code: 'B' },
  { id: 't3', name: 'Torre C - Aroeira', code: 'C' },
  { id: 't4', name: 'Torre D - Algaroba', code: 'D' },
  { id: 't5', name: 'Torre E - Jacarandá', code: 'E' },
  { id: 't6', name: 'Torre F - Imbúia', code: 'F' },
];

function generateApartments(): Apartment[] {
  const firstNames = ['Ana', 'Carlos', 'Maria', 'João', 'Pedro', 'Luciana', 'Roberto', 'Fernanda', 'Paulo', 'Juliana', 'Marcos', 'Patrícia', 'Ricardo', 'Camila', 'André', 'Beatriz', 'Lucas', 'Mariana', 'Diego', 'Larissa'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Araújo', 'Melo', 'Barbosa', 'Cardoso', 'Rocha', 'Dias'];
  const apts: Apartment[] = [];
  let idx = 0;

  for (const tower of TOWERS) {
    for (let floor = 1; floor <= 20; floor++) {
      for (let unit = 1; unit <= 4; unit++) {
        const aptNum = `${floor}0${unit}`;
        apts.push({
          id: `${tower.id}-${aptNum}`,
          towerId: tower.id,
          number: aptNum,
          floor,
          residentName: `${firstNames[idx % firstNames.length]} ${lastNames[(idx + 7) % lastNames.length]}`,
          residentPhone: `(11) 9${String(8000 + idx).padStart(4, '0')}-${String(1000 + idx).padStart(4, '0')}`,
        });
        idx++;
      }
    }
  }
  return apts;
}

export const APARTMENTS = generateApartments();

const now = new Date();
const today = now.toISOString().slice(0, 10);
const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'p1', trackingCode: '26012747433187', sender: 'Shopee', status: 'portaria',
    apartmentId: null, receivedAt: `${today}T13:54:00`, receivedBy: 'Carlos Portaria',
    sentToAdminAt: null, sentToAdminBy: null, notifiedAt: null, notifiedBy: null, deliveredAt: null, deliveredBy: null,
  },
  {
    id: 'p2', trackingCode: 'AJ2601271B1715601', sender: 'Shopee', status: 'aguardando_retirada',
    apartmentId: 't4-1903', receivedAt: `${today}T13:50:00`, receivedBy: 'Carlos Portaria',
    sentToAdminAt: `${today}T14:00:00`, sentToAdminBy: 'Carlos Portaria', notifiedAt: `${today}T14:05:00`, notifiedBy: 'Maria Admin', deliveredAt: null, deliveredBy: null,
  },
  {
    id: 'p3', trackingCode: 'BR123456789', sender: 'Amazon', status: 'entregue',
    apartmentId: 't4-1903', receivedAt: `${today}T08:30:00`, receivedBy: 'Carlos Portaria',
    sentToAdminAt: `${today}T09:00:00`, sentToAdminBy: 'Carlos Portaria', notifiedAt: `${today}T09:10:00`, notifiedBy: 'Maria Admin', deliveredAt: `${today}T10:00:00`, deliveredBy: 'Maria Admin',
  },
  {
    id: 'p4', trackingCode: 'BR987654321', sender: 'Mercado Livre', status: 'administracao',
    apartmentId: 't1-101', receivedAt: `${today}T07:15:00`, receivedBy: 'Carlos Portaria',
    sentToAdminAt: `${today}T07:30:00`, sentToAdminBy: 'Carlos Portaria', notifiedAt: null, notifiedBy: null, deliveredAt: null, deliveredBy: null,
  },
  {
    id: 'p5', trackingCode: 'BR555666777', sender: 'Magazine Luiza', status: 'aguardando_retirada',
    apartmentId: 't1-102', receivedAt: `${yesterday}T14:20:00`, receivedBy: 'Carlos Portaria',
    sentToAdminAt: `${yesterday}T14:40:00`, sentToAdminBy: 'Carlos Portaria', notifiedAt: `${yesterday}T14:50:00`, notifiedBy: 'Maria Admin', deliveredAt: null, deliveredBy: null,
  },
  {
    id: 'p6', trackingCode: 'BR111222333', sender: 'Shopee', status: 'entregue',
    apartmentId: 't1-201', receivedAt: `${yesterday}T10:00:00`, receivedBy: 'Carlos Portaria',
    sentToAdminAt: `${yesterday}T10:20:00`, sentToAdminBy: 'Carlos Portaria', notifiedAt: `${yesterday}T10:30:00`, notifiedBy: 'Maria Admin', deliveredAt: `${yesterday}T11:00:00`, deliveredBy: 'Maria Admin',
  },
];

export const INITIAL_USERS: AppUser[] = [
  { id: 'u1', name: 'Suporte Master', email: 'master@entregasapp.com', role: 'master', active: true },
  { id: 'u2', name: 'Maria Admin', email: 'admin@condominio.com', role: 'admin', active: true },
  { id: 'u3', name: 'Carlos Portaria', email: 'portaria@condominio.com', role: 'portaria', active: true },
  { id: 'u4', name: 'Ana Admin 2', email: 'admin2@condominio.com', role: 'admin', active: true },
];

export const STATUS_LABELS: Record<PackageStatus, string> = {
  portaria: 'Na Portaria',
  administracao: 'Na Administração',
  aguardando_retirada: 'Aguardando Retirada',
  entregue: 'Entregue',
};

export function getApartmentLabel(apartmentId: string | null): string {
  if (!apartmentId) return '—';
  const apt = APARTMENTS.find(a => a.id === apartmentId);
  if (!apt) return apartmentId;
  const tower = TOWERS.find(t => t.id === apt.towerId);
  return `${tower?.name || ''} - ${apt.number}`;
}
