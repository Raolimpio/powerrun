'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Equipment } from '@/types';

interface ProductHeaderProps {
  equipment: Equipment;
  productLine: 'red' | 'blue';
  colors: {
    text: string;
    solid: string;
  };
}

export function ProductHeader({
  equipment,
  productLine: _productLine,
  colors,
}: ProductHeaderProps) {
  return (
    <div className='relative h-80 bg-gray-900 overflow-hidden'>
      <div className='absolute inset-0'>
        <Image
          src={equipment.images[0]}
          alt={equipment.name}
          fill
          className='object-cover opacity-60'
        />
        <div className='absolute inset-0 bg-black/40'></div>
      </div>

      <div className='relative z-10 container mx-auto px-4 h-full flex items-end py-8'>
        {/* Breadcrumb do Lado Esquerdo */}
        <nav>
          <div className='flex items-center space-x-1 text-sm'>
            <Link href='/' className='text-white/70 hover:text-white transition-colors'>
              Início
            </Link>
            <span className='text-white/40 mx-2'>·</span>
            <Link href='/equipamentos' className='text-white/70 hover:text-white transition-colors'>
              Equipamentos
            </Link>
            <span className='text-white/40 mx-2'>·</span>
            <span className={`${colors.text} font-medium`}>
              {equipment.category.charAt(0).toUpperCase() + equipment.category.slice(1)}
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
