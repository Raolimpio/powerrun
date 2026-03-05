'use client';

import { ComponentProps } from '@/types';
import { Footer } from './Footer';
import { Header } from './Header';

interface MainLayoutProps extends ComponentProps {
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({
  children,
  title: _title,
  showHeader = true,
  showFooter = true,
  className,
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col relative ${className}`}>
      {/* Fundo cinza claro elegante */}
      <div className='fixed inset-0 bg-gray-50 -z-10'>
        {/* Padrão de pontos sutis para textura */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[length:20px_20px]'></div>
      </div>

      {showHeader && <Header />}
      <main className='flex-1 relative'>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
