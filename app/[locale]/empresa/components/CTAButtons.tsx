'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants';

interface CTAButtonsProps {
  contactText: string;
  catalogText: string;
  contactAlert?: string; // opcional agora
  catalogAlert?: string; // opcional agora
}

export function CTAButtons({ contactText, catalogText }: CTAButtonsProps) {
  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
      <a
        href={`https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=Olá! Gostaria de saber mais sobre os produtos e serviços da Power Run.`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <Button
          size='lg'
          className='bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold min-w-[200px]'
        >
          {contactText}
        </Button>
      </a>
      <Link href='/equipamentos'>
        <Button
          variant='outline'
          size='lg'
          className='border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold min-w-[200px]'
        >
          {catalogText}
        </Button>
      </Link>
    </div>
  );
}
