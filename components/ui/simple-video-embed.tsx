import { NoSSR } from '@/components/common';

interface SimpleVideoEmbedProps {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  allow?: string;
  allowFullScreen?: boolean;
  fallbackText?: string;
}

function VideoIframe({
  src,
  title,
  className = '',
  style,
  allow = 'autoplay; encrypted-media',
  allowFullScreen = true,
}: SimpleVideoEmbedProps) {
  return (
    <iframe
      src={src}
      title={title}
      className={className}
      style={style}
      allow={allow}
      allowFullScreen={allowFullScreen}
      loading='lazy'
      referrerPolicy='strict-origin-when-cross-origin'
      sandbox='allow-scripts allow-same-origin'
    />
  );
}

function VideoFallback({
  className = '',
  style,
  title,
  fallbackText = 'Carregando vídeo...',
}: SimpleVideoEmbedProps) {
  return (
    <div
      className={`bg-gray-900 flex flex-col items-center justify-center text-white ${className}`}
      style={style}
    >
      <div className='text-center p-8'>
        <div className='w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto'>
          <div className='w-6 h-6 border-l-[6px] border-l-white ml-1' />
        </div>
        <p className='text-white/70'>{fallbackText}</p>
        <p className='text-white/50 text-sm mt-2'>{title}</p>
      </div>
    </div>
  );
}

export function SimpleVideoEmbed(props: SimpleVideoEmbedProps) {
  return (
    <NoSSR fallback={<VideoFallback {...props} />}>
      <VideoIframe {...props} />
    </NoSSR>
  );
}
