// ========================================
// 🔗 MAPEAMENTO DE QR CODES PARA MANUAIS
// ========================================
// Sistema de redirecionamento QR Code → Manual PDF

import {
  manualPowerRace7000TS,
  manualPowerRace7000,
  manualPowerRound550,
  manualSimuladorEscada350,
  manualPowerRush350,
  manualPowerRush250,
  manualPowerRise650,
  manualPR001,
  manualPR006,
  manualPR009,
  manualPR015,
  manualPR002,
  manualPR003,
  manualPR010,
  manualPR004,
  manualPR013,
  manualPR008,
  // manualPR012, // Ainda não existe
} from './pdf-links';

// === 🎯 MAPEAMENTO QR CODE → MANUAL ===
export const QR_CODE_REDIRECTS: Record<string, string> = {
  // Blue Line
  'qr-pk60te': manualPowerRace7000TS, // PR7000 TS
  'qr-pk60': manualPowerRace7000, // PR7000
  'qr-pp790': manualPowerRound550, // PR550 (Power Round 550)
  'qr-pp290': manualSimuladorEscada350, // PR450 → Simulador Escada 350
  'qr-pp390': manualPowerRush350, // PR350 (Power Rush 350)
  'qr-pq980': manualPowerRush250, // PR250 (Power Rush 250)
  'qr-pp007': manualPowerRise650, // PR650 (Power Rise 650)

  // Musculação
  'qr-pra003': manualPR001, // PR001
  'qr-pra020': manualPR006, // PR006
  'qr-pra021': manualPR009, // PR009
  'qr-pra025': manualPR015, // PR015
  'qr-pra026': manualPR002, // PR002
  'qr-pra029': manualPR003, // PR003
  'qr-prs004': manualPR010, // PR010
  'qr-prs004lp': manualPR004, // PR004
  'qr-prs020': manualPR013, // PR013
  'qr-pr003': manualPR008, // PR008
  // 'qr-prc5': manualPR012,                // PR012 - Manual ainda não existe
};

// === 🔧 FUNÇÃO HELPER ===
export function getManualByQRCode(qrCode: string): string | null {
  return QR_CODE_REDIRECTS[qrCode] || null;
}

// === 📊 ESTATÍSTICAS ===
export function getQRCodeStats() {
  const totalCodes = Object.keys(QR_CODE_REDIRECTS).length;
  const workingCodes = Object.values(QR_CODE_REDIRECTS).filter(
    (url) => url && url.trim() !== ''
  ).length;

  return {
    total: totalCodes,
    working: workingCodes,
    missing: totalCodes - workingCodes,
    coverage: Math.round((workingCodes / totalCodes) * 100),
  };
}

// === ❌ QR CODES SEM MANUAL ===
export const MISSING_QR_MANUALS = [
  'qr-prc5', // PR012 - Manual ainda não existe
];
