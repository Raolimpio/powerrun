import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, path, scrollDepth } = body;

    // Atualizar PageView com scroll depth
    await prisma.pageView.updateMany({
      where: {
        sessionId,
        path,
        scrollDepth: null, // Apenas atualizar views sem scroll ainda
      },
      data: {
        scrollDepth,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Scroll depth error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

