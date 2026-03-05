import { Equipment, EquipmentCategory } from '@/types';

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    id: 'red-line',
    name: 'Red Line',
    slug: 'red-line',
    description: 'Red Line: Esteiras, bicicletas, elípticos e equipamentos fundamentais',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  },
  {
    id: 'blue-line',
    name: 'Blue Line',
    slug: 'blue-line',
    description: 'Blue Line: Equipamentos avançados com tecnologia de ponta',
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&h=600&fit=crop',
  },
  {
    id: 'musculacao',
    name: 'Musculação',
    slug: 'musculacao',
    description: 'Aparelhos de musculação, pesos livres e acessórios para treinamento de força',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
  },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  // Simulador de Escada PR600 - PRIMEIRO PRODUTO DA LINHA VERMELHA
  {
    id: 'escada-pr600',
    name: 'Simulador de escada profissional - PR600',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR600',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203715/11_gnm1yo.png', // Principal (manter atual)
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367750/36_gdmnf8.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367730/38_a42j2w.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367716/39_ff2pdz.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367703/37_rfgoca.png', // Masonry: Destaques
    ],
    shortDescription: 'Treino cardiovascular intenso (glúteos, pernas, condicionamento).',
    description:
      'Simulador de Escada PR600 com 15 graus de inclinação e velocidade 15-164 passos/min. Área de degrau ampliada (56 x 23,5cm), display 5 funções e capacidade 160kg. Estrutura compacta para múltiplos ambientes.',
    specifications: {
      Aparência: '—',
      'Auto-diagnóstico': 'Exibe automaticamente o código de falha em caso de problema',
      'Carga Máxima': '160 kg',
      Dimensões: '145 × 82 × 208 cm',
      Display: 'Tempo, distância, calorias, frequência cardíaca, inclinação',
      'Fonte de Alimentação': '110/220 V',
      Funções:
        'Nível de resistência, potência, tempo de exercício, calorias, frequência cardíaca, distância de exercício',
      Inclinação: '0–15 graus',
      'Modo de Suspensão': '—',
      'Níveis de resistência': 'EMS com 40 níveis',
      Velocidade: '15 a 164 passos/min',
      'Área do degrau': '56 × 23,5 × 22 cm',
    },
    features: [
      'Controle de carga via joystick',
      'Corrimão emborrachado com acabamento antiferrugem',
      'Escovas laterais de segurança (evitam acidentes e entrada de objetos)',
      'Pé de apoio em chapa de aço carbono 4 mm com borracha antiderrapante',
      'Ajuste de velocidade: 15–164 passos/min',
      'Capacidade de carga: até 160 kg',
      'Degraus amplos: 56 × 23,5 × 22 cm',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // Bicicleta Spinning PR200
  {
    id: 'bicicleta-spinning-pr200',
    name: 'Bicicleta profissional - PR200 Red Line',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR200',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756266844/Bike_Spinning_spk8jt.png', // Principal
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366616/29_fihuop.png', // Masonry: Detalhes atualizados
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366590/28_ujhga4.png', // Masonry: Detalhes atualizados
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366562/27_nlxtrv.png', // Masonry: Detalhes atualizados
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366546/26_pxddkg.png', // Masonry: Detalhes atualizados
    ],
    shortDescription:
      'Bicicleta spinning profissional com disco de inércia 21kg, transmissão por corrente e capacidade para 150kg.',
    description:
      'BICICLETA SPINNING PR200 Red Line com disco de inércia de 21kg e transmissão por corrente. Suporta até 150kg com dimensões de 139 x 54cm e peso de 45kg. Inclui freio duplo com parada de emergência, regulagens de altura em aço inox e guidão emborrachado.',
    specifications: {
      'Ajuste do assento Vertical': 'Regulagem de altura e distância em aço inox',
      'Ajuste do assento Horizontal': '—',
      Alça: '—',
      'Capacidade de Utilização': '150 kg',
      Carenagem: '—',
      'Conteúdo da tela': '—',
      Cor: 'Diversas',
      'Dimensões (C x L x A)': '139 x 54 cm',
      'Disco de Inércia': '21 kg',
      Display: '—',
      'Fonte de energia': '—',
      Freio: 'Duplo com parada de emergência',
      'Função opcional': '—',
      Garantia: '3 anos para estrutura, 1 ano para peça',
      Guidão: 'Emborrachado com regulagem de altura em aço inox',
      Lubrificação: 'Manual',
      'Modo de ajuste da resistência': '—',
      'Modo de alimentação': '—',
      'Sistema de Transmissão': 'Corrente',
      'Movimento Central': 'Blindado',
      'Níveis de resistência': '—',
      Peso: '45 kg',
      'Proteção do motor': '—',
      'Sistema de resistência': '—',
      'Tipo de carga': '—',
    },
    features: [
      'Guidão com suporte para celular e apoios de peso (1–3 kg)',
      'Movimento central Shimano reforçado',
      'Pedal e pedivela reforçados',
      'Opcionais: painel digital e pedal de sapatilha',
      'Roda de inércia ~21 kg',
      'Capacidade do usuário: 150 kg',
      'Carenagem de proteção completa',
      'Customização com cores e identidade da academia',
    ],
    targets: ['academia', 'condominio', 'residencia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // Esteira Profissional PR4000 1.8
  {
    id: 'esteira-pr4000-18',
    name: 'Esteira profissional - PR4000 1.8',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR4000 1.8',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203712/3_atupd0.png', // Principal
    ],
    shortDescription: 'Estrutura em aço carbono com pintura eletrostática e design profissional.',
    description:
      'Esteira Profissional PR4000 1.8 Red Line com estrutura em aço carbono, carenagens em polietileno com proteção UV, lona antiestática de dupla camada, deck reforçado resistente ao desgaste e sistema de amortecimento de impacto. Capacidade 120kg, área útil 135x47cm. Velocidade máxima 16km/h.',
    specifications: {
      'Motor / Inversor': 'WEG 1.8 HP AC Peak Power',
      'Área útil (C × L)': '135 × 47 cm',
      'Velocidade máx.': '16 km/h',
      Inclinação: '—',
      Display: 'LED com 3 janelas',
      Programas: '—',
      'Atalhos de velocidade': '6/8/10',
      'Dimensões (C × L × A)': '176 × 73 × 146 cm',
      'Capacidade de uso': '120 kg',
      Tensão: '110/220 V',
      'Porta-squeeze/objetos': 'Sim',
      'Suporte p/ celular': 'Suporte regulável',
      'Tomada USB': 'Sim',
      'Botão de emergência': 'Sim',
      'Hand grip cardíaco': 'Sim',
    },
    features: [
      'Largura da lona de 47 cm',
      'Atalhos de velocidade',
      'Lona antiestática de dupla camada',
      'Sistema de amortecimento de impacto',
      'Tomada USB para celulares',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },
  // Esteira Profissional PR4000 3.0
  {
    id: 'esteira-pr4000-30',
    name: 'Esteira profissional - PR4000 3.0',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR4000 3.0',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203712/4_bmnoav.png', // Principal
    ],
    shortDescription: 'Estrutura em aço carbono com pintura eletrostática e design profissional.',
    description:
      'Esteira Profissional PR4000 3.0 Red Line com estrutura em aço carbono, carenagens em polietileno com proteção UV, lona antiestática de dupla camada, deck reforçado resistente ao desgaste e sistema de amortecimento de impacto. Capacidade 150kg, área útil 135x47cm. Velocidade máxima 18km/h.',
    specifications: {
      'Motor / Inversor': 'WEG 3.0 HP AC Peak Power',
      'Área útil (C × L)': '135 × 47 cm',
      'Velocidade máx.': '18 km/h',
      Inclinação: '—',
      Display: 'LED com 5 janelas',
      Programas: '—',
      'Atalhos de velocidade': '6/8/10/12/14',
      'Dimensões (C × L × A)': '176 × 73 × 146 cm',
      'Capacidade de uso': '150 kg',
      Tensão: '110/220 V',
      'Porta-squeeze/objetos': 'Sim',
      'Suporte p/ celular': 'Suporte regulável',
      'Tomada USB': 'Sim',
      'Botão de emergência': 'Sim',
      'Hand grip cardíaco': 'Sim',
    },
    features: [
      'Largura da lona de 47 cm',
      'Atalhos de velocidade',
      'Lona antiestática de dupla camada',
      'Sistema de amortecimento de impacto',
      'Motor WEG 3.0 HP AC Peak Power',
      'Tomada USB para celulares',
      'Sistema de parada lenta',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },
  // Esteira Profissional PR5000 Series
  {
    id: 'esteira-pr5000',
    name: 'Esteira profissional - PR5000 Series',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR5000',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297828/5_ufc7nz.png', // Principal: Ficha técnica
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364318/16_enr07y.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364307/18_lfpfu1.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364295/19_jkic7z.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364284/17_djyftl.png', // Masonry: Destaques
    ],
    shortDescription:
      'Estrutura em aço carbono com pintura eletrostática, deck duplo e design profissional.',
    description:
      'Esteira Profissional PR5000 Red Line com estrutura em aço carbono, carenagens em polietileno com proteção UV, lona antiestática de dupla camada, deck reforçado resistente ao desgaste e sistema de amortecimento de impacto. Capacidade 150kg, área útil 135x54cm. Velocidade máxima 18km/h.',
    specifications: {
      'Motor / Inversor': 'WEG 3.0 HP AC Peak Power',
      'Área útil (C × L)': '135 × 54 cm',
      'Velocidade máx.': '18 km/h',
      Inclinação: '—',
      Display: 'LED com 5 janelas',
      Programas: '—',
      'Atalhos de velocidade': '6/8/10/12/14',
      'Dimensões (C × L × A)': '187 × 86 × 146 cm',
      'Capacidade de uso': '150 kg',
      Tensão: '110/220 V',
      'Porta-squeeze/objetos': 'Sim',
      'Suporte p/ celular': 'Suporte ajustável',
      'Tomada USB': 'Sim',
      'Botão de emergência': 'Sim',
      'Hand grip cardíaco': 'Sim',
    },
    features: [
      'Largura da lona de 54 cm',
      'Área de Corrida 135 × 54 cm',
      'Atalhos de velocidade',
      'Deck Reforçado Resistente ao Desgaste',
      'WEG 3.0 HP AC Peak Power',
      'Tomada USB para celulares',
      'Sistema de parada lenta',
      'Lona antiestática de dupla camada',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: true,
  },
  // Esteira Profissional PR5000i
  {
    id: 'esteira-pr5000i',
    name: 'Esteira profissional - PR5000i',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR5000i',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297849/6_vws1yt.png', // Principal
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364809/16_dldmhr.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364720/19_l0h9xe.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364708/18_jl8ogu.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364696/Destaques_evoaln.png', // Masonry: Destaques
    ],
    shortDescription:
      'Estrutura em aço carbono com pintura eletrostática, deck duplo e design profissional.',
    description:
      'Esteira Profissional PR5000i Red Line com estrutura em aço carbono, carenagens em polietileno com proteção UV, lona antiestática de dupla camada, deck reforçado resistente ao desgaste e sistema de amortecimento de impacto. Capacidade 150kg, área útil 135x54cm. Velocidade máxima 20km/h com inclinação automática 0-15%.',
    specifications: {
      'Motor / Inversor': 'WEG 3.0 HP AC Peak Power',
      'Área útil (C × L)': '135 × 54 cm',
      'Velocidade máx.': '20 km/h',
      Inclinação: 'Automática 0–15%',
      Display: 'LED com 7 janelas',
      Programas: '16',
      'Atalhos de velocidade': '6/8/10/12/14',
      'Dimensões (C × L × A)': '187 × 86 × 146 cm',
      'Capacidade de uso': '150 kg',
      Tensão: '110/220 V',
      'Porta-squeeze/objetos': 'Sim',
      'Suporte p/ celular': '—',
      'Tomada USB': 'Sim',
      'Botão de emergência': 'Sim',
      'Hand grip cardíaco': 'Sim',
    },
    features: [
      'Largura da lona de 54 cm',
      'Área de Corrida 135 × 54 cm',
      'Atalhos de velocidade',
      'Deck Reforçado Resistente ao Desgaste',
      'Lona antiestática de dupla camada',
      'WEG 3.0 HP AC Peak Power',
      'Tomada USB para celulares',
      'Sistema de parada lenta',
      'Sistema de inclinação',
      '16 programas de treino',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: true,
  },
  // Esteira Profissional PR6000 Series
  {
    id: 'esteira-pr6000',
    name: 'Esteira profissional - PR6000 Series',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR6000',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297860/7_y7xxhe.png', // Principal
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364439/Destaques_ba1hyt.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364126/16_smwxn8.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364112/19_kn9n9c.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756364101/18_nrhgos.png', // Masonry: Destaques
    ],
    shortDescription:
      'Estrutura em aço carbono com pintura eletrostática. Carenagens em polietileno com proteção UV.',
    description:
      'Esteira Profissional PR6000 Red Line com estrutura em aço carbono, carenagens em polietileno com proteção UV, lona antiestática de dupla camada, deck reforçado resistente ao desgaste e sistema de amortecimento de impacto. Capacidade 150kg, área útil 155x54cm. Velocidade máxima 20km/h.',
    specifications: {
      'Motor / Inversor': 'WEG 3.0 HP AC Peak Power',
      'Área útil (C × L)': '155 × 54 cm',
      'Velocidade máx.': '20 km/h',
      Inclinação: '—',
      Display: 'LED com 6 janelas',
      Programas: '16',
      'Atalhos de velocidade': '6/8/10/12/14',
      'Dimensões (C × L × A)': '207 × 86 × 146 cm',
      'Capacidade de uso': '150 kg',
      Tensão: '110/220 V',
      'Porta-squeeze/objetos': 'Sim',
      'Suporte p/ celular': '—',
      'Tomada USB': 'Sim',
      'Botão de emergência': 'Sim',
      'Hand grip cardíaco': 'Sim',
    },
    features: [
      'Largura da lona de 54 cm',
      'Área de Corrida 155 × 54 cm',
      'Atalhos de velocidade',
      'Deck Reforçado Resistente ao Desgaste',
      'Lona antiestática de dupla camada',
      'WEG 3.0 HP AC Peak Power',
      'Tomada USB para celulares',
      'Sistema de parada lenta',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },
  // Esteira Profissional PR6000i
  {
    id: 'esteira-pr6000i',
    name: 'Esteira profissional - PR6000i',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR6000i',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297869/8_csee85.png', // Principal
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756365066/Destaques_1_ifizty.png', // Masonry: Diferenciais
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756365052/16_xff5vk.png', // Masonry: Diferenciais
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756365026/18_yemuzr.png', // Masonry: Diferenciais
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756365015/19_d87atb.png', // Masonry: Diferenciais
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756365015/19_d87atb.png', // Masonry: Diferenciais
    ],
    shortDescription:
      'Estrutura em aço carbono com pintura eletrostática. Carenagens em polietileno com proteção UV.',
    description:
      'Esteira Profissional PR6000i Red Line com estrutura em aço carbono, carenagens em polietileno com proteção UV, lona antiestática de dupla camada, deck reforçado resistente ao desgaste e sistema de amortecimento de impacto. Capacidade 150kg, área útil 155x54cm. Velocidade máxima 20km/h com inclinação automática 0-15%.',
    specifications: {
      'Motor / Inversor': 'WEG 3.0 HP AC Peak Power',
      'Área útil (C × L)': '155 × 54 cm',
      'Velocidade máx.': '20 km/h',
      Inclinação: 'Automática 0–15%',
      Display: 'LED com 7 janelas',
      Programas: '16',
      'Atalhos de velocidade': '6/8/10/12/14',
      'Dimensões (C × L × A)': '207 × 86 × 146 cm',
      'Capacidade de uso': '150 kg',
      Tensão: '110/220 V',
      'Porta-squeeze/objetos': 'Sim',
      'Suporte p/ celular': 'Tomada USB + suporte',
      'Tomada USB': 'Sim',
      'Botão de emergência': 'Sim',
      'Hand grip cardíaco': 'Sim',
    },
    features: [
      'Largura da lona de 54 cm',
      'Área de Corrida 155 × 54 cm',
      'Atalhos de velocidade',
      'Deck Reforçado Resistente ao Desgaste',
      'Lona antiestática de dupla camada',
      'WEG 3.0 HP AC Peak Power',
      'Tomada USB para celulares',
      'Sistema de parada lenta',
      'Sistema de inclinação',
      '16 programas de treino',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },
  // Bicicleta Vertical PR300
  {
    id: 'bike-vertical-pr300',
    name: 'Bicicleta profissional - PR300 Vertical',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR300',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203713/9_b8kugz.png', // Principal (manter atual)
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367673/33_yywjti.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367653/31_cn25mz.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367517/34_rv8iaq.png', // Masonry: Destaques
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367485/30_ufymvg.png', // Masonry: Destaques
    ],
    shortDescription:
      'Bicicleta vertical com sistema EMS de 20 níveis, energia autogerável e display LED branco de 6 janelas.',
    description:
      'BICICLETA VERTICAL PR300 Red Line com sistema de energia autogerável e resistência eletromagnética EMS de 20 níveis. Display LED branco de 6 janelas com gráfico de treino. Assento em espuma PU com ajuste de altura e correia silenciosa resistente ao desgaste.',
    specifications: {
      'Ajuste do assento Vertical': 'Sim',
      'Ajuste do assento Horizontal': '—',
      Alça: '—',
      'Capacidade de Utilização': '160 kg',
      Carenagem: '—',
      'Conteúdo da tela': '—',
      Cor: '—',
      'Dimensões (C x L x A)': '105 × 62 × 138 cm',
      'Disco de Inércia': '—',
      Display: 'LED branco 6 janelas',
      'Fonte de energia': 'Autogerável (self-powered)',
      Freio: '—',
      'Função opcional': '—',
      Garantia: '—',
      Guidão: '—',
      Lubrificação: 'Manual',
      'Modo de ajuste da resistência': '—',
      'Modo de alimentação': '—',
      'Sistema de Transmissão': 'Correia silenciosa resistente ao desgaste',
      'Movimento Central': '—',
      'Níveis de resistência': '1–20 EMS',
      Peso: '76,5 kg',
      'Proteção do motor': '—',
      'Sistema de resistência': '—',
      'Tipo de carga': 'Eletromagnético',
    },
    features: [
      'Sistema EMS com 20 níveis',
      'Energia autogerada (self-powered)',
      'Tela/Display LED branco com 6 janelas',
      'Assento em espuma PU confortável',
      'Ajuste do assento com auto-encaixe seguro',
      'Modos de treino personalizáveis',
      'Teclas de atalho rápidas',
    ],
    targets: ['academia', 'condominio', 'residencia'],
    downloads: [],
    inStock: true,
    featured: true,
  },
  // Bicicleta Horizontal PR400
  {
    id: 'bike-horizontal-pr400',
    name: 'Bicicleta profissional - PR400 Horizontal',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR400',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756368450/9_fx6iyp.png', // Principal atualizado
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367457/24_li3zym.png', // Masonry: Destaque
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367368/25_acrvqt.png', // Masonry: Destaque
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367330/22_uelb3g.png', // Masonry: Destaque
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367294/23_uewfjg.png', // Masonry: Destaque
    ],
    shortDescription:
      'Bicicleta horizontal com sistema EMS de 20 níveis, energia autogerável e display LED branco de 6 janelas.',
    description:
      'BICICLETA HORIZONTAL PR400 Red Line com sistema de energia autogerável e resistência eletromagnética EMS de 20 níveis. Display LED branco de 6 janelas com gráfico de treino. Assento e encosto em espuma PU com ajuste em 8 rodas de rolagem.',
    specifications: {
      'Ajuste do assento Vertical': 'Sim',
      'Ajuste do assento Horizontal': 'Sim',
      Alça: '—',
      'Capacidade de Utilização': '160 kg',
      Carenagem: '—',
      'Conteúdo da tela': '—',
      Cor: '—',
      'Dimensões (C x L x A)': '170 × 66 × 131 cm',
      'Disco de Inércia': '—',
      Display: 'LED branco 6 janelas',
      'Fonte de energia': 'Autogerável (self-powered)',
      Freio: '—',
      'Função opcional': '—',
      Garantia: '—',
      Guidão: '—',
      Lubrificação: 'Manual',
      'Modo de ajuste da resistência': '—',
      'Modo de alimentação': '—',
      'Sistema de Transmissão': 'Correia silenciosa resistente ao desgaste',
      'Movimento Central': '—',
      'Níveis de resistência': '1–20 EMS',
      Peso: '96 kg',
      'Proteção do motor': '—',
      'Sistema de resistência': '—',
      'Tipo de carga': 'Eletromagnético',
    },
    features: [
      'Sistema EMS com 20 níveis',
      'Energia autogerada (self-powered)',
      'Tela/Display LED branco com 6 janelas',
      'Assento + encosto em espuma PU',
      'Ajuste do assento em 8 rodas de rolagem',
      'Modos de treino personalizáveis',
      'Teclas de atalho rápidas',
    ],
    targets: ['academia', 'condominio', 'residencia'],
    downloads: [],
    inStock: true,
    featured: true,
  },
  // Elíptico PR500
  {
    id: 'eliptico-pr500',
    name: 'Elíptico profissional - PR500',
    category: 'red-line',
    brand: 'PowerRun',
    model: 'PR500',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203712/1_u0txxo.png', // Principal (manter atual - destaques vazios)
    ],
    shortDescription:
      'Elíptico com energia autogerada, resistência eletromagnética EMS de 20 níveis e display LED branco de 6 janelas.',
    description:
      'ELÍPTICO PR500 Red Line com sistema de energia autogerável e resistência eletromagnética EMS de 20 níveis. Display LED branco de 6 janelas com dados completos de treino. Capacidade máxima de 160kg e programas personalizáveis.',
    specifications: {
      'Capacidade máxima': '160 kg',
      'Comprimento da passada': '—',
      'Conteúdo da tela':
        'Resistência / Velocidade / Tempo / Distância / Calorias / Frequência cardíaca / Frequência de passo / Potência',
      'Dimensões (C × L × A)': '217 × 75 × 163 cm',
      Display: 'LED branco 6 janelas',
      'Fonte de energia': 'Autogerável (self-powered)',
      'Medição cardíaca': 'Sim',
      'Modo de alimentação': '—',
      'Peso líquido': '113 kg',
      Programas: 'personalizados e fixos',
      'Proteção do motor': '—',
      'Resistência eletromagnética': 'EMS com 20 níveis',
    },
    features: [
      'Resistência EMS com 20 níveis',
      'Energia autogerada (self-powered)',
      'Display LED branco 6 janelas',
      'Apoios de mão duplos',
      'Programas personalizáveis e fixos',
      'Teclas de atalho rápidas',
      'Capacidade: até 160 kg',
      'Rodas de transporte + suporte para celular/garrafa',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: true,
  },
  // Banco Bi Inclinável PR014
  {
    id: 'banco-bi-inclinavel-pr014',
    name: 'Banco Bi Inclinável PR014',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR014',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203716/12_tii8jy.png'],
    shortDescription:
      'Ajustes de encosto e assento para treinos horizontais, inclinados e verticais (0° a 90°).',
    description:
      'Banco Bi Inclinável PR014 com estrutura em aço reforçado. Estofado anatômico injetado em PVC Naval, antialérgico, lavável e antifúngico. Rodízios para transporte e rolos frontais para estabilidade.',
    specifications: {
      Dimensões: '1750 × 850 × 1340 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Sapatilhas: 'Borracha vulcanizada',
      'Peso total': '50 kg',
      'Suporta até': '300 kg',
    },
    features: [
      'Ajustes de encosto e assento para treinos horizontais, inclinados e verticais (0° a 90°)',
      'Estrutura em aço reforçado',
      'Estofado anatômico injetado em PVC Naval, antialérgico, lavável e antifúngico',
      'Rodízios para transporte e rolos frontais para estabilidade',
      'Suporta até 300 kg',
      'Pintura eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
    ],
    targets: ['academia', 'condominio', 'residencia'],
    downloads: [],
    inStock: true,
    featured: true,
  },
  // Multi Gym PR012
  {
    id: 'multi-gym-pr012',
    name: 'Multigym - PR012',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR012',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203716/13_kvflks.png'],
    shortDescription: 'Equipamento multifuncional de musculação e condicionamento.',
    description:
      'Multi Gym PR012 permite treinos simultâneos de até 3 usuários. Estrutura reforçada, ocupa pouco espaço. Dupla torre de peso com ajuste independente. Vem com acessórios e suportes (puxadores, barra V, land mine, agachamento livre).',
    specifications: {
      Dimensões: '1975 × 1612 × 2145 mm',
      'Área ocupada': '3,74 m²',
      Estrutura: 'Metalon 80x80 mm, espessura 3 mm',
      Pintura: 'Eletrostática em poliéster, dupla camada com tratamento anticorrosivo',
      'Bateria de peso': 'Placas de 5 kg (110 kg cada lado)',
      Cabos: 'Aço 1/8 padrão aeronáutico, revestidos em nylon injetado',
      Fixadores: 'Parafusos e arruelas com tratamento em zinco preto',
      'Carga limite Smith': '200 kg (100 kg de cada lado)',
      'Suportes para anilhas': '4 suportes, até 100 kg cada',
      Sapatilhas: 'Borracha vulcanizada',
      Manoplas: 'PVC ou Integral Skin',
      'Peso total': '436 kg',
    },
    features: [
      'Equipamento multifuncional de musculação e condicionamento',
      'Permite treinos simultâneos de até 3 usuários',
      'Estrutura reforçada, ocupa pouco espaço',
      'Dupla torre de peso com ajuste independente',
      'Vem com acessórios e suportes (puxadores, barra V, land mine, agachamento livre)',
      'Adesivo ilustrativo dos músculos trabalhados',
      'Estrutura Metalon 80x80 mm, espessura 3 mm',
      'Cabos de aço 1/8 padrão aeronáutico, revestidos em nylon injetado',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // ===== BLUE LINE (PREMIUM) =====

  // Power Rise 650 - Simulador de Escada
  {
    id: 'power-rise-650',
    name: 'Simulador de escada profissional - Power Rise 650',
    category: 'blue-line',
    brand: 'PowerRun',
    model: 'Power Rise 650',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300582/19_vwjhpr.png'],
    shortDescription:
      'Carregador por indução, Bluetooth, sistema de carga eletromagnético e controle de carga via joystick.',
    description:
      'Simulador de escada com sistema de carga eletromagnética de 40 níveis e capacidade para 180kg. Display LED de 8 janelas com controle via joystick, carregador por indução e conectividade Bluetooth. Dimensões: 1357 x 905 x 2230mm com carenagem ABS e auto-diagnóstico.',
    specifications: {
      Aparência: 'Carcaça ABS com iluminação moderna em LED',
      'Auto-diagnóstico': 'Exibe automaticamente o código de falha em caso de problema',
      'Carga Máxima': '180 kg',
      Dimensões: '135 x 90 x 223 cm',
      Display: 'LED branco moderno de 8 janelas com joystick para configuração de carga',
      'Fonte de Alimentação': '110/220 V',
      Funções:
        'Nível de resistência, potência, tempo de exercício, calorias, frequência cardíaca, distância de exercício, carregador de indução e Bluetooth',
      Inclinação: '0–15 graus',
      'Modo de Suspensão': 'Entra no modo de suspensão em 5 minutos quando em espera',
      'Níveis de resistência': 'EMS com 40 níveis',
      Velocidade: '16 a 164 passos/min',
      'Área do degrau': '—',
    },
    features: [
      'Carregador de Celular por indução',
      'Conectividade Bluetooth',
      'Controle de carga via joystick',
      'Carenagem em ABS',
      'Iluminação moderna em LED',
      'Pedais antiderrapantes e manoplas ergonômicas TPR',
      'Modo de suspensão inteligente após 5 minutos de inatividade',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // Power Race 7000 Series - Esteira Premium
  {
    id: 'power-race-7000',
    name: 'Esteira profissional - Power Race 7000 Series',
    category: 'blue-line',
    brand: 'PowerRun',
    model: 'Power Race 7000',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300607/6_ktdeb7.png', // Principal Normal
    ],
    galleryImages: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756369540/Destaques_3_u74d2a.png',
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756369514/44_i5hlzv.png',
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756369500/43_lasoqg.png',
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756369485/42_elieye.png',
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756369409/45_gyodyw.png',
    ],
    shortDescription:
      'Esteira premium com motor 4.5HP, velocidade até 22KM/H, deck dupla face, inclinação automática até 16% e conectividade Bluetooth.',
    description:
      'Esteira Profissional Power Race 7000 Blue Line com motor 4.5HP AC Peak Power e capacidade para 180kg. Área de corrida de 155x55cm, velocidade de 0.8 a 22km/h e inclinação até 16%. Dimensões: 220x85x151cm, peso 170kg. Deck dupla face de 18mm com display LED branco digital.',
    specifications: {
      Dimensões: '2200mm x 850mm x 1510mm (C x L x A)',
      'Peso líquido/bruto': '170kg / 220kg',
      'Capacidade máxima': '180 kg',
      'Potência do motor': '4.5HP AC Peak Power',
      'Faixa de velocidade': '0.8 ~ 22KM/H',
      'Faixa de inclinação': '0 ~ 16%',
      'Área de corrida': '1550mm x 550mm',
      'Deck dupla face': 'Deck dupla face com 18mm de espessura; 2.2mm resistente ao desgaste',
      Corrimão: 'Apoio lateral de espuma de PU, espessura da pele mais de 2mm',
      Display: 'LED branco digital',
      'Conteúdo da tela':
        'Velocidade / Inclinação / Tempo / Distância / Calorias / Frequência cardíaca',
      'Teclas de atalho':
        'Velocidade: 3/6/9/12; Inclinação: 3/6/9/12, Teclas de atalho de velocidade continuamente ajustáveis em 2 km/H',
      'Botão de emergência': 'Cabo de parada de emergência',
      'Suporte p/ celular': 'Suporte e Carregador de Indução',
    },
    features: [
      'Motor 4.5HP AC Peak Power',
      'Velocidade: 0.8 a 22km/h',
      'Inclinação automática até 16%',
      'Área de corrida: 1550 x 550mm',
      'Deck dupla face de 18mm',
      'Corrimãos em PU',
      'Display LED moderno com leitura clara',
      'Conectividade Bluetooth com auto-falante integrado',
      'Carregamento USB',
      'Sistema inteligente de desligamento automático',
      'Auto sleep / Medição de frequência cardíaca ao segurar',
      'Player multimídia USB',
      'Sistema de autodiagnóstico de falhas',
      'Carregador de indução',
      'Início lento',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // Power Race 7000 TS - Esteira Premium com Tela Touch
  {
    id: 'power-race-7000-ts',
    name: 'Esteira profissional - Power Race 7000 TS',
    category: 'blue-line',
    brand: 'PowerRun',
    model: 'Power Race 7000 TS',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300595/21_zs48vf.png'],
    shortDescription:
      'Esteira premium com tela touch HD de 23.8", Wi-Fi integrado, deck dupla face e experiência interativa avançada.',
    description:
      'Esteira Profissional Power Race 7000 TS Blue Line com tela touch HD de 23.8" e capacidade para 180kg. Velocidade de 0.8 a 22km/h, inclinação até 16% e área de corrida 156x55cm. Dimensões: 220x85x151cm, peso 190kg. Wi-Fi integrado, deck dupla face e experiência interativa avançada.',
    specifications: {
      Dimensões: '2200mm x 850mm x 1510mm (C x L x A)',
      'Peso líquido/bruto': '190kg / 240kg',
      'Capacidade máxima': '180 kg',
      'Faixa de velocidade': '0.8 ~ 22KM/H',
      'Faixa de inclinação': '0 ~ 16%',
      'Área de corrida': '1550mm x 550mm',
      'Deck dupla face': 'Deck dupla face com 18mm de espessura; 2.2mm resistente ao desgaste',
      Corrimão: 'Apoio lateral de espuma de PU, espessura da pele mais de 2mm',
      Display: 'TFT touch 23.8" capacitiva',
      'Conteúdo da tela':
        'Velocidade / Inclinação / Tempo / Distância / Calorias / Frequência cardíaca',
      'Teclas de atalho':
        'Velocidade: 3/6/9/12; Inclinação: 3/6/9/12, Teclas de atalho de velocidade continuamente ajustáveis em 2 km/H',
      'Botão de emergência': 'Cabo de parada de emergência',
      'Suporte p/ celular': 'Suporte e Carregador de Indução',
    },
    features: [
      'Tela touch HD de 23_8" com experiência interativa',
      'Interfaces de entretenimento e simulação de cena real',
      'Wi-Fi integrado e carregamento sem fio',
      'Conectividade Bluetooth com auto-falante integrado',
      'Velocidade de 0_8 a 22KM_H',
      'Inclinação de até 16%',
      'Área de corrida ampla: 1550mm x 550mm',
      'Deck dupla face com 18mm e lona resistente ao desgaste (2_2mm)',
      'Corrimãos em espuma PU com acabamento premium',
      'Player multimídia via USB',
      'Leitura de frequência cardíaca manual e opcional sem fio',
      'Desligamento automático e sistema de autodiagnóstico',
      'Interface multilíngue e nove modos interativos',
      'Carregador de indução',
      'Início lento',
    ],
    targets: ['academia'],
    downloads: [
      {
        name: 'Manual da Esteira TS',
        type: 'manual',
        url: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756310588/Manual_Esteira_-_PK60TE_sg9afk.pdf',
        size: 'PDF',
      },
    ],
    inStock: true,
    featured: true,
  },

  // Power Round 550 - Elíptico Profissional
  {
    id: 'power-round-550',
    name: 'Elíptico profissional - Power Round 550',
    category: 'blue-line',
    brand: 'PowerRun',
    model: 'Power Round 550',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300568/3_symhkl.png', // Principal
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370302/14_tcwyh3.png', // Detalhes
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370142/13_b58i0d.png', // Detalhes
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370111/15_o3pccq.png', // Detalhes
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756369969/12_gnbqet.png', // Detalhes
    ],
    shortDescription:
      'Elíptico profissional com energia autogerada, 40 níveis de resistência eletromagnética EMS e passada longa de 590mm.',
    description:
      'ELÍPTICO PROFISSIONAL POWER ROUND 550 Blue Line com sistema de energia autogerável e resistência eletromagnética EMS de 40 níveis. Display LED branco de 8 janelas com dados completos incluindo MET. Capacidade máxima de 180kg e proteção automática do motor.',
    specifications: {
      'Capacidade máxima': '180 kg',
      'Comprimento da passada': '590mm',
      'Conteúdo da tela':
        'Resistência / Velocidade / Tempo / Distância / Calorias / Frequência cardíaca / Frequência de passo / Potência / MET',
      'Dimensões (C × L × A)': '221 x 73 x 166 cm',
      Display: 'LED branco 8 janelas',
      'Fonte de energia': 'Autogerável (self-powered)',
      'Medição cardíaca': 'Sim',
      'Modo de alimentação': 'Gerador, fonte de alimentação externa',
      'Peso líquido': '146 kg',
      Programas: 'personalizados e fixos',
      'Proteção do motor':
        'Quando o sistema detecta automaticamente que não há carga, após 180s entrará no modo de espera para proteger o motor reluctante',
      'Resistência eletromagnética': 'EMS com 40 níveis',
    },
    features: [
      'Sistema de alimentação por eletricidade espontânea (sem tomada)',
      'Resistência eletromagnética ajustável em 40 níveis',
      'Movimentos suaves e silenciosos',
      'Passada longa de 590mm garante biomecânica natural',
      'Display LED branco 8 janelas com dados em tempo real',
      'Sensor de frequência cardíaca',
      'Sistema inteligente de proteção do motor',
      'LED ambiente em arco',
      'Desligamento automático sem operador',
      'Sistema de autodiagnóstico de falhas',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // Power Rush 350 - Bicicleta Vertical Premium
  {
    id: 'power-rush-350',
    name: 'Bicicleta profissional - Power Rush 350 Vertical',
    category: 'blue-line',
    brand: 'PowerRun',
    model: 'Power Rush 350',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300554/8_esgynp.png'],
    shortDescription:
      'Bicicleta vertical premium com energia autogerada, 40 níveis de resistência EMS, disco de inércia 15kg e design ergonômico.',
    description:
      'BICICLETA VERTICAL POWER RUSH 350 Blue Line com energia autogerada e sistema eletromagnético de 40 níveis. Display LED branco de 7 janelas com dados completos de treino. Disco de inércia de 15kg, ajuste de assento em 11 posições e proteção automática do motor.',
    specifications: {
      'Ajuste do assento Vertical': 'Ajuste do assento com onze posições',
      'Ajuste do assento Horizontal': '—',
      Alça: '—',
      'Capacidade de Utilização': '180 kg',
      Carenagem: '—',
      'Conteúdo da tela':
        'Resistência / Velocidade / Tempo / Distância / Calorias / Frequência cardíaca /Frequência de passo / Potência / MET',
      Cor: '—',
      'Dimensões (C x L x A)': '120 x 58 x 155 cm',
      'Disco de Inércia': '15kg',
      Display: 'LED branco 7 janelas',
      'Fonte de energia': 'Autogerável (self-powered)',
      Freio: '—',
      'Função opcional': '—',
      Garantia: '—',
      Guidão: 'Suporte ergonômico para cotovelos',
      Lubrificação: 'Manual',
      'Modo de ajuste da resistência': '—',
      'Modo de alimentação': 'Eletricidade espontânea',
      'Sistema de Transmissão': 'Correia silenciosa resistente ao desgaste',
      'Movimento Central': '—',
      'Níveis de resistência': '1-40 EMS',
      Peso: '72 kg',
      'Proteção do motor':
        'Quando o sistema detecta automaticamente que não há carga, após 180s entrará no modo de espera para proteger o motor reluctante',
      'Sistema de resistência': 'Nível 1-40, Sistema de controle de carga eletromagnética',
      'Tipo de carga': 'Eletromagnético',
    },
    features: [
      'Energia autogerada (self-powered)',
      'Sistema EMS com 40 níveis',
      'Disco de Inércia de 15 kg para fluidez no movimento',
      'Ajuste de assento em 11 posições',
      'Alça com apoio ergonômico para cotovelos',
      'Display LED branco 7 janelas',
      'Proteção automática por gerador com modo de espera após 180s',
      'Sistema de autodiagnóstico de falhas',
      'Sensores de batimentos embutidos',
      'Carregamento USB',
      'Medição de frequência cardíaca ao segurar',
      'Design profissional para ambientes exigentes',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // Power Rush 450 - Bicicleta Horizontal Premium
  {
    id: 'power-rush-450',
    name: 'Bicicleta profissional - Power Rush 450 Horizontal',
    category: 'blue-line',
    brand: 'PowerRun',
    model: 'Power Rush 450',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300526/4_jiptgj.png'],
    shortDescription:
      'Bicicleta horizontal premium com energia autogerada, 40 níveis de resistência EMS, disco de inércia 15kg e encosto ergonômico ventilado.',
    description:
      'BICICLETA HORIZONTAL POWER RUSH 450 Blue Line com energia autogerada e sistema eletromagnético de 40 níveis. Encosto ergonômico com ventilação natural, disco de inércia de 15kg e ajuste de assento em 18 posições. Carenagem premium e proteção automática do motor.',
    specifications: {
      'Ajuste do assento Vertical': 'Dezoito posições de ajuste de altura do assento',
      'Ajuste do assento Horizontal':
        'Trava do dial da alça, basta girar 90° para realizar a trava rápida, conveniente, sem limitação de espaço',
      Alça: 'Guidão ergonômico multiposição revestida em mangueira elastomérica, com ajuste de altura em 11 posições',
      'Capacidade de Utilização': '180 kg',
      Carenagem: 'Carenagem Premium e aparência mais impactante',
      'Conteúdo da tela': '—',
      Cor: '—',
      'Dimensões (C x L x A)': '172 x 75 x 143 cm',
      'Disco de Inércia': '15kg',
      Display: '—',
      'Fonte de energia': 'Autogerável (self-powered)',
      Freio: '—',
      'Função opcional':
        'Relógio eletrônico, pode exibir o conteúdo: Calorias / Tempo / Velocidade / RPM',
      Garantia: '—',
      Guidão: '—',
      Lubrificação: 'Manual',
      'Modo de ajuste da resistência': 'Velocidade variável contínua',
      'Modo de alimentação': '—',
      'Sistema de Transmissão': 'Correia silenciosa resistente ao desgaste',
      'Movimento Central': '—',
      'Níveis de resistência': '1-40 EMS',
      Peso: '72kg',
      'Proteção do motor':
        'Quando o sistema detecta automaticamente que não há carga, após 180s entrará no modo de espera para proteger o motor reluctante',
      'Sistema de resistência': 'Resistência de controle magnético',
      'Tipo de carga': 'Eletromagnético',
    },
    features: [
      'Energia autogerada (self-powered)',
      'Sistema EMS com 40 níveis',
      'Disco de Inércia de 15 kg',
      'Encosto ergonômico com ventilação natural',
      'Painel LED Branco 7 janelas',
      'Sistema inteligente de proteção do motor',
      'Medição de frequência cardíaca ao segurar',
      'Carregamento USB',
      'Sistema de autodiagnóstico de falhas',
      'Design profissional para ambientes exigentes',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // Power Rush 250 - Bicicleta Spinning Premium
  {
    id: 'power-rush-250',
    name: 'Bicicleta profissional - Power Rush 250 Spinning',
    category: 'blue-line',
    brand: 'PowerRun',
    model: 'Power Rush 250',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300541/9_y7thrn.png', // Principal
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370399/49_w8s0rq.png', // Detalhes
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370378/52_twpzrp.png', // Detalhes
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370333/51_ejmrfa.png', // Detalhes
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370318/50_g0dh4h.png', // Detalhes
    ],
    shortDescription:
      'Bicicleta spinning premium com disco de inércia 17kg, resistência magnética variável contínua e design profissional.',
    description:
      'BICICLETA DE SPINNING POWER RUSH 250 Blue Line com disco de inércia de 17kg e sistema de resistência magnética de velocidade variável contínua. Correia silenciosa resistente ao desgaste, carenagem premium e estrutura compacta elegante.',
    specifications: {
      'Ajuste do assento Vertical': 'Nove posições de ajuste de altura do assento',
      'Ajuste do assento Horizontal':
        'Trava do dial da alça, basta girar 90° para realizar a trava rápida, conveniente, sem limitação de espaço',
      Alça: '—',
      'Capacidade de Utilização': '180 kg',
      Carenagem: 'Carenagem Premium e aparência mais impactante',
      'Conteúdo da tela': '—',
      Cor: '—',
      'Dimensões (C x L x A)': '120 x 58 x 155 cm',
      'Disco de Inércia': '17kg',
      Display: '—',
      'Fonte de energia': '—',
      Freio: '—',
      'Função opcional': '—',
      Garantia: '—',
      Guidão: 'Alça ergonômica multiposição com ajuste de altura em 11 posições',
      Lubrificação: 'Manual',
      'Modo de ajuste da resistência': 'Velocidade variável contínua',
      'Modo de alimentação': '—',
      'Sistema de Transmissão': 'Correia silenciosa resistente ao desgaste',
      'Movimento Central': '—',
      'Níveis de resistência': 'Resistência de controle magnético',
      Peso: '68kg',
      'Proteção do motor': '—',
      'Sistema de resistência': 'Resistência de controle magnético',
      'Tipo de carga': 'Eletromagnético',
    },
    features: [
      'Disco de inércia de 17kg',
      'Sistema de resistência magnética de velocidade variável contínua',
      'Correia silenciosa e resistente ao desgaste',
      'Carcaça totalmente fechada para proteção e visual elevado',
      'Ajuste de assento prático com trava rápida de 90°',
      'Regulagem de altura do assento em 9 posições',
      'Guidão multi-posição em 11 níveis',
      'Alça multi-posição com apoio para cotovelos',
      'Estrutura compacta e elegante',
      'Design profissional para ambientes exigentes',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // ===== MUSCULAÇÃO =====

  // PR001 - Peitoral/Dorsal
  {
    id: 'pr001-peitoral-dorsal',
    name: 'Peitoral / dorsal - PR001',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR001',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303289/2_cxwwae.png'],
    shortDescription:
      'Equipamento profissional para exercícios de peitoral e dorsal. Estrutura reforçada em aço com estofado anatômico.',
    description:
      'Equipamento PR001 especializado em peitoral e dorsal com carga máxima de 100kg. Estrutura compacta de aço carbono (1560 x 1300 x 2020mm), peso 236kg. Movimento específico para desenvolvimento de peitorais e dorsais.',
    specifications: {
      Dimensões: '1560 × 1300 × 2020 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg',
      'Capacidade de uso': '125 kg',
      'Peso total': '236 kg',
    },
    features: [
      'Estrutura reforçada em aço carbono',
      'Pintura eletrostática com dupla camada',
      'Tratamento anticorrosivo por banhos de fosfatização',
      'Estofado anatômico injetado em PV Crom Naval',
      'Material antialérgico, lavável e antifúngico',
      'Costuras duplas nas laterais para maior durabilidade',
      'Sapatas em borracha vulcanizada',
      'Suporta carga de até 100 kg',
      'Capacidade de uso até 125 kg',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },

  // PR002 - Polia Superior com Remada
  {
    id: 'pr002-polia-superior-remada',
    name: 'Polia superior com remada - PR002',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR002',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303291/4_szupeb.png'],
    shortDescription:
      'Equipamento versátil combinando polia superior e remada. Estrutura robusta para exercícios completos de tração.',
    description:
      'Equipamento PR002 2 em 1: polia superior + remada baixa em estação única. Carga máxima de 100kg, estrutura alta (2034 x 1208 x 2239mm), peso 224kg. Exercícios completos de tração em equipamento combinado.',
    specifications: {
      Dimensões: '2034 x 1208 x 2239 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg',
      'Peso total': '220 kg',
    },
    features: [
      'Combinação de polia superior e remada',
      'Estrutura robusta em aço carbono',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico e antifúngico',
      'Sapatas em borracha vulcanizada',
      'Exercícios completos para dorsal e deltoides',
      'Movimentos seguros e controlados',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },

  // PR003 - Multi Press
  {
    id: 'pr003-multi-press',
    name: 'Multi press - PR003',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR003',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303293/5_ecrnya.png'],
    shortDescription:
      'Equipamento multifuncional para exercícios de press com carga máxima de 100kg. Estrutura em aço reforçado.',
    description:
      'Equipamento PR003 multifuncional para diversos tipos de press (peito, ombro, tríceps). Carga máxima de 100kg, estrutura robusta (1948 x 1496 x 1575mm), peso 260kg. Múltiplas angulações de exercícios de empurrar.',
    specifications: {
      Dimensões: '1948 x 1496 x 1575 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg',
      'Peso total': '260 kg',
    },
    features: [
      'Equipamento multifuncional para exercícios de press',
      'Estrutura ergonômica',
      'Estrutura reforçada em aço carbono',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico, lavável e antifúngico',
      'Sapatas em borracha vulcanizada',
      'Múltiplas opções de exercícios',
      'Segurança e performance garantidas',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },

  // PR004 - Bíceps/Tríceps
  {
    id: 'pr004-biceps-triceps',
    name: 'Bíceps / tríceps - PR004',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR004',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303290/3_ireskr.png'],
    shortDescription:
      'Equipamento para exercícios de bíceps e tríceps com carga máxima de 100kg. Estrutura em aço com estofado anatômico.',
    description:
      'Equipamento PR004 especializado exclusivamente em braços: bíceps e tríceps. Carga máxima de 100kg, estrutura compacta (1359 x 1103 x 1536mm), peso 235kg. Movimento isolado para desenvolvimento específico dos músculos do braço.',
    specifications: {
      Dimensões: '1359×1103×1536 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg',
      'Peso total': '235 kg',
    },
    features: [
      'Especializado para exercícios de bíceps e tríceps',
      'Movimentos biomecânicos precisos',
      'Isolamento muscular eficiente',
      'Estrutura reforçada em aço carbono',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico e antifúngico',
      'Sapatas em borracha vulcanizada',
      'Desenvolvimento equilibrado e seguro',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },

  // PR005 - Leg Press Sentado com Hack
  {
    id: 'pr005-leg-press-hack',
    name: 'Leg press sentado com hack - PR005',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR005',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303296/7_yrqq6f.png'],
    shortDescription:
      'Equipamento robusto para exercícios de leg press e hack squat. Design versátil para desenvolvimento completo das pernas.',
    description:
      'Equipamento PR005 2 em 1: leg press sentado + hack squat. Carga máxima 100kg, peso robusto 349kg (mais estável). Estrutura maior (1982 x 1038 x 1786mm) para treinos pesados de pernas.',
    specifications: {
      Dimensões: '1982 x 1038 x 1786 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg',
      'Peso total': '349 kg',
    },
    features: [
      'Combinação de leg press e hack squat',
      'Design versátil para desenvolvimento completo das pernas',
      'Posicionamento ergonômico para ambos exercícios',
      'Estrutura extremamente robusta',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico, lavável e antifúngico',
      'Sapatas em borracha vulcanizada',
      'Carga máxima: 100kg',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // PR006 - Cadeira Adutora/Abdutora
  {
    id: 'pr006-cadeira-adutora-abdutora',
    name: 'Cadeira adutora / abdutora - PR006',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR006',
    images: [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756315626/Imagens_Site_Muscula%C3%A7%C3%A3o_1_ateso1.png',
    ],
    shortDescription:
      'Equipamento específico para exercícios de adução e abdução das pernas. Movimento preciso e confortável.',
    description:
      'Equipamento PR006 exclusivo para adutores e abdutores das pernas. Movimento preciso e isolado para músculos internos/externos da coxa. Carga máxima 100kg, peso 223kg, estrutura dedicada (1668 x 1045 x 1575mm).',
    specifications: {
      Dimensões: '1668 x 1045 x 1575 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg',
      'Peso total': '223 kg',
    },
    features: [
      'Específico para exercícios de adução e abdução',
      'Movimento preciso e controlado',
      'Isolamento eficiente dos músculos das coxas',
      'Ajustes ergonômicos para diferentes biotipos',
      'Estrutura robusta em aço carbono',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico e antifúngico',
      'Fortalecimento para estabilidade e performance',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },

  // PR008 - Leg Press Hack Squat
  {
    id: 'pr008-leg-press-hack-squat',
    name: 'Leg press hack squat - PR008',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR008',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303300/9_ohjbdi.png'],
    shortDescription:
      'Equipamento profissional para leg press e hack squat. Design otimizado para treinos intensos de membros inferiores.',
    description:
      'Equipamento PR008 Hack Squat com ângulo fixo otimizado e estrutura mais longa (2250mm). Peso 150kg (mais leve que PR005), design específico para hack squat. Plataforma de apoio ampliada.',
    specifications: {
      Dimensões: '2250 x 1150 x 1505 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      'Peso total': '150 kg',
    },
    features: [
      'Combinação de leg press e hack squat',
      'Design otimizado para treinos intensos',
      'Biomecânica aprimorada para máxima eficiência',
      'Estrutura robusta e estável',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico, lavável e antifúngico',
      'Treinos completos para membros inferiores',
      'Segurança e eficiência garantidas',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: false,
  },

  // PR009 - Cross Over Angular
  {
    id: 'pr009-cross-over-angular',
    name: 'Cross over - PR009',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR009',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303301/10_qhewkb.png'],
    shortDescription:
      'Torre de cross over com design angular avançado. Múltiplas opções de exercícios com polias duplas.',
    description:
      'Torre de cross over com design angular e sistema de polias duplas. Permite exercícios para todos os grupos musculares com carga máxima de 100kg por lado. Estrutura robusta em aço com pintura eletrostática anticorrosiva.',
    specifications: {
      Dimensões: '2173 x 861 x 2342 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg × 2',
      'Peso total': '396 kg',
    },
    features: [
      'Design angular otimizado',
      'Sistema de polias duplas',
      'Múltiplas opções de exercícios',
      'Ideal para treinos funcionais',
      'Desenvolvimento muscular completo',
      'Estrutura extremamente robusta',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Dupla carga máxima de 100 kg cada lado',
      'Sapatas em borracha vulcanizada',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // PR010 - Multi Station
  {
    id: 'pr010-multi-station',
    name: 'Multi estação 4 funções - PR010',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR010',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303288/11_hccbgz.png'],
    shortDescription:
      'Estação multifuncional completa para academias. Múltiplos exercícios em um único equipamento compacto.',
    description:
      'Estação de musculação multifuncional com tripla carga de 100kg cada estação. Dimensões: 3426 x 3010 x 2249mm, peso total 700kg. Estrutura em aço com pintura eletrostática anticorrosiva e estofado PV Crom Naval.',
    specifications: {
      Dimensões: '3426 x 3010 x 2249 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg × 3',
      'Peso total': '700 kg',
    },
    features: [
      'Estação multifuncional completa',
      'Múltiplos exercícios em um único equipamento',
      'Solução ideal para otimização de espaço',
      'Treinos para todos os grupos musculares',
      'Estrutura extremamente robusta e estável',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico, lavável e antifúngico',
      'Tripla carga máxima de 100 kg cada estação',
      'Sapatas em borracha vulcanizada',
    ],
    targets: ['academia'],
    downloads: [],
    inStock: true,
    featured: true,
  },

  // PR013 - Banco Uni-Inclinável
  {
    id: 'pr013-banco-uni-inclinavel',
    name: 'Banco multirregulável - PR013',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR013',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1756303294/6_qjcczx.png'],
    shortDescription:
      'Banco com regulagem unidirecional para exercícios com peso livre. Design compacto e resistente.',
    description:
      'Banco PR013 com regulagem unidirecional simplificada (só encosto). Versão mais básica que o PR014 (bi-inclinável). Peso 50kg, dimensões 1750 x 850 x 134mm. Ideal para treinos básicos com peso livre.',
    specifications: {
      Dimensões: '1750 x 850 x 134 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Peso total': '50 kg',
    },
    features: [
      'Regulagem unidirecional precisa',
      'Design compacto e resistente',
      'Ideal para exercícios com peso livre',
      'Suporte estável e ajustável',
      'Estrutura robusta em aço carbono',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico, lavável e antifúngico',
      'Sapatas em borracha vulcanizada',
      'Versatilidade para múltiplos exercícios',
    ],
    targets: ['academia', 'condominio', 'residencia'],
    downloads: [],
    inStock: true,
    featured: false,
  },

  // PR015 - Cadeira Extensora/Flexora
  {
    id: 'pr015-cadeira-extensora-flexora',
    name: 'Cadeira extensora / flexora - PR015',
    category: 'musculacao',
    brand: 'PowerRun',
    model: 'PR015',
    images: ['https://res.cloudinary.com/dq0bovaz5/image/upload/v1772749621/8_zfqcgq.png'],
    shortDescription:
      'Equipamento 2 em 1 para exercícios de extensão e flexão das pernas. Biomecânica precisa para quadríceps e isquiotibiais.',
    description:
      'Equipamento 2 em 1 para exercícios de extensão e flexão das pernas com carga máxima de 100kg. Dimensões: 1383 x 1174 x 1575mm, peso total 262kg. Estrutura em aço com pintura eletrostática anticorrosiva e estofado PV Crom Naval antialérgico.',
    specifications: {
      Dimensões: '1383x1174x1575 mm',
      Pintura: 'Eletrostática em poliéster com dupla camada e tratamento anticorrosivo',
      Estofado:
        'Injetado, anatômico revestido com PV Crom Naval, antialérgico, lavável, antifúngico',
      Sapatas: 'Borracha vulcanizada para ótima aderência ao solo',
      'Carga máxima': '100 kg',
      'Peso total': '262 kg',
    },
    features: [
      'Equipamento 2 em 1 para extensão e flexão',
      'Biomecânica precisa para quadríceps e isquiotibiais',
      'Exercícios isolados para desenvolvimento equilibrado',
      'Ajustes ergonômicos para diferentes biotipos',
      'Estrutura robusta em aço carbono',
      'Pintura eletrostática com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval',
      'Material antialérgico, lavável e antifúngico',
      'Sapatas em borracha vulcanizada',
      'Desenvolvimento seguro das pernas',
    ],
    targets: ['academia', 'condominio'],
    downloads: [],
    inStock: true,
    featured: false,
  },
];

export const EQUIPMENT_BRANDS = [
  'PowerRun',
  'TechnoGym',
  'Life Fitness',
  'Precor',
  'Matrix',
  'Cybex',
];
