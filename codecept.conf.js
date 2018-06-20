exports.config = {
  tests: './tests/e2e/tests/*_test.js',
  output: './tests/e2e/output',
  include: {
    I: './tests/e2e/steps_file.js'
  },
  helpers: {
    Nightmare: {
      url: 'http://127.0.0.1:9191/tests/e2e/pages/',
      show: true,
      restart: true
    }
  }
};
