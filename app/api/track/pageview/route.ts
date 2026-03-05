import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      path,
      locale,
      referer,
      userAgent,
      ip,
      country,
      city: cityName,
      deviceType,
      browser,
      os,
      screenWidth,
      screenHeight,
      sessionId, // Novo campo
    } = body;

    // Obter IP real do cliente
    const clientIp = ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 'unknown';

    await prisma.pageView.create({
      data: {
        path,
        locale,
        referer,
        userAgent,
        ip: clientIp,
        country,
        city: cityName,
        deviceType,
        browser,
        os,
        screenWidth,
        screenHeight,
        sessionId, // Adicionar sessionId
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

