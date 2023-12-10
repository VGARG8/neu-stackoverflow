module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    overrides: [
        {
            files: ['**/*.spec.js'],
            globals: {
                cy: 'readonly',
            },
            env: {
                jest: true,
            },
            plugins: ['cypress'],
        },
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.js', '.eslintrc.cjs'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {},
};
