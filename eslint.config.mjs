// moze tu byt este dost kokocin, aj ked sme to uz kus precistili. snazme sa pouzivat co najviac extendovanych configov a co najmenej explicitnych rules

import {fixupConfigRules} from '@eslint/compat'
import {FlatCompat} from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import vitest from '@vitest/eslint-plugin'
import restrictedGlobals from 'confusing-browser-globals'
import {globalIgnores} from 'eslint/config'
import eslintComments from 'eslint-plugin-eslint-comments'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
})

// eslint-disable-next-line import/no-default-export
export default tseslint.config(
  globalIgnores(['.next/', '.yarn/']),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  // TODO: consider switching to even more strict configs:
  // tseslint.configs.strictTypeChecked,
  // tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // 'import' plugin je definovany nejakym inym extendovanym configom, takze ho ani nemozeme definovat sami
  // importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    plugins: {
      'eslint-comments': eslintComments,
      unicorn,
      'simple-import-sort': simpleImportSort,
    },
    extends: fixupConfigRules(
      compat.extends(
        // for what's included, check: https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js
        'next',
        'next/core-web-vitals',

        // Set rules for module imports/exports
        // 'plugin:import/errors',
        // 'plugin:import/warnings',

        // Avoid common errors related to Promises
        'plugin:promise/recommended',

        // Detect common patterns that can lead to security issues
        'plugin:security/recommended-legacy',
      ),
    ),
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/self-closing-comp': 'error',

      // TODO: enable (remove lines) and fix the errors
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',

      '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],

      'no-restricted-globals': ['error', ...restrictedGlobals],
      eqeqeq: ['warn', 'smart'],
      'prefer-const': 'warn',
      'no-return-await': 'warn',
      'prefer-promise-reject-errors': 'warn',
      'array-callback-return': [
        'warn',
        {
          allowImplicit: true,
          checkForEach: true,
        },
      ],
      'no-console': 'warn',
      'spaced-comment': [
        'warn',
        'always',
        {
          line: {
            markers: ['/'],
          },

          block: {
            markers: ['!'],
            balanced: true,
          },
        },
      ],

      'import/no-absolute-path': 'error',
      'import/order': 'off',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'eslint-comments/no-unused-disable': 'warn',
      'eslint-comments/no-unlimited-disable': 'warn',

      'security/detect-object-injection': 'off',

      'unicorn/custom-error-definition': 'warn',
      'unicorn/error-message': 'warn',
      'unicorn/throw-new-error': 'warn',
      'unicorn/better-regex': 'warn',
      'unicorn/no-array-push-push': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/prefer-array-flat-map': 'warn',
      'unicorn/prefer-array-index-of': 'warn',
      'unicorn/prefer-array-some': 'warn',
      'unicorn/prefer-includes': 'warn',
      'unicorn/no-instanceof-array': 'warn',
      'unicorn/prefer-negative-index': 'warn',
      'unicorn/no-array-callback-reference': 'warn',
      'unicorn/prefer-regexp-test': 'warn',
      'unicorn/prefer-string-replace-all': 'warn',
      'unicorn/prefer-string-slice': 'warn',
      'unicorn/prefer-string-starts-ends-with': 'warn',
      'unicorn/prefer-string-trim-start-end': 'warn',
      'unicorn/escape-case': 'warn',
      'unicorn/prefer-number-properties': 'warn',
      'unicorn/numeric-separators-style': 'warn',
      'unicorn/no-zero-fractions': 'warn',
      'unicorn/number-literal-case': 'warn',
      'unicorn/prefer-math-trunc': 'warn',
      'unicorn/prefer-set-has': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mjs', '**/*.mts'],
    extends: fixupConfigRules(compat.extends('plugin:node/recommended-module')),
    rules: {
      'import/no-commonjs': 'warn',
      'import/no-default-export': 'warn',

      'node/no-missing-import': 'off',
      // screams on import() when using next/dynamic
      'node/no-unsupported-features/es-syntax': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    extends: fixupConfigRules(compat.extends('plugin:node/recommended-script')),
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      vitest,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    rules: {
      ...vitest.configs.all.rules,
      'vitest/prefer-expect-assertions': [
        'warn',
        {
          onlyFunctionsWithExpectInCallback: true,
          onlyFunctionsWithAsyncKeyword: true,
        },
      ],

      'node/no-unpublished-import': 'off',
    },
  },
  {
    files: ['**/*.config.mjs', '**/*.config.ts', '**/*.config.mts'],
    rules: {
      'node/no-unpublished-import': 'off',
    },
  },
  {
    files: ['src/pages/**/*'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['src/types/api/generated/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  eslintPluginPrettierRecommended,
)
