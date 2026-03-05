'use client';

import { useEffect, useState } from 'react';

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  source: string;
}

export function ConsoleErrorTracker() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);

  useEffect(() => {
    // Capture console.error calls
    const originalError = console.error;
    console.error = (...args) => {
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ');

      const error: ErrorLog = {
        message,
        stack: new Error().stack,
        timestamp: new Date().toLocaleTimeString(),
        source: 'console.error',
      };

      setErrors((prev) => [...prev.slice(-9), error]); // Keep last 10
      originalError.apply(console, args); // Call original
    };

    // Capture JavaScript errors
    const handleError = (event: ErrorEvent) => {
      const error: ErrorLog = {
        message: `${event.message} at ${event.filename}:${event.lineno}`,
        stack: event.error?.stack,
        timestamp: new Date().toLocaleTimeString(),
        source: 'javascript',
      };

      setErrors((prev) => [...prev.slice(-9), error]);
    };

    // Capture promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const error: ErrorLog = {
        message: `Promise rejected: ${event.reason}`,
        timestamp: new Date().toLocaleTimeString(),
        source: 'promise',
      };

      setErrors((prev) => [...prev.slice(-9), error]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50 max-w-md'>
      <div className='bg-red-600 text-white p-4 rounded-lg shadow-lg'>
        <h3 className='font-bold text-sm mb-2'>🚨 Console Errors ({errors.length})</h3>
        <div className='max-h-48 overflow-y-auto space-y-2'>
          {errors.map((error, index) => (
            <div key={index} className='text-xs bg-red-700 p-2 rounded'>
              <div className='font-mono'>
                {error.timestamp} - {error.source}
              </div>
              <div className='mt-1'>{error.message}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setErrors([])}
          className='mt-2 px-2 py-1 bg-red-700 text-xs rounded hover:bg-red-800'
        >
          Clear
        </button>
      </div>
    </div>
  );
}
