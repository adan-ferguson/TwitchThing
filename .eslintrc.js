module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
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
        indent: ['error', 4]
    }
}
