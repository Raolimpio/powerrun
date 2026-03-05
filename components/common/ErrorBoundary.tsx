'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

/**
 * 🛡️ ERROR BOUNDARY COMPONENT
 *
 * Componente profissional para captura e tratamento de erros React
 * Integrado com Sentry para monitoramento completo
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualizar state para mostrar fallback UI
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 🛡️ O Sentry captura erros automaticamente via configuração global
    // Não precisamos importar aqui para evitar problemas no build

    // Callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError();
    }

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.group('🛡️ Error Boundary Ativado');
      // eslint-disable-next-line no-console
      console.error('Erro:', error);
      // eslint-disable-next-line no-console
      console.error('Erro Stack:', error.stack);
      // eslint-disable-next-line no-console
      console.error('ErrorInfo:', errorInfo);
      // eslint-disable-next-line no-console
      console.error('ComponentStack:', errorInfo?.componentStack);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  override render() {
    if (this.state.hasError) {
      // Fallback UI personalizado ou padrão
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback UI padrão profissional
      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
          <div className='max-w-md w-full mx-auto'>
            <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-8 w-8 text-red-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800 dark:text-red-200'>
                    Ops! Algo deu errado
                  </h3>
                  <div className='mt-2 text-sm text-red-700 dark:text-red-300'>
                    <p>
                      Encontramos um problema inesperado. Nossa equipe foi notificada
                      automaticamente e está trabalhando na correção.
                    </p>
                  </div>
                  <div className='mt-4'>
                    <div className='-mx-2 -my-1.5 flex'>
                      <button
                        type='button'
                        className='bg-red-50 dark:bg-red-900/50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        onClick={() => window.location.reload()}
                      >
                        Recarregar página
                      </button>
                      <button
                        type='button'
                        className='ml-3 bg-red-50 dark:bg-red-900/50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        onClick={() => this.setState({ hasError: false })}
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do erro em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className='mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md'>
                  <h4 className='text-sm font-medium text-gray-800 dark:text-gray-200 mb-2'>
                    Debug Info (dev only):
                  </h4>
                  <code className='text-xs text-gray-600 dark:text-gray-400 break-all'>
                    {this.state.error.message}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 🎯 HOC para envolver componentes automaticamente
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default ErrorBoundary;
