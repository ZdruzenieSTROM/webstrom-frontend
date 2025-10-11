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
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
})

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
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      // not included in recommended config
      'unicorn/better-regex': 'warn',
      'unicorn/custom-error-definition': 'warn',

      // we don't want
      'unicorn/prefer-module': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-useless-promise-resolve-reject': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/filename-case': 'off',
    },
  },
  {
    // https://github.com/lydell/eslint-plugin-simple-import-sort#usage
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off',
    },
  },
  {
    plugins: {
      'eslint-comments': eslintComments,
    },
    rules: {
      'eslint-comments/no-unused-disable': 'warn',
      'eslint-comments/no-unlimited-disable': 'warn',
    },
  },
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
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
      'import/no-default-export': 'warn',

      'security/detect-object-injection': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mjs', '**/*.mts'],
    extends: fixupConfigRules(compat.extends('plugin:node/recommended-module')),
    rules: {
      'import/no-commonjs': 'warn',

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
    files: ['**/*.config.{mjs,ts,mts}'],
    rules: {
      'node/no-unpublished-import': 'off',
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
  {
    files: ['src/pages/**/*.tsx'],
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
