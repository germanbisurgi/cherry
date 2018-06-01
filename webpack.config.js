var path = require('path');

module.exports = [
  {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'comp.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'comp'
    }
  },
  {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'comp.js',
      path: path.resolve(__dirname, 'tests/e2e'),
      library: 'comp'
    }
  }
];
