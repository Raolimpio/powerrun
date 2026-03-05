// =========================================
// 🎯 GERADOR DE PDF UNIFICADO
// =========================================
// Sistema único para gerar PDFs técnicos tanto em produtos quanto em suporte

import { getProductLineConfig } from '@/constants/product-line-mapping';
import { Equipment } from '@/types';

/**
 * Filtra especificações técnicas removendo campos vazios ou com valor "—"
 * @param specifications - Objeto com as especificações técnicas
 * @returns Objeto filtrado sem campos vazios
 */
function filterEmptySpecifications(specifications: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(specifications).filter(([, value]) => {
      // Remove campos que contêm apenas "—" ou estão vazios
      return value && value.toString().trim() !== '—' && value.toString().trim() !== '';
    })
  );
}

/**
 * Gera descrição profissional personalizada por categoria
 */
export function getProductDescription(equipment: Equipment): string {
  const productLineConfig = getProductLineConfig(equipment.id);
  const name = equipment.name;

  const categoryDescriptions: Record<string, string> = {
    spinning: `A ${name} é um equipamento de spinning profissional com sistema de resistência regulável. Construída com materiais de alta durabilidade para uso intensivo em academias e estúdios. Oferece treino cardiovascular eficiente com ajustes ergonômicos.`,
    esteira: `A ${name} é uma esteira profissional com sistema de amortecimento e motor de alta potência. Projetada para uso intensivo com estrutura robusta e controles digitais. Oferece treino cardiovascular seguro e eficiente.`,
    elíptico: `O ${name} é um equipamento elíptico para exercício cardiovascular de baixo impacto. Oferece movimentos naturais que trabalham corpo inteiro minimizando o estresse articular. Indicado para usuários de todos os níveis de condicionamento.`,
    simulador: `O ${name} é um simulador de treino cardiovascular com resistência progressiva. Oferece movimentos funcionais que trabalham diferentes grupos musculares. Ideal para diversificar rotinas de exercícios.`,
    bike: `A ${name} é uma bicicleta ergométrica profissional com resistência regulável. Projetada para treinos intensivos com ajustes ergonômicos precisos. Adequada para treinamento personalizado e aulas coletivas.`,
    remo: `O ${name} simula o movimento do remo aquático proporcionando treino completo que trabalha aproximadamente 85% dos músculos. Oferece resistência progressiva para desenvolvimento de força, resistência e coordenação.`,
    'multi-gym': `O ${name} é uma estação de musculação multifuncional que permite realizar diversos exercícios em um único equipamento. Design compacto que otimiza espaços mantendo funcionalidade profissional. Ideal para treinos de força completos.`,
    musculacao: `O ${name} é um equipamento de musculação profissional com estrutura reforçada em aço carbono. Desenvolvido para treinamento de força com biomecânica precisa e ajustes ergonômicos. Oferece isolamento muscular eficiente para desenvolvimento específico com segurança e durabilidade para uso intensivo.`,
  };

  const category =
    productLineConfig.category?.toLowerCase() || equipment.category?.toLowerCase() || '';

  if (equipment.description) {
    return equipment.description;
  }

  for (const [key, description] of Object.entries(categoryDescriptions)) {
    if (category.includes(key) || name.toLowerCase().includes(key)) {
      return description;
    }
  }

  return `O ${name} representa excelência em equipamentos fitness, combinando tecnologia avançada com design ergonômico. Desenvolvido para atender aos mais altos padrões de qualidade e performance, oferece uma experiência de treino superior e resultados consistentes. Ideal para ambientes profissionais e residenciais que exigem o melhor em equipamentos de exercício.`;
}

/**
 * Gera benefícios técnicos específicos por categoria
 */
