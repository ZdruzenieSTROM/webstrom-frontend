// ESLint config - most of this file is taken from the config on one of Riso's previous projects in Vacuumlabs.
// EDIT: vela kokocin asi. snazme sa pouzivat co najviac extendovanych configov a co najmenej explicitnych rules

// eslint-disable-next-line @typescript-eslint/no-require-imports
const restrictedGlobals = require('confusing-browser-globals')

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-comments',
    'filenames',
    'no-secrets',
    'node',
    'unicorn',
    'simple-import-sort',
  ],
  extends: [
    // for what's included, check: https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js
    'next',

    // Baseline configurations
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/strict',

    // Disable ESLint rules conflicting with Prettier
    'prettier',
    'prettier/prettier',

    // Set rules for module imports/exports
    'plugin:import/errors',
    'plugin:import/warnings',

    // Avoid common errors related to Promises
    'plugin:promise/recommended',

    // Detect common patterns that can lead to security issues
    'plugin:security/recommended-legacy',

    // Run Prettier as an ESLint plugin (not separately after ESLint)
    'plugin:prettier/recommended',

    // React-specific rules - not needed, included in 'next'
    // 'plugin:react/recommended',
    // 'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // as of React 17, React doesn't need to be imported to use JSX
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // we use TS, not prop types
    'react/prop-types': 'off',
    // restrict usage of confusing global variables
    'no-restricted-globals': ['error', ...restrictedGlobals],

    // additional React rules not included in recommended set
    'react/self-closing-comp': 'error',

    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_', ignoreRestSiblings: true}],
    '@typescript-eslint/no-explicit-any': 'warn',

    // Use === instead of == for everything, except for comparison with null and other special
    // cases.
    eqeqeq: ['warn', 'smart'],

    // Disable eval() and equivalents, as they're potentially unsafe
    'no-eval': 'warn',
    'no-implied-eval': 'warn',

    // Use const for declaring variables when they aren't reassigned
    'prefer-const': 'warn',

    // Keep imports tidy: group all of them on top, order them in a conventional manner,
    // add a newline after, avoid duplicates, and force a consistent style when importing index files
    'import/no-absolute-path': 'error',
    'import/order': 'off', // conflicts with simple-import-sort
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'unicorn/import-index': 'warn',

    // Even better import sorting - ordering and grouping based on scope
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // Prevent ESLint comments from accidentally disabling more rules than intended
    // or masking other errors
    'eslint-comments/no-unused-disable': 'warn',
    'eslint-comments/no-unlimited-disable': 'warn',
    'eslint-comments/disable-enable-pair': 'warn',

    // Heuristic to try to detect secrets accidentally left in the code
    // 'no-secrets/no-secrets': 'warn',

    // Unluckily this rule has a very high false-positivity rate, making it unusable
    'security/detect-object-injection': 'off',

    // Improve regexes by making them shorter, more consistent, and safer
    // 'require-unicode-regexp': 'warn',
    'unicorn/better-regex': 'warn',
    'unicorn/no-unsafe-regex': 'warn',

    // Best practices for Promises and async methods
    'no-return-await': 'warn',
    'prefer-promise-reject-errors': 'warn',

    // Best practices for errors
    'no-throw-literal': 'warn',
    'unicorn/custom-error-definition': 'warn',
    'unicorn/error-message': 'warn',
    'unicorn/throw-new-error': 'warn',

    // Best practices for Arrays
    'array-callback-return': ['warn', {allowImplicit: true, checkForEach: true}],
    'unicorn/no-array-push-push': 'warn',
    'unicorn/prefer-array-find': 'warn',
    'unicorn/prefer-array-flat-map': 'warn',
    'unicorn/prefer-array-index-of': 'warn',
    'unicorn/prefer-array-some': 'warn',
    'unicorn/prefer-includes': 'warn',
    'unicorn/no-instanceof-array': 'warn',
    'unicorn/prefer-negative-index': 'warn',
    'unicorn/no-array-callback-reference': 'warn',

    // Best practices for Strings
    'unicorn/prefer-regexp-test': 'warn',
    'unicorn/prefer-string-replace-all': 'warn',
    'unicorn/prefer-string-slice': 'warn',
    'unicorn/prefer-string-starts-ends-with': 'warn',
    'unicorn/prefer-string-trim-start-end': 'warn',
    'unicorn/escape-case': 'warn',

    // Best practices for Numbers
    'unicorn/prefer-number-properties': 'warn',
    'unicorn/numeric-separators-style': 'warn',
    'unicorn/no-zero-fractions': 'warn',
    'unicorn/number-literal-case': 'warn',
    'unicorn/prefer-math-trunc': 'warn',

    // Disallow nested ternary expressions, that are hard to read
    // 'unicorn/no-nested-ternary': 'warn',

    // Prefer Set#has() over Array#includes() when checking for existence or non-existence,
    // as it's faster
    'unicorn/prefer-set-has': 'warn',

    // Avoid using sync versions of functions, that would block the event loop on the server,
    // potentially blocking all requests
    'node/no-sync': 'warn',

    // Don't use console.log, prefer the Nest logger instead
    'no-console': 'warn',

    // Add one space before comment texts
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
  },
  overrides: [
    // Rules specific to files that should be treated as modules
    {
      files: ['*.ts', '*.tsx', '*.mjs'],
      extends: ['plugin:node/recommended-module'],
      rules: {
        // Use only imports/exports, no commonjs in modules
        'import/no-commonjs': 'warn',

        // Always use named exports, as they work better with refactoring tools and IDEs
        'import/no-default-export': 'warn',

        // Already handled by eslint-plugin-import
        'node/no-missing-import': 'off',
      },
    },

    // Rules specific to files that should be treated as commonjs
    {
      files: ['*.js', '*.cjs'],
      extends: ['plugin:node/recommended-script'],
    },

    // Rules specific to TypeScript files
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
      extends: [
        'plugin:import/typescript',
        // TODO: allow for stricter rules
        //  'plugin:@typescript-eslint/recommended-type-checked'
        // TODO: consider moving this further to strict
        //  'plugin:@typescript-eslint/strict-type-checked'
      ],
      rules: {
        // Unsupported syntax will be transpiled by TypeScript anyway
        'node/no-unsupported-features/es-syntax': 'off',

        // Use explicit type signatures for everything that is exported from a module
        // This works as a live documentation system and helps catching more errors.
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // Disable const x = require("module") syntax (use imports instead)
        '@typescript-eslint/no-var-requires': 'warn',
      },
    },

    // Rules specific to test files
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      extends: ['plugin:vitest/all'],
      rules: {
        // In test files we can load modules that are not part of the production dependencies
        'node/no-unpublished-import': 'off',
      },
    },

    // Rules specific to config files
    {
      files: ['*.config.ts'],
      rules: {
        // Configuration files are kebab-cased and have the ".config" suffix
        'filenames/match-regex': ['warn', `^[a-z]+(-[a-z0-9]+)*\\.config$`],

        // In configuration files we can use dev dependencies
        'node/no-unpublished-import': 'off',
      },
    },

    // Rules specific to .eslintrc.js file
    {
      files: ['.eslintrc.js'],
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },

    // Next.js needs default exports for pages and API points
    {
      files: ['src/pages/**/*'],
      rules: {
        'import/no-default-export': 'off',
      },
    },

    // generated types contain many `any`s
    {
      files: ['src/types/api/generated/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
