'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h2>Ocorreu um erro</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
          {error.digest && <small>{error.digest}</small>}
        </div>
      </body>
    </html>
  );
}
