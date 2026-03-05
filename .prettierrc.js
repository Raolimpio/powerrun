/** @type {import('prettier').Config} */
export default {
  // Configurações empresariais para código limpo e consistente

  // Básico
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  // Objetos e Arrays
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,

  // JSX específico
  jsxSingleQuote: true,
  jsxBracketSameLine: false,

  // Funções
  arrowParens: 'always',

  // Quebra de linha
  endOfLine: 'lf',

  // Configurações específicas por tipo de arquivo
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      options: {
        parser: 'babel',
      },
    },
  ],

  // Plugins extras (se disponíveis)
  plugins: [],
};
