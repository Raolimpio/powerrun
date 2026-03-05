import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'SessionId obrigatório' }, { status: 400 });
    }

    // Incrementar conversões na sessão
    await prisma.session.update({
      where: { sessionId },
      data: {
        conversions: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session conversion error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

