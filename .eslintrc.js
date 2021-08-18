module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
  ],
  plugins: ['import', 'prettier', '@typescript-eslint', 'simple-import-sort'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'max-len': ['error', 180], // 最大长度 180
    'import/prefer-default-export': 'off', // off Prefer a default export if module exports a single name
    '@typescript-eslint/no-var-requires': 'off', // 可以使用 require
    'import/no-extraneous-dependencies': 'off', // 可以使用 package.json 中为定义的 package
    'max-classes-per-file': 'warn', // 但文件最大 class 限制
    // 'class-methods-use-this': 'off', // 不太能使用这条规则  https://eslint.org/docs/rules/class-methods-use-this#enforce-that-class-methods-utilize-this-class-methods-use-this
  },
  overrides: [
    {
      files: ['config/*.ts'],
      rules: {
        'max-len': 'off',
        'prettier/prettier': [
          'error',
          {
            printWidth: 1000,
          },
        ],
      },
    },
  ],
}