export function getTechnicalBenefits(equipment: Equipment): string[] {
  const productLineConfig = getProductLineConfig(equipment.id);
  const category =
    productLineConfig.category?.toLowerCase() || equipment.category?.toLowerCase() || '';
  const name = equipment.name;

  const benefits: Record<string, string[]> = {
    spinning: [
      'Sistema de transmissão por correia para operação silenciosa',
      'Roda de inércia balanceada para movimento suave e natural',
      'Resistência magnética/friction de alta precisão',
      'Estrutura em aço carbono com acabamento anticorrosivo',
      'Ergonomia ajustável para diferentes biotipos',
      'Sistema de frenagem de emergência para máxima segurança',
    ],
    esteira: [
      'Motor de corrente contínua com controle eletrônico de velocidade',
      'Sistema de amortecimento multicamadas para proteção articular',
      'Deck reversível de alta densidade com maior durabilidade',
      'Painel eletrônico com programas pré-definidos',
      'Sistema de inclinação automática para variação de intensidade',
      'Proteções de segurança e parada de emergência',
    ],
    elíptico: [
      'Movimento biomecânico natural com baixo impacto articular',
      'Sistema de resistência magnética silenciosa',
      'Pedais antiderrapantes com angulação ergonômica',
      'Estrutura robusta em aço com estabilidade superior',
      'Console multifuncional com feedback de performance',
      'Design compacto otimizado para diferentes espaços',
    ],
    simulador: [
      'Tecnologia de simulação realística de movimento',
      'Resistência progressiva e ajustável',
      'Construção robusta para uso intensivo',
      'Interface intuitiva de controle',
      'Sistema de segurança integrado',
      'Design ergonômico para máximo conforto',
    ],
    bike: [
      'Sistema de transmissão profissional de alta durabilidade',
      'Resistência magnética ou por atrito ajustável',
      'Guidão e selim com ajustes multidirecionais',
      'Estrutura em aço carbono para máxima estabilidade',
      'Pedais profissionais com sistema de fixação',
      'Console com monitoramento de performance em tempo real',
    ],
    remo: [
      'Resistência pneumática ou magnética para movimento fluido',
      'Sistema de retorno automático com cabo de alta resistência',
      'Assento ergonômico com trilho de alumínio',
      'Monitor de performance com métricas avançadas',
      'Pegadores antiderrapantes para máxima aderência',
      'Estrutura dobrável para otimização de espaço',
    ],
    'multi-gym': [
      'Sistema de cabos e polias de grau comercial',
      'Estações múltiplas para treino completo',
      'Placas de peso em ferro fundido com acabamento premium',
      'Estrutura modular expansível conforme necessidade',
      'Componentes com certificação de segurança',
      'Design compacto para máximo aproveitamento do espaço',
    ],
    musculacao: [
      'Estrutura reforçada em aço carbono com tratamento anticorrosivo',
      'Estofado anatômico em PV Crom Naval antialérgico e antifúngico',
      'Pintura eletrostática em poliéster com dupla camada',
      'Sapatas em borracha vulcanizada para aderência ao solo',
      'Sistema de placas de peso em ferro fundido',
      'Cabos de aço de alta resistência com baixa manutenção',
      'Componentes com certificação de segurança profissional',
    ],
  };

  for (const [key, benefitList] of Object.entries(benefits)) {
    if (category.includes(key) || name.toLowerCase().includes(key)) {
      return benefitList;
    }
  }

  // Se não tem categoria específica, retorna características básicas reais e verificáveis
  return [
    'Estrutura robusta em aço carbono',
    'Pintura eletrostática com tratamento anticorrosivo',
    'Design ergonômico para uso profissional',
    'Componentes de alta durabilidade',
    'Acabamento resistente ao desgaste',
  ];
}

/**
 * Gera HTML completo do PDF técnico - SISTEMA UNIFICADO
 */
