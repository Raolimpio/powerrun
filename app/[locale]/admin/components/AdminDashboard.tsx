'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminLogin } from './AdminLogin';
import { AdminStats } from './AdminStats';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const params = useParams();
  const locale = params?.locale as string || 'pt-BR';

  useEffect(() => {
    // Verificar se já está autenticado
    fetch('/api/admin/auth')
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminStats onLogout={() => setIsAuthenticated(false)} locale={locale} />;
}

