// ========================================
// 🎯 MAPEAMENTO QR CODE → EQUIPAMENTO
// ========================================
// Relaciona códigos QR com equipamentos para mostrar dados na página de destino

export const QR_EQUIPMENT_MAPPING: Record<string, string> = {
  // Blue Line
  'qr-pk60te': 'power-race-7000-ts', // PR7000 TS
  'qr-pk60': 'power-race-7000', // PR7000
  'qr-pp790': 'power-round-550', // PR550 (Power Round 550)
  'qr-pp290': 'simulador-escada-350', // PR450 → Simulador Escada 350
  'qr-pp390': 'power-rush-350', // PR350 (Power Rush 350)
  'qr-pq980': 'power-rush-250', // PR250 (Power Rush 250)
  'qr-pp007': 'power-rise-650', // PR650 (Power Rise 650)

  // Red Line
  'qr-pr400': 'bike-horizontal-pr400', // PR400 (Bike Horizontal)
  'qr-pr300': 'bike-vertical-pr300', // PR300 (Bike Vertical)
  'qr-pr500': 'eliptico-pr500', // PR500 (Elíptico)
  'qr-pr600': 'escada-pr600', // PR600 (Escada)
  'qr-pr200': 'bicicleta-spinning-pr200', // PR200 (Spinning)
  'qr-pr5000': 'esteira-pr5000', // PR5000 (Esteira)
  'qr-pr6000': 'esteira-pr6000', // PR6000 (Esteira)

  // Musculação
  'qr-pra003': 'pr001', // PR001
  'qr-pra020': 'pr006', // PR006
  'qr-pra021': 'pr009', // PR009
  'qr-pra025': 'pr015', // PR015
  'qr-pra026': 'pr002', // PR002
  'qr-pra029': 'pr003', // PR003
  'qr-prs004': 'pr010', // PR010
  'qr-prs004lp': 'pr004', // PR004
  'qr-prs020': 'pr013', // PR013
  'qr-pr003': 'pr008', // PR008
  'qr-prc5': 'pr012', // PR012
  'qr-pr005': 'pr005-leg-press-hack', // PR005 (Leg Press Hack)
};

// === 🔧 FUNÇÃO HELPER ===
export function getEquipmentIdByQRCode(qrCode: string): string | null {
  return QR_EQUIPMENT_MAPPING[qrCode] || null;
}

// === 📱 INFORMAÇÕES DE CONTATO ===
export const CONTACT_INFO = {
  commercial: {
    phone: '(14) 9 8202-4824',
    whatsapp:
      'https://wa.me/5514982024824?text=Olá! Vi o QR code de um equipamento Power Run e gostaria de mais informações comerciais.',
    label: 'Comercial',
  },
  support: {
    phone: '(14) 98202-4827',
    whatsapp:
      'https://wa.me/5514982024827?text=Olá! Vi o QR code de um equipamento Power Run e preciso de suporte técnico.',
    label: 'Suporte Técnico',
  },
};
