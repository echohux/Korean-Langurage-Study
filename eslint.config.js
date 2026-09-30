import js from '@eslint/js';
import compat from 'eslint-plugin-compat';
import importPlugin from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist', 'build', 'node_modules']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite
        ],
        languageOptions: {
            globals: globals.browser
        },
        plugins: {
            prettier,
            'unused-imports': unusedImports,
            'import-x': importPlugin,
            compat
        },
        rules: {
            'prettier/prettier': 'warn',
            'compat/compat': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
            'unused-imports/no-unused-imports': 'warn',
            'import-x/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    pathGroups: [
                        { pattern: '@baidu/**', group: 'external', position: 'after' },
                        { pattern: '@/**', group: 'internal' }
                    ],
                    pathGroupsExcludedImportTypes: [],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true }
                }
            ]
        }
    }
]);
