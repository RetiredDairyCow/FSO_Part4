module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 13,
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'semi': [
      'error',
      'never',
    ],
    'indent': [
      'error',
      2,
    ],
  },
}
