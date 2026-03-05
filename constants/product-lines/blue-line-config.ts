// ========================================
// 🔵 BLUE LINE (PREMIUM) - CONFIGURAÇÕES CENTRALIZADAS
// ========================================
// Baseado em Produdos.md - NÃO INVENTAR DADOS!

export const BLUE_LINE_PRODUCTS = {
  // === SIMULADOR DE ESCADA ===
  'power-rise-650': {
    name: 'Simulador de escada profissional - PR650',
    commercialDescription:
      'Níveis: 40 eletromagnéticos | Auto-diagnóstico: Sim | Capacidade: 180kg',
    commercialDescriptionEN: 'Levels: 40 electromagnetic | Auto-diagnosis: Yes | Capacity: 180kg',
    commercialDescriptionES:
      'Niveles: 40 electromagnéticos | Auto-diagnóstico: Sí | Capacidad: 180kg',
    commercialDescriptionZH: '级别：40个电磁 | 自动诊断：是 | 承重：180公斤',
    category: 'escada',
    features: [
      'Display LED branco de 8 janelas',
      'Sistema de carga eletromagnética com 40 níveis',
      'Carregador de indução',
      'Carga máxima 180kg',
      'Sistema livre de manutenção',
      'Auto-diagnóstico com código de falha',
    ],
    specifications: {
      'Relógio Eletrônico': 'Display LED branco de 8 janelas, configuração via teclas',
      'Função Padrão':
        'Nível de resistência, potência, tempo de exercício, calorias, frequência cardíaca, distância de exercício e carregador de Indução',
      'Sistema de Resistência': 'Sistema de ajuste de carga eletromagnética 1-40',
      'Ajuste de Resistência': '1-40 (ajustável durante o movimento)',
      'Carga Máxima': '180kg',
      'Coluna de Suporte': 'PT40802, tolerância ±1',
      'Tamanho do Produto': '1357mm 905mm 2230mm (C x L x A)',
      'Fonte de Alimentação': 'Bivolt',
      Aparência: 'Carcaça ABS com iluminação esportiva de ambiente',
      'Sistema Livre de Manutenção':
        'Sistema de auto-diagnóstico, exibe automaticamente o código de falha em caso de problema',
      'Modo de Suspensão': 'Entra no modo de suspensão em 5 minutos quando em espera',
    },
  },

  // === ESTEIRAS PREMIUM ===
  'power-race-7000': {
    name: 'Esteira ergométrica profissional - PR7000 LED',
    commercialDescription: 'Motor: 4.5HP Silencioso | Área: 155x55cm | Inclinação: 0-16%',
    commercialDescriptionEN: 'Motor: 4.5HP Silent | Area: 155x55cm | Incline: 0-16%',
    commercialDescriptionES: 'Motor: 4.5HP Silencioso | Área: 155x55cm | Inclinación: 0-16%',
    commercialDescriptionZH: '电机：4.5HP静音 | 区域：155x55厘米 | 倾斜：0-16%',
    category: 'esteira',
    features: [
      'Motor 4.5HP AC Peak Power',
      'Velocidade: 0.8 a 22 km/h',
      'Inclinação automática até 16%',
      'Área de corrida: 1550 x 550mm',
      'Deck dupla face de 18mm',
      'Corrimãos em PU',
      'Display LED moderno com leitura clara',
      'Conectividade Bluetooth com alto-falante integrado',
      'Carregamento USB',
      'Sistema inteligente de desligamento automático',
      'Auto sleep / Medição de frequência cardíaca ao segurar',
      'Player multimídia USB',
      'Sistema de autodiagnóstico de falhas',
      'Carregador de indução',
      'Início lento',
    ],
    specifications: {
      'Tamanho do produto': '2200mm x 850mm x 1510mm (C x L x A)',
      'Peso líquido/bruto': '170kg / 220kg',
      'Capacidade máxima': '180kg',
      'Potência do motor': '4.5HP AC Peak Power',
      'Faixa de velocidade': '0.8 ~ 22KM/H',
      'Faixa de inclinação': '0 ~ 16%',
      'Área de corrida': '1550mm x 550mm',
      'Plataforma/lona de corrida':
        'Deck dupla face com 18mm de espessura; 2.2mm resistente ao desgaste',
      'Diâmetro do rolo': 'Φ75mm',
      Corrimão: 'Apoio lateral de espuma de PU, espessura da pele mais de 2mm',
      'Função padrão':
        'Auto sleep / Reprodução de música via Bluetooth / Medição de frequência cardíaca ao segurar / Carregamento USB / Player multimídia USB / Desligamento automático sem operador / Sistema de autodiagnóstico de falhas / Carregador de Indução',
      Tela: 'LED branco digital',
      'Conteúdo da tela':
        'Velocidade / Inclinação / Tempo / Distância / Calorias / Frequência cardíaca',
      'Teclas de atalho':
        'Velocidade: 3/6/9/12; Inclinação: 3/6/9/12, Teclas de atalho de velocidade continuamente ajustáveis em 2 km/H',
      'Botão de emergência': 'Cabo de parada de emergência',
      'Suporte p/ celular': 'Suporte e Carregador de Indução',
    },
  },

  'power-race-7000-ts': {
    name: 'Esteira ergométrica profissional - PR7000 TS',
    commercialDescription: 'Tela: 23.8" Touch HD | Motor: 4.5HP | Wi-Fi: Integrado',
    commercialDescriptionEN: 'Screen: 23.8" Touch HD | Motor: 4.5HP | Wi-Fi: Integrated',
    commercialDescriptionES: 'Pantalla: 23.8" Touch HD | Motor: 4.5HP | Wi-Fi: Integrado',
    commercialDescriptionZH: '屏幕：23.8英寸触摸HD | 电机：4.5HP | Wi-Fi：集成',
    category: 'esteira',
    features: [
      'Tela touch HD de 23.8" com experiência interativa',
      'Interfaces de entretenimento e simulação de cena real',
      'Wi-Fi integrado e carregamento sem fio',
      'Conectividade Bluetooth com alto-falante integrado',
      'Velocidade de 0.8 a 22 km/h',
      'Inclinação de até 16%',
      'Área de corrida ampla: 1550mm x 550mm',
      'Deck dupla face com 18mm e lona resistente ao desgaste (2.2mm)',
      'Corrimãos em espuma PU com acabamento premium',
      'Player multimídia via USB',
      'Leitura de frequência cardíaca manual é opcional sem fio',
      'Desligamento automático e sistema de autodiagnóstico',
      'Interface multilíngue e nove modos interativos',
      'Carregador de indução',
      'Início lento',
    ],
    specifications: {
      'Tamanho do produto': '2200mm x 850mm x 1510mm (C x L x A)',
      'Peso líquido/bruto': '190kg / 240kg',
      'Capacidade máxima': '180kg',
      'Potência do motor': '4.5HP AC Peak Power',
      'Faixa de velocidade': '0.8 ~ 22KM/H',
      'Faixa de inclinação': '0 ~ 16%',
      'Área de corrida': '1550mm x 550mm',
      'Plataforma/lona de corrida':
        'Deck dupla face com 18mm de espessura; 2.2mm resistente ao desgaste',
      'Diâmetro do rolo': 'Φ75mm',
      Corrimão: 'Apoio lateral de espuma de PU, espessura da pele mais de 2mm',
      'Função padrão':
        'Auto sleep / Reprodução de música via Bluetooth / Medição de frequência cardíaca ao segurar / Carregamento USB / Player multimídia USB / Desligamento automático sem operador / Sistema de autodiagnóstico de falhas / Carregador de Indução',
      'Funções opcionais': 'Cabo de parada de emergência / Frequência cardíaca sem fio',
      Tela: 'TFT touch 23.8" capacitiva',
      'Conteúdo da tela':
        'Velocidade / Inclinação / Tempo / Distância / Calorias / Frequência cardíaca',
      'Teclas de atalho':
        'Velocidade: 3/6/9/12; Inclinação: 3/6/9/12, Teclas de atalho de velocidade continuamente ajustáveis em 2 km/H',
      'Botão de emergência': 'Cabo de parada de emergência',
      'Suporte p/ celular': 'Suporte e Carregador de Indução',
    },
  },

  // === ELÍPTICO PREMIUM ===
  'power-round-550': {
    name: 'Elíptico profissional - PR550',
    commercialDescription: 'Níveis: 40 eletromagnéticos | Passada: 59cm | Disco: 15kg',
    commercialDescriptionEN: 'Levels: 40 electromagnetic | Stride: 59cm | Flywheel: 15kg',
    commercialDescriptionES: 'Niveles: 40 electromagnéticos | Zancada: 59cm | Disco: 15kg',
    commercialDescriptionZH: '级别：40个电磁 | 步幅：59厘米 | 飞轮：15公斤',
    category: 'eliptico',
    features: [
      'Sistema de alimentação por eletricidade espontânea',
      'Carga eletromagnética ajustável em 40 níveis',
      'Disco de Inércia 15 kg',
      'Passada longa de 590mm',
      'Display LED com 8 janelas',
      'Sistema inteligente de proteção',
    ],
    specifications: {
      'Tamanho do produto': '2210mm x 730mm x 1660mm (C x L x A)',
      'Peso líquido/bruto': '146kg / 200kg',
      'Capacidade máxima': '180kg',
      'Sistema de resistência': '1-40 graus, sistema de controle de carga eletromagnética',
      'Disco de Inércia': '15kg',
      'Comprimento da passada': '590mm',
      'Modo de alimentação': 'Gerador, fonte de alimentação externa',
      'Proteção do motor reluctante':
        'Quando o sistema detecta automaticamente que não há carga, após 180s entrará no modo de espera para proteger o motor reluctante',
      'Função padrão':
        'Medição de frequência cardíaca ao segurar / Carregamento USB / Correia de luz de recurso / Desligamento automático sem operador / Sistema de autodiagnóstico de falhas',
      Tela: 'Display digital LED branco com 8 janelas',
      'Conteúdo da tela':
        'Resistência / Velocidade / Tempo / Distância / Calorias / Frequência cardíaca / Frequência de passo / Potência / MET',
    },
  },

  // === BICICLETAS AVANÇADAS ===
  'power-rush-350': {
    name: 'Bicicleta vertical profissional - PR350',
    commercialDescription: 'Níveis: 40 eletromagnéticos | Disco: 15kg | Ajustes: 11 posições',
    commercialDescriptionEN:
      'Levels: 40 electromagnetic | Flywheel: 15kg | Adjustments: 11 positions',
    commercialDescriptionES: 'Niveles: 40 electromagnéticos | Disco: 15kg | Ajustes: 11 posiciones',
    commercialDescriptionZH: '级别：40个电磁 | 飞轮：15公斤 | 调节：11个位置',
    category: 'bike',
    features: [
      'Tecnologia eletromagnética silenciosa',
      'Sistema de carga de 40 níveis',
      'Disco de Inércia de 15 kg',
      'Ajuste de assento em 11 posições',
      'Alimentação por eletricidade espontânea',
      'Alça com apoio ergonômico para cotovelos',
    ],
    specifications: {
      'Tamanho do produto': '1200mm x 580mm x 1550mm (C x L x A)',
      'Peso líquido': '72 kg',
      'Capacidade máxima': '180kg',
      'Sistema de resistência': 'Nível 1-40, Sistema de controle de carga eletromagnética',
      'Disco de Inércia': '15kg',
      'Ajuste do assento': 'Ajuste do assento com onze posições',
      'Modo de alimentação': 'Eletricidade espontânea',
      'Proteção do motor reluctante':
        'Quando o sistema detecta automaticamente que não há carga, após 180s entrará no modo de espera para proteger o motor reluctante',
      'Função padrão':
        'Medição de frequência cardíaca ao segurar / Carregamento USB / Correia de luz de recurso / Sistema de autodiagnóstico de falhas',
      Tela: 'Display digital LED branco com 7 janelas',
      'Conteúdo da tela':
        'Resistência / Velocidade / Tempo / Distância / Calorias / Frequência cardíaca /Frequência de passo / Potência / MET',
      Guidão: 'Suporte ergonômico para cotovelos',
    },
  },

  'power-rush-450': {
    name: 'Bicicleta horizontal profissional - PR450',
    commercialDescription: 'Níveis: 40 eletromagnéticos | Ajustes: 18 posições | Bluetooth: Sim',
    commercialDescriptionEN:
      'Levels: 40 electromagnetic | Adjustments: 18 positions | Bluetooth: Yes',
    commercialDescriptionES:
      'Niveles: 40 electromagnéticos | Ajustes: 18 posiciones | Bluetooth: Sí',
    commercialDescriptionZH: '级别：40个电磁 | 调节：18个位置 | 蓝牙：是',
    category: 'bike',
    features: [
      'Sistema eletromagnético de 40 níveis',
      'Disco de Inércia de 15kg',
      '18 ajustes de assento',
      'Encosto ergonômico com ventilação natural',
      'Painel LED com 7 janelas',
      'Reprodução de música via Bluetooth',
    ],
    specifications: {
      'Tamanho do produto': '1720mm x 750mm x 1430mm (C x L x A)',
      'Peso líquido/Bruto': '72kg / 92kg',
      'Capacidade máxima': '180kg',
      'Sistema de resistência': 'Resistência de controle magnético',
      'Modo de ajuste da resistência': 'Velocidade variável contínua',
      'Disco de Inércia': '15kg',
      Carenagem:
        'Carenagem toda inclusiva torna o movimento mais seguro e a aparência mais impactante',
      'Modo de condução': 'Correia silenciosa resistente ao desgaste',
      'Ajuste do assento (frente e trás)':
        'Trava do dial da alça, basta girar 90° para realizar a trava rápida, conveniente, sem limitação de espaço',
      'Ajuste do assento (alto e baixo)': 'Dezoito posições de ajuste de altura do assento',
      'Função opcional':
        'Relógio eletrônico, pode exibir o conteúdo: Calorias / Tempo / Velocidade / RPM',
      Alça: 'Guidão ergonômico multiposição revestida em mangueira elastomérica, com ajuste de altura em 11 posições',
    },
  },

  'power-rush-250': {
    name: 'Bicicleta spinning profissional - PR250',
    commercialDescription: 'Resistência: Magnética variável | Disco: 17kg | Carcaça: Fechada',
    commercialDescriptionEN: 'Resistance: Variable magnetic | Flywheel: 17kg | Frame: Closed',
    commercialDescriptionES: 'Resistencia: Magnética variable | Disco: 17kg | Carcasa: Cerrada',
    commercialDescriptionZH: '阻力：可变磁性 | 飞轮：17公斤 | 车架：封闭式',
    category: 'spinning',
    features: [
      'Disco de Inércia de 17 kg',
      'Sistema de resistência magnética',
      'Correia silenciosa resistente ao desgaste',
      'Carcaça totalmente fechada',
      'Ajuste de assento com trava rápida',
      'Alça multi-posição ergonômica',
    ],
    specifications: {
      'Tamanho do produto': '1200mm x 580mm x 1550mm',
      'Peso líquido/bruto': '68kg / 88kg',
      'Capacidade máxima': '180kg',
      'Sistema de resistência': 'Resistência de controle magnético',
      'Modo de ajuste da resistência': 'Velocidade variável contínua',
      'Disco de Inércia': '17kg',
      Carenagem: 'Carenagem toda inclusiva torna o movimento mais seguro e a aparência mai',
      'Modo de condução': 'Correia silenciosa resistente ao desgaste',
      'Ajuste do assento (frente e trás)':
        'Trava do dial da alça, basta girar 90° para realizar a trava rápida, conveniente, sem limitação de espaço',
      'Ajuste do assento (alto e baixo)': 'Nove posições de ajuste de altura do assento',
      Guidão: 'Alça ergonômica multiposição com ajuste de altura em 11 posições',
    },
  },
} as const;

export const BLUE_LINE_CONFIG = {
  name: 'Blue Line',
  colors: {
    primary: '#61fbfe',
    secondary: '#00bcd4',
    text: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  type: 'cardio' as const,
  line: 'blue' as const,
} as const;
