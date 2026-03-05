interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton = ({ className = '', style }: SkeletonProps) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} style={style} />
);

interface HeroSkeletonProps {
  hasVideo?: boolean;
  hasStats?: boolean;
  className?: string;
}

export const HeroSkeleton = ({
  hasVideo = false,
  hasStats = false,
  className = '',
}: HeroSkeletonProps) => (
  <section
    className={`relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden pt-32 pb-20 ${className}`}
  >
    {/* Background */}
    {hasVideo ? (
      <div className='absolute inset-0 w-full h-full bg-gray-700 animate-pulse opacity-20' />
    ) : (
      <div className='absolute inset-0 w-full h-full bg-gray-700 animate-pulse opacity-20' />
    )}

    {/* Gradientes do layout real */}
    <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 via-black/70 to-transparent'>
      <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
    </div>

    <div className='relative z-10'>
      <div className='container mx-auto px-4 text-center'>
        {/* Breadcrumb opcional */}
        <nav className='flex items-center justify-center space-x-2 text-sm text-gray-300 mb-8'>
          <div className='h-4 w-12 bg-gray-600 rounded animate-pulse'></div>
          <svg
            className='w-4 h-4 text-gray-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
          <div className='h-4 w-24 bg-gray-600 rounded animate-pulse'></div>
        </nav>

        {/* Título */}
        <div className='h-16 lg:h-20 w-3/4 mx-auto bg-gray-600 rounded animate-pulse mb-6'></div>

        {/* Subtitle */}
        <div className='max-w-4xl mx-auto mb-12'>
          <div className='h-6 w-full bg-gray-700 rounded animate-pulse mb-2'></div>
          <div className='h-6 w-2/3 mx-auto bg-gray-700 rounded animate-pulse'></div>
        </div>

        {/* Botões */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
          <div className='h-14 w-32 bg-gray-300 rounded animate-pulse'></div>
          <div className='h-14 w-40 bg-gray-600 border border-gray-500 rounded animate-pulse'></div>
        </div>

        {/* Estatísticas opcionais */}
        {hasStats && (
          <div className='flex items-center justify-center space-x-4 sm:space-x-8 py-4'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='text-center'>
                <div className='h-8 w-16 bg-gray-600 rounded animate-pulse mb-2'></div>
                <div className='h-4 w-20 bg-gray-700 rounded animate-pulse'></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
);

interface SectionSkeletonProps {
  className?: string;
  background?: 'white' | 'gray' | 'black';
  title?: boolean;
  subtitle?: boolean;
  children?: React.ReactNode;
}

export const SectionSkeleton = ({
  className = '',
  background = 'white',
  title = true,
  subtitle = false,
  children,
}: SectionSkeletonProps) => {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    black: 'bg-black',
  };

  const titleColor = background === 'black' ? 'bg-gray-600' : 'bg-gray-200';
  const subtitleColor = background === 'black' ? 'bg-gray-700' : 'bg-gray-200';

  return (
    <section className={`py-20 ${bgClasses[background]} ${className}`}>
      <div className='container mx-auto px-4'>
        {(title || subtitle) && (
          <div className='text-center mb-12'>
            {title && (
              <div className={`h-8 w-1/3 mx-auto ${titleColor} rounded animate-pulse mb-4`}></div>
            )}
            {subtitle && (
              <div className={`h-6 w-1/2 mx-auto ${subtitleColor} rounded animate-pulse`}></div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

interface GridSkeletonProps {
  columns: number;
  items: number;
  itemHeight?: string;
  className?: string;
}

export const GridSkeleton = ({
  columns,
  items,
  itemHeight = 'h-64',
  className = '',
}: GridSkeletonProps) => (
  <div
    className={`grid gap-6 ${className}`}
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
  >
    {[...Array(items)].map((_, i) => (
      <div key={i} className={`bg-gray-200 rounded-xl animate-pulse ${itemHeight}`}></div>
    ))}
  </div>
);

interface CardSkeletonProps {
  className?: string;
  hasImage?: boolean;
  hasContent?: boolean;
  imageHeight?: string;
}

export const CardSkeleton = ({
  className = '',
  hasImage = true,
  hasContent = true,
  imageHeight = 'h-48',
}: CardSkeletonProps) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm ${className}`}
  >
    {hasImage && <div className={`${imageHeight} bg-gray-200 animate-pulse`}></div>}
    {hasContent && (
      <div className='p-6'>
        <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2'></div>
        <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-1'></div>
        <div className='h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4'></div>
        <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
      </div>
    )}
  </div>
);

interface TimelineSkeletonProps {
  items: number;
  className?: string;
}

export const TimelineSkeleton = ({ items, className = '' }: TimelineSkeletonProps) => (
  <div className={`space-y-16 ${className}`}>
    {[...Array(items)].map((_, index) => (
      <div
        key={index}
        className={`flex flex-col lg:flex-row items-center gap-8 ${
          index % 2 === 1 ? 'lg:flex-row-reverse' : ''
        }`}
      >
        <div className='flex-1'>
          <div className='bg-white border border-gray-200 rounded-2xl p-8 shadow-lg'>
            <div className='h-6 w-16 bg-gray-200 rounded animate-pulse mb-2'></div>
            <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3'></div>
            <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-1'></div>
            <div className='h-4 w-2/3 bg-gray-200 rounded animate-pulse'></div>
          </div>
        </div>

        <div className='flex-1'>
          <div className='h-64 bg-gray-200 rounded-2xl animate-pulse'></div>
        </div>
      </div>
    ))}
  </div>
);

interface VideoSkeletonProps {
  className?: string;
  aspectRatio?: string;
}

export const VideoSkeleton = ({
  className = '',
  aspectRatio = 'aspect-video',
}: VideoSkeletonProps) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg ${className}`}
  >
    <div className={`${aspectRatio} bg-gray-200 animate-pulse flex items-center justify-center`}>
      <svg className='w-16 h-16 text-gray-400' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M8 5v14l11-7z' />
      </svg>
    </div>
    <div className='p-6'>
      <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2'></div>
      <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-1'></div>
      <div className='h-4 w-2/3 bg-gray-200 rounded animate-pulse'></div>
    </div>
  </div>
);
