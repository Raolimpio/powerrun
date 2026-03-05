# Produtos: imagens e informações técnicas

O catálogo não usa base de dados. Tudo é definido em **constants**:
equipamentos, imagens, descrições, especificações e links de PDFs. Alterar aqui
reflete em listagens, páginas de produto, sitemaps, projetos-academia e SEO.

## Onde está cada coisa

| O quê                                                      | Ficheiro(s)                                                                                 | Uso                                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Lista de equipamentos, imagens, descrição, specs, features | `constants/equipment-data.ts`                                                               | Página de equipamentos, detalhe do produto, projetos, SEO, sitemaps, QR                  |
| Imagens das categorias (Red Line, Blue Line, Musculação)   | `constants/equipment-data.ts` → `EQUIPMENT_CATEGORIES`                                      | Cards de categoria na listagem                                                           |
| Textos e specs por linha (Blue/Red/Musculação)             | `constants/product-lines/blue-line-config.ts`, `red-line-config.ts`, `musculacao-config.ts` | Conteúdo por linha quando usado em páginas que leem estes configs                        |
| Manuais e fichas técnicas (PDFs)                           | `constants/pdf-links.ts`                                                                    | Documentação técnica, botões de download; alguns equipamentos referenciam em `downloads` |

A **fonte principal** para nome, imagens, descrição curta/longa, especificações
e características de cada produto é `constants/equipment-data.ts`
(`MOCK_EQUIPMENT`).

## Tipo de um equipamento

Cada item em `MOCK_EQUIPMENT` segue o tipo `Equipment` (`types/index.ts`):

- **id** — identificador único (ex.: `escada-pr600`,
  `bicicleta-spinning-pr200`).
- **name**, **category**, **brand**, **model** — texto.
- **images** — array de URLs (primeira = principal; restantes =
  galeria/masonry).
- **shortDescription**, **description** — texto curto e longo.
- **specifications** — objeto `Record<string, string>` (ex.:
  `'Carga Máxima': '160 kg'`).
- **features** — array de strings (diferenciais).
- **targets** — ex.: `['academia']`.
- **downloads** — array
  `{ name, url, type: 'manual' | 'catalog' | 'warranty' | 'technical' }` (PDFs).
- **inStock**, **featured** — boolean.

## Como alterar imagens de produtos

1. **Subir a nova imagem** na Cloudinary (dashboard ou API). O projeto usa o
   cloud `dq0bovaz5`; URLs são do tipo
   `https://res.cloudinary.com/dq0bovaz5/image/upload/...`.
2. **Copiar a URL** gerada (pode usar transformações na URL se quiser
   tamanho/formato).
3. **Editar** `constants/equipment-data.ts`, localizar o equipamento pelo `id` e
   alterar o array **images**:
   - Primeira posição = imagem principal na página do produto.
   - Posições seguintes = galeria (masonry/destaques).
4. Guardar; não é necessário alterar mais nenhum ficheiro — as páginas e
   sitemaps leem deste ficheiro.

Para **trocar apenas a imagem principal**, substitua a primeira URL do array.
Para **adicionar fotos à galeria**, acrescente novas URLs ao array.

**Imagens de categorias** (Red Line, Blue Line, Musculação): no mesmo ficheiro,
em `EQUIPMENT_CATEGORIES`, o campo **image** de cada categoria aceita qualquer
URL (hoje usa Unsplash; pode trocar por Cloudinary).

## Como alterar informações técnicas (texto e specs)

1. **Descrições e specs no listado/detalhe do produto**  
   Editar em `constants/equipment-data.ts` no objeto do equipamento:
   - **shortDescription** — texto curto (cards/listagens).
   - **description** — texto longo (página do produto).
   - **specifications** — pares chave/valor (ex.: `'Carga Máxima': '160 kg'`,
     `'Dimensões': '145 × 82 × 208 cm'`). Adicionar ou remover chaves conforme
     necessário.
   - **features** — array de strings (bullets de diferenciais).

2. **Conteúdo por linha (Blue/Red/Musculação)**  
   Se a página usar os configs de linha, editar em:
   - `constants/product-lines/blue-line-config.ts`
   - `constants/product-lines/red-line-config.ts`
   - `constants/product-lines/musculacao-config.ts`  
     Em cada produto do config: **name**, **commercialDescription** (e variantes
     EN/ES/ZH), **features**, **specifications**. Estes configs não têm imagens;
     imagens vêm de `equipment-data.ts`.

Mantenha **id** e **category** consistentes entre `equipment-data.ts` e os
configs de linha quando o mesmo produto aparecer nos dois.

## Como alterar manuais e fichas técnicas (PDFs)

1. **Subir o novo PDF** na Cloudinary (ou obter URL estável).
2. **Editar** `constants/pdf-links.ts`:
   - Manuais: constantes do tipo `manualPowerRise650`, `manualPowerRace7000`,
     etc.
   - Fichas: constantes do tipo `fichaPowerRise650`, `fichaPowerRace5000`, etc.
3. Atribuir a nova URL à constante correspondente.
4. **Se o equipamento tiver campo `downloads`** em `equipment-data.ts`, atualize
   a **url** (e opcionalmente **name**) do item que aponta para esse
   manual/ficha, para manter a mesma URL que está em `pdf-links.ts` (ou use a
   constante importada, se o código já fizer esse link).

Em muitos casos as páginas importam as constantes de `pdf-links.ts` e mapeiam
por produto; ao alterar só `pdf-links.ts` já se atualiza o link em todo o site.

## Checklist rápido

- **Imagem principal do produto:** `equipment-data.ts` → produto → **images[0]**
  → nova URL Cloudinary.
- **Galeria do produto:** `equipment-data.ts` → produto → **images** → adicionar
  ou trocar URLs.
- **Texto / especificações do produto:** `equipment-data.ts` →
  **shortDescription**, **description**, **specifications**, **features**; ou
  configs em `product-lines/*.ts` se for esse o conteúdo usado na página.
- **Manual ou ficha em PDF:** `pdf-links.ts` → constante do manual/ficha → nova
  URL; e, se existir, **downloads** do equipamento em `equipment-data.ts`.
- **Imagem da categoria (linha):** `equipment-data.ts` →
  **EQUIPMENT_CATEGORIES** → **image** da categoria.

Depois de guardar, fazer build/refresh para ver as alterações (e, em produção,
novo deploy).
