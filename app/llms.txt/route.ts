import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * llms.txt - Arquivo para LLMs (Large Language Models)
 * 
 * Similar ao robots.txt e sitemap.xml, mas específico para IAs
 * Ajuda LLMs a entender melhor a estrutura e conteúdo do site
 * 
 * Especificação: https://llmstxt.org/
 */
export async function GET() {
  try {
    // Ler arquivo llms.txt da pasta public
    const filePath = path.join(process.cwd(), 'public', 'llms.txt');
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse('llms.txt not found', { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Erro ao ler llms.txt:', error);
    return new NextResponse('Error reading llms.txt', { status: 500 });
  }
}

export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidar a cada 24 horas

