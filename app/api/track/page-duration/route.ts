import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, path, duration } = body;

    // Atualizar PageView com duração
    await prisma.pageView.updateMany({
      where: {
        sessionId,
        path,
        duration: null, // Apenas atualizar views sem duração ainda
      },
      data: {
        duration,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page duration error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

