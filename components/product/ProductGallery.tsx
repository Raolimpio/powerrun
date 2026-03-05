'use client';

import Image from 'next/image';
import { Equipment } from '@/types';

interface ProductGalleryProps {
  equipment: Equipment;
  onImageClick: () => void;
}

export function ProductGallery({ equipment, onImageClick }: ProductGalleryProps) {
  return (
    <div className='relative'>
      <div
        className='relative h-[850px] rounded-2xl overflow-hidden group cursor-pointer'
        onClick={onImageClick}
      >
        <Image
          src={equipment.images[0]}
          alt={equipment.name}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          priority
        />

        {/* Overlay sutil com zoom */}
        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
          <div className='bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30'>
            <svg
              className='w-8 h-8 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7a3 3 0 100 6 3 3 0 000-6z'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
