// const tslint = require("typescript-eslint");

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint', 'simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'array-bracket-spacing': ['warn', 'never'],
    'array-callback-return': 'off',
    'computed-property-spacing': ['warn', 'never'],
    'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
    'guard-for-in': 'off',
    'max-len': ['error', { code: 150, ignoreStrings: true, ignoreUrls: true }],
    'no-await-in-loop': 'off',
    'no-fallthrough': 'off',
    'no-param-reassign': 'warn',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-return-await': 'off',
    'object-curly-spacing': ['warn', 'always'],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
    'require-await': 'off',
    semi: ['error', 'always'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        destructuredArrayIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-var-requires': 'error',
    'prettier/prettier': [
      'error',
      {
        printWidth: 150,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'lf',
      },
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages `nest` related packages come first.
          ['^@nestjs', '^@?\\w'],
          ['^@hapi', '^@?\\w'],
          ['^@jest', '^@?\\w'],
          ['^@prisma', '^@?\\w'],
          // Internal packages.
          ['^(@libs|@common|@app)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\\\.\\\\.(?!/?$), ^\\\\.\\\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\\\./(?=.*/)(?!/?$), ^\\\\.(?!/?$), ^\\\\./?$'],
        ],
      },
    ],
  },
};
