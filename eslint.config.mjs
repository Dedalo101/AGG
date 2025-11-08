import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['**/*.min.js', '**/*.min.css'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestIdleCallback: 'readonly',
        Intercom: 'readonly',
        intercomSettings: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        DOMParser: 'readonly',
        screen: 'readonly',
        alert: 'readonly',
        process: 'readonly',
        module: 'readonly',
        AdminLogin: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-empty': 'warn'
    }
  },
  {
    files: ['**/*.min.js', 'js/script.js'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off'
    }
  },
  {
    files: ['strip-console-logs.js', 'optimize.js', 'generate-critical-css.js', 'debug-overflow.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        global: 'readonly'
      }
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'warn'
    }
  }
];