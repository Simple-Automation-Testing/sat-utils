module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
    'mocha': true
  },
  'globals': {
    'describe:': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'plugins': [
    '@typescript-eslint',
    'mocha',
    'chai-expect',
    'chai-friendly'
  ],
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'typeParameter',
        'format': ['PascalCase'],
        'prefix': ['T']
      }
    ],
    'no-undefined': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-console': 2,
    'arrow-parens': 2,
    'require-atomic-updates': 'off',
    'eol-last': ['error', 'always'],
    'max-len': ['error', {'code': 140, 'tabWidth': 2}],
    'prefer-const': ['error', {'destructuring': 'any', 'ignoreReadBeforeAssign': false}],
    'space-in-parens': [2, 'never'],
    'no-trailing-spaces': ['error'],
    'semi': [2, 'always'],
    'no-multiple-empty-lines': [2, {'max': 2}],
    'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
    'valid-jsdoc': ['error', {'requireParamDescription': false, 'requireReturnDescription': false}],
    'no-shadow': 'off',
    'space-before-function-paren': ['error', {'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always'}],
    'require-jsdoc': 'off', //['error', {'require': {'FunctionDeclaration': true, 'MethodDefinition': true}}],
    'keyword-spacing': ['error'],
    'chai-friendly/no-unused-expressions': 'off',
    'no-undef-init': ['error'],
    'comma-spacing': ['error'],
    'brace-style': ['error'],
    '@typescript-eslint/no-unused-vars': 'off',
    'no-irregular-whitespace': 'off',
    'mocha/no-mocha-arrows': 'off',
    'chai-expect/no-inner-compare': 'off',
    '@typescript-eslint/no-this-alias': 'off'
  },
  'extends': [
    'eslint:recommended',
    'plugin:mocha/recommended',
    'plugin:chai-expect/recommended',
    'plugin:chai-friendly/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended'
  ]
};
