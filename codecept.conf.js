exports.config = {
  tests: './tests/e2e/tests/*_test.js',
  output: './tests/e2e/output',
  include: {
    I: './tests/e2e/steps_file.js'
  },
  name: 'ci',
  timeout: 10000,
  bootstrap: false,
  teardown: null,
  helpers: {
    Nightmare: {
      url: 'http://127.0.0.1:8080',
      show: true,
      restart: false
    }
  }
};

