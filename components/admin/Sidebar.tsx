'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  FileText, 
  Settings,
  TrendingUp,
  Globe,
  Activity,
  Search,
  Menu,
  X,
  Mail,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  locale: string;
}

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    name: 'Análise de Tráfego',
    icon: TrendingUp,
    href: '/admin/trafego',
  },
  {
    name: 'Conversões',
    icon: Activity,
    href: '/admin/conversoes',
  },
  {
    name: 'Produtos',
    icon: BarChart3,
    href: '/admin/produtos',
  },
  {
    name: 'Cidades',
    icon: Globe,
    href: '/admin/cidades',
  },
  {
    name: 'Performance',
    icon: Settings,
    href: '/admin/performance',
  },
  {
    name: 'SEO Analytics',
    icon: Search,
    href: '/admin/seo',
  },
  {
    name: 'Campanhas',
    icon: DollarSign,
    href: '/admin/campanhas',
  },
  {
    name: 'Fichas Técnicas',
    icon: FileText,
    href: '/admin/fichas-tecnicas',
  },
  {
    name: 'Relatórios de Marketing',
    icon: Mail,
    href: '/admin/relatorios-marketing',
  },
];

export function Sidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); // Iniciar como true para desktop
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Em desktop, sempre manter aberto
      if (!mobile) {
        setIsOpen(true);
      }
    };
    
    // Verificar imediatamente no cliente
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }

    return undefined;
  }, []);

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === '/admin') {
      return pathname === fullPath;
    }
    return pathname.startsWith(fullPath);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botão Mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Overlay Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50
          transition-transform duration-300 ease-in-out shadow-lg
          ${isMobile 
            ? (isOpen ? 'translate-x-0' : '-translate-x-full') 
            : 'translate-x-0 lg:translate-x-0'
          }
        `}
      >
        {/* Logo/Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative w-32 h-10">
              <Image
                src="/Logo PowerRun.png"
                alt="Power Run"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${active 
                      ? 'bg-[#9c1006] text-white border border-[#9c1006]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#374151]'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-medium text-[#374151] mb-1">Sistema de Monitoramento</p>
          <p className="text-xs text-gray-500">Versão 2.0</p>
        </div>
      </div>
    </aside>
    </>
  );
}

