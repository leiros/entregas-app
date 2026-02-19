import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Package, AppUser, INITIAL_PACKAGES, INITIAL_USERS, PackageStatus } from '@/data/mockData';

interface AppState {
  packages: Package[];
  users: AppUser[];
  currentUser: AppUser;
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackageStatus: (id: string, status: PackageStatus, extra: Partial<Package>) => void;
  addUser: (user: Omit<AppUser, 'id'>) => void;
  updateUser: (id: string, data: Partial<AppUser>) => void;
  setCurrentUser: (user: AppUser) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<AppUser>(INITIAL_USERS[0]);

  const addPackage = (pkg: Omit<Package, 'id'>) => {
    setPackages(prev => [...prev, { ...pkg, id: `p${Date.now()}` }]);
  };

  const updatePackageStatus = (id: string, status: PackageStatus, extra: Partial<Package>) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, status, ...extra } : p));
  };

  const addUser = (user: Omit<AppUser, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: `u${Date.now()}` }]);
  };

  const updateUser = (id: string, data: Partial<AppUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  return (
    <AppContext.Provider value={{ packages, users, currentUser, addPackage, updatePackageStatus, addUser, updateUser, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
