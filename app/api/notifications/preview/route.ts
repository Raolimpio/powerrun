import { NextRequest, NextResponse } from 'next/server';
import { generateNotificationEmail } from '@/lib/notification-templates';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação via cookie de admin
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession?.value) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') || 'whatsapp') as 'whatsapp' | 'quote';

    // Dados de exemplo para preview
    const sampleData = {
      type,
      productName: 'Esteira PR 4000',
      productId: 'esteira-pr4000',
      cityName: 'São Paulo',
      pagePath: type === 'whatsapp' ? '/pt-BR/equipamentos/esteira-pr4000' : '/pt-BR/seo/esteira-pr4000/corrida/sao-paulo',
      pageType: type === 'whatsapp' ? 'normal' : 'seo',
      deviceType: 'mobile',
      browser: 'chrome',
      os: 'android',
      referer: 'https://www.google.com/search?q=esteira+corrida',
      trafficChannel: type === 'whatsapp' ? 'organic' : 'seo' as 'seo' | 'organic' | 'paid' | 'direct' | 'other',
      timestamp: new Date(),
    };

    const emailHtml = generateNotificationEmail(sampleData);

    return new NextResponse(emailHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Erro ao gerar preview de notificação:', error);
    return NextResponse.json(
      {
        error: 'Erro ao gerar preview',
        message: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

