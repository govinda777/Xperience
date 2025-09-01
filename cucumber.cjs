module.exports = {
  default: {
    import: [
      'features/step_definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber_report.json',
      'html:reports/cucumber_report.html',
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
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
    import: [
      'features/step_definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    format: [
      'json:reports/cucumber_report.json',
      'html:reports/cucumber_report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 4,
    tags: 'not @skip and not @manual',
    retry: 2,
    retryTagFilter: '@flaky'
  },
  debug: {
    import: [
      'features/step_definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    format: [
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 1,
    tags: '@debug'
  }
};
