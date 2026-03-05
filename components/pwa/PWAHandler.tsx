'use client';

import { useEffect, useState } from 'react';

/**
 * PWA Handler Component - AAAA+++
 *
 * Responsável por:
 * - Registro do Service Worker
 * - Controle de atualizações da PWA
 * - Prompt de instalação
 * - Notificações de conexão
 */

// Removed unused BeforeInstallPromptEvent interface

export default function PWAHandler() {
  // Removed unused deferredPrompt state
  // const [showInstallPrompt, setShowInstallPrompt] = useState(false); // Banner removido
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registrationSW, setRegistrationSW] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Registrar Service Worker
    registerServiceWorker();

    // Configurar eventos PWA
    setupPWAEventListeners();

    // Monitorar conexão
    setupConnectionMonitoring();

    return () => {
      // Cleanup listeners
      // window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt); // Banner removido
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Registrar Service Worker
   */
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        setRegistrationSW(registration);
        console.log('✅ Service Worker registrado:', registration);

        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          console.log('🔄 Nova versão detectada');
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                console.log('📱 Atualização disponível');
              }
            });
          }
        });

        // Controlar Service Worker ativo
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      } catch (error) {
        console.error('❌ Erro no registro do Service Worker:', error);
      }
    }
  };

  /**
   * Configurar event listeners PWA
   */
  const setupPWAEventListeners = () => {
    // Banner de instalação removido - listeners desabilitados
    /*
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // App instalado
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA instalada com sucesso');
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'App Installed'
        });
      }
    });
    */
  };

  /**
   * Handle before install prompt - DESABILITADO
   */
  /*
  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    setDeferredPrompt(e as BeforeInstallPromptEvent);
    setShowInstallPrompt(true);
    console.log('📱 PWA pode ser instalada');
  };

  const showInstallBanner = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`Resultado instalação: ${outcome}`);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'pwa_install_prompt', {
          event_category: 'PWA',
          event_label: outcome
        });
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };
  */

  /**
   * Aplicar atualização
   */
  const applyUpdate = () => {
    if (registrationSW?.waiting) {
      registrationSW.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  /**
   * Monitoramento de conexão
   */
  const setupConnectionMonitoring = () => {
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  };

  const handleOnline = () => {
    setIsOnline(true);
    console.log('🌐 Conexão restaurada');
  };

  const handleOffline = () => {
    setIsOnline(false);
    console.log('📴 Modo offline ativado');
  };

  return (
    <>
      {/* Banner de instalação PWA removido a pedido do usuário */}
      {/* 
      {showInstallPrompt && (
        ...banner code...
      )}
      */}

      {/* Notificação de atualização */}
      {updateAvailable && (
        <div className='fixed top-4 right-4 z-50'>
          <div className='bg-green-600 text-white rounded-lg shadow-2xl p-4 max-w-sm'>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
              <div className='flex-1'>
                <h4 className='font-semibold text-sm'>Atualização Disponível</h4>
                <p className='text-xs text-green-100 mt-1'>Nova versão do Power Run pronta</p>
              </div>
            </div>
            <div className='flex gap-2 mt-3'>
              <button
                onClick={applyUpdate}
                className='flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors'
              >
                Atualizar
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className='px-3 py-2 text-green-100 hover:text-white text-sm transition-colors'
              >
                Depois
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status de conexão */}
      {!isOnline && (
        <div className='fixed top-0 left-0 right-0 z-50'>
          <div className='bg-amber-600 text-white px-4 py-2 text-center text-sm font-medium'>
            <div className='flex items-center justify-center gap-2'>
              <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
              Modo offline - Funcionalidade limitada
            </div>
          </div>
        </div>
      )}
    </>
  );
}
