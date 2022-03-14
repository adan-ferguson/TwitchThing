module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    quotes: [
      'error',
      'single'
    ],
    'quote-props': [
      'error',
      'as-needed'
    ],
    semi: [
      'error',
      'never'
    ],
    'no-console': 'off',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'no-unused-vars': ["error", { "args": "none" }],
    'space-before-blocks': ['error', 'never'],
    indent: ['error', 2]
  }
}
