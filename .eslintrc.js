module.exports = {
    root: true,
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        '@vue/typescript/recommended'
        // 'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always']
    }
};
