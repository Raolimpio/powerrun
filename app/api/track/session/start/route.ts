import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, landingPage, userAgent, referrer, currentUrl } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'SessionId obrigatório' }, { status: 400 });
    }

    // Detectar dispositivo, browser e OS
    const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';
    
    let browser = 'unknown';
    if (userAgent?.includes('Chrome')) browser = 'chrome';
    else if (userAgent?.includes('Firefox')) browser = 'firefox';
    else if (userAgent?.includes('Safari')) browser = 'safari';
    else if (userAgent?.includes('Edge')) browser = 'edge';
    
    let os = 'unknown';
    if (userAgent?.includes('Windows')) os = 'windows';
    else if (userAgent?.includes('Mac')) os = 'macos';
    else if (userAgent?.includes('Linux')) os = 'linux';
    else if (userAgent?.includes('Android')) os = 'android';
    else if (userAgent?.includes('iOS')) os = 'ios';

    // Criar ou atualizar sessão
    await prisma.session.upsert({
      where: { sessionId },
      update: {
        pageViews: { increment: 1 },
      },
      create: {
        sessionId,
        landingPage,
        deviceType,
        browser,
        os,
        pageViews: 1,
      },
    });

    // Registrar origem de tráfego
    // Priorizar URL atual (pode ter gclid ou UTM) sobre referrer
    const urlToAnalyze = currentUrl || referrer;
    
    if (urlToAnalyze) {
      const trafficSource = analyzeTrafficSource(urlToAnalyze);
      await prisma.trafficSource.create({
        data: {
          sessionId,
          source: trafficSource.source,
          medium: trafficSource.medium,
          campaign: trafficSource.campaign,
          referrer: referrer || urlToAnalyze,
          landingPage,
        },
      });
    } else {
      // Tráfego direto
      await prisma.trafficSource.create({
        data: {
          sessionId,
          source: 'direct',
          referrer: null,
          landingPage,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session start error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Função para analisar origem de tráfego
function analyzeTrafficSource(referrer: string): {
  source: string;
  medium: string | null;
  campaign: string | null;
} {
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();
    
    // ✅ DETECÇÃO DE GOOGLE ADS (PRIORIDADE ALTA)
    // 1. Verificar gclid (Google Click ID) - indica Google Ads
    const gclid = url.searchParams.get('gclid');
    if (gclid) {
      const utmCampaign = url.searchParams.get('utm_campaign') || 'Google Ads';
      const utmSource = url.searchParams.get('utm_source') || 'google';
      const utmMedium = url.searchParams.get('utm_medium') || 'cpc';
      return {
        source: utmSource,
        medium: utmMedium, // 'cpc' indica tráfego pago
        campaign: utmCampaign,
      };
    }
    
    // 2. Verificar UTM parameters (pode indicar Google Ads)
    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    const utmCampaign = url.searchParams.get('utm_campaign');
    
    // Se utm_medium é 'cpc' ou 'cpm', é tráfego pago
    if (utmMedium && (utmMedium.toLowerCase() === 'cpc' || utmMedium.toLowerCase() === 'cpm')) {
      return {
        source: utmSource || 'google',
        medium: utmMedium, // 'cpc' ou 'cpm'
        campaign: utmCampaign,
      };
    }
    
    // Se utm_source é 'google' e utm_medium é 'cpc', é Google Ads
    if (utmSource?.toLowerCase() === 'google' && utmMedium?.toLowerCase() === 'cpc') {
      return {
        source: 'google',
        medium: 'cpc',
        campaign: utmCampaign,
      };
    }
    
    // Se tem UTM parameters, usar eles
    if (utmSource) {
      return {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
      };
    }
    
    // Detectar redes sociais
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return { source: 'social', medium: 'facebook', campaign: null };
    }
    if (hostname.includes('instagram.com')) {
      return { source: 'social', medium: 'instagram', campaign: null };
    }
    if (hostname.includes('twitter.com') || hostname.includes('t.co')) {
      return { source: 'social', medium: 'twitter', campaign: null };
    }
    if (hostname.includes('linkedin.com')) {
      return { source: 'social', medium: 'linkedin', campaign: null };
    }
    if (hostname.includes('youtube.com')) {
      return { source: 'social', medium: 'youtube', campaign: null };
    }
    
    // Detectar motores de busca (ORGÂNICO - sem gclid ou UTM)
    if (hostname.includes('google.')) {
      return { source: 'organic', medium: 'google', campaign: null };
    }
    if (hostname.includes('bing.com')) {
      return { source: 'organic', medium: 'bing', campaign: null };
    }
    if (hostname.includes('yahoo.com')) {
      return { source: 'organic', medium: 'yahoo', campaign: null };
    }
    
    // Outros são referral
    return { source: 'referral', medium: hostname, campaign: null };
  } catch {
    return { source: 'referral', medium: null, campaign: null };
  }
}

