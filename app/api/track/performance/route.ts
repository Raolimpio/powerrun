import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, pagePath, metricName, value, rating } = body;

    await prisma.performanceMetric.create({
      data: {
        sessionId,
        pagePath,
        metricName,
        value,
        rating,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Performance metric error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

