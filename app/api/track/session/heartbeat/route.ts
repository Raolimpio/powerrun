import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, duration } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'SessionId obrigatório' }, { status: 400 });
    }

    // Atualizar duração da sessão (heartbeat)
    await prisma.session.update({
      where: { sessionId },
      data: {
        duration,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silenciar erros de heartbeat
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

