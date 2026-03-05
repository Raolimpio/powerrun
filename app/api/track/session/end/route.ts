import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, duration, exitPage } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'SessionId obrigatório' }, { status: 400 });
    }

    // Atualizar sessão
    await prisma.session.update({
      where: { sessionId },
      data: {
        endTime: new Date(),
        duration,
        exitPage,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session end error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

