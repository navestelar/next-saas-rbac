/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@rocketseat/eslint-config/next'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'require-await': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
  },
}
