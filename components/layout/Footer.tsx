'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { APP_CONFIG } from '@/constants';
import { ComponentProps } from '@/types';

interface FooterProps extends ComponentProps {}

export function Footer({ className }: FooterProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const tCommon = useTranslations('common');

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calcula o gradiente baseado na posição do mouse
  const getGradientStyle = () => {
    if (!isClient || typeof window === 'undefined') {
      return {
        background: 'linear-gradient(90deg, #61fbfe 0%, #9c1006 100%)',
      };
    }

    const windowWidth = window.innerWidth;
    const percentage = (mousePosition.x / windowWidth) * 100;

    return {
      background: `linear-gradient(90deg, #61fbfe ${Math.max(0, percentage - 20)}%, #9c1006 ${Math.min(100, percentage + 20)}%)`,
    };
  };

  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { key: 'empresa', href: '/empresa' },
    { key: 'equipamentos', href: '/equipamentos' },
    { key: 'suporte', href: '/suporte' },
  ];

  const equipmentCategories = [
    { key: 'red-line', name: 'Red Line', href: '/equipamentos?category=red-line' },
    { key: 'blue-line', name: 'Blue Line', href: '/equipamentos?category=blue-line' },
    { key: 'musculacao', name: tCommon('musculacao'), href: '/equipamentos?category=musculacao' },
  ];

  const socialMediaLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/powerrunfitness/',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/PowerRunProfessional/',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(tCommon('saberMaisEquipamentos'))}`,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
        </svg>
      ),
    },
  ];

  return (
    <footer className={`relative mt-20 ${className}`}>
      {/* Linha animada do gradiente no topo do footer */}
      <div
        className='absolute top-0 left-0 right-0 h-0.5 w-full transition-all duration-300'
        style={getGradientStyle()}
      />

      {/* Footer principal com design preto elegante glassmorphism */}
      <div className='backdrop-blur-xl bg-black/95 border-t border-white/5 shadow-2xl carousel-card-text no-border'>
        <div className='container mx-auto px-6 py-16'>
          {/* Seção Principal - Grid de 6 colunas */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12'>
            {/* Logo e Descrição */}
            <div className='lg:col-span-2'>
              <div className='mb-8'>
                <div className='relative w-56 h-24 rounded-xl overflow-hidden'>
                  <Image
                    src={APP_CONFIG.logo}
                    alt={APP_CONFIG.name}
                    fill
                    className='object-contain'
                    priority
                  />
                </div>
              </div>
              <p className='text-white/60 text-base leading-relaxed font-light mb-6'>
                {tFooter('qualityCommitment')}
              </p>
              <p className='text-white/40 text-sm leading-relaxed font-light'>
                {tFooter('premiumSolutions')}
              </p>
            </div>

            {/* Links de Navegação */}
            <div>
              <h3 className='text-white font-medium mb-6 text-lg tracking-wide'>
                {tFooter('navigation')}
              </h3>
              <nav className='space-y-3'>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href as any}
                    className='block text-white/50 hover:text-white transition-all duration-300 
                             hover:translate-x-2 transform text-sm font-light btn-exception no-border'
                  >
                    {tNav(link.key)}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Categorias de Equipamentos */}
            <div>
              <h3 className='text-white font-medium mb-6 text-lg tracking-wide'>
                {tFooter('products')}
              </h3>
              <nav className='space-y-3'>
                {equipmentCategories.map((category) => (
                  <Link
                    key={category.key}
                    href={category.href as any}
                    className='block text-white/50 hover:text-white transition-all duration-300 
                             hover:translate-x-2 transform text-sm font-light btn-exception no-border'
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contatos Especializados */}
            <div>
              <h3 className='text-white font-medium mb-6 text-lg tracking-wide'>
                {tFooter('contact')}
              </h3>
              <div className='space-y-4'>
                <div className='text-white/50'>
                  <h4 className='text-white/70 font-medium text-sm mb-2'>
                    {tFooter('contacts.commercial')}
                  </h4>
                  <a
                    href={`https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}`}
                    className='text-sm hover:text-white transition-colors inline-block py-2 pr-2 min-h-[44px] flex items-center btn-exception no-border'
                    aria-label={`WhatsApp comercial: ${APP_CONFIG.contact.comercial.whatsapp}`}
                  >
                    {APP_CONFIG.contact.comercial.whatsapp}
                  </a>
                  <br />
                  <a
                    href={`mailto:${APP_CONFIG.contact.comercial.email}`}
                    className='text-sm hover:text-white transition-colors inline-block py-2 pr-2 min-h-[44px] flex items-center btn-exception no-border'
                    aria-label={`Email comercial: ${APP_CONFIG.contact.comercial.email}`}
                  >
                    {APP_CONFIG.contact.comercial.email}
                  </a>
                </div>

                <div className='text-white/50'>
                  <h4 className='text-white/70 font-medium text-sm mb-2'>
                    {tFooter('contacts.technical')}
                  </h4>
                  <a
                    href={`https://wa.me/55${APP_CONFIG.contact.suporte.whatsapp.replace(/\D/g, '')}`}
                    className='text-sm hover:text-white transition-colors inline-block py-2 pr-2 min-h-[44px] flex items-center btn-exception no-border'
                    aria-label={`${tCommon('whatsappTecnico')}: ${APP_CONFIG.contact.suporte.whatsapp}`}
                  >
                    {APP_CONFIG.contact.suporte.whatsapp}
                  </a>
                  <br />
                  <a
                    href={`mailto:${APP_CONFIG.contact.suporte.email}`}
                    className='text-sm hover:text-white transition-colors inline-block py-2 pr-2 min-h-[44px] flex items-center btn-exception no-border'
                    aria-label={`${tCommon('emailTecnico')}: ${APP_CONFIG.contact.suporte.email}`}
                  >
                    {APP_CONFIG.contact.suporte.email}
                  </a>
                </div>

                <div className='text-white/50'>
                  <h4 className='text-white/70 font-medium text-sm mb-2'>
                    {tFooter('contacts.afterSales')}
                  </h4>
                  <a
                    href={`https://wa.me/55${APP_CONFIG.contact.posVenda.whatsapp.replace(/\D/g, '')}`}
                    className='text-sm hover:text-white transition-colors inline-block py-2 pr-2 min-h-[44px] flex items-center btn-exception no-border'
                    aria-label={`${tCommon('whatsappPosVenda')}: ${APP_CONFIG.contact.posVenda.whatsapp}`}
                  >
                    {APP_CONFIG.contact.posVenda.whatsapp}
                  </a>
                  <br />
                  <a
                    href={`mailto:${APP_CONFIG.contact.posVenda.email}`}
                    className='text-sm hover:text-white transition-colors inline-block py-2 pr-2 min-h-[44px] flex items-center btn-exception no-border'
                    aria-label={`${tCommon('emailPosVenda')}: ${APP_CONFIG.contact.posVenda.email}`}
                  >
                    {APP_CONFIG.contact.posVenda.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Redes Sociais e Localização */}
            <div>
              <h3 className='text-white font-medium mb-6 text-lg tracking-wide'>
                {tFooter('socialMedia')}
              </h3>

              {/* Links das Redes Sociais */}
              <div className='flex space-x-4 mb-6'>
                {socialMediaLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 
                             backdrop-blur-sm transition-all duration-300 hover:scale-105 
                             flex items-center justify-center text-white/40 hover:text-white group btn-exception'
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Endereço */}
              <div className='text-white/50'>
                <h4 className='text-white/70 font-medium text-sm mb-2'>{tCommon('localizacao')}</h4>
                <div className='flex items-start space-x-2'>
                  <svg
                    className='w-4 h-4 mt-1 flex-shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  <span className='text-xs leading-relaxed'>{APP_CONFIG.contact.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Linha divisória minimalista */}
          <div className='border-t border-white/5 pt-8'>
            <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
              <div className='text-center md:text-left'>
                <p className='text-white/40 text-sm font-light mb-2'>
                  {tFooter('rights', { year: currentYear, name: APP_CONFIG.name })}
                </p>
                <p className='text-white/30 text-xs font-light'>
                  <a
                    href='https://wa.me/5514982135008'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-white/50 transition-colors'
                  >
                    {tFooter('developedBy', { developer: 'Open Dreams' })}
                  </a>
                </p>
              </div>
              <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-white/40'>
                <div className='flex items-center space-x-6'>
                  <Link
                    href='/privacidade'
                    className='hover:text-white/70 transition-colors duration-300 font-light btn-exception no-border'
                  >
                    {tFooter('privacy')}
                  </Link>
                  <Link
                    href='/termos'
                    className='hover:text-white/70 transition-colors duration-300 font-light btn-exception no-border'
                  >
                    {tFooter('terms')}
                  </Link>
                </div>
                <span className='text-white/30 text-xs'>v{APP_CONFIG.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Efeito de brilho sutil */}
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.005] to-transparent pointer-events-none'></div>
      </div>
    </footer>
  );
}
