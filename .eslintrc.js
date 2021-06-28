module.exports = {
    env: {
        es2021: true,
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
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
