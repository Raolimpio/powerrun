'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Página 404 global - redireciona para versão com locale
export default function GlobalNotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página 404 com locale padrão
    router.replace('/pt-BR/not-found-custom');
  }, [router]);

  // Loading enquanto redireciona
  return (
    <html lang='pt-BR'>
      <body
        style={{
          margin: 0,
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#f8fafc',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#9c1006',
              marginBottom: '16px',
            }}
          >
            404
          </div>
          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              marginBottom: '24px',
            }}
          >
            Redirecionando...
          </p>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #000000',
              borderTop: '4px solid #9c1006',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </body>
    </html>
  );
}