export function generateTechnicalSheetHTML(equipment: Equipment): string {
  const productLineConfig = getProductLineConfig(equipment.id);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${equipment.name} - Documentação Técnica</title>
     <style>
        @page { 
          margin: 5mm; 
          size: A4 portrait;
        }
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        body { 
          font-family: 'Arial', sans-serif; 
          background: #f8f9fa; 
          color: #333;
          line-height: 1.3;
          font-size: 8pt;
        }
        
        /* MOLDURA PRINCIPAL */
        .page-wrapper {
          background: white;
          border-radius: 6px;
          border: 1px solid #ddd;
          margin: 4px auto;
          padding: 4mm 6mm 18mm 6mm;
          min-height: calc(100vh - 8px);
          max-width: 190mm;
        }
        
        /* CABEÇALHO PROFISSIONAL */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid #999;
          margin-bottom: 12px;
        }
        .logo {
          height: 32px;
          object-fit: contain;
        }
        .product-code {
          font-size: 7pt;
          color: #666;
          font-family: monospace;
        }
        
        /* TÍTULO DO PRODUTO */
        .product-title {
          font-size: 14pt;
          font-weight: 500;
          color: #333;
          margin: 8px 0 4px 0;
        }
        .product-category {
          font-size: 7pt;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        
        /* IMAGEM DO PRODUTO */
        .product-image {
          width: 100%;
          max-width: 120mm;
          height: auto;
          max-height: 60mm;
          object-fit: contain;
          margin: 8px auto;
          display: block;
        }
        
        /* SEÇÕES */
        .section {
          margin: 10px 0;
        }
        .section-title {
          font-size: 9pt;
          font-weight: 600;
          color: #333;
          border-bottom: 0.5pt solid #ccc;
          padding-bottom: 2px;
          margin-bottom: 6px;
        }
        
        /* DESCRIÇÃO */
        .description {
          font-size: 8pt;
          line-height: 1.3;
          color: #444;
          text-align: justify;
          margin-bottom: 8px;
        }
        
        /* CARACTERÍSTICAS */
        .features-list {
          columns: 2;
          column-gap: 12px;
          font-size: 7pt;
          line-height: 1.2;
        }
        .feature-item {
          margin-bottom: 2px;
          break-inside: avoid;
          color: #555;
        }
        .feature-item:before {
          content: "• ";
          color: #888;
        }
        
        /* TABELA COMPLETA */
        .specs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 7pt;
          margin-top: 6px;
        }
        .specs-table th {
          background: #f5f5f5;
          padding: 3px 6px;
          border: 0.5pt solid #ccc;
          font-weight: 600;
          text-align: left;
        }
        .specs-table td {
          padding: 2px 6px;
          border: 0.5pt solid #ddd;
          vertical-align: top;
        }
        .specs-table tr:nth-child(even) td {
          background: #fafafa;
        }
        
        /* RODAPÉ PROFISSIONAL */
        .footer {
          position: fixed;
          bottom: 3mm;
          left: 5mm;
          right: 5mm;
          font-size: 8pt;
          font-weight: 600;
          color: #333;
          text-align: center;
          border-top: 1px solid #999;
          padding: 4px 6px;
          background: white;
          box-shadow: 0 -2px 4px rgba(0,0,0,0.15);
          z-index: 1000;
        }
        
        /* QUEBRA DE PÁGINA */
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          body { 
            background: white !important;
            print-color-adjust: exact; 
          }
          .page-wrapper {
            border: none;
            border-radius: 0;
            margin: 0;
            padding: 4mm 6mm 18mm 6mm !important;
            min-height: auto;
            max-width: none;
          }
          .footer {
            position: fixed;
            bottom: 2mm !important;
            left: 5mm !important;
            right: 5mm !important;
            font-size: 8pt !important;
            font-weight: 600 !important;
            color: #333 !important;
            background: white !important;
            border-top: 1px solid #333 !important;
            box-shadow: none;
          }
          .no-print { display: none; }
        }
      </style>
    </head>
     <body>
       <div class="page-wrapper">
         <!-- CABEÇALHO PROFISSIONAL -->
         <div class="header">
           <img src="/Logo PowerRun.png" alt="Power Run" class="logo" onerror="this.outerHTML='<div style=&quot;font-size: 9pt; font-weight: bold; color: #333;&quot;>POWER RUN</div>';">
           <div class="product-code">${equipment.id.toUpperCase()}</div>
         </div>
         
         <!-- TÍTULO DO PRODUTO -->
         <h1 class="product-title">${equipment.name}</h1>
         <div class="product-category">${equipment.category}</div>
         
         <!-- IMAGEM DO PRODUTO -->
         ${
           equipment.images && equipment.images.length > 0
             ? `<img src="${equipment.images[0]}" alt="${equipment.name}" class="product-image">`
             : `<div style="text-align: center; font-size: 7pt; color: #999; padding: 20px; border: 1px dashed #ddd; border-radius: 4px;">[Imagem do produto não disponível]<br><small>${equipment.name}</small></div>`
         }
         
         <!-- DESCRIÇÃO PROFISSIONAL COMPLETA -->
        <div class="section">
          <h2 class="section-title">Descrição</h2>
          <p class="description">${getProductDescription(equipment)}</p>
        </div>
        
        <!-- ESPECIFICAÇÕES TÉCNICAS COMPLETAS -->
        <div class="section">
           <h2 class="section-title">Especificações Técnicas</h2>
           <table class="specs-table">
             <thead>
               <tr>
                 <th style="width: 40%;">Especificação</th>
                 <th>Valor</th>
               </tr>
             </thead>
             <tbody>
               ${Object.entries(filterEmptySpecifications(equipment.specifications || {}))
                 .map(
                   ([key, value]) => `
                 <tr>
                   <td>${key}</td>
                   <td>${value}</td>
                 </tr>
               `
                 )
                 .join('')}
               <tr>
                 <td><strong>Marca</strong></td>
                 <td>${equipment.brand}</td>
               </tr>
               <tr>
                 <td><strong>Modelo</strong></td>
                 <td>${equipment.model}</td>
               </tr>
               <tr>
                 <td><strong>Linha de Produto</strong></td>
                 <td>${productLineConfig.line === 'blue' ? 'Blue Line Premium' : productLineConfig.line === 'red' ? 'Red Line Professional' : 'Linha Musculação'}</td>
               </tr>
               <tr>
                 <td><strong>Aplicação</strong></td>
                 <td>${equipment.targets.join(', ')}</td>
               </tr>
             </tbody>
           </table>
         </div>
         
         <!-- APLICAÇÕES E INDICAÇÕES COMPLETAS -->
         <div class="section">
           <h2 class="section-title">Indicações de Uso</h2>
           <div style="font-size: 7pt; line-height: 1.3; color: #555;">
             <strong>Ambientes Recomendados:</strong> Academias comerciais, estúdios especializados, residências premium, condomínios, centros de reabilitação, hotéis e resorts.
             <br><br>
             <strong>Público-Alvo:</strong> Iniciantes a atletas avançados, programas de reabilitação, treinamento funcional, aulas coletivas e uso pessoal intensivo.
             <br><br>
             <strong>Benefícios do Treinamento:</strong> Melhora cardiovascular, fortalecimento muscular, queima calórica eficiente, baixo impacto articular e versatilidade de exercícios.
           </div>
         </div>
       </div>
       
       <!-- RODAPÉ PROFISSIONAL -->
       <div class="footer">
         <strong>Power Run Equipamentos</strong> • www.powerrun.com.br • Rev. 1.0 • ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
       </div>
     </body>
    </html>
  `;

  return htmlContent;
}

/**
 * Abre e imprime o PDF técnico - FUNÇÃO UNIFICADA
 */
export function printTechnicalSheet(equipment: Equipment): void {
  const htmlContent = generateTechnicalSheetHTML(equipment);

  try {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();

      // Aguardar carregamento e imprimir
      setTimeout(() => {
        newWindow.print();
      }, 500);
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Tente novamente.');
  }
}
