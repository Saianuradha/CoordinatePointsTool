require('dotenv').config({
    path: process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env',
    override: process.env.TEST_ENV ? true : false,
});
require('fs-extra').ensureDir('./test-results/reports');
require('fs-extra').remove('./test-results/screenshots');
require('fs-extra').remove('./test-results/videos');

// Base options for all profiles
const baseOptions = {
    requireModule: ['ts-node/register'],
    require: ['**/steps/*.ts', './src/support/config/hooks.ts'],
    format: [
        'summary',
        'rerun:@rerun.txt',
        'json:./test-results/reports/cucumber.json'
    ],
    formatOptions: {
        snippetInterface: 'async-await'
    },
    publishQuiet: true,
    parallel: parseInt(process.env.PARALLEL_THREAD || '1'),
    retry: parseInt(process.env.RETRIES || '0')
};

module.exports = {
    // Default runner profile
    default: {
        ...baseOptions,
        paths: ['./features/'],
        tags: 'not @ignore'
    },

    // Runner profile (for backward compatibility)
    runner: {
        ...baseOptions,
        paths: ['./features/'],
        tags: 'not @ignore'
    },

    // Rerun profile
    rerun: {
        ...baseOptions,
        paths: ['@rerun.txt']
    },

    // Smoke tests - P0 Critical tests
    smoke: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@smoke and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/smoke-report.json'
        ]
    },

    // Critical tests - Must pass for deployment
    critical: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@critical and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/critical-report.json'
        ]
    },

    // Regression tests - P1 High priority
    regression: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@regression and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/regression-report.json'
        ]
    },

    // Validation tests
    validation: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@validation and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/validation-report.json'
        ]
    },

    // Calculation tests
    calculation: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@calculation and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/calculation-report.json'
        ]
    },

    // Edge case tests
    edgecase: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@edge-case and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/edgecase-report.json'
        ]
    },

    // UI tests
    ui: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@ui and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/ui-report.json'
        ]
    },

    // Known bug tests (expected to fail)
    bugs: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '@bug and not @ignore',
        format: [
            'progress-bar',
            'json:./test-results/reports/bugs-report.json'
        ]
    },

    // All tests except bugs
    nobug: {
        ...baseOptions,
        paths: ['./features/'],
        tags: 'not @bug and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/nobug-report.json'
        ]
    },

    // Combined smoke + critical (quick pre-deployment check)
    predeploy: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '(@smoke or @critical) and not @bug and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/predeploy-report.json'
        ]
    },

    // Full regression (P0 + P1 + P2, no bugs)
    fullregression: {
        ...baseOptions,
        paths: ['./features/'],
        tags: '(@smoke or @regression or @edge-case) and not @bug and not @ignore and not @skip',
        format: [
            'progress-bar',
            'json:./test-results/reports/fullregression-report.json'
        ]
    }
};