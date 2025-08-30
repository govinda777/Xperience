module.exports = {
  default: {
    require: [
      'features/step_definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber_report.json',
      'html:reports/cucumber_report.html',
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    parallel: 2,
    tags: 'not @skip',
    retry: 1,
    retryTagFilter: '@flaky',
    worldParameters: {
      baseUrl: 'http://localhost:3000',
      timeout: 10000
    }
  },
  ci: {
    require: [
      'features/step_definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'json:reports/cucumber_report.json',
      'html:reports/cucumber_report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    parallel: 4,
    tags: 'not @skip and not @manual',
    retry: 2,
    retryTagFilter: '@flaky'
  },
  debug: {
    require: [
      'features/step_definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    parallel: 1,
    tags: '@debug'
  }
};
